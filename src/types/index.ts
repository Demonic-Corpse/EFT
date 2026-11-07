export type MediaCategory = 'All' | 'Training' | 'Matches' | 'Events' | 'Videos';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Training' | 'Matches' | 'Events' | 'Videos';
  mediaType: 'image' | 'video';
  src: string;
  thumbnail: string;
  caption: string;
  date: string; // e.g. "XYZ Season 2025"
  drillType?: string;
  videoDuration?: string;
  videoSource?: string;
}

export interface ReviewItem {
  id: string;
  author: string; // e.g. "XYZ Player" or "XYZ Parent"
  role: 'Player' | 'Parent' | 'Alumni';
  rating: number; // 1 to 5
  content: string;
  date: string;
  avatar?: string;
  verifiedBadge?: boolean;
}

export interface TrainingProgram {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  level: string; // "XYZ"
  ageGroup: string; // "XYZ"
  schedule: string; // "XYZ"
  duration: string; // "XYZ"
  image: string;
  badge: string;
  highlights: string[];
  focusAreas: string[];
}

export interface ScheduleSlot {
  id: string;
  day: string;
  program: string;
  ageGroup: string;
  timeSlot: string;
  pitch: string;
  intensity: 'High' | 'Medium' | 'Fundamental';
}

export interface AcademyStats {
  playersTrained: string; // "XYZ+"
  yearsExperience: string; // "XYZ"
  trainingSessions?: string; // Optional metric
  qualifiedCoaches: string; // "XYZ"
}

export interface AcademyContactInfo {
  academyName: string;
  tagline: string;
  phone: string; // "+91 XXXXX XXXXX"
  email: string; // "XYZ@example.com"
  location: string; // "XYZ, City, India"
  addressDetails: string;
  operatingHours: string;
  whatsappNumber: string; // for direct WhatsApp API link
  instagramUrl: string;
  youtubeUrl: string;
  googleMapsEmbedUrl: string;
  latitude?: string;
  longitude?: string;
  mapcartaUrl?: string;
  googleMapsUrl?: string;
}

export interface EnquiryFormData {
  fullName: string;
  contactNumber: string;
  email: string;
  playerAge: string;
  experienceLevel: string;
  programPreference: string;
  message: string;
}

export interface ReviewFormData {
  author: string;
  role: 'Player' | 'Parent';
  rating: number;
  content: string;
}
