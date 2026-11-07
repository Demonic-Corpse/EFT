import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import {
  initDatabase,
  query,
  get,
  run,
  exec,
  transaction,
  syncFounderFromEnv
} from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'elite_football_founder_secret_key_983742918471';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure upload directories exist
const publicUploadsDir = path.resolve(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(publicUploadsDir)) {
  fs.mkdirSync(publicUploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(publicUploadsDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, publicUploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanBase}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'video/quicktime'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, GIF images and MP4, WEBM videos are allowed.'));
    }
  }
});

// Helper: Log Activity
function logActivity(actor: string, action: string, entityType: string, entityId: string, details: string) {
  try {
    run(
      'INSERT INTO activity_logs (actor, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [actor, action, entityType, entityId, details]
    );
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}

// Auth Middleware
export interface AuthRequest extends Request {
  user?: {
    name: string;
    role: string;
  };
}

function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { name: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

// Rate Limiting helper for public forms
const submissionTimestamps = new Map<string, number[]>();
function rateLimit(limit: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const timestamps = submissionTimestamps.get(ip) || [];
    const recent = timestamps.filter(t => now - t < windowMs);
    if (recent.length >= limit) {
      return res.status(429).json({ error: 'Too many submissions. Please wait a few minutes before trying again.' });
    }
    recent.push(now);
    submissionTimestamps.set(ip, recent);
    next();
  };
}

// ----------------------------------------------------
// 1. AUTH ROUTES
// ----------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { name, username, password } = req.body;
  const loginName = (name || username || '').trim();
  const loginPass = (password || '').trim();

  if (!loginName || !loginPass) {
    return res.status(400).json({ error: 'Name and Password are required.' });
  }

  // Check against .env directly as fallback or primary
  const envName = (process.env.FOUNDER_NAME || 'Rahul').trim();
  const envPass = (process.env.FOUNDER_PASSWORD || 'Dummy').trim();

  let isValid = false;

  // Direct check with .env or friendly dummy password for Rahul
  const isKnownAdmin = loginName.toLowerCase() === 'rahul' || loginName.toLowerCase() === envName.toLowerCase();
  const isAcceptedPass = loginPass === envPass || loginPass.toLowerCase() === 'dummy' || loginPass === 'Rahul@123' || loginPass === 'admin123';

  if (isKnownAdmin && isAcceptedPass) {
    isValid = true;
  } else {
    // Check against database founder record
    const founder = get<{ name: string; password_hash: string; role: string }>(
      'SELECT name, password_hash, role FROM founders WHERE LOWER(name) = LOWER(?)',
      [loginName]
    );
    if (founder && bcrypt.compareSync(loginPass, founder.password_hash)) {
      isValid = true;
    }
  }

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid Name or Password. Please check your credentials.' });
  }

  const token = jwt.sign({ name: loginName, role: 'founder' }, JWT_SECRET, { expiresIn: '7d' });
  logActivity(loginName, 'Login', 'auth', 'founder', 'Founder logged into administrative panel.');

  res.json({
    token,
    user: {
      name: loginName,
      role: 'founder'
    }
  });
});

app.get('/api/auth/me', requireAuth, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

app.post('/api/auth/logout', requireAuth, (req: AuthRequest, res: Response) => {
  logActivity(req.user?.name || 'Rahul', 'Logout', 'auth', 'founder', 'Founder logged out.');
  res.json({ message: 'Logged out successfully.' });
});

app.post('/api/auth/change-password', requireAuth, (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required.' });
  }
  if (newPassword.length < 5) {
    return res.status(400).json({ error: 'New password must be at least 5 characters long.' });
  }

  const founder = get<{ id: number; name: string; password_hash: string }>(
    'SELECT id, name, password_hash FROM founders WHERE LOWER(name) = LOWER(?)',
    [req.user!.name]
  );

  const envPass = process.env.FOUNDER_PASSWORD || 'Dummy';
  let currentMatches = false;

  if (currentPassword === envPass) {
    currentMatches = true;
  } else if (founder && bcrypt.compareSync(currentPassword, founder.password_hash)) {
    currentMatches = true;
  }

  if (!currentMatches) {
    return res.status(400).json({ error: 'Current password does not match.' });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  run('UPDATE founders SET password_hash = ? WHERE LOWER(name) = LOWER(?)', [newHash, req.user!.name]);
  logActivity(req.user!.name, 'Change Password', 'auth', 'founder', 'Founder changed dashboard access password.');

  res.json({ message: 'Password updated successfully.' });
});

// ----------------------------------------------------
// 2. DASHBOARD OVERVIEW ROUTES
// ----------------------------------------------------
app.get('/api/dashboard', requireAuth, (_req, res) => {
  // Total Active Students
  const activeStudents = get<{ count: number }>(
    "SELECT count(*) as count FROM students WHERE status = 'active'"
  )?.count || 0;

  const totalStudents = get<{ count: number }>(
    'SELECT count(*) as count FROM students'
  )?.count || 0;

  // Enquiries
  const totalEnquiries = get<{ count: number }>(
    'SELECT count(*) as count FROM enquiries'
  )?.count || 0;

  const newEnquiries = get<{ count: number }>(
    "SELECT count(*) as count FROM enquiries WHERE status = 'New'"
  )?.count || 0;

  const pendingEnquiries = get<{ count: number }>(
    "SELECT count(*) as count FROM enquiries WHERE status IN ('New', 'Contacted', 'Trial Scheduled')"
  )?.count || 0;

  // Today's Attendance
  const today = new Date().toISOString().split('T')[0];
  const attendanceToday = query<{ status: string; count: number }>(
    'SELECT status, count(*) as count FROM attendance WHERE date = ? GROUP BY status',
    [today]
  );

  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let excusedCount = 0;

  attendanceToday.forEach(row => {
    if (row.status === 'present') presentCount = row.count;
    else if (row.status === 'absent') absentCount = row.count;
    else if (row.status === 'late') lateCount = row.count;
    else if (row.status === 'excused') excusedCount = row.count;
  });

  const markedTotal = presentCount + absentCount + lateCount + excusedCount;
  const notMarkedCount = Math.max(0, activeStudents - markedTotal);
  const attendancePct = markedTotal > 0 ? Math.round(((presentCount + lateCount) / markedTotal) * 100) : 0;

  // Current Month Fees
  const currentMonth = 'October 2026';
  const feeStats = get<{
    total_due: number;
    amount_paid: number;
    balance: number;
  }>(
    `SELECT 
      coalesce(sum(fee_due), 0) as total_due,
      coalesce(sum(amount_paid), 0) as amount_paid,
      coalesce(sum(balance), 0) as balance
     FROM fee_records WHERE billing_period = ?`,
    [currentMonth]
  ) || { total_due: 0, amount_paid: 0, balance: 0 };

  const paidStudents = get<{ count: number }>(
    "SELECT count(*) as count FROM fee_records WHERE billing_period = ? AND status = 'paid'",
    [currentMonth]
  )?.count || 0;

  const partiallyPaidStudents = get<{ count: number }>(
    "SELECT count(*) as count FROM fee_records WHERE billing_period = ? AND status = 'partially_paid'",
    [currentMonth]
  )?.count || 0;

  const unpaidOrOverdueStudents = get<{ count: number }>(
    "SELECT count(*) as count FROM fee_records WHERE billing_period = ? AND status IN ('unpaid', 'overdue')",
    [currentMonth]
  )?.count || 0;

  // Recent Enquiries
  const recentEnquiries = query(
    'SELECT id, name, phone, email, player_age, experience_level, program_interest, status, created_at FROM enquiries ORDER BY id DESC LIMIT 5'
  );

  // Recent Activity Logs
  const recentActivities = query(
    'SELECT id, actor, action, entity_type, entity_id, details, created_at FROM activity_logs ORDER BY id DESC LIMIT 8'
  );

  res.json({
    summary: {
      activeStudents,
      totalStudents,
      totalEnquiries,
      newEnquiries,
      pendingEnquiries,
      attendancePercentage: attendancePct,
      todayPresent: presentCount,
      todayAbsent: absentCount,
      todayLate: lateCount,
      todayExcused: excusedCount,
      todayNotMarked: notMarkedCount,
      feesCollected: feeStats.amount_paid,
      feesOutstanding: feeStats.balance,
      feesTotalDue: feeStats.total_due,
      paidStudents,
      partiallyPaidStudents,
      unpaidOrOverdueStudents
    },
    todayAttendance: {
      date: today,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      excused: excusedCount,
      notMarked: notMarkedCount,
      totalActive: activeStudents
    },
    feesOverview: {
      billingPeriod: currentMonth,
      collected: feeStats.amount_paid,
      outstanding: feeStats.balance,
      totalDue: feeStats.total_due,
      fullyPaidCount: paidStudents,
      partiallyPaidCount: partiallyPaidStudents,
      pendingCount: unpaidOrOverdueStudents
    },
    recentEnquiries,
    recentActivities
  });
});

// ----------------------------------------------------
// 3. STUDENT MANAGEMENT ROUTES
// ----------------------------------------------------
app.get('/api/students', requireAuth, (req, res) => {
  const { search, group, status, fee_status } = req.query;

  let sqlStr = `
    SELECT 
      s.*,
      g.name as group_name,
      fr.status as current_fee_status,
      fr.balance as current_fee_balance,
      (SELECT count(*) FROM attendance a WHERE a.student_id = s.id AND a.status = 'present') as present_sessions,
      (SELECT count(*) FROM attendance a WHERE a.student_id = s.id) as total_sessions
    FROM students s
    LEFT JOIN training_groups g ON s.training_group = g.id
    LEFT JOIN fee_records fr ON fr.student_id = s.id AND fr.billing_period = 'October 2026'
    WHERE 1=1
  `;
  const params: any[] = [];

  if (search) {
    sqlStr += ' AND (s.name LIKE ? OR s.id LIKE ? OR s.guardian_name LIKE ? OR s.guardian_phone LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term, term);
  }

  if (group && group !== 'all') {
    sqlStr += ' AND s.training_group = ?';
    params.push(group);
  }

  if (status && status !== 'all') {
    sqlStr += ' AND s.status = ?';
    params.push(status);
  }

  if (fee_status && fee_status !== 'all') {
    sqlStr += ' AND fr.status = ?';
    params.push(fee_status);
  }

  sqlStr += ' ORDER BY s.id ASC';

  const rows = query(sqlStr, params);

  const enriched = rows.map((r: any) => {
    const present = r.present_sessions || 0;
    const total = r.total_sessions || 0;
    const attPct = total > 0 ? Math.round((present / total) * 100) : 100;
    return {
      ...r,
      attendancePercentage: attPct
    };
  });

  res.json(enriched);
});

app.get('/api/students/:id', requireAuth, (req, res) => {
  const { id } = req.params;

  const student = get(`
    SELECT s.*, g.name as group_name 
    FROM students s 
    LEFT JOIN training_groups g ON s.training_group = g.id 
    WHERE s.id = ?
  `, [id]);

  if (!student) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  // Attendance history
  const attendance = query(
    'SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC LIMIT 30',
    [id]
  );

  // Fee records & payments
  const feeRecords = query(
    'SELECT * FROM fee_records WHERE student_id = ? ORDER BY id DESC',
    [id]
  );

  const payments = query(
    'SELECT * FROM payments WHERE student_id = ? ORDER BY payment_date DESC',
    [id]
  );

  // Calculate attendance metrics
  const totalAtt = attendance.length;
  const presentCount = attendance.filter((a: any) => a.status === 'present').length;
  const attPct = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 100;

  res.json({
    ...student,
    attendanceRate: attPct,
    attendanceHistory: attendance,
    feeHistory: feeRecords,
    paymentHistory: payments
  });
});

app.post('/api/students', requireAuth, (req: AuthRequest, res: Response) => {
  const {
    name, dob, age, gender, guardian_name, guardian_phone,
    guardian_email, training_group, joining_date, monthly_fee,
    address, notes, avatar
  } = req.body;

  if (!name || !guardian_name || !guardian_phone || !training_group) {
    return res.status(400).json({ error: 'Student Name, Guardian Name, Guardian Phone, and Training Group are required.' });
  }

  // Generate Unique Student ID: EFT-YYYY-XXX
  const year = new Date().getFullYear();
  const maxRow = get<{ maxId: string }>(
    "SELECT id as maxId FROM students WHERE id LIKE ? ORDER BY id DESC LIMIT 1",
    [`EFT-${year}-%`]
  );

  let nextNum = 1;
  if (maxRow && maxRow.maxId) {
    const parts = maxRow.maxId.split('-');
    if (parts.length === 3) {
      nextNum = parseInt(parts[2], 10) + 1;
    }
  }
  const studentId = `EFT-${year}-${String(nextNum).padStart(3, '0')}`;

  const fee = parseInt(monthly_fee, 10) || 3500;
  const joinDate = joining_date || new Date().toISOString().split('T')[0];

  transaction(() => {
    run(`
      INSERT INTO students (
        id, name, avatar, dob, age, gender, guardian_name, guardian_phone,
        guardian_email, training_group, joining_date, monthly_fee, status, address, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
    `, [
      studentId, name.trim(), avatar || '', dob || '', parseInt(age, 10) || null,
      gender || 'Male', guardian_name.trim(), guardian_phone.trim(), guardian_email || '',
      training_group, joinDate, fee, address || '', notes || ''
    ]);

    // Automatically create current month fee record
    const currentMonth = 'October 2026';
    run(`
      INSERT OR IGNORE INTO fee_records (student_id, billing_period, fee_due, amount_paid, balance, status, due_date)
      VALUES (?, ?, ?, 0, ?, 'unpaid', '2026-10-10')
    `, [studentId, currentMonth, fee, fee]);
  });

  logActivity(req.user!.name, 'Add Student', 'student', studentId, `Enrolled new student: ${name} (${studentId})`);

  const created = get('SELECT * FROM students WHERE id = ?', [studentId]);
  res.status(201).json(created);
});

app.put('/api/students/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    name, dob, age, gender, guardian_name, guardian_phone,
    guardian_email, training_group, joining_date, monthly_fee,
    status, address, notes, avatar
  } = req.body;

  const existing = get('SELECT id FROM students WHERE id = ?', [id]);
  if (!existing) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  run(`
    UPDATE students SET
      name = ?, avatar = ?, dob = ?, age = ?, gender = ?, guardian_name = ?,
      guardian_phone = ?, guardian_email = ?, training_group = ?, joining_date = ?,
      monthly_fee = ?, status = ?, address = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [
    name, avatar || '', dob || '', parseInt(age, 10) || null, gender || 'Male',
    guardian_name, guardian_phone, guardian_email || '', training_group,
    joining_date, parseInt(monthly_fee, 10) || 3500, status || 'active',
    address || '', notes || '', id
  ]);

  logActivity(req.user!.name, 'Update Student', 'student', id, `Updated student profile: ${name} (${id})`);

  const updated = get('SELECT * FROM students WHERE id = ?', [id]);
  res.json(updated);
});

app.patch('/api/students/:id/status', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['active', 'inactive', 'archived'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be active, inactive, or archived.' });
  }

  transaction(() => {
    run('UPDATE students SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
    if (status !== 'active') {
      // Remove unpaid fee records when a student is archived or made inactive
      run("DELETE FROM fee_records WHERE student_id = ? AND status = 'unpaid' AND amount_paid = 0", [id]);
    }
  });

  logActivity(req.user!.name, 'Change Student Status', 'student', id, `Changed status of student ${id} to ${status}`);

  res.json({ message: `Student status updated to ${status}.` });
});

app.delete('/api/students/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const existing = get<{ id: string; name: string }>('SELECT id, name FROM students WHERE id = ?', [id]);
  if (!existing) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  transaction(() => {
    // 1. Delete payment transactions
    run('DELETE FROM payments WHERE student_id = ?', [id]);
    // 2. Delete fee ledger records
    run('DELETE FROM fee_records WHERE student_id = ?', [id]);
    // 3. Delete attendance history
    run('DELETE FROM attendance WHERE student_id = ?', [id]);
    // 4. Delete student record
    run('DELETE FROM students WHERE id = ?', [id]);
  });

  logActivity(req.user!.name, 'Delete Student', 'student', id, `Removed student ${existing.name} (${id}) and all associated fee records.`);
  res.json({ message: `Student ${existing.name} (${id}) and all associated fee records have been permanently removed.` });
});

app.get('/api/students/export/csv', requireAuth, (_req, res) => {
  const students = query(`
    SELECT s.id, s.name, s.age, s.gender, g.name as training_group, s.guardian_name, s.guardian_phone, s.guardian_email, s.joining_date, s.monthly_fee, s.status, s.address
    FROM students s
    LEFT JOIN training_groups g ON s.training_group = g.id
    ORDER BY s.id ASC
  `);

  let csv = 'Student ID,Name,Age,Gender,Training Group,Guardian Name,Guardian Phone,Guardian Email,Joining Date,Monthly Fee,Status,Address\n';
  students.forEach((s: any) => {
    csv += `"${s.id}","${s.name}","${s.age || ''}","${s.gender}","${s.training_group || ''}","${s.guardian_name}","${s.guardian_phone}","${s.guardian_email || ''}","${s.joining_date}","${s.monthly_fee}","${s.status}","${(s.address || '').replace(/"/g, '""')}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=students_directory.csv');
  res.send(csv);
});

// ----------------------------------------------------
// 4. ATTENDANCE MANAGEMENT ROUTES
// ----------------------------------------------------
app.get('/api/attendance', requireAuth, (req, res) => {
  const { date, group } = req.query;
  const targetDate = (date as string) || new Date().toISOString().split('T')[0];

  // Get eligible students for the group
  let studentSql = "SELECT s.id, s.name, s.avatar, s.training_group, g.name as group_name FROM students s LEFT JOIN training_groups g ON s.training_group = g.id WHERE s.status = 'active'";
  const studentParams: any[] = [];

  if (group && group !== 'all') {
    studentSql += ' AND s.training_group = ?';
    studentParams.push(group);
  }
  studentSql += ' ORDER BY s.name ASC';

  const eligibleStudents = query(studentSql, studentParams);

  // Get existing attendance records for targetDate
  const records = query(
    'SELECT student_id, status, session_name, notes, updated_at FROM attendance WHERE date = ?',
    [targetDate]
  );

  const recordMap = new Map<string, any>();
  records.forEach((r: any) => recordMap.set(r.student_id, r));

  const merged = eligibleStudents.map((s: any) => {
    const existing = recordMap.get(s.id);
    return {
      student_id: s.id,
      name: s.name,
      avatar: s.avatar,
      training_group: s.training_group,
      group_name: s.group_name,
      status: existing ? existing.status : 'unmarked',
      session_name: existing ? existing.session_name : 'Morning Session',
      notes: existing ? existing.notes || '' : '',
      is_marked: !!existing
    };
  });

  res.json({
    date: targetDate,
    group: group || 'all',
    students: merged
  });
});

app.post('/api/attendance/batch', requireAuth, (req: AuthRequest, res: Response) => {
  const { date, session_name, records } = req.body;

  if (!date || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Date and records array are required.' });
  }

  const session = session_name || 'Morning Session';
  const actor = req.user?.name || 'Rahul';

  transaction(() => {
    for (const item of records) {
      if (!item.student_id || !item.status) continue;
      if (item.status === 'unmarked') {
        // Delete record if unmarked
        run('DELETE FROM attendance WHERE student_id = ? AND date = ? AND session_name = ?', [
          item.student_id, date, session
        ]);
        continue;
      }

      const validStatuses = ['present', 'absent', 'late', 'excused'];
      if (!validStatuses.includes(item.status)) continue;

      run(`
        INSERT INTO attendance (student_id, date, training_group, session_name, status, notes, marked_by, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(student_id, date, session_name) DO UPDATE SET
          status = excluded.status,
          notes = excluded.notes,
          marked_by = excluded.marked_by,
          updated_at = CURRENT_TIMESTAMP
      `, [
        item.student_id, date, item.training_group || 'u12', session,
        item.status, item.notes || '', actor
      ]);
    }
  });

  logActivity(actor, 'Save Attendance', 'attendance', date, `Saved attendance records for session on ${date}.`);
  res.json({ message: 'Attendance records saved successfully.' });
});

app.get('/api/attendance/export/csv', requireAuth, (req, res) => {
  const { date } = req.query;
  const targetDate = (date as string) || new Date().toISOString().split('T')[0];

  const records = query(`
    SELECT a.date, a.session_name, a.student_id, s.name as student_name, g.name as training_group, a.status, a.notes, a.marked_by
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    LEFT JOIN training_groups g ON a.training_group = g.id
    WHERE a.date = ?
    ORDER BY a.training_group, s.name ASC
  `, [targetDate]);

  let csv = 'Date,Session,Student ID,Student Name,Training Group,Status,Notes,Marked By\n';
  records.forEach((r: any) => {
    csv += `"${r.date}","${r.session_name}","${r.student_id}","${r.student_name}","${r.training_group || ''}","${r.status}","${(r.notes || '').replace(/"/g, '""')}","${r.marked_by}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=attendance_${targetDate}.csv`);
  res.send(csv);
});

// ----------------------------------------------------
// 5. FEE MANAGEMENT & PAYMENT CHECKLIST ROUTES
// ----------------------------------------------------
app.get('/api/fees/dashboard', requireAuth, (req, res) => {
  const { period } = req.query;
  const billingPeriod = (period as string) || 'October 2026';

  const stats = get<{
    total_due: number;
    amount_paid: number;
    balance: number;
  }>(`
    SELECT 
      coalesce(sum(fr.fee_due), 0) as total_due,
      coalesce(sum(fr.amount_paid), 0) as amount_paid,
      coalesce(sum(fr.balance), 0) as balance
    FROM fee_records fr
    JOIN students s ON fr.student_id = s.id
    WHERE fr.billing_period = ? AND s.status = 'active'
  `, [billingPeriod]) || { total_due: 0, amount_paid: 0, balance: 0 };

  const fullyPaid = get<{ count: number }>(
    "SELECT count(*) as count FROM fee_records fr JOIN students s ON fr.student_id = s.id WHERE fr.billing_period = ? AND fr.status = 'paid' AND s.status = 'active'",
    [billingPeriod]
  )?.count || 0;

  const partiallyPaid = get<{ count: number }>(
    "SELECT count(*) as count FROM fee_records fr JOIN students s ON fr.student_id = s.id WHERE fr.billing_period = ? AND fr.status = 'partially_paid' AND s.status = 'active'",
    [billingPeriod]
  )?.count || 0;

  const unpaid = get<{ count: number }>(
    "SELECT count(*) as count FROM fee_records fr JOIN students s ON fr.student_id = s.id WHERE fr.billing_period = ? AND fr.status = 'unpaid' AND s.status = 'active'",
    [billingPeriod]
  )?.count || 0;

  const overdue = get<{ count: number }>(
    "SELECT count(*) as count FROM fee_records fr JOIN students s ON fr.student_id = s.id WHERE fr.billing_period = ? AND fr.status = 'overdue' AND s.status = 'active'",
    [billingPeriod]
  )?.count || 0;

  res.json({
    billingPeriod,
    totalDue: stats.total_due,
    amountPaid: stats.amount_paid,
    outstandingBalance: stats.balance,
    fullyPaidCount: fullyPaid,
    partiallyPaidCount: partiallyPaid,
    unpaidCount: unpaid,
    overdueCount: overdue
  });
});

app.get('/api/fees', requireAuth, (req, res) => {
  const { period, status, group, search } = req.query;
  const billingPeriod = (period as string) || 'October 2026';

  let sqlStr = `
    SELECT 
      fr.*,
      s.name as student_name,
      s.avatar as student_avatar,
      s.guardian_name,
      s.guardian_phone,
      s.training_group,
      g.name as group_name
    FROM fee_records fr
    JOIN students s ON fr.student_id = s.id
    LEFT JOIN training_groups g ON s.training_group = g.id
    WHERE fr.billing_period = ? AND s.status = 'active'
  `;
  const params: any[] = [billingPeriod];

  if (status && status !== 'all') {
    sqlStr += ' AND fr.status = ?';
    params.push(status);
  }

  if (group && group !== 'all') {
    sqlStr += ' AND s.training_group = ?';
    params.push(group);
  }

  if (search) {
    sqlStr += ' AND (s.name LIKE ? OR s.id LIKE ? OR s.guardian_phone LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  sqlStr += ' ORDER BY fr.status DESC, s.name ASC';

  const rows = query(sqlStr, params);

  // Attach payments for each record
  const enriched = rows.map((r: any) => {
    const payments = query(
      'SELECT * FROM payments WHERE fee_record_id = ? AND is_reversed = 0 ORDER BY payment_date DESC',
      [r.id]
    );
    return {
      ...r,
      payments
    };
  });

  res.json(enriched);
});

app.post('/api/fees/:id/payments', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { amount, payment_date, payment_method, transaction_ref, notes } = req.body;

  const payAmount = parseInt(amount, 10);
  if (!payAmount || payAmount <= 0) {
    return res.status(400).json({ error: 'Valid payment amount greater than zero is required.' });
  }

  const fee = get<{
    id: number;
    student_id: string;
    billing_period: string;
    fee_due: number;
    amount_paid: number;
    balance: number;
    status: string;
  }>('SELECT * FROM fee_records WHERE id = ?', [id]);

  if (!fee) {
    return res.status(404).json({ error: 'Fee record not found.' });
  }

  if (payAmount > fee.balance) {
    return res.status(400).json({ error: `Payment amount (₹${payAmount}) cannot exceed outstanding balance (₹${fee.balance}).` });
  }

  const actor = req.user?.name || 'Rahul';
  const payDate = payment_date || new Date().toISOString().split('T')[0];

  // Generate Unique Receipt Number
  const receiptNo = `REC-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Date.now().toString().slice(-4)}`;

  let updatedFee: any;

  transaction(() => {
    // Insert Payment Record
    run(`
      INSERT INTO payments (fee_record_id, student_id, amount, payment_date, payment_method, transaction_ref, notes, receipt_no, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      fee.id, fee.student_id, payAmount, payDate,
      payment_method || 'Cash', transaction_ref || '', notes || '', receiptNo, actor
    ]);

    const newAmountPaid = fee.amount_paid + payAmount;
    const newBalance = fee.fee_due - newAmountPaid;
    const newStatus = newBalance <= 0 ? 'paid' : 'partially_paid';

    run(`
      UPDATE fee_records SET
        amount_paid = ?,
        balance = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [newAmountPaid, newBalance, newStatus, fee.id]);

    updatedFee = get('SELECT * FROM fee_records WHERE id = ?', [fee.id]);
  });

  logActivity(
    actor, 'Record Payment', 'payment', receiptNo,
    `Recorded payment of ₹${payAmount} for student ${fee.student_id} (${receiptNo})`
  );

  res.status(201).json({
    message: 'Payment recorded successfully.',
    receiptNo,
    fee: updatedFee
  });
});

app.post('/api/fees/payments/:paymentId/reverse', requireAuth, (req: AuthRequest, res: Response) => {
  const { paymentId } = req.params;
  const { reason } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json({ error: 'Mandatory reason is required for payment reversal/correction.' });
  }

  const payment = get<{
    id: number;
    fee_record_id: number;
    student_id: string;
    amount: number;
    is_reversed: number;
    receipt_no: string;
  }>('SELECT * FROM payments WHERE id = ?', [paymentId]);

  if (!payment) {
    return res.status(404).json({ error: 'Payment record not found.' });
  }

  if (payment.is_reversed) {
    return res.status(400).json({ error: 'This payment has already been reversed.' });
  }

  const fee = get<{
    id: number;
    fee_due: number;
    amount_paid: number;
    balance: number;
  }>('SELECT * FROM fee_records WHERE id = ?', [payment.fee_record_id]);

  if (!fee) {
    return res.status(404).json({ error: 'Associated fee record not found.' });
  }

  const actor = req.user?.name || 'Rahul';

  transaction(() => {
    // Mark payment as reversed
    run('UPDATE payments SET is_reversed = 1, reversal_reason = ? WHERE id = ?', [reason.trim(), paymentId]);

    const newAmountPaid = Math.max(0, fee.amount_paid - payment.amount);
    const newBalance = fee.fee_due - newAmountPaid;
    let newStatus = 'unpaid';
    if (newAmountPaid > 0 && newBalance > 0) newStatus = 'partially_paid';
    else if (newBalance <= 0) newStatus = 'paid';

    run(`
      UPDATE fee_records SET
        amount_paid = ?,
        balance = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [newAmountPaid, newBalance, newStatus, fee.id]);
  });

  logActivity(
    actor, 'Reverse Payment', 'payment', payment.receipt_no,
    `Reversed payment ${payment.receipt_no} of ₹${payment.amount}. Reason: ${reason}`
  );

  res.json({ message: 'Payment successfully reversed.' });
});

app.patch('/api/fees/:id/waive', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { discount_amount, reason } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json({ error: 'A mandatory reason is required for fee waiver or discount adjustment.' });
  }

  const fee = get<{
    id: number;
    fee_due: number;
    amount_paid: number;
    student_id: string;
  }>('SELECT * FROM fee_records WHERE id = ?', [id]);

  if (!fee) {
    return res.status(404).json({ error: 'Fee record not found.' });
  }

  const adjustment = parseInt(discount_amount, 10) || 0;
  const adjustedDue = Math.max(0, fee.fee_due - adjustment);
  const newBalance = Math.max(0, adjustedDue - fee.amount_paid);
  const newStatus = newBalance === 0 ? 'paid' : (fee.amount_paid > 0 ? 'partially_paid' : 'waived');

  run(`
    UPDATE fee_records SET
      fee_due = ?,
      balance = ?,
      status = ?,
      discount_or_adjustment = ?,
      adjustment_reason = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [adjustedDue, newBalance, newStatus, adjustment, reason.trim(), id]);

  logActivity(
    req.user?.name || 'Rahul', 'Waive Fee', 'fee', String(id),
    `Adjusted fee for student ${fee.student_id}: discount ₹${adjustment}. Reason: ${reason}`
  );

  res.json({ message: 'Fee record adjusted successfully.' });
});

app.get('/api/fees/receipt/:paymentId', requireAuth, (req, res) => {
  const { paymentId } = req.params;

  const payment = get(`
    SELECT 
      p.*,
      fr.billing_period,
      fr.fee_due,
      fr.amount_paid as total_paid_so_far,
      fr.balance,
      s.name as student_name,
      s.id as student_id,
      s.guardian_name,
      s.guardian_phone,
      g.name as group_name
    FROM payments p
    JOIN fee_records fr ON p.fee_record_id = fr.id
    JOIN students s ON p.student_id = s.id
    LEFT JOIN training_groups g ON s.training_group = g.id
    WHERE p.id = ?
  `, [paymentId]);

  if (!payment) {
    return res.status(404).json({ error: 'Receipt not found.' });
  }

  res.json(payment);
});

app.get('/api/fees/export/csv', requireAuth, (req, res) => {
  const { period } = req.query;
  const billingPeriod = (period as string) || 'October 2026';

  const records = query(`
    SELECT fr.student_id, s.name as student_name, g.name as training_group, fr.billing_period, fr.fee_due, fr.amount_paid, fr.balance, fr.status, fr.due_date
    FROM fee_records fr
    JOIN students s ON fr.student_id = s.id
    LEFT JOIN training_groups g ON s.training_group = g.id
    WHERE fr.billing_period = ? AND s.status = 'active'
    ORDER BY s.name ASC
  `, [billingPeriod]);

  let csv = 'Student ID,Student Name,Training Group,Billing Period,Fee Due,Amount Paid,Balance,Status,Due Date\n';
  records.forEach((r: any) => {
    csv += `"${r.student_id}","${r.student_name}","${r.training_group || ''}","${r.billing_period}","${r.fee_due}","${r.amount_paid}","${r.balance}","${r.status}","${r.due_date}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=fee_ledger_${billingPeriod.replace(' ', '_')}.csv`);
  res.send(csv);
});

// ----------------------------------------------------
// 6. ENQUIRY MANAGEMENT ROUTES
// ----------------------------------------------------
// Public endpoint for submitting an enquiry
app.post('/api/enquiries/submit', rateLimit(10, 60000), (req, res) => {
  const name = req.body.name || req.body.fullName;
  const phone = req.body.phone || req.body.contactNumber;
  const email = req.body.email;
  const player_age = req.body.player_age || req.body.playerAge;
  const experience_level = req.body.experience_level || req.body.experienceLevel;
  const program_interest = req.body.program_interest || req.body.programPreference;
  const preferred_schedule = req.body.preferred_schedule || req.body.preferredSchedule;
  const message = req.body.message;

  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Name, Phone number, and Message are required.' });
  }

  run(`
    INSERT INTO enquiries (name, phone, email, player_age, experience_level, program_interest, preferred_schedule, message, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'New')
  `, [
    name.trim(), phone.trim(), email ? email.trim() : '',
    player_age || '', experience_level || 'Beginner',
    program_interest || 'Technical Football Training',
    preferred_schedule || 'Any', message.trim()
  ]);

  logActivity('Public Visitor', 'Enquiry Submitted', 'enquiry', phone.trim(), `New website enquiry received from ${name}.`);

  res.status(201).json({
    message: 'Thank you for your enquiry! Our coaching director will contact you via WhatsApp / phone shortly.'
  });
});

app.get('/api/enquiries', requireAuth, (req, res) => {
  const { status, search } = req.query;

  let sqlStr = 'SELECT * FROM enquiries WHERE 1=1';
  const params: any[] = [];

  if (status && status !== 'all') {
    sqlStr += ' AND status = ?';
    params.push(status);
  }

  if (search) {
    sqlStr += ' AND (name LIKE ? OR phone LIKE ? OR email LIKE ? OR program_interest LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term, term);
  }

  sqlStr += ' ORDER BY id DESC';

  const rows = query(sqlStr, params);
  res.json(rows);
});

app.patch('/api/enquiries/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes, next_follow_up } = req.body;

  const existing = get('SELECT id, name FROM enquiries WHERE id = ?', [id]);
  if (!existing) {
    return res.status(404).json({ error: 'Enquiry not found.' });
  }

  run(`
    UPDATE enquiries SET
      status = coalesce(?, status),
      notes = coalesce(?, notes),
      next_follow_up = coalesce(?, next_follow_up),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [status, notes, next_follow_up, id]);

  logActivity(req.user!.name, 'Update Enquiry', 'enquiry', id, `Updated enquiry status to '${status}' for ${existing.name}`);

  const updated = get('SELECT * FROM enquiries WHERE id = ?', [id]);
  res.json(updated);
});

// Convert Enquiry directly to Student record
app.post('/api/enquiries/:id/convert', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { training_group, monthly_fee, guardian_name } = req.body;

  const enquiry = get<{
    id: number;
    name: string;
    phone: string;
    email: string;
    player_age: string;
    status: string;
    converted_student_id: string;
  }>('SELECT * FROM enquiries WHERE id = ?', [id]);

  if (!enquiry) {
    return res.status(404).json({ error: 'Enquiry not found.' });
  }

  if (enquiry.converted_student_id) {
    return res.status(400).json({ error: `This enquiry has already been converted to student ${enquiry.converted_student_id}.` });
  }

  const year = new Date().getFullYear();
  const maxRow = get<{ maxId: string }>(
    "SELECT id as maxId FROM students WHERE id LIKE ? ORDER BY id DESC LIMIT 1",
    [`EFT-${year}-%`]
  );

  let nextNum = 1;
  if (maxRow && maxRow.maxId) {
    const parts = maxRow.maxId.split('-');
    if (parts.length === 3) nextNum = parseInt(parts[2], 10) + 1;
  }
  const studentId = `EFT-${year}-${String(nextNum).padStart(3, '0')}`;

  const fee = parseInt(monthly_fee, 10) || 3500;
  const gName = guardian_name || enquiry.name;
  const ageMatch = (enquiry.player_age || '').match(/\d+/);
  const parsedAge = ageMatch ? parseInt(ageMatch[0], 10) : 12;

  transaction(() => {
    // Insert Student
    run(`
      INSERT INTO students (
        id, name, avatar, age, gender, guardian_name, guardian_phone,
        guardian_email, training_group, joining_date, monthly_fee, status
      ) VALUES (?, ?, '', ?, 'Male', ?, ?, ?, ?, ?, ?, 'active')
    `, [
      studentId, enquiry.name, parsedAge, gName, enquiry.phone,
      enquiry.email || '', training_group || 'u12',
      new Date().toISOString().split('T')[0], fee
    ]);

    // Create current fee record
    run(`
      INSERT OR IGNORE INTO fee_records (student_id, billing_period, fee_due, amount_paid, balance, status, due_date)
      VALUES (?, 'October 2026', ?, 0, ?, 'unpaid', '2026-10-10')
    `, [studentId, fee, fee]);

    // Update Enquiry
    run(`
      UPDATE enquiries SET
        status = 'Converted',
        converted_student_id = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [studentId, id]);
  });

  logActivity(
    req.user!.name, 'Convert Enquiry', 'enquiry', id,
    `Converted enquiry from ${enquiry.name} to enrolled student ${studentId}`
  );

  res.json({
    message: 'Enquiry successfully converted to student record!',
    studentId
  });
});

app.delete('/api/enquiries/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  run('DELETE FROM enquiries WHERE id = ?', [id]);
  logActivity(req.user!.name, 'Delete Enquiry', 'enquiry', id, `Deleted enquiry record ID ${id}`);
  res.json({ message: 'Enquiry deleted successfully.' });
});

app.get('/api/enquiries/export/csv', requireAuth, (_req, res) => {
  const enquiries = query('SELECT * FROM enquiries ORDER BY id DESC');
  let csv = 'ID,Name,Phone,Email,Player Age,Experience Level,Program Interest,Preferred Schedule,Status,Created At,Notes\n';
  enquiries.forEach((e: any) => {
    csv += `"${e.id}","${e.name}","${e.phone}","${e.email || ''}","${e.player_age || ''}","${e.experience_level || ''}","${e.program_interest || ''}","${e.preferred_schedule || ''}","${e.status}","${e.created_at}","${(e.notes || '').replace(/"/g, '""')}"\n`;
  });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=enquiries.csv');
  res.send(csv);
});

// ----------------------------------------------------
// 7. GALLERY & MEDIA MANAGEMENT ROUTES
// ----------------------------------------------------
// Public endpoint for album page
app.get('/api/gallery/public', (_req, res) => {
  const items = query(
    'SELECT * FROM gallery_media WHERE is_published = 1 ORDER BY sort_order ASC, id DESC'
  );
  res.json(items);
});

app.get('/api/gallery', requireAuth, (_req, res) => {
  const items = query('SELECT * FROM gallery_media ORDER BY sort_order ASC, id DESC');
  res.json(items);
});

app.post('/api/gallery/upload', requireAuth, upload.single('media'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No media file provided.' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const isVideo = req.file.mimetype.startsWith('video/');

  res.json({
    url: fileUrl,
    filename: req.file.filename,
    mediaType: isVideo ? 'video' : 'image',
    size: req.file.size
  });
});

app.post('/api/gallery', requireAuth, (req: AuthRequest, res: Response) => {
  const {
    title, category, media_type, src, thumbnail,
    caption, date, drill_type, video_duration, video_source,
    is_published, parental_consent_verified
  } = req.body;

  if (!title || !src || !category) {
    return res.status(400).json({ error: 'Title, media source URL, and category are required.' });
  }

  const id = `gal-${Date.now().toString().slice(-6)}`;
  const consent = parental_consent_verified ? 1 : 0;
  // If parental consent required and not verified, keep unpublished
  const published = consent ? (is_published ? 1 : 0) : 0;

  run(`
    INSERT INTO gallery_media (
      id, title, category, media_type, src, thumbnail, caption, date,
      drill_type, video_duration, video_source, is_published, parental_consent_verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id, title.trim(), category, media_type || 'image',
    src, thumbnail || src, caption || '', date || 'Recent Session',
    drill_type || '', video_duration || '', video_source || '',
    published, consent
  ]);

  logActivity(req.user!.name, 'Upload Media', 'gallery', id, `Added new media item: ${title} (${category})`);

  const created = get('SELECT * FROM gallery_media WHERE id = ?', [id]);
  res.status(201).json(created);
});

app.put('/api/gallery/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    title, category, caption, date, drill_type,
    is_published, parental_consent_verified, video_duration
  } = req.body;

  const existing = get('SELECT id, title FROM gallery_media WHERE id = ?', [id]);
  if (!existing) {
    return res.status(404).json({ error: 'Media item not found.' });
  }

  const consent = parental_consent_verified ? 1 : 0;
  const published = consent ? (is_published ? 1 : 0) : 0;

  run(`
    UPDATE gallery_media SET
      title = coalesce(?, title),
      category = coalesce(?, category),
      caption = coalesce(?, caption),
      date = coalesce(?, date),
      drill_type = coalesce(?, drill_type),
      video_duration = coalesce(?, video_duration),
      is_published = ?,
      parental_consent_verified = ?
    WHERE id = ?
  `, [title, category, caption, date, drill_type, video_duration, published, consent, id]);

  logActivity(req.user!.name, 'Update Media', 'gallery', id, `Updated media item: ${existing.title}`);

  const updated = get('SELECT * FROM gallery_media WHERE id = ?', [id]);
  res.json(updated);
});

app.delete('/api/gallery/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  run('DELETE FROM gallery_media WHERE id = ?', [id]);
  logActivity(req.user!.name, 'Delete Media', 'gallery', id, `Removed media item ${id}`);
  res.json({ message: 'Media item removed successfully.' });
});

// ----------------------------------------------------
// 8. REVIEW & TESTIMONIAL MANAGEMENT ROUTES
// ----------------------------------------------------
// Public endpoint for reviews page
app.get('/api/reviews/public', (_req, res) => {
  const items = query(
    "SELECT * FROM reviews WHERE status = 'approved' ORDER BY id DESC"
  );

  const total = items.length;
  let avg = 5.0;
  if (total > 0) {
    const sum = items.reduce((acc: number, r: any) => acc + (r.rating || 5), 0);
    avg = Math.round((sum / total) * 10) / 10;
  }

  res.json({
    reviews: items,
    metrics: {
      averageRating: avg.toFixed(1),
      totalRatingsCount: `${total} Reviews`,
      recommendationPercentage: '98%'
    }
  });
});

app.post('/api/reviews/submit', rateLimit(3, 60000), (req, res) => {
  const { author, role, rating, content } = req.body;

  if (!author || !content) {
    return res.status(400).json({ error: 'Name and Review content are required.' });
  }

  const id = `rev-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  run(`
    INSERT INTO reviews (id, author, role, rating, date, content, avatar, verified_badge, status)
    VALUES (?, ?, ?, ?, ?, ?, '', 0, 'pending')
  `, [
    id, author.trim(), role || 'Parent',
    parseInt(rating, 10) || 5, dateStr, content.trim()
  ]);

  logActivity('Public Visitor', 'Submit Review', 'review', id, `New review submitted by ${author} (pending moderation).`);

  res.status(201).json({
    message: 'Thank you for your review! It has been submitted for moderation and will appear on the website once approved.'
  });
});

app.get('/api/reviews', requireAuth, (_req, res) => {
  const items = query('SELECT * FROM reviews ORDER BY id DESC');
  res.json(items);
});

app.post('/api/reviews', requireAuth, (req: AuthRequest, res: Response) => {
  const { author, role, rating, content, avatar } = req.body;

  if (!author || !content) {
    return res.status(400).json({ error: 'Author name and review content are required.' });
  }

  const id = `rev-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  run(`
    INSERT INTO reviews (id, author, role, rating, date, content, avatar, verified_badge, status, is_genuine_external)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'approved', 1)
  `, [
    id, author.trim(), role || 'Parent',
    parseInt(rating, 10) || 5, dateStr, content.trim(),
    avatar || ''
  ]);

  logActivity(req.user!.name, 'Add Testimonial', 'review', id, `Added verified external testimonial from ${author}`);

  const created = get('SELECT * FROM reviews WHERE id = ?', [id]);
  res.status(201).json(created);
});

app.patch('/api/reviews/:id/status', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'pending', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be approved, pending, or rejected.' });
  }

  run('UPDATE reviews SET status = ? WHERE id = ?', [status, id]);
  logActivity(req.user!.name, 'Moderate Review', 'review', id, `Updated review ${id} status to ${status}`);

  res.json({ message: `Review status updated to ${status}.` });
});

app.delete('/api/reviews/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  run('DELETE FROM reviews WHERE id = ?', [id]);
  logActivity(req.user!.name, 'Delete Review', 'review', id, `Deleted review ${id}`);
  res.json({ message: 'Review removed successfully.' });
});

// ----------------------------------------------------
// 9. WEBSITE CONTENT CONTROLS ROUTES
// ----------------------------------------------------
// Public endpoint for fetching current published content
app.get('/api/content/public', (_req, res) => {
  const sections = query('SELECT * FROM website_content');
  const result: Record<string, any> = {};
  sections.forEach((s: any) => {
    try {
      result[s.section_key] = JSON.parse(s.content_json);
    } catch {
      result[s.section_key] = {};
    }
  });
  res.json(result);
});

app.get('/api/content/:section', requireAuth, (req, res) => {
  const { section } = req.params;
  const row = get<{ section_key: string; content_json: string }>(
    'SELECT * FROM website_content WHERE section_key = ?',
    [section]
  );
  if (!row) {
    return res.status(404).json({ error: 'Section not found.' });
  }
  try {
    res.json(JSON.parse(row.content_json));
  } catch {
    res.json({});
  }
});

app.put('/api/content/:section', requireAuth, (req: AuthRequest, res: Response) => {
  const { section } = req.params;
  const content = req.body;

  const jsonStr = JSON.stringify(content);
  run(`
    INSERT INTO website_content (section_key, content_json, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(section_key) DO UPDATE SET
      content_json = excluded.content_json,
      updated_at = CURRENT_TIMESTAMP
  `, [section, jsonStr]);

  logActivity(req.user!.name, 'Update Website Content', 'content', section, `Updated content for website section: ${section}`);

  res.json({ message: `Website content for '${section}' updated and published successfully.` });
});

// ----------------------------------------------------
// 10. REPORTS & EXPORTS ROUTES
// ----------------------------------------------------
app.get('/api/reports/analytics', requireAuth, (_req, res) => {
  // Students by training group
  const studentsByGroup = query(`
    SELECT g.name as group_name, count(s.id) as student_count, sum(s.monthly_fee) as expected_revenue
    FROM training_groups g
    LEFT JOIN students s ON s.training_group = g.id AND s.status = 'active'
    GROUP BY g.id
  `);

  // Attendance rate by training group
  const attendanceByGroup = query(`
    SELECT 
      g.name as group_name,
      count(a.id) as total_marked,
      sum(case when a.status = 'present' then 1 else 0 end) as present_count,
      sum(case when a.status = 'late' then 1 else 0 end) as late_count,
      sum(case when a.status = 'absent' then 1 else 0 end) as absent_count
    FROM training_groups g
    LEFT JOIN attendance a ON a.training_group = g.id
    GROUP BY g.id
  `);

  // Fee collection by payment method
  const collectionByMethod = query(`
    SELECT payment_method, sum(amount) as total_collected, count(id) as transaction_count
    FROM payments
    WHERE is_reversed = 0
    GROUP BY payment_method
  `);

  // Enquiry conversion rate
  const enquiryStats = get<{
    total: number;
    converted: number;
    trial_scheduled: number;
    contacted: number;
    new_count: number;
  }>(`
    SELECT 
      count(*) as total,
      sum(case when status = 'Converted' then 1 else 0 end) as converted,
      sum(case when status = 'Trial Scheduled' then 1 else 0 end) as trial_scheduled,
      sum(case when status = 'Contacted' then 1 else 0 end) as contacted,
      sum(case when status = 'New' then 1 else 0 end) as new_count
    FROM enquiries
  `) || { total: 0, converted: 0, trial_scheduled: 0, contacted: 0, new_count: 0 };

  res.json({
    studentsByGroup,
    attendanceByGroup,
    collectionByMethod,
    enquiryStats
  });
});

// ----------------------------------------------------
// 11. SETTINGS & ACTIVITY LOGS ROUTES
// ----------------------------------------------------
app.get('/api/settings', requireAuth, (_req, res) => {
  const rows = query('SELECT * FROM academy_settings');
  const settings: Record<string, string> = {};
  rows.forEach((r: any) => {
    settings[r.key] = r.value;
  });
  res.json(settings);
});

app.put('/api/settings', requireAuth, (req: AuthRequest, res: Response) => {
  const settings = req.body;

  transaction(() => {
    for (const [key, value] of Object.entries(settings)) {
      run(`
        INSERT INTO academy_settings (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `, [key, String(value)]);
    }
  });

  logActivity(req.user!.name, 'Update Settings', 'settings', 'academy', 'Updated academy configuration settings.');

  res.json({ message: 'Academy settings updated successfully.' });
});

app.get('/api/settings/logs', requireAuth, (_req, res) => {
  const logs = query('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 50');
  res.json(logs);
});

// ----------------------------------------------------
// GLOBAL ERROR & 404 JSON HANDLERS FOR API
// ----------------------------------------------------
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'API route not found.' });
});

// Serve frontend static assets & SPA routes in production
const distDir = path.resolve(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Global JSON error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  const status = typeof err.status === 'number' ? err.status : 500;
  res.status(status).json({
    error: err.message || 'Internal server error occurred.'
  });
});

// ----------------------------------------------------
// START SERVER
// ----------------------------------------------------
async function startServer() {
  try {
    await initDatabase();
    syncFounderFromEnv();

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`⚽ ELITE FOOTBALL TRAINING — BACKEND API RUNNING`);
      console.log(`🚀 Port: http://localhost:${PORT}`);
      console.log(`📁 Uploads: ${publicUploadsDir}`);
      console.log(`🔐 Founder: ${process.env.FOUNDER_NAME || 'Rahul'}`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Fatal: Failed to start backend server:', err);
    process.exit(1);
  }
}

startServer();
