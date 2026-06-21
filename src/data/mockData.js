// ═══════════════════════════════════════════════
//  EliteClub — Mock Data
//  All data is simulated for frontend development
// ═══════════════════════════════════════════════

export const brandInfo = {
  name: 'The Elite Club',
  tagline: 'Where Every Pour is a Privilege',
  location: 'S01 2nd Floor Khinvasara High Street, Ulkanagri, Garkheda area, Chh. Sambhajinagar 431009',
  phone: '+91 77967 76692',
  email: 'team.eliteclubcsn@gmail.com',
  website: 'www.theeliteclub.in',
  description: 'An exclusive membership-based liquor club offering premium experiences across partnered venues in Chh. Sambhajinagar.',
  techSupport: [
    { name: 'Parth Pawar', phone: '+91 9325058522' },
    { name: 'Sarvesh Madiwale', phone: '+91 9356784119' }
  ]
};

export const membershipPlans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    subtitle: 'The Starter Experience',
    duration: '30 Days',
    mrpDays: 0,
    unlimitedDays: 0,
    maxVisits: 5,
    price: 999,
    perDayValue: '₹200/visit',
    features: [
      '5 visits to selected partner venues',
      'Liquor at MRP + VAT pricing',
      'OTP verified check-in',
      'Digital membership card with QR',
      'Member-only offers & deals',
    ],
    popular: false,
    color: 'silver',
  },
  {
    id: 'prime',
    name: 'Solo Plan',
    subtitle: 'The Personal Privilege',
    duration: '30 Days',
    mrpDays: 29,
    unlimitedDays: 1,
    price: 4000,
    perDayValue: '₹133/day',
    features: [
      '29 days liquor at MRP + VAT',
      '1 day with NO consumption limits',
      'OTP verified — must be present at venue',
      'Access to all partner venues',
      'Digital membership card with QR',
      'Priority seating at events',
      'Member-only offers & deals',
    ],
    popular: true,
    color: 'burgundy',
  },
  {
    id: 'shareable',
    name: 'Shareable Plan',
    subtitle: 'The Shared Experience',
    duration: '30 Days',
    mrpDays: 29,
    unlimitedDays: 1,
    price: 6000,
    perDayValue: '₹200/day',
    features: [
      'Shareable with 1 other person via OTP',
      'Owner not required to be present',
      '29 days liquor at MRP + VAT',
      '1 day with NO consumption limits',
      'Access to all partner venues',
      'Digital membership card with QR',
      'VIP priority at all venues',
      'Exclusive member events access',
    ],
    popular: false,
    color: 'gold',
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
    title: '1-Day Unlimited Quota',
    description: 'One day where venue consumption limits are entirely lifted, letting you enjoy without quotas.',
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
    description: 'Select Basic, Solo, or Shareable plan based on your lifestyle.',
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
  { id: 3, name: 'Patiala Peg Kitchen & Bar', type: 'Kitchen & Bar', status: 'verified', image: '/hotels/Patiala Peg.jpeg', address: 'Meera complex, Above HDFC Bank, Shivaji Nagar Rd, Sutgirni Chowk, Chhatrapati Sambhajinagar, Maharashtra 431009' },
  { id: 4, name: 'The Hangover', type: 'Bar & Lounge', status: 'verified', image: '/hotels/The Hangover.jpeg', address: 'Beed Bypass Rd, Mukundwadi, Chhatrapati Sambhajinagar, Maharashtra 431001' },
  { id: 5, name: 'Abhinandan Rooftop Restaurant & Bar', type: 'Rooftop Restaurant', status: 'verified', image: '/hotels/Abhinandan Rooftop.png', address: 'Jalna Rd, above MI Service Center, Seven Hills, Town Center, M G M, Chhatrapati Sambhajinagar, Maharashtra 431009' },
  { id: 6, name: 'Tokeo Vintage Sky Lounge', type: 'Club & Kitchen', status: 'verified', image: '/hotels/Tokeyo Lounge.png', address: '3rd Floor, Golden City Center, beside Prozon Mall, MIDC Industrial Area, Chilkalthana, Chhatrapati Sambhajinagar, Maharashtra 431006' },
  { id: 7, name: 'Hotel Balbeer Family Restro & Bar', type: 'Restaurant & Bar', status: 'verified', image: '/hotels/Hotel Balbeer.jpg.jpeg', address: 'Shendra, Aurangabad, SH-30, Nagpur Aurangabad Mumbai Highway, Aurangabad, Chhatrapati Sambhajinagar, Maharashtra 431154' },
  { id: 8, name: 'The Maple Restaurant & Bar', type: 'Restaurant & Bar', status: 'verified', image: '/hotels/The Maple.png', address: 'gut no 40, t_point, paithan, link road, waluj, Kanchanwadi, Golwadi, Maharashtra 431001' },
  { id: 9, name: 'Silver Oak', type: 'Restaurant & Bar', status: 'verified', image: '/hotels/Silver Oak.png', address: 'Plot No. X - 34, Shendra Five Star M.I.D.C., Area, Kubhephal, Maharashtra 431154' },
  { id: 10, name: 'Hotel Ambika Executive', type: 'Hotel & Bar', status: 'verified', image: '/hotels/Hotel Ambika.png', address: 'Aurangabad - Solapur Hwy, Zalta, Maharashtra 431007' },
  { id: 11, name: 'Hotel Madhuram', type: 'Hotel & Restaurant', status: 'verified', image: '/hotels/Hotel Madhuram.png', address: 'Near Hindustan Petroleum Corporation, Bypass Rd, Sawangi, Maharashtra 431008' },
  { id: 12, name: 'Swara Executive Restaurant & Bar', type: 'Restaurant & Bar', status: 'verified', image: '/hotels/Swara Executive.png', address: 'Kamgar Chowk, Mayanagar Colony, N 2, Cidco, Chhatrapati Sambhajinagar, Maharashtra 431003' },
  { id: 13, name: 'Kohinoor Plaza', type: 'Hotel & Restaurant', status: 'verified', image: '/hotels/Kohinoor Plaza.png', address: 'Nirala Bazar Rd, opposite M.P. LOW COLLEGE, Samarth Nagar, Chhatrapati Sambhajinagar, Maharashtra 431001' },
];

export const faqData = [
  {
    question: 'What is The Elite Club?',
    answer: 'The Elite Club is an exclusive membership-based liquor club in Chh. Sambhajinagar. Members enjoy premium benefits including MRP+VAT pricing and free unlimited liquor days across 12+ partner venues.',
  },
  {
    question: 'How does the unlimited quota day work?',
    answer: 'Based on your plan, you get 1 full day where venue consumption limits (nips/beers) are completely lifted. You will still be billed at MRP+VAT, but there is no maximum limit to what you can order on that day.',
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
    plan: 'shareable',
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
    plan: 'prime',
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
    plan: 'shareable',
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
    plan: 'prime',
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
    plan: 'shareable',
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
    plan: 'prime',
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
    plan: 'shareable',
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
    plan: 'prime',
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
  { id: 'SCN001', hotelId: 'HTL001', hotelName: 'Elevate Bar', userId: 'USR001', userName: 'Rajesh Kumar', timestamp: '2026-04-30T18:30:00', result: 'valid', plan: 'Shareable Plan' },
  { id: 'SCN002', hotelId: 'HTL002', hotelName: 'Spree', userId: 'USR002', userName: 'Amit Sharma', timestamp: '2026-04-30T19:15:00', result: 'valid', plan: 'Solo Plan' },
  { id: 'SCN003', hotelId: 'HTL003', hotelName: 'Patiala Peg', userId: 'USR003', userName: 'Priya Deshmukh', timestamp: '2026-04-30T20:00:00', result: 'expired', plan: 'Shareable Plan' },
  { id: 'SCN004', hotelId: 'HTL001', hotelName: 'Elevate Bar', userId: 'USR004', userName: 'Vikram Patil', timestamp: '2026-04-30T20:45:00', result: 'valid', plan: 'Solo Plan' },
  { id: 'SCN005', hotelId: 'HTL005', hotelName: 'Abhinandan', userId: 'USR001', userName: 'Rajesh Kumar', timestamp: '2026-04-29T21:00:00', result: 'valid', plan: 'Shareable Plan' },
  { id: 'SCN006', hotelId: 'HTL004', hotelName: 'The Hangover', userId: 'USR007', userName: 'Anita More', timestamp: '2026-04-29T19:30:00', result: 'expired', plan: 'Shareable Plan' },
  { id: 'SCN007', hotelId: 'HTL002', hotelName: 'Spree', userId: 'USR006', userName: 'Rohan Kulkarni', timestamp: '2026-04-29T18:00:00', result: 'valid', plan: 'Solo Plan' },
  { id: 'SCN008', hotelId: 'HTL008', hotelName: 'The Maple', userId: 'USR008', userName: 'Deepak Gaikwad', timestamp: '2026-04-28T20:30:00', result: 'valid', plan: 'Solo Plan' },
  { id: 'SCN009', hotelId: 'HTL001', hotelName: 'Elevate Bar', userId: 'UNKNOWN', userName: 'Unknown', timestamp: '2026-04-28T22:00:00', result: 'invalid', plan: 'N/A' },
  { id: 'SCN010', hotelId: 'HTL007', hotelName: 'Hotel Balbeer', userId: 'USR004', userName: 'Vikram Patil', timestamp: '2026-04-28T19:15:00', result: 'valid', plan: 'Solo Plan' },
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
  plan: 'shareable',
  planName: 'Shareable Plan',
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
  { id: 1, type: 'user_joined', message: 'Sneha Joshi registered for Shareable Plan', time: '2 hours ago', icon: 'UserPlus' },
  { id: 2, type: 'scan', message: 'QR scanned at Elevate Bar — Valid membership', time: '3 hours ago', icon: 'ScanLine' },
  { id: 3, type: 'hotel_request', message: 'Tokeo Vintage Sky Lounge applied for partnership', time: '5 hours ago', icon: 'Building2' },
  { id: 4, type: 'payment', message: 'Payment received from Vikram Patil — ₹1,700', time: '6 hours ago', icon: 'IndianRupee' },
  { id: 5, type: 'expired', message: 'Anita More\'s Shareable Plan expired', time: '1 day ago', icon: 'AlertTriangle' },
  { id: 6, type: 'hotel_verified', message: 'Silver Oak partnership request rejected', time: '2 days ago', icon: 'XCircle' },
  { id: 7, type: 'scan', message: 'Invalid QR scan attempt at Elevate Bar', time: '2 days ago', icon: 'ShieldAlert' },
  { id: 8, type: 'user_joined', message: 'Deepak Gaikwad registered for Solo Plan', time: '3 days ago', icon: 'UserPlus' },
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
