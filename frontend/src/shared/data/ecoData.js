// ═══════════════════════════════════════════════════════════════
// ecoData.js  –  All dummy data for Carbon Tracker & CivicHero
// ═══════════════════════════════════════════════════════════════

export const CURRENT_USER = {
  id:            'u_me',
  name:          'Arjun Desai',
  initials:      'AD',
  city:          'Nashik, MH',
  joinedAt:      'Jan 2024',
  avatarColor:   'linear-gradient(135deg,#1a6b3c,#22924f)',
  ecoPoints:     3840,
  streak:        14,
  longestStreak: 21,
  level:         4,
  levelXP:       68,
  cleanups:      23,
  plantations:   11,
  reports:       47,
  donations:     8,
  badges: ['first_report', 'week_streak', 'top10', 'clean_champ', 'green_thumb'],
}

export const ECO_LEVELS = [
  { level: 1, title: 'Seedling',       emoji: '🌱', color: '#86efac', gradFrom: '#bbf7d0', gradTo: '#86efac', min: 0,     max: 500   },
  { level: 2, title: 'Sapling',        emoji: '🪴', color: '#4ade80', gradFrom: '#86efac', gradTo: '#4ade80', min: 500,   max: 1500  },
  { level: 3, title: 'Eco Warrior',    emoji: '⚔️', color: '#22c55e', gradFrom: '#4ade80', gradTo: '#22c55e', min: 1500,  max: 3000  },
  { level: 4, title: 'Green Hero',     emoji: '🦸', color: '#16a34a', gradFrom: '#22c55e', gradTo: '#16a34a', min: 3000,  max: 5500  },
  { level: 5, title: 'Earth Guardian', emoji: '🌍', color: '#15803d', gradFrom: '#16a34a', gradTo: '#15803d', min: 5500,  max: 9000  },
  { level: 6, title: 'Planet Sage',    emoji: '🧙', color: '#166534', gradFrom: '#15803d', gradTo: '#166534', min: 9000,  max: 14000 },
]

export const DAILY_LOG = [
  { day: 'Mar 10', label: 'M', co2kg: 6.8, points: 180 },
  { day: 'Mar 11', label: 'T', co2kg: 5.2, points: 240 },
  { day: 'Mar 12', label: 'W', co2kg: 7.4, points: 110 },
  { day: 'Mar 13', label: 'T', co2kg: 4.1, points: 310 },
  { day: 'Mar 14', label: 'F', co2kg: 6.3, points: 200 },
  { day: 'Mar 15', label: 'S', co2kg: 3.9, points: 350 },
  { day: 'Mar 16', label: 'S', co2kg: 5.7, points: 220 },
  { day: 'Mar 17', label: 'M', co2kg: 4.6, points: 280 },
  { day: 'Mar 18', label: 'T', co2kg: 7.1, points: 140 },
  { day: 'Mar 19', label: 'W', co2kg: 3.5, points: 390 },
  { day: 'Mar 20', label: 'T', co2kg: 4.8, points: 260 },
  { day: 'Mar 21', label: 'F', co2kg: 5.0, points: 250 },
  { day: 'Mar 22', label: 'S', co2kg: 2.9, points: 420 },
  { day: 'Mar 23', label: 'S', co2kg: 3.4, points: 400, today: true },
]

export const WEEKLY_LOG = DAILY_LOG.slice(-7)

export const FOOTPRINT_CATEGORIES = [
  { id: 'transport', label: 'Transport',   emoji: '🚗', kg: 1.8, avg: 2.4, color: '#ef4444', tip: 'Try carpooling or public transport tomorrow.' },
  { id: 'food',      label: 'Food',        emoji: '🍽️', kg: 0.9, avg: 1.1, color: '#f97316', tip: 'One plant-based meal saves ~0.4 kg CO₂.' },
  { id: 'energy',    label: 'Home Energy', emoji: '⚡', kg: 0.5, avg: 0.9, color: '#eab308', tip: 'Switch off appliances at the socket tonight.' },
  { id: 'waste',     label: 'Waste',       emoji: '🗑️', kg: 0.2, avg: 0.5, color: '#84cc16', tip: "Segregate today's waste before bed." },
]

export const BADGES = [
  { id: 'first_report', emoji: '📍', label: 'First Report',    desc: 'Filed your first civic report',  earnedAt: 'Jan 15 2024' },
  { id: 'week_streak',  emoji: '🔥', label: '7-Day Streak',    desc: 'Active 7 days in a row',          earnedAt: 'Feb 2 2024'  },
  { id: 'top10',        emoji: '🏆', label: 'Top 10 Hero',     desc: 'Ranked in city top 10',           earnedAt: 'Feb 20 2024' },
  { id: 'clean_champ',  emoji: '🧹', label: 'Clean Champ',     desc: '20+ cleanup drives joined',       earnedAt: 'Mar 5 2024'  },
  { id: 'green_thumb',  emoji: '🌱', label: 'Green Thumb',     desc: 'Planted 10+ trees',               earnedAt: 'Mar 18 2024' },
  { id: 'eco_donor',    emoji: '🤝', label: 'Eco Donor',       desc: 'Donate 5+ items on marketplace',  locked: true },
  { id: 'carbon_zero',  emoji: '💚', label: 'Carbon Zero Day', desc: 'Log a sub-2 kg CO₂ day',          locked: true },
]

export const TODAY_ACTIONS = [
  { id: 'a1', emoji: '🚶', label: 'Walked instead of driving',       points: 50, done: true  },
  { id: 'a2', emoji: '🥗', label: 'Ate a plant-based meal',          points: 40, done: true  },
  { id: 'a3', emoji: '♻️', label: 'Segregated household waste',      points: 30, done: true  },
  { id: 'a4', emoji: '💡', label: 'Used natural light (no bulbs)',    points: 25, done: false },
  { id: 'a5', emoji: '🚿', label: 'Reduced shower time to 5 min',    points: 20, done: false },
  { id: 'a6', emoji: '🛍️', label: 'Used reusable bags for shopping', points: 15, done: false },
]

export const LEADERBOARD_USERS = [
  { rank:1,  id:'u1',   name:'Priya Sharma',   initials:'PS', city:'Pune',       ecoPoints:9420, plantations:48, cleanups:62, reports:94, streak:45, level:5, weeklyChange:320,  avatarColor:'linear-gradient(135deg,#f9a8d4,#c084fc)' },
  { rank:2,  id:'u2',   name:'Rahul Nair',     initials:'RN', city:'Mumbai',     ecoPoints:8105, plantations:41, cleanups:55, reports:76, streak:33, level:5, weeklyChange:210,  avatarColor:'linear-gradient(135deg,#93c5fd,#6ee7b7)' },
  { rank:3,  id:'u3',   name:'Sneha Iyer',     initials:'SI', city:'Nashik',     ecoPoints:7890, plantations:37, cleanups:49, reports:68, streak:28, level:5, weeklyChange:185,  avatarColor:'linear-gradient(135deg,#fde68a,#6ee7b7)' },
  { rank:4,  id:'u4',   name:'Vikram Mehta',   initials:'VM', city:'Nagpur',     ecoPoints:6740, plantations:29, cleanups:43, reports:55, streak:19, level:4, weeklyChange:95,   avatarColor:'linear-gradient(135deg,#fca5a5,#fdba74)' },
  { rank:5,  id:'u5',   name:'Anita Kulkarni', initials:'AK', city:'Aurangabad', ecoPoints:5915, plantations:25, cleanups:38, reports:49, streak:15, level:4, weeklyChange:130,  avatarColor:'linear-gradient(135deg,#c4b5fd,#93c5fd)' },
  { rank:6,  id:'u6',   name:'Deepak Joshi',   initials:'DJ', city:'Solapur',    ecoPoints:5220, plantations:21, cleanups:32, reports:41, streak:11, level:4, weeklyChange:-40,  avatarColor:'linear-gradient(135deg,#bbf7d0,#a7f3d0)' },
  { rank:7,  id:'u_me', name:'Arjun Desai',    initials:'AD', city:'Nashik',     ecoPoints:3840, plantations:11, cleanups:23, reports:47, streak:14, level:4, weeklyChange:220,  avatarColor:'linear-gradient(135deg,#1a6b3c,#22924f)', isCurrentUser:true },
  { rank:8,  id:'u7',   name:'Meena Patil',    initials:'MP', city:'Nashik',     ecoPoints:3190, plantations:9,  cleanups:18, reports:30, streak:7,  level:3, weeklyChange:60,   avatarColor:'linear-gradient(135deg,#fbcfe8,#fde68a)' },
  { rank:9,  id:'u8',   name:'Rohan Gaikwad',  initials:'RG', city:'Kolhapur',   ecoPoints:2870, plantations:7,  cleanups:14, reports:22, streak:5,  level:3, weeklyChange:45,   avatarColor:'linear-gradient(135deg,#a5f3fc,#6ee7b7)' },
  { rank:10, id:'u9',   name:'Fatima Sheikh',  initials:'FS', city:'Nanded',     ecoPoints:2440, plantations:6,  cleanups:11, reports:17, streak:3,  level:3, weeklyChange:80,   avatarColor:'linear-gradient(135deg,#e9d5ff,#f9a8d4)' },
]
