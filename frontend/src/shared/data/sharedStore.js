/**
 * sharedStore.js
 * ─────────────────────────────────────────────────────────────
 * Simulates a shared backend state accessible by both Admin
 * and Citizen portals. In production this would be a real API.
 *
 * Uses a simple pub-sub so components can subscribe to changes.
 */

// ── Citizen posts pending admin review ───────────────────────
export const CITIZEN_POSTS = [
  {
    id: 'POST-0011',
    userId:   'USR-4821',
    userName: 'Ramesh Kulkarni',
    avatar:   'RK',
    city:     'Nashik',
    ward:     'Ward 1',
    type:     'garbage_cleared',
    title:    'Cleared 3-day-old dump near Nashik Road ATM',
    desc:     'Organized a 12-person volunteer cleanup. Removed ~200 kg of mixed waste. Sorted recyclables separately.',
    image:    null,
    beforeBg: 'linear-gradient(135deg,#3d1a1a,#7c2d12)',
    afterBg:  'linear-gradient(135deg,#14532d,#166534)',
    weight:   0.20,  // tons
    trees:    0,
    points:   240,
    tags:     ['Volunteer', 'Nashik Road', 'Mixed Waste'],
    submittedAt: new Date(Date.now() - 2 * 3600000),
    status:   'pending',   // pending | approved | rejected
    voucher:  null,
  },
  {
    id: 'POST-0012',
    userId:   'USR-9034',
    userName: 'Priya Sharma',
    avatar:   'PS',
    city:     'Nashik',
    ward:     'Ward 2',
    type:     'tree_planted',
    title:    'Planted 15 saplings along Panchavati Ghat',
    desc:     'Coordinated with forest dept. Planted Neem, Peepal & Arjun saplings with watering schedules assigned.',
    image:    null,
    beforeBg: 'linear-gradient(135deg,#1e1b4b,#312e81)',
    afterBg:  'linear-gradient(135deg,#14532d,#065f46)',
    weight:   0,
    trees:    15,
    points:   375,
    tags:     ['Trees', 'Panchavati', 'Neem', 'Peepal'],
    submittedAt: new Date(Date.now() - 5 * 3600000),
    status:   'pending',
    voucher:  null,
  },
  {
    id: 'POST-0013',
    userId:   'USR-3317',
    userName: 'Anita Bhosale',
    avatar:   'AB',
    city:     'Pune',
    ward:     'Ward 5',
    type:     'garbage_cleared',
    title:    'Market waste segregation drive – FC Road',
    desc:     'Led 8-volunteer drive. Total 0.45 tons removed. Wet/dry separation done on-site. Municipal truck arranged.',
    image:    null,
    beforeBg: 'linear-gradient(135deg,#422006,#92400e)',
    afterBg:  'linear-gradient(135deg,#0c4a6e,#0369a1)',
    weight:   0.45,
    trees:    0,
    points:   310,
    tags:     ['Segregation', 'FC Road', 'Market'],
    submittedAt: new Date(Date.now() - 7 * 3600000),
    status:   'pending',
    voucher:  null,
  },
  {
    id: 'POST-0014',
    userId:   'USR-7756',
    userName: 'Suresh Patil',
    avatar:   'SP',
    city:     'Nashik',
    ward:     'Ward 3',
    type:     'tree_planted',
    title:    '30 Gulmohar planted on Cidco divider',
    desc:     'Collaborated with CIDCO. 30 Gulmohar saplings + 10 Bamboo clumps on road divider. All geo-tagged.',
    image:    null,
    beforeBg: 'linear-gradient(135deg,#1e3a5f,#1e40af)',
    afterBg:  'linear-gradient(135deg,#14532d,#15803d)',
    weight:   0,
    trees:    40,
    points:   580,
    tags:     ['CIDCO', 'Gulmohar', 'Divider'],
    submittedAt: new Date(Date.now() - 9 * 3600000),
    status:   'pending',
    voucher:  null,
  },
  {
    id: 'POST-0015',
    userId:   'USR-2289',
    userName: 'Fatima Khan',
    avatar:   'FK',
    city:     'Mumbai',
    ward:     'Ward 8',
    type:     'garbage_cleared',
    title:    'Coastal cleanup at Versova Beach',
    desc:     'NGO-led effort. 22 volunteers, 1.2 tons of plastic & mixed waste cleared. Partnered with BMC.',
    image:    null,
    beforeBg: 'linear-gradient(135deg,#450a0a,#991b1b)',
    afterBg:  'linear-gradient(135deg,#0c4a6e,#155e75)',
    weight:   1.20,
    trees:    0,
    points:   820,
    tags:     ['Coastal', 'Versova', 'NGO', 'Plastic'],
    submittedAt: new Date(Date.now() - 11 * 3600000),
    status:   'approved',
    voucher:  { code: 'GVT-2289-A', value: 500, sponsor: 'Maharashtra State Green Fund', issuedAt: new Date(Date.now() - 10 * 3600000) },
  },
  {
    id: 'POST-0016',
    userId:   'USR-6645',
    userName: 'Vijay Deshmukh',
    avatar:   'VD',
    city:     'Nashik',
    ward:     'Ward 6',
    type:     'tree_planted',
    title:    'School plantation drive – 50 saplings',
    desc:     '50 mango and banyan saplings planted by students at Igatpuri Vidyalaya. Documented with photos.',
    image:    null,
    beforeBg: 'linear-gradient(135deg,#1e1b4b,#4c1d95)',
    afterBg:  'linear-gradient(135deg,#14532d,#166534)',
    weight:   0,
    trees:    50,
    points:   720,
    tags:     ['School', 'Igatpuri', 'Students'],
    submittedAt: new Date(Date.now() - 14 * 3600000),
    status:   'approved',
    voucher:  { code: 'GVT-6645-B', value: 750, sponsor: 'Nashik Municipal Green Mission', issuedAt: new Date(Date.now() - 13 * 3600000) },
  },
  {
    id: 'POST-0017',
    userId:   'USR-1102',
    userName: 'Meena Joshi',
    avatar:   'MJ',
    city:     'Pune',
    ward:     'Ward 2',
    type:     'garbage_cleared',
    title:    'Night dump removal near Katraj Zoo',
    desc:     'Illegal dump site cleared over 2 nights. 0.8 tons of construction + bio waste. FIR filed against violators.',
    image:    null,
    beforeBg: 'linear-gradient(135deg,#1a1a2e,#16213e)',
    afterBg:  'linear-gradient(135deg,#0f3324,#166534)',
    weight:   0.80,
    trees:    0,
    points:   640,
    tags:     ['Illegal Dump', 'Katraj', 'Night Op'],
    submittedAt: new Date(Date.now() - 18 * 3600000),
    status:   'rejected',
    voucher:  null,
    rejectReason: 'Insufficient photographic evidence. Please resubmit with before/after photos.',
  },
]

// ── City transparency data (admin-maintained) ───────────────
export const CITY_DATA = {
  Nashik: {
    garbageCleared:   87.4,   // tons
    treesPlanted:     21340,
    activeCleaned:    312,    // drives
    volunteersTotal:  4820,
    aqi:              68,
    aqiLabel:         'Moderate',
    riverHealth:      74,
    wasteRecycled:    41.2,   // %
    lastUpdated:      'Today, 09:15 AM',
    monthlyGarbage:   [6.2, 7.1, 8.4, 9.0, 7.8, 8.9, 9.3, 10.1, 8.7, 6.5, 7.8, 7.6],
    monthlyTrees:     [1200,1450,1800,2100,1950,2200,2400,2800,2100,1600,1900,1790],
    wards: [
      { name: 'Ward 1 – Nashik Road',    garbage: 18.2, trees: 4200, drives: 68 },
      { name: 'Ward 2 – Panchavati',     garbage: 14.1, trees: 5800, drives: 52 },
      { name: 'Ward 3 – Cidco',          garbage: 16.9, trees: 3900, drives: 61 },
      { name: 'Ward 4 – Satpur',         garbage: 12.3, trees: 3100, drives: 44 },
      { name: 'Ward 5 – Deolali Camp',   garbage:  9.8, trees: 2200, drives: 38 },
      { name: 'Ward 6 – Igatpuri',       garbage: 16.1, trees: 2140, drives: 49 },
    ],
  },
  Pune: {
    garbageCleared:   124.6,
    treesPlanted:     38900,
    activeCleaned:    489,
    volunteersTotal:  9140,
    aqi:              82,
    aqiLabel:         'Moderate',
    riverHealth:      61,
    wasteRecycled:    38.7,
    lastUpdated:      'Today, 08:40 AM',
    monthlyGarbage:   [9.1,10.2,11.8,12.4,10.9,12.1,13.0,14.2,12.1,9.8,10.9,8.1],
    monthlyTrees:     [2800,3200,3900,4200,3800,4400,4900,5200,4100,3200,3700,3400],
    wards: [
      { name: 'Ward 1 – Shivajinagar',   garbage: 22.4, trees: 7800, drives: 92 },
      { name: 'Ward 2 – Katraj',         garbage: 18.9, trees: 6200, drives: 78 },
      { name: 'Ward 3 – Kothrud',        garbage: 21.1, trees: 8100, drives: 88 },
      { name: 'Ward 4 – Hadapsar',       garbage: 19.7, trees: 5900, drives: 71 },
      { name: 'Ward 5 – FC Road',        garbage: 24.2, trees: 7400, drives: 96 },
      { name: 'Ward 6 – Kondhwa',        garbage: 18.3, trees: 3500, drives: 64 },
    ],
  },
  Mumbai: {
    garbageCleared:   312.8,
    treesPlanted:     89200,
    activeCleaned:    1240,
    volunteersTotal:  28400,
    aqi:              118,
    aqiLabel:         'Unhealthy for Sensitive Groups',
    riverHealth:      42,
    wasteRecycled:    29.3,
    lastUpdated:      'Today, 07:55 AM',
    monthlyGarbage:   [24,26,29,31,27,30,33,36,30,25,28,25],
    monthlyTrees:     [6200,7100,8400,9200,8100,9800,10200,11400,9100,7300,8100,5300],
    wards: [
      { name: 'Ward A – Versova',        garbage: 52.1, trees: 14200, drives: 214 },
      { name: 'Ward B – Andheri',        garbage: 61.4, trees: 18900, drives: 248 },
      { name: 'Ward C – Dharavi',        garbage: 48.9, trees:  9800, drives: 196 },
      { name: 'Ward D – Bandra',         garbage: 44.2, trees: 16400, drives: 188 },
      { name: 'Ward E – Dadar',          garbage: 58.6, trees: 17100, drives: 221 },
      { name: 'Ward F – Kurla',          garbage: 47.6, trees: 12800, drives: 173 },
    ],
  },
}

// ── Voucher tiers ────────────────────────────────────────────
export const VOUCHER_TIERS = [
  { type: 'garbage_cleared', minWeight: 0.05, baseValue: 250,  multiplier: 200,  unit: 'per 0.1 ton', maxValue: 2000, sponsor: 'Swachh Bharat Mission' },
  { type: 'tree_planted',    minTrees:  5,    baseValue: 150,  multiplier: 25,   unit: 'per tree',    maxValue: 3000, sponsor: 'National Afforestation Programme' },
]

// ── Simple pub-sub for cross-component reactivity ────────────
const listeners = new Set()

let _posts = [...CITIZEN_POSTS]

export function getPosts()  { return _posts }

export function updatePost(id, updates) {
  _posts = _posts.map(p => p.id === id ? { ...p, ...updates } : p)
  listeners.forEach(fn => fn(_posts))
}

export function subscribe(fn)   { listeners.add(fn);    return () => listeners.delete(fn) }

// ── Voucher generator ────────────────────────────────────────
export function generateVoucher(post) {
  const tier  = VOUCHER_TIERS.find(t => t.type === post.type)
  if (!tier) return null
  let value = tier.baseValue
  if (post.type === 'garbage_cleared') value = Math.min(tier.maxValue, Math.round((post.weight / 0.1) * tier.multiplier + tier.baseValue))
  if (post.type === 'tree_planted')    value = Math.min(tier.maxValue, Math.round(post.trees * tier.multiplier + tier.baseValue))
  const code = `GVT-${post.userId.replace('USR-','')}-${Math.random().toString(36).slice(2,5).toUpperCase()}`
  return { code, value, sponsor: tier.sponsor, issuedAt: new Date() }
}
