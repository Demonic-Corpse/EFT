import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, 'data', 'academy.sqlite');

let SQL: SqlJsStatic;
let db: Database;

export interface QueryResult<T = any> {
  rows: T[];
}

export function saveDatabase() {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error('Error saving SQLite database to disk:', err);
  }
}

export function query<T = any>(sqlStr: string, params: any[] = []): T[] {
  if (!db) throw new Error('Database not initialized');
  const stmt = db.prepare(sqlStr);
  stmt.bind(params);
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as unknown as T);
  }
  stmt.free();
  return results;
}

export function get<T = any>(sqlStr: string, params: any[] = []): T | null {
  const rows = query<T>(sqlStr, params);
  return rows.length > 0 ? rows[0] : null;
}

let inTransaction = false;

export function run(sqlStr: string, params: any[] = []): { changes: number } {
  if (!db) throw new Error('Database not initialized');
  db.run(sqlStr, params);
  if (!inTransaction) {
    saveDatabase();
  }
  return { changes: db.getRowsModified() };
}

export function exec(sqlStr: string): void {
  if (!db) throw new Error('Database not initialized');
  db.exec(sqlStr);
  if (!inTransaction) {
    saveDatabase();
  }
}

export function transaction<T>(callback: () => T): T {
  if (!db) throw new Error('Database not initialized');
  if (inTransaction) {
    return callback();
  }
  db.run('BEGIN TRANSACTION;');
  inTransaction = true;
  try {
    const result = callback();
    db.run('COMMIT;');
    inTransaction = false;
    saveDatabase();
    return result;
  } catch (error) {
    console.error('Transaction failed:', error);
    try {
      db.run('ROLLBACK;');
    } catch (rbErr) {
      console.warn('Rollback error ignored:', rbErr);
    }
    inTransaction = false;
    throw error;
  }
}

export async function initDatabase(): Promise<Database> {
  if (db) return db;

  SQL = await initSqlJs();

  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (fs.existsSync(DB_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
      console.log('Loaded existing SQLite database from', DB_PATH);
    } catch (err) {
      console.warn('Failed to read existing DB, creating new one:', err);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
    console.log('Created new SQLite database');
  }

  // Create Schema
  createSchema();

  // Seed / Sync founder from .env
  syncFounderFromEnv();

  // Sync official website contact defaults & pitch coordinates
  syncWebsiteContentDefaults();

  // Seed initial data if tables are empty
  seedInitialData();

  saveDatabase();
  return db;
}

function createSchema() {
  exec(`
    CREATE TABLE IF NOT EXISTS founders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'founder',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS training_groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age_range TEXT,
      schedule TEXT,
      description TEXT,
      monthly_fee INTEGER DEFAULT 3500,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT,
      dob TEXT,
      age INTEGER,
      gender TEXT DEFAULT 'Male',
      guardian_name TEXT NOT NULL,
      guardian_phone TEXT NOT NULL,
      guardian_email TEXT,
      training_group TEXT NOT NULL REFERENCES training_groups(id),
      joining_date TEXT NOT NULL,
      monthly_fee INTEGER NOT NULL DEFAULT 3500,
      status TEXT NOT NULL DEFAULT 'active',
      address TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL REFERENCES students(id),
      date TEXT NOT NULL,
      training_group TEXT NOT NULL,
      session_name TEXT NOT NULL DEFAULT 'Morning Training',
      status TEXT NOT NULL,
      notes TEXT,
      marked_by TEXT DEFAULT 'Rahul',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_id, date, session_name)
    );

    CREATE TABLE IF NOT EXISTS fee_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL REFERENCES students(id),
      billing_period TEXT NOT NULL,
      fee_due INTEGER NOT NULL,
      amount_paid INTEGER NOT NULL DEFAULT 0,
      balance INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'unpaid',
      due_date TEXT NOT NULL,
      discount_or_adjustment INTEGER DEFAULT 0,
      adjustment_reason TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_id, billing_period)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fee_record_id INTEGER NOT NULL REFERENCES fee_records(id),
      student_id TEXT NOT NULL REFERENCES students(id),
      amount INTEGER NOT NULL,
      payment_date TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      transaction_ref TEXT,
      notes TEXT,
      receipt_no TEXT UNIQUE,
      is_reversed INTEGER DEFAULT 0,
      reversal_reason TEXT,
      created_by TEXT DEFAULT 'Rahul',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      player_age TEXT,
      experience_level TEXT,
      program_interest TEXT,
      preferred_schedule TEXT,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'New',
      notes TEXT,
      next_follow_up TEXT,
      converted_student_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS gallery_media (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      media_type TEXT NOT NULL,
      src TEXT NOT NULL,
      thumbnail TEXT,
      caption TEXT,
      date TEXT,
      drill_type TEXT,
      video_duration TEXT,
      video_source TEXT,
      is_published INTEGER DEFAULT 1,
      parental_consent_verified INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      author TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Parent',
      rating INTEGER NOT NULL DEFAULT 5,
      date TEXT NOT NULL,
      content TEXT NOT NULL,
      avatar TEXT,
      verified_badge INTEGER DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'approved',
      is_genuine_external INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS website_content (
      section_key TEXT PRIMARY KEY,
      content_json TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS academy_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export function syncFounderFromEnv() {
  const envName = process.env.FOUNDER_NAME || 'Rahul';
  const envPassword = process.env.FOUNDER_PASSWORD || 'Dummy';
  const passwordHash = bcrypt.hashSync(envPassword, 10);

  const existing = get('SELECT id, password_hash FROM founders WHERE name = ?', [envName]);
  if (!existing) {
    run('INSERT INTO founders (name, password_hash, role) VALUES (?, ?, ?)', [envName, passwordHash, 'founder']);
    console.log(`Initialized founder account for: ${envName}`);
  } else {
    // If password in .env changed, update hash so restart takes immediate effect!
    const isSame = bcrypt.compareSync(envPassword, existing.password_hash);
    if (!isSame) {
      run('UPDATE founders SET password_hash = ? WHERE name = ?', [passwordHash, envName]);
      console.log(`Updated founder credentials from .env for: ${envName}`);
    }
  }
}

export function syncWebsiteContentDefaults() {
  const officialContact = {
    academyName: 'Elite Football Training',
    tagline: 'TRAIN HARD. PLAY ELITE.',
    phone: '+91 7768993889',
    email: 'elitefootballtraining01@gmail.com',
    location: 'Crimson Anisha Football Pitch, Pune',
    addressDetails:
      'Crimson Anisha Football Ground, Marunji Road, near Life Republic, Hinjawadi Phase 1 / Mulshi, Pune, Maharashtra 411057',
    operatingHours: '4:30 PM to 5:30 PM - Junior batch | 5:30 PM to 6:30 PM - Senior batch',
    whatsappNumber: '+917768993889',
    latitude: '18.62161° N (18° 37′ 18″ N)',
    longitude: '73.71343° E (73° 42′ 48″ E)',
    googleMapsEmbedUrl:
      'https://maps.google.com/maps?q=18.62161,73.71343&hl=en&z=16&output=embed',
    googleMapsUrl: 'https://www.google.com/maps?q=18.62161,73.71343',
    mapcartaUrl: 'https://mapcarta.com/N8585616660',
    instagramUrl: 'https://instagram.com/elitefootballtraining',
    youtubeUrl: 'https://youtube.com/@elitefootballtraining',
  };

  const existingContact = get<{ content_json: string }>(
    'SELECT content_json FROM website_content WHERE section_key = ?',
    ['contact']
  );

  if (!existingContact) {
    run('INSERT INTO website_content (section_key, content_json) VALUES (?, ?)', [
      'contact',
      JSON.stringify(officialContact),
    ]);
  } else {
    try {
      const parsed = JSON.parse(existingContact.content_json);
      if (!parsed.latitude || !parsed.mapcartaUrl || parsed.location?.includes('Sports Complex')) {
        const merged = { ...parsed, ...officialContact };
        run(
          'UPDATE website_content SET content_json = ?, updated_at = CURRENT_TIMESTAMP WHERE section_key = ?',
          [JSON.stringify(merged), 'contact']
        );
        console.log('Updated pitch coordinates and Crimson Anisha location in database.');
      }
    } catch {
      // ignore
    }
  }

  // Sync Hero eyebrow branding to 'ELITE FOOTBALL TRAINING'
  const existingHero = get<{ content_json: string }>(
    'SELECT content_json FROM website_content WHERE section_key = ?',
    ['hero']
  );
  if (existingHero) {
    try {
      const parsed = JSON.parse(existingHero.content_json);
      if (parsed.eyebrow?.includes('ACADEMY')) {
        parsed.eyebrow = 'ELITE FOOTBALL TRAINING';
        run(
          'UPDATE website_content SET content_json = ?, updated_at = CURRENT_TIMESTAMP WHERE section_key = ?',
          [JSON.stringify(parsed), 'hero']
        );
        console.log('Updated hero eyebrow to ELITE FOOTBALL TRAINING in database.');
      }
    } catch {
      // ignore
    }
  }

  // Sync academy_name setting
  run(
    "UPDATE academy_settings SET value = 'Elite Football Training' WHERE key = 'academy_name' AND value LIKE '%Academy%'"
  );
}

function seedInitialData() {
  // Check if training groups exist
  const groupCount = get<{ count: number }>('SELECT count(*) as count FROM training_groups');
  if (!groupCount || groupCount.count === 0) {
    const groups = [
      ['junior', 'Junior Batch', 'Ages 6-13', 'Tue, Thu, Sat (06:30 AM)', 'Foundations, ball mastery, agility, and teamwork', 1600],
      ['senior', 'Senior Batch', 'Ages 14+', 'Mon, Wed, Fri (05:00 PM)', 'Tactical conditioning, match play, and positional mastery', 2000]
    ];
    for (const g of groups) {
      run(
        'INSERT INTO training_groups (id, name, age_range, schedule, description, monthly_fee) VALUES (?, ?, ?, ?, ?, ?)',
        g
      );
    }
  }

  // Check if students exist (initial seeding disabled - start with clean database)
  /*
  const studentCount = get<{ count: number }>('SELECT count(*) as count FROM students');
  if (!studentCount || studentCount.count === 0) {
    ...
  }
  */

  // Seed Enquiries
  const enquiryCount = get<{ count: number }>('SELECT count(*) as count FROM enquiries');
  if (!enquiryCount || enquiryCount.count === 0) {
    const sampleEnquiries = [
      ['Sameer Kapoor', '+91 98765 11223', 'sameer.k@example.com', '11 years', 'Beginner', 'Technical Football Training', 'Morning Batches', 'Looking for professional coaching for my 11-year-old son who has a huge passion for football.', 'New', 'Needs trial slot on Saturday morning', '2026-10-21'],
      ['Pooja Singhania', '+91 98222 33445', 'pooja.s@example.com', '14 years', 'Intermediate', 'Passing & Ball Control', 'Evening Batches', 'My daughter plays for her school team and wants to join academy for competitive matches and tactical development.', 'Contacted', 'Spoke on phone, sent fee brochure via WhatsApp', '2026-10-22'],
      ['Deepak Rawat', '+91 99110 44556', 'deepak.rawat@example.com', '16 years', 'Advanced', 'Elite Attacking & Shooting', 'Weekend Scrimmages', 'Interested in U-16 tournament exposure and professional coaching mentorship.', 'Trial Scheduled', 'Trial confirmed for Oct 24th 5:00 PM', '2026-10-24'],
      ['Meera Joshi', '+91 97766 55443', 'meera.j@example.com', '9 years', 'Beginner', 'Grassroots Program', 'Morning Batches', 'Enquiry about training gear, boots requirement, and coach ratio for small kids.', 'New', '', ''],
      ['Arjun Nair', '+91 98440 99887', 'arjun.nair@example.com', '13 years', 'Intermediate', 'Speed, Fitness & Agility', 'Evening Batches', 'Joined training trial last week, wants to enroll.', 'Converted', 'Enrolled as student EFT-2024-008', '']
    ];

    for (const e of sampleEnquiries) {
      run(
        `INSERT INTO enquiries (name, phone, email, player_age, experience_level, program_interest, preferred_schedule, message, status, notes, next_follow_up)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        e
      );
    }
  }

  // Seed Gallery Items from existing galleryData
  const galleryCount = get<{ count: number }>('SELECT count(*) as count FROM gallery_media');
  if (!galleryCount || galleryCount.count === 0) {
    const galleryItems = [
      ['gal-1', 'High-Tempo Dribbling Cone Drills', 'Training', 'image', 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=600&q=80', 'Sample photo: Academy players executing rapid inside-outside foot touches through agility slalom cones.', 'October 2026', 'Ball Mastery', '', '', 1, 1, 1],
      ['gal-2', 'Shooting Technique & Top-Corner Finishing', 'Training', 'image', 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80', 'Sample photo: Striker striking the ball with instep power during target practice under coach supervision.', 'October 2026', 'Finishing', '', '', 1, 1, 2],
      ['gal-3', 'Dynamic First-Touch Video Breakdown', 'Videos', 'video', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80', 'Sample video highlight: Rapid 2-touch receiving and directional turning under defensive pressure.', 'October 2026', 'Passing & Receiving', '01:45', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 1, 1, 3],
      ['gal-4', 'Speed Agility Ladders & Acceleration', 'Training', 'image', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80', 'Sample photo: Speed ladder footwork training designed to sharpen fast-twitch muscle response.', 'October 2026', 'Agility & Fitness', '', '', 1, 1, 4],
      ['gal-5', 'Youth Cohort Weekend Friendly Match', 'Matches', 'image', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80', 'Sample photo: Weekend scrimmage testing tactical shape and teamwork in a competitive environment.', 'October 2026', 'Match Simulation', '', '', 1, 1, 5],
      ['gal-6', 'Tactical Team Huddle & Match Debrief', 'Events', 'image', 'https://images.unsplash.com/photo-1517747614396-d21a78b850e8?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1517747614396-d21a78b850e8?auto=format&fit=crop&w=600&q=80', 'Sample photo: Post-drill tactical breakdown focusing on defensive balance and transition speed.', 'September 2026', 'Tactical Briefing', '', '', 1, 1, 6],
      ['gal-7', 'Intense 1v1 Pressing & Ball Recovery', 'Videos', 'video', 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=600&q=80', 'Sample video highlight: Close-quarters defending drills emphasizing side-on stance and recovery timing.', 'September 2026', 'Defensive Skills', '02:10', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4', 1, 1, 7],
      ['gal-8', 'Inter-Academy Championship Final Moment', 'Events', 'image', 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=600&q=80', 'Sample photo: Academy squad celebrating a hard-fought tournament victory with trophies and medals.', 'August 2026', 'Tournament', '', '', 1, 1, 8],
      ['gal-9', 'Goalkeeper Reflex & Parrying Drills', 'Training', 'image', 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=600&q=80', 'Sample photo: Specialized shot-stopping and aerial claim drills under floodlights.', 'August 2026', 'Goalkeeping', '', '', 1, 1, 9],
      ['gal-10', 'Evening Floodlight Small-Sided Game', 'Matches', 'image', 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80', 'Sample photo: 5v5 high-octane mini tournament encouraging rapid decision making under pressure.', 'July 2026', 'Small Sided Match', '', '', 1, 1, 10],
      ['gal-11', 'Sprint Acceleration & Bounding Video', 'Videos', 'video', 'https://images.unsplash.com/photo-1489944445391-11751d2e1b0b?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1489944445391-11751d2e1b0b?auto=format&fit=crop&w=600&q=80', 'Sample video highlight: Plyometric bounding drills and resistor band sprint mechanics.', 'July 2026', 'Sprint Mechanics', '01:15', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 1, 1, 11],
      ['gal-12', 'Annual Academy Showcase & Awards Day', 'Events', 'image', 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=600&q=80', 'Sample photo: Academy family gathering acknowledging individual player development and sportsmanship.', 'June 2026', 'Annual Ceremony', '', '', 1, 1, 12]
    ];

    for (const g of galleryItems) {
      run(
        `INSERT INTO gallery_media (id, title, category, media_type, src, thumbnail, caption, date, drill_type, video_duration, video_source, is_published, parental_consent_verified, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        g
      );
    }
  }

  // Seed Reviews (disabled - starts empty until real reviews are submitted or added via Admin)
  /*
  const reviewCount = get<{ count: number }>('SELECT count(*) as count FROM reviews');
  if (!reviewCount || reviewCount.count === 0) {
    ...
  }
  */

  // Seed Website Content Sections
  const websiteContentCount = get<{ count: number }>('SELECT count(*) as count FROM website_content');
  if (!websiteContentCount || websiteContentCount.count === 0) {
    const heroContent = {
      eyebrow: 'ELITE FOOTBALL TRAINING',
      headlinePart1: 'TRAIN HARD.',
      headlinePart2: 'PLAY ELITE.',
      subtext: 'Develop your skills, build confidence, and take your football to the next level with Elite Football Training.',
      primaryCtaText: 'Join Our Training',
      primaryCtaLink: '/contact',
      secondaryCtaText: 'Explore Our Academy',
      secondaryCtaLink: '/about',
      badge1Title: 'High Tempo',
      badge1Subtitle: 'Drills & rondos',
      badge2Title: 'Pro Mentors',
      badge2Subtitle: 'Qualified staff',
      badge3Title: 'Match Ready',
      badge3Subtitle: '11v11 leagues'
    };

    const statsContent = {
      playersTrained: '250+',
      yearsExperience: '8+',
      trainingSessions: '1,200+',
      qualifiedCoaches: '6+'
    };

    const contactContent = {
      academyName: 'Elite Football Training',
      tagline: 'TRAIN HARD. PLAY ELITE.',
      phone: '+91 7768993889',
      email: 'elitefootballtraining01@gmail.com',
      location: 'Sports Complex, Ground 2, Stadium Road, City',
      operatingHours: '4:30 PM to 5:30 PM - Junior batch | 5:30 PM to 6:30 PM - Senior batch',
      whatsappNumber: '+917768993889',
      instagramUrl: 'https://instagram.com/elitefootballtraining',
      youtubeUrl: 'https://youtube.com/@elitefootballtraining'
    };

    const aboutContent = {
      missionHeadline: 'OUR MISSION',
      missionQuote: 'To provide a positive, structured, and development-focused football training environment where every player can learn, grow, and improve.',
      visionHeadline: 'OUR VISION',
      visionQuote: 'To inspire the next generation of footballers through quality coaching, discipline, teamwork, and dedication.',
      storyParagraph1: 'Elite Football Training was established with a vision to help aspiring footballers improve their technical ability, physical fitness, tactical understanding, and confidence. Our training environment focuses on discipline, teamwork, consistent improvement, and a genuine love for football.',
      storyParagraph2: 'Over the years, we have trained over 250+ aspiring athletes, developing fundamental game intelligence, speed agility, and tournament temperament with licensed AFC/AIFF coaches.'
    };

    run('INSERT INTO website_content (section_key, content_json) VALUES (?, ?)', ['hero', JSON.stringify(heroContent)]);
    run('INSERT INTO website_content (section_key, content_json) VALUES (?, ?)', ['stats', JSON.stringify(statsContent)]);
    run('INSERT INTO website_content (section_key, content_json) VALUES (?, ?)', ['contact', JSON.stringify(contactContent)]);
    run('INSERT INTO website_content (section_key, content_json) VALUES (?, ?)', ['about', JSON.stringify(aboutContent)]);
  }

  // Seed Academy Settings
  const settingsCount = get<{ count: number }>('SELECT count(*) as count FROM academy_settings');
  if (!settingsCount || settingsCount.count === 0) {
    const defaultSettings: [string, string][] = [
      ['academy_name', 'Elite Football Training'],
      ['tagline', 'TRAIN HARD. PLAY ELITE.'],
      ['currency', 'INR (₹)'],
      ['default_monthly_fee', '3500'],
      ['contact_phone', '+91 7768993889'],
      ['contact_email', 'elitefootballtraining01@gmail.com'],
      ['billing_cycle_day', '1st of every month'],
      ['fee_due_day', '10th of every month'],
      ['max_upload_size_mb', '25'],
      ['parental_consent_required', 'true']
    ];
    for (const [k, v] of defaultSettings) {
      run('INSERT INTO academy_settings (key, value) VALUES (?, ?)', [k, v]);
    }
  }

  // Seed Activity Log
  const logCount = get<{ count: number }>('SELECT count(*) as count FROM activity_logs');
  if (!logCount || logCount.count === 0) {
    const logs = [
      ['Rahul', 'System Initialization', 'system', 'sys-1', 'Founder Panel initialized with secure database and schema.'],
      ['Rahul', 'Enquiry Received', 'enquiry', '1', 'Enquiry received from Sameer Kapoor for Technical Football Training.'],
      ['Rahul', 'Payment Recorded', 'payment', '1', 'Recorded fee payment of ₹3,500 for Aarav Sharma (REC-202610-001).'],
      ['Rahul', 'Attendance Marked', 'attendance', 'today', "Marked morning session attendance for U-12 & U-14 squads."]
    ];
    for (const l of logs) {
      run('INSERT INTO activity_logs (actor, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)', l);
    }
  }
}
