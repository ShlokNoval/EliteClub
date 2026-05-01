// ═══════════════════════════════════════════════
//  EliteClub — Mock Data
//  All data is simulated for frontend development
// ═══════════════════════════════════════════════

export const brandInfo = {
  name: 'The Elite Club',
  tagline: 'Where Every Pour is a Privilege',
  location: 'Chh. Sambhajinagar',
  phone: '+91 98765 43210',
  email: 'membership@theeliteclub.in',
  website: 'www.theeliteclub.in',
  description: 'An exclusive membership-based liquor club offering premium experiences across partnered venues in Chh. Sambhajinagar.',
};

export const membershipPlans = [
  {
    id: 'dainik',
    name: 'Dainik Member',
    subtitle: 'The Daily Connoisseur',
    duration: '30 Days',
    mrpDays: 29,
    freeDays: 1,
    price: 1700,
    perDayValue: '₹57/day',
    features: [
      '29 days liquor at MRP + VAT',
      '1 day unlimited liquor — FREE',
      'Access to all partner venues',
      'Digital membership card with QR',
      'Priority seating at events',
      'Member-only offers & deals',
    ],
    popular: false,
    color: 'gold',
  },
  {
    id: 'decka',
    name: 'Decka Member',
    subtitle: 'The Premium Experience',
    duration: '10 Days',
    mrpDays: 9,
    freeDays: 1,
    price: 3400,
    perDayValue: '₹340/day',
    features: [
      '9 days liquor at MRP + VAT',
      '1 day unlimited liquor — FREE',
      'Access to all partner venues',
      'Digital membership card with QR',
      'VIP priority at all venues',
      'Exclusive member events access',
      'Personal concierge support',
      'Complimentary appetizer on free day',
    ],
    popular: true,
    color: 'burgundy',
  },
];

export const benefits = [
  {
    id: 1,
    icon: 'Crown',
    title: 'Exclusive Access',
    description: 'Walk into any partner venue with VIP treatment and priority service.',
  },
  {
    id: 2,
    icon: 'Percent',
    title: 'MRP + VAT Pricing',
    description: 'Enjoy your favourite drinks at the fairest price — no hidden charges.',
  },
  {
    id: 3,
    icon: 'Wine',
    title: 'Free Unlimited Day',
    description: 'One day of unlimited liquor completely free with every membership cycle.',
  },
  {
    id: 4,
    icon: 'QrCode',
    title: 'Digital Card',
    description: 'Carry your membership in your pocket with a secure digital QR card.',
  },
  {
    id: 5,
    icon: 'MapPin',
    title: '12+ Partner Venues',
    description: 'Valid across the finest bars, restaurants, and lounges in the city.',
  },
  {
    id: 6,
    icon: 'Shield',
    title: 'Verified & Secure',
    description: 'Every transaction is verified through our secure QR validation system.',
  },
];

export const howItWorks = [
  {
    step: 1,
    title: 'Choose Your Plan',
    description: 'Select Dainik or Decka membership based on your lifestyle.',
    icon: 'Sparkles',
  },
  {
    step: 2,
    title: 'Get Your Card',
    description: 'Receive your digital membership card with a unique QR code.',
    icon: 'CreditCard',
  },
  {
    step: 3,
    title: 'Visit Any Venue',
    description: 'Walk into any of our 12+ partner venues across the city.',
    icon: 'MapPin',
  },
  {
    step: 4,
    title: 'Scan & Enjoy',
    description: 'Show your QR, get verified instantly, and enjoy your privileges.',
    icon: 'ScanLine',
  },
];

export const partnerVenues = [
  { id: 1, name: 'Elevate Bar', type: 'Bar & Lounge', status: 'verified' },
  { id: 2, name: 'Spree', type: 'Restaurant & Bar', status: 'verified' },
  { id: 3, name: 'Patiala Peg Kitchen & Bar', type: 'Kitchen & Bar', status: 'verified' },
  { id: 4, name: 'The Hangover', type: 'Bar & Lounge', status: 'verified' },
  { id: 5, name: 'Abhinandan Rooftop Restaurant & Bar', type: 'Rooftop Restaurant', status: 'verified' },
  { id: 6, name: 'Tokeo Vintage Sky Lounge', type: 'Club & Kitchen', status: 'verified' },
  { id: 7, name: 'Hotel Balbeer Family Restro & Bar', type: 'Restaurant & Bar', status: 'verified' },
  { id: 8, name: 'The Maple Restaurant & Bar', type: 'Restaurant & Bar', status: 'verified' },
  { id: 9, name: 'Silver Oak', type: 'Restaurant & Bar', status: 'verified' },
  { id: 10, name: 'Hotel Ambika Executive', type: 'Hotel & Bar', status: 'verified' },
  { id: 11, name: 'Hotel Madhuram', type: 'Hotel & Restaurant', status: 'verified' },
  { id: 12, name: 'Swara Executive Restaurant & Bar', type: 'Restaurant & Bar', status: 'verified' },
];

export const faqData = [
  {
    question: 'What is The Elite Club?',
    answer: 'The Elite Club is an exclusive membership-based liquor club in Chh. Sambhajinagar. Members enjoy premium benefits including MRP+VAT pricing and free unlimited liquor days across 12+ partner venues.',
  },
  {
    question: 'How does the free unlimited liquor day work?',
    answer: 'Based on your plan, you get 1 full day of unlimited liquor at any partner venue at no extra cost. Dainik members get this once in 30 days, and Decka members get it once in 10 days.',
  },
  {
    question: 'Can I use my membership at any venue?',
    answer: 'Yes! Your digital membership card is valid across all 12+ verified partner venues in Chh. Sambhajinagar. Simply show your QR code to the venue staff.',
  },
  {
    question: 'How do I get my membership card?',
    answer: 'After registration and payment, you receive a digital membership card with a unique QR code. You can access it anytime from your member dashboard.',
  },
  {
    question: 'What happens if my membership expires?',
    answer: 'You can renew your membership anytime from your dashboard. During the inactive period, you won\'t be able to avail member benefits at partner venues.',
  },
  {
    question: 'Is the QR code secure?',
    answer: 'Absolutely. Each QR code is uniquely generated and verified in real-time. Only admin-approved partner hotels can validate your membership through secure scanning.',
  },
];

// ═══ Mock User Data ═══
export const mockUsers = [
  {
    id: 'USR001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 11111',
    plan: 'decka',
    status: 'active',
    joinDate: '2026-04-01',
    expiryDate: '2026-04-10',
    avatar: null,
    totalSpent: 6800,
    visitsCount: 15,
  },
  {
    id: 'USR002',
    name: 'Amit Sharma',
    email: 'amit.sharma@email.com',
    phone: '+91 98765 22222',
    plan: 'dainik',
    status: 'active',
    joinDate: '2026-04-05',
    expiryDate: '2026-05-04',
    avatar: null,
    totalSpent: 3400,
    visitsCount: 8,
  },
  {
    id: 'USR003',
    name: 'Priya Deshmukh',
    email: 'priya.d@email.com',
    phone: '+91 98765 33333',
    plan: 'decka',
    status: 'inactive',
    joinDate: '2026-03-15',
    expiryDate: '2026-03-25',
    avatar: null,
    totalSpent: 3400,
    visitsCount: 5,
  },
  {
    id: 'USR004',
    name: 'Vikram Patil',
    email: 'vikram.p@email.com',
    phone: '+91 98765 44444',
    plan: 'dainik',
    status: 'active',
    joinDate: '2026-04-10',
    expiryDate: '2026-05-09',
    avatar: null,
    totalSpent: 5100,
    visitsCount: 12,
  },
  {
    id: 'USR005',
    name: 'Sneha Joshi',
    email: 'sneha.j@email.com',
    phone: '+91 98765 55555',
    plan: 'decka',
    status: 'pending',
    joinDate: '2026-04-28',
    expiryDate: null,
    avatar: null,
    totalSpent: 0,
    visitsCount: 0,
  },
  {
    id: 'USR006',
    name: 'Rohan Kulkarni',
    email: 'rohan.k@email.com',
    phone: '+91 98765 66666',
    plan: 'dainik',
    status: 'active',
    joinDate: '2026-04-15',
    expiryDate: '2026-05-14',
    avatar: null,
    totalSpent: 1700,
    visitsCount: 3,
  },
  {
    id: 'USR007',
    name: 'Anita More',
    email: 'anita.m@email.com',
    phone: '+91 98765 77777',
    plan: 'decka',
    status: 'expired',
    joinDate: '2026-03-01',
    expiryDate: '2026-03-10',
    avatar: null,
    totalSpent: 10200,
    visitsCount: 22,
  },
  {
    id: 'USR008',
    name: 'Deepak Gaikwad',
    email: 'deepak.g@email.com',
    phone: '+91 98765 88888',
    plan: 'dainik',
    status: 'active',
    joinDate: '2026-04-20',
    expiryDate: '2026-05-19',
    avatar: null,
    totalSpent: 1700,
    visitsCount: 6,
  },
];

// ═══ Mock Hotels (for Admin) ═══
export const mockHotels = [
  { id: 'HTL001', name: 'Elevate Bar', contact: 'Rahul Verma', phone: '+91 98765 10001', status: 'verified', role: 'partner', scanCount: 145, joinDate: '2026-01-15' },
  { id: 'HTL002', name: 'Spree', contact: 'Suresh Patel', phone: '+91 98765 10002', status: 'verified', role: 'partner', scanCount: 230, joinDate: '2026-01-20' },
  { id: 'HTL003', name: 'Patiala Peg Kitchen & Bar', contact: 'Harpreet Singh', phone: '+91 98765 10003', status: 'verified', role: 'partner', scanCount: 189, joinDate: '2026-02-01' },
  { id: 'HTL004', name: 'The Hangover', contact: 'Vishal Jadhav', phone: '+91 98765 10004', status: 'verified', role: 'partner', scanCount: 167, joinDate: '2026-02-10' },
  { id: 'HTL005', name: 'Abhinandan Rooftop', contact: 'Manoj Gupta', phone: '+91 98765 10005', status: 'verified', role: 'partner', scanCount: 198, joinDate: '2026-02-15' },
  { id: 'HTL006', name: 'Tokeo Vintage Sky Lounge', contact: 'Nikhil Rao', phone: '+91 98765 10006', status: 'pending', role: 'applicant', scanCount: 0, joinDate: '2026-04-25' },
  { id: 'HTL007', name: 'Hotel Balbeer', contact: 'Balbeer Khan', phone: '+91 98765 10007', status: 'verified', role: 'partner', scanCount: 112, joinDate: '2026-03-01' },
  { id: 'HTL008', name: 'The Maple', contact: 'Arun Tiwari', phone: '+91 98765 10008', status: 'verified', role: 'partner', scanCount: 156, joinDate: '2026-03-05' },
  { id: 'HTL009', name: 'Silver Oak', contact: 'Prakash Jain', phone: '+91 98765 10009', status: 'rejected', role: 'applicant', scanCount: 0, joinDate: '2026-04-20' },
  { id: 'HTL010', name: 'Hotel Ambika Executive', contact: 'Sandeep Mishra', phone: '+91 98765 10010', status: 'verified', role: 'partner', scanCount: 88, joinDate: '2026-03-15' },
  { id: 'HTL011', name: 'Hotel Madhuram', contact: 'Ramesh Yadav', phone: '+91 98765 10011', status: 'verified', role: 'partner', scanCount: 134, joinDate: '2026-03-20' },
  { id: 'HTL012', name: 'Swara Executive', contact: 'Dinesh Sawant', phone: '+91 98765 10012', status: 'pending', role: 'applicant', scanCount: 0, joinDate: '2026-04-28' },
];

// ═══ Mock Scans ═══
export const mockScans = [
  { id: 'SCN001', hotelId: 'HTL001', hotelName: 'Elevate Bar', userId: 'USR001', userName: 'Rajesh Kumar', timestamp: '2026-04-30T18:30:00', result: 'valid', plan: 'Decka Member' },
  { id: 'SCN002', hotelId: 'HTL002', hotelName: 'Spree', userId: 'USR002', userName: 'Amit Sharma', timestamp: '2026-04-30T19:15:00', result: 'valid', plan: 'Dainik Member' },
  { id: 'SCN003', hotelId: 'HTL003', hotelName: 'Patiala Peg', userId: 'USR003', userName: 'Priya Deshmukh', timestamp: '2026-04-30T20:00:00', result: 'expired', plan: 'Decka Member' },
  { id: 'SCN004', hotelId: 'HTL001', hotelName: 'Elevate Bar', userId: 'USR004', userName: 'Vikram Patil', timestamp: '2026-04-30T20:45:00', result: 'valid', plan: 'Dainik Member' },
  { id: 'SCN005', hotelId: 'HTL005', hotelName: 'Abhinandan', userId: 'USR001', userName: 'Rajesh Kumar', timestamp: '2026-04-29T21:00:00', result: 'valid', plan: 'Decka Member' },
  { id: 'SCN006', hotelId: 'HTL004', hotelName: 'The Hangover', userId: 'USR007', userName: 'Anita More', timestamp: '2026-04-29T19:30:00', result: 'expired', plan: 'Decka Member' },
  { id: 'SCN007', hotelId: 'HTL002', hotelName: 'Spree', userId: 'USR006', userName: 'Rohan Kulkarni', timestamp: '2026-04-29T18:00:00', result: 'valid', plan: 'Dainik Member' },
  { id: 'SCN008', hotelId: 'HTL008', hotelName: 'The Maple', userId: 'USR008', userName: 'Deepak Gaikwad', timestamp: '2026-04-28T20:30:00', result: 'valid', plan: 'Dainik Member' },
  { id: 'SCN009', hotelId: 'HTL001', hotelName: 'Elevate Bar', userId: 'UNKNOWN', userName: 'Unknown', timestamp: '2026-04-28T22:00:00', result: 'invalid', plan: 'N/A' },
  { id: 'SCN010', hotelId: 'HTL007', hotelName: 'Hotel Balbeer', userId: 'USR004', userName: 'Vikram Patil', timestamp: '2026-04-28T19:15:00', result: 'valid', plan: 'Dainik Member' },
];

// ═══ Admin Stats ═══
export const adminStats = {
  totalUsers: 156,
  activeMembers: 89,
  pendingApprovals: 12,
  totalHotels: 12,
  verifiedHotels: 9,
  monthlyRevenue: 284500,
  totalScans: 1847,
  todayScans: 34,
};

// ═══ Hotel Stats (for a sample hotel) ═══
export const hotelStats = {
  todayScans: 12,
  validScans: 10,
  invalidScans: 1,
  expiredScans: 1,
  totalScans: 456,
  weeklyScans: 67,
  verificationStatus: 'verified',
};

// ═══ Current logged-in user (mock) ═══
export const currentUser = {
  id: 'USR001',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@email.com',
  phone: '+91 98765 11111',
  plan: 'decka',
  planName: 'Decka Member',
  status: 'active',
  joinDate: '2026-04-01',
  expiryDate: '2026-04-10',
  memberId: 'EC-2026-001',
  totalSpent: 6800,
  visitsCount: 15,
  favouriteVenue: 'Elevate Bar',
};

// ═══ Current hotel (mock) ═══
export const currentHotel = {
  id: 'HTL001',
  name: 'Elevate Bar',
  contact: 'Rahul Verma',
  phone: '+91 98765 10001',
  status: 'verified',
  role: 'partner',
  location: 'Jalna Road, Chh. Sambhajinagar',
  scanCount: 145,
  joinDate: '2026-01-15',
};

// ═══ Recent Activity (Admin) ═══
export const recentActivity = [
  { id: 1, type: 'user_joined', message: 'Sneha Joshi registered for Decka membership', time: '2 hours ago', icon: 'UserPlus' },
  { id: 2, type: 'scan', message: 'QR scanned at Elevate Bar — Valid membership', time: '3 hours ago', icon: 'ScanLine' },
  { id: 3, type: 'hotel_request', message: 'Tokeo Vintage Sky Lounge applied for partnership', time: '5 hours ago', icon: 'Building2' },
  { id: 4, type: 'payment', message: 'Payment received from Vikram Patil — ₹1,700', time: '6 hours ago', icon: 'IndianRupee' },
  { id: 5, type: 'expired', message: 'Anita More\'s Decka membership expired', time: '1 day ago', icon: 'AlertTriangle' },
  { id: 6, type: 'hotel_verified', message: 'Silver Oak partnership request rejected', time: '2 days ago', icon: 'XCircle' },
  { id: 7, type: 'scan', message: 'Invalid QR scan attempt at Elevate Bar', time: '2 days ago', icon: 'ShieldAlert' },
  { id: 8, type: 'user_joined', message: 'Deepak Gaikwad registered for Dainik membership', time: '3 days ago', icon: 'UserPlus' },
];

// ═══ Revenue Chart Data ═══
export const revenueChartData = [
  { month: 'Jan', revenue: 42000 },
  { month: 'Feb', revenue: 58000 },
  { month: 'Mar', revenue: 67000 },
  { month: 'Apr', revenue: 89000 },
  { month: 'May', revenue: 28500 },
];

// ═══ Scans Chart Data ═══
export const scansChartData = [
  { day: 'Mon', scans: 18 },
  { day: 'Tue', scans: 24 },
  { day: 'Wed', scans: 31 },
  { day: 'Thu', scans: 28 },
  { day: 'Fri', scans: 42 },
  { day: 'Sat', scans: 56 },
  { day: 'Sun', scans: 48 },
];
