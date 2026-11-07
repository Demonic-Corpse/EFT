export interface FounderUser {
  name: string;
  role: string;
}

export interface Student {
  id: string;
  name: string;
  avatar?: string;
  dob?: string;
  age?: number;
  gender?: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email?: string;
  training_group: string;
  group_name?: string;
  joining_date: string;
  monthly_fee: number;
  status: 'active' | 'inactive' | 'archived';
  address?: string;
  notes?: string;
  current_fee_status?: string;
  current_fee_balance?: number;
  attendancePercentage?: number;
  present_sessions?: number;
  total_sessions?: number;
}

export interface AttendanceRecord {
  id?: number;
  student_id: string;
  name?: string;
  avatar?: string;
  date: string;
  training_group: string;
  group_name?: string;
  session_name: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'unmarked';
  notes?: string;
  marked_by?: string;
  updated_at?: string;
  is_marked?: boolean;
}

export interface Payment {
  id: number;
  fee_record_id: number;
  student_id: string;
  amount: number;
  payment_date: string;
  payment_method: 'Cash' | 'UPI' | 'Bank Transfer' | 'Other';
  transaction_ref?: string;
  notes?: string;
  receipt_no: string;
  is_reversed: number;
  reversal_reason?: string;
  created_by?: string;
  created_at: string;
}

export interface FeeRecord {
  id: number;
  student_id: string;
  student_name?: string;
  student_avatar?: string;
  guardian_name?: string;
  guardian_phone?: string;
  training_group?: string;
  group_name?: string;
  billing_period: string;
  fee_due: number;
  amount_paid: number;
  balance: number;
  status: 'unpaid' | 'partially_paid' | 'paid' | 'overdue' | 'waived';
  due_date: string;
  discount_or_adjustment?: number;
  adjustment_reason?: string;
  created_at: string;
  updated_at: string;
  payments?: Payment[];
}

export interface Enquiry {
  id: number;
  name: string;
  phone: string;
  email?: string;
  player_age?: string;
  experience_level?: string;
  program_interest?: string;
  preferred_schedule?: string;
  message: string;
  status: 'New' | 'Contacted' | 'Trial Scheduled' | 'Converted' | 'Not Interested';
  notes?: string;
  next_follow_up?: string;
  converted_student_id?: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryMediaItem {
  id: string;
  title: string;
  category: 'Training' | 'Matches' | 'Events' | 'Team Photos' | 'Videos';
  media_type: 'image' | 'video';
  src: string;
  thumbnail?: string;
  caption?: string;
  date?: string;
  drill_type?: string;
  video_duration?: string;
  video_source?: string;
  is_published: number;
  parental_consent_verified: number;
  sort_order: number;
  created_at: string;
}

export interface ReviewItemAdmin {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  content: string;
  avatar?: string;
  verified_badge: number;
  status: 'pending' | 'approved' | 'rejected';
  is_genuine_external: number;
  created_at: string;
}

export interface ActivityLog {
  id: number;
  actor: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details: string;
  created_at: string;
}
