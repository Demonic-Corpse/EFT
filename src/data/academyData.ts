import { AcademyContactInfo, AcademyStats } from '../types';

/**
 * ELITE FOOTBALL TRAINING CONFIGURATION
 * All values marked with XYZ are placeholders and should be replaced with verified
 * academy details once official records are provided.
 */
export const ACADEMY_CONFIG: AcademyContactInfo = {
  academyName: 'Elite Football Training',
  tagline: 'TRAIN HARD. PLAY ELITE.',
  phone: '+91 7768993889',
  email: 'elitefootballtraining01@gmail.com',
  location: 'Crimson Anisha Football Pitch, Pune',
  addressDetails: 'Crimson Anisha Football Ground, Marunji Road, near Life Republic, Hinjawadi / Mulshi, Pune, Maharashtra 411057',
  operatingHours: '4:30 PM to 5:30 PM - Junior batch | 5:30 PM to 6:30 PM - Senior batch',
  whatsappNumber: '+917768993889',
  instagramUrl: 'https://instagram.com/elitefootballtraining',
  youtubeUrl: 'https://youtube.com/@elitefootballtraining',
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=18.62161,73.71343&hl=en&z=16&output=embed',
  latitude: '18.62161° N (18° 37′ 18″ N)',
  longitude: '73.71343° E (73° 42′ 48″ E)',
  mapcartaUrl: 'https://mapcarta.com/N8585616660',
  googleMapsUrl: 'https://www.google.com/maps?q=18.62161,73.71343',
};

export const ACADEMY_STATS: AcademyStats = {
  playersTrained: '50+',
  yearsExperience: '5+',
  qualifiedCoaches: '2',
};

export const ACADEMY_STAT_ITEMS = [
  {
    key: 'players',
    value: '50+',
    label: 'Players Trained',
    subtext: 'Nurtured across youth & senior programs',
    note: 'Verified enrolled players and development roster',
  },
  {
    key: 'experience',
    value: '5+',
    label: 'Years of Experience',
    subtext: 'Dedicated football dev elopment',
    note: 'Delivering structured pitch excellence & coaching',
  },
  {
    key: 'coaches',
    value: '2',
    label: 'Qualified Coaches',
    subtext: 'Licensed football mentors & staff',
    note: 'Certified coaching roster',
  },
];

export const ACADEMY_MISSION = {
  headline: 'OUR MISSION',
  quote:
    'To provide a positive, structured, and development-focused football training environment where every player can learn, grow, and improve.',
};

export const ACADEMY_VISION = {
  headline: 'OUR VISION',
  quote:
    'To inspire the next generation of footballers through quality coaching, discipline, teamwork, and dedication.',
};

export const ACADEMY_STORY = {
  paragraph1:
    'Elite Football Training was established with a vision to help aspiring footballers improve their technical ability, physical fitness, tactical understanding, and confidence. Our training environment focuses on discipline, teamwork, consistent improvement, and a genuine love for football.',
};

export const ACADEMY_VALUES = [
  {
    title: 'Discipline',
    description:
      'Punctuality, focus during drills, respecting the badge, and developing work ethic on and off the pitch.',
    iconName: 'ShieldCheck',
  },
  {
    title: 'Teamwork',
    description:
      'Understanding tactical cohesion, vocal communication, supporting teammates, and winning together.',
    iconName: 'Users',
  },
  {
    title: 'Consistency',
    description:
      'Continuous daily progression, mastery through repetitions, and building muscle memory through dedication.',
    iconName: 'Repeat',
  },
  {
    title: 'Sportsmanship',
    description:
      'Respecting opponents, referees, coaching staff, and upholding the integrity of the beautiful game.',
    iconName: 'HeartHandshake',
  },
];

export const COACHING_PHILOSOPHY = [
  {
    pillar: 'Technical Mastery',
    detail:
      'High-repetition ball manipulation, close control in tight spaces, bilateral passing (both feet), and clinical finishing under pressure.',
    tag: 'Phase 1: Foundation',
  },
  {
    pillar: 'Physical & Athletic Conditioning',
    detail:
      'Football-specific speed, explosive acceleration, deceleration, agility ladders, core stability, and injury prevention protocols.',
    tag: 'Phase 2: Performance',
  },
  {
    pillar: 'Tactical Game Awareness',
    detail:
      'Scanning before receiving, reading passing lanes, transition moments (attack-to-defense), spatial awareness, and position-specific intelligence.',
    tag: 'Phase 3: Intelligence',
  },
  {
    pillar: 'Mental Toughness & Confidence',
    detail:
      'Developing positive self-talk, overcoming in-game mistakes, leadership voice, and resilient decision-making in high-stakes match situations.',
    tag: 'Phase 4: Mindset',
  },
];

export const HEAD_COACH_INFO = {
  name: 'Rahul Gaonkar',
  designation: 'Founder & Head Coach',
  academy: 'Elite Football Training',
  location: 'Hinjewadi – Marunji, Pune',
  badge: 'FOUNDER & HEAD COACH',
  license: "D License in Football",
  experience: '5+ Years Coaching Experience',
  tournaments: 'State Level & Cluster Tournament Player',
  ageGroups: 'Trains 5 Years Old to U-19 Players',
  image: '/founder.jpg',
  credentials: [
    { label: 'Qualification', value: 'D License in Football', icon: 'Award' },
    { label: 'Experience', value: '5+ Years Coaching', icon: 'Calendar' },
    { label: 'Tournaments', value: 'State Level & Cluster', icon: 'Trophy' },
    { label: 'Age Groups', value: 'Age 5 to U-19 Players', icon: 'Users' },
  ],
  bio: [
    'At Elite Football Training, our vision is to create an environment where young footballers can develop their skills, build confidence and understand the true spirit of the game.',
    "As the Founder and Head Coach of Elite Football Training, Rahul Gaonkar leads the academy's training activities with a focus on football development, discipline, teamwork and continuous improvement.",
    'A certified D License football coach with over 5+ years of coaching experience, he has represented and competed in prestigious State-level and Cluster tournaments. His coaching spans from young 5-year-old grassroots trainees up to competitive U-19 footballers.',
    'His aim is to help aspiring players improve their technical abilities, develop a strong understanding of football and gain valuable experience through regular training and competitive opportunities.',
  ],
  philosophy: [
    {
      title: 'Technical Development',
      description: 'Building strong football fundamentals and individual skills.',
      icon: 'Zap',
    },
    {
      title: 'Discipline',
      description: 'Developing consistency, commitment and respect.',
      icon: 'ShieldCheck',
    },
    {
      title: 'Teamwork',
      description: 'Encouraging communication, cooperation and sportsmanship.',
      icon: 'Users',
    },
    {
      title: 'Competitive Mindset',
      description: 'Preparing players to perform confidently in competitive matches.',
      icon: 'Trophy',
    },
  ],
};
