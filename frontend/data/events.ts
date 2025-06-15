export interface Event {
  id: string;
  name: string;
  type: 'festival' | 'gacha' | 'ranking' | 'mission' | 'collab';
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  isActive: boolean;
  rewards: Array<{
    id: string;
    name: string;
    type: string;
    description: string;
    icon: string;
  }>;
  requirements: Array<{
    type: string;
    description: string;
    target?: number;
  }>;
}

export const eventsData: Event[] = [
  {
    id: 'EVT001',
    name: 'Summer Beach',
    type: 'festival',
    description: 'Join the ultimate summer beach festival with exclusive swimsuits, special matches, and amazing rewards! Enjoy beach volleyball tournaments, water sports competitions, and festive activities.',
    startDate: '2024-07-01T09:00:00Z',
    endDate: '2024-07-31T23:59:59Z',
    image: '🏖️',
    isActive: true,
    rewards: [
      { id: 'R001', name: 'Summer Princess Swimsuit', type: 'swimsuit', description: 'Exclusive SSR swimsuit', icon: '👙' },
      { id: 'R002', name: 'Beach Volleyball', type: 'accessory', description: 'Special event accessory', icon: '🏐' },
      { id: 'R003', name: 'Festival Coins', type: 'currency', description: '1000 festival coins', icon: '🪙' }
    ],
    requirements: [
      { type: 'participation', description: 'Complete 10 festival matches' },
      { type: 'ranking', description: 'Reach top 1000 in festival ranking' }
    ]
  },
  {
    id: 'EVT002',
    name: 'Premium Gacha Campaign',
    type: 'gacha',
    description: 'Limited time premium gacha featuring exclusive SSR swimsuits and accessories with increased drop rates!',
    startDate: '2024-06-15T00:00:00Z',
    endDate: '2024-06-30T23:59:59Z',
    image: '⭐',
    isActive: false,
    rewards: [
      { id: 'R004', name: 'Starlight Swimsuit', type: 'swimsuit', description: 'Ultra rare SSR swimsuit', icon: '✨' },
      { id: 'R005', name: 'Crystal Tiara', type: 'accessory', description: 'Premium head accessory', icon: '👑' }
    ],
    requirements: [
      { type: 'gacha', description: 'Perform 50 premium gacha pulls', target: 50 }
    ]
  },
  {
    id: 'EVT003',
    name: 'Autumn Tournament Ranking',
    type: 'ranking',
    description: 'Compete in the autumn tournament and climb the rankings to win exclusive rewards and titles!',
    startDate: '2024-09-01T09:00:00Z',
    endDate: '2024-09-30T23:59:59Z',
    image: '🏆',
    isActive: false,
    rewards: [
      { id: 'R006', name: 'Champion Trophy', type: 'trophy', description: 'First place trophy', icon: '🥇' },
      { id: 'R007', name: 'Autumn Leaf Crown', type: 'accessory', description: 'Seasonal head accessory', icon: '🍂' }
    ],
    requirements: [
      { type: 'ranking', description: 'Achieve rank 100 or higher', target: 100 },
      { type: 'matches', description: 'Win 20 ranking matches', target: 20 }
    ]
  },
  {
    id: 'EVT004',
    name: 'Daily Mission Challenge',
    type: 'mission',
    description: 'Complete daily missions to earn points and unlock progressive rewards throughout the event period.',
    startDate: '2024-08-01T00:00:00Z',
    endDate: '2024-08-14T23:59:59Z',
    image: '🎯',
    isActive: false,
    rewards: [
      { id: 'R008', name: 'Mission Master Badge', type: 'badge', description: 'Completion badge', icon: '🏅' },
      { id: 'R009', name: 'Energy Boost Pack', type: 'item', description: 'Special energy items', icon: '⚡' }
    ],
    requirements: [
      { type: 'daily', description: 'Complete all daily missions for 10 days', target: 10 },
      { type: 'points', description: 'Accumulate 5000 mission points', target: 5000 }
    ]
  },
  {
    id: 'EVT005',
    name: 'Collaboration: Ocean Dreams',
    type: 'collab',
    description: 'Special collaboration event featuring exclusive characters and swimsuits from the Ocean Dreams series.',
    startDate: '2024-10-15T09:00:00Z',
    endDate: '2024-11-15T23:59:59Z',
    image: '🌊',
    isActive: false,
    rewards: [
      { id: 'R010', name: 'Ocean Dreams Collection', type: 'collection', description: 'Complete collaboration set', icon: '🐚' },
      { id: 'R011', name: 'Mermaid Tail Accessory', type: 'accessory', description: 'Unique collaboration item', icon: '🧜‍♀️' }
    ],
    requirements: [
      { type: 'story', description: 'Complete collaboration story mode' },
      { type: 'collection', description: 'Collect all collaboration items' }
    ]
  },
  {
    id: 'EVT006',
    name: 'Winter Wonderland',
    type: 'festival',
    description: 'Experience the magic of winter with snow-themed activities, holiday matches, and festive rewards.',
    startDate: '2024-12-20T09:00:00Z',
    endDate: '2025-01-10T23:59:59Z',
    image: '❄️',
    isActive: false,
    rewards: [
      { id: 'R012', name: 'Snow Queen Outfit', type: 'swimsuit', description: 'Winter themed SSR swimsuit', icon: '👸' },
      { id: 'R013', name: 'Crystal Snowflake', type: 'accessory', description: 'Magical winter accessory', icon: '❄️' }
    ],
    requirements: [
      { type: 'festival', description: 'Participate in winter activities for 15 days', target: 15 },
      { type: 'special', description: 'Complete holiday special missions' }
    ]
  },
  {
    id: 'EVT007',
    name: 'Spring Bloom Tournament',
    type: 'ranking',
    description: 'Celebrate spring with a blooming tournament featuring cherry blossom themes and nature-inspired rewards.',
    startDate: '2025-03-15T09:00:00Z',
    endDate: '2025-04-15T23:59:59Z',
    image: '🌸',
    isActive: false,
    rewards: [
      { id: 'R014', name: 'Sakura Princess', type: 'swimsuit', description: 'Cherry blossom themed UR swimsuit', icon: '🌸' },
      { id: 'R015', name: 'Petal Crown', type: 'accessory', description: 'Delicate flower crown', icon: '👑' }
    ],
    requirements: [
      { type: 'tournament', description: 'Win 25 tournament matches', target: 25 },
      { type: 'ranking', description: 'Achieve top 500 ranking', target: 500 }
    ]
  },
  {
    id: 'EVT008',
    name: 'Mystic Moon Gacha',
    type: 'gacha',
    description: 'Under the mystic moonlight, discover rare and magical swimsuits with enhanced drop rates.',
    startDate: '2025-05-01T00:00:00Z',
    endDate: '2025-05-31T23:59:59Z',
    image: '🌙',
    isActive: false,
    rewards: [
      { id: 'R016', name: 'Moonbeam Goddess', type: 'swimsuit', description: 'Legendary moonlight swimsuit', icon: '🌙' },
      { id: 'R017', name: 'Lunar Crystal', type: 'accessory', description: 'Moon-powered crystal accessory', icon: '💎' }
    ],
    requirements: [
      { type: 'gacha', description: 'Perform 100 mystic gacha pulls', target: 100 },
      { type: 'collection', description: 'Collect 5 different moon-themed items', target: 5 }
    ]
  },
  {
    id: 'EVT009',
    name: 'Ocean Depths Exploration',
    type: 'mission',
    description: 'Dive deep into the ocean depths to discover hidden treasures and ancient swimsuit collections.',
    startDate: '2025-06-10T09:00:00Z',
    endDate: '2025-07-10T23:59:59Z',
    image: '🌊',
    isActive: false,
    rewards: [
      { id: 'R018', name: 'Deep Sea Explorer', type: 'swimsuit', description: 'Ocean depths themed SSR swimsuit', icon: '🌊' },
      { id: 'R019', name: 'Trident Accessory', type: 'accessory', description: 'Mythical trident ornament', icon: '🔱' }
    ],
    requirements: [
      { type: 'exploration', description: 'Complete 20 deep sea explorations', target: 20 },
      { type: 'treasure', description: 'Find 10 hidden treasure chests', target: 10 }
    ]
  },
  {
    id: 'EVT010',
    name: 'Fire Festival Spectacular',
    type: 'festival',
    description: 'An explosive festival of fire and passion with blazing competitions and fiery rewards.',
    startDate: '2025-08-05T09:00:00Z',
    endDate: '2025-08-25T23:59:59Z',
    image: '🔥',
    isActive: false,
    rewards: [
      { id: 'R020', name: 'Flame Empress', type: 'swimsuit', description: 'Fire-themed UR swimsuit', icon: '🔥' },
      { id: 'R021', name: 'Phoenix Feather', type: 'accessory', description: 'Mystical phoenix feather', icon: '🪶' }
    ],
    requirements: [
      { type: 'festival', description: 'Participate in fire challenges for 12 days', target: 12 },
      { type: 'score', description: 'Achieve 50,000 festival points', target: 50000 }
    ]
  },
  {
    id: 'EVT011',
    name: 'Golden Anniversary',
    type: 'festival',
    description: 'Celebrate the golden anniversary with exclusive rewards and special commemorative items.',
    startDate: '2025-09-20T09:00:00Z',
    endDate: '2025-10-20T23:59:59Z',
    image: '🏆',
    isActive: false,
    rewards: [
      { id: 'R022', name: 'Anniversary Queen', type: 'swimsuit', description: 'Special anniversary UR swimsuit', icon: '👑' },
      { id: 'R023', name: 'Golden Memories', type: 'trophy', description: 'Commemorative golden trophy', icon: '🏆' }
    ],
    requirements: [
      { type: 'anniversary', description: 'Log in for 30 consecutive days', target: 30 },
      { type: 'celebration', description: 'Complete all anniversary missions' }
    ]
  },
  {
    id: 'EVT012',
    name: 'Starlight Championship',
    type: 'ranking',
    description: 'The ultimate championship under the starlit sky with the most prestigious rewards.',
    startDate: '2025-11-01T09:00:00Z',
    endDate: '2025-11-30T23:59:59Z',
    image: '⭐',
    isActive: false,
    rewards: [
      { id: 'R024', name: 'Cosmic Champion', type: 'swimsuit', description: 'Ultimate championship UR swimsuit', icon: '⭐' },
      { id: 'R025', name: 'Star Crown', type: 'accessory', description: 'Championship star crown', icon: '👑' }
    ],
    requirements: [
      { type: 'championship', description: 'Win championship finals', target: 1 },
      { type: 'ranking', description: 'Maintain top 10 ranking for 7 days', target: 7 }
    ]
  },
  {
    id: 'EVT013',
    name: 'Crystal Cave Adventure',
    type: 'mission',
    description: 'Venture into mysterious crystal caves filled with sparkling treasures and magical encounters.',
    startDate: '2026-01-15T09:00:00Z',
    endDate: '2026-02-15T23:59:59Z',
    image: '💎',
    isActive: false,
    rewards: [
      { id: 'R026', name: 'Crystal Mage', type: 'swimsuit', description: 'Crystal-powered SSR swimsuit', icon: '💎' },
      { id: 'R027', name: 'Gem Scepter', type: 'accessory', description: 'Magical crystal scepter', icon: '🔮' }
    ],
    requirements: [
      { type: 'adventure', description: 'Complete crystal cave expeditions', target: 15 },
      { type: 'crystals', description: 'Collect 100 magical crystals', target: 100 }
    ]
  },
  {
    id: 'EVT014',
    name: 'Rainbow Bridge Festival',
    type: 'festival',
    description: 'Cross the rainbow bridge to discover a festival of colors with vibrant rewards and joyful activities.',
    startDate: '2026-03-01T09:00:00Z',
    endDate: '2026-03-31T23:59:59Z',
    image: '🌈',
    isActive: false,
    rewards: [
      { id: 'R028', name: 'Rainbow Goddess', type: 'swimsuit', description: 'Multi-colored UR swimsuit', icon: '🌈' },
      { id: 'R029', name: 'Prismatic Orb', type: 'accessory', description: 'Color-changing crystal orb', icon: '🔮' }
    ],
    requirements: [
      { type: 'festival', description: 'Complete all rainbow challenges', target: 7 },
      { type: 'colors', description: 'Collect items of all 7 rainbow colors', target: 7 }
    ]
  },
  {
    id: 'EVT015',
    name: 'Eternal Dreams Collection',
    type: 'mission',
    description: 'Gather pieces of eternal dreams to unlock the most coveted swimsuit collection ever created.',
    startDate: '2026-05-10T09:00:00Z',
    endDate: '2026-06-10T23:59:59Z',
    image: '✨',
    isActive: false,
    rewards: [
      { id: 'R030', name: 'Dream Eternal', type: 'swimsuit', description: 'Ultimate dream-themed UR swimsuit', icon: '✨' },
      { id: 'R031', name: 'Infinity Charm', type: 'accessory', description: 'Charm representing eternal beauty', icon: '♾️' }
    ],
    requirements: [
      { type: 'collection', description: 'Collect all dream fragments', target: 50 },
      { type: 'dreams', description: 'Complete the eternal dream quest' }
    ]
  },
  {
    id: 'EVT016',
    name: 'Celestial Guardian Tournament',
    type: 'ranking',
    description: 'Prove yourself worthy to become a celestial guardian in this ultimate tournament of champions.',
    startDate: '2026-07-20T09:00:00Z',
    endDate: '2026-08-20T23:59:59Z',
    image: '👼',
    isActive: false,
    rewards: [
      { id: 'R032', name: 'Celestial Guardian', type: 'swimsuit', description: 'Divine guardian UR swimsuit', icon: '👼' },
      { id: 'R033', name: 'Halo of Light', type: 'accessory', description: 'Sacred celestial halo', icon: '😇' }
    ],
    requirements: [
      { type: 'tournament', description: 'Defeat 50 celestial challengers', target: 50 },
      { type: 'guardian', description: 'Pass the celestial trials' }
    ]
  },
  {
    id: 'EVT017',
    name: 'True Colors Outfit Gacha',
    type: 'gacha',
    description: 'Discover the true colors of Luna with her exclusive Precious Shine swimsuit! Limited time gacha featuring enhanced SSR rates and Luna Palette x10 included!',
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2024-07-31T23:59:59Z',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=400',
    isActive: true,
    rewards: [
      { id: 'R034', name: 'Precious Shine (Luna)', type: 'swimsuit', description: 'SSR Swimsuit with Bronkless', icon: '👙' },
      { id: 'R035', name: 'Luna Palette', type: 'item', description: 'Special gacha currency x10', icon: '🎨' },
      { id: 'R036', name: 'F Fever Skill', type: 'skill', description: 'Enhanced fever ability', icon: '⚡' }
    ],
    requirements: [
      { type: 'gacha', description: 'Enhanced SSR rates available', target: 1 },
      { type: 'guarantee', description: '10x pull guarantee system' }
    ]
  },
  {
    id: 'EVT018',
    name: 'Summer Paradise Premium Gacha',
    type: 'gacha',
    description: 'Experience the ultimate summer paradise with exclusive tropical swimsuits and beach accessories!',
    startDate: '2024-08-01T00:00:00Z',
    endDate: '2024-08-31T23:59:59Z',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=400',
    isActive: true,
    rewards: [
      { id: 'R037', name: 'Paradise Queen', type: 'swimsuit', description: 'UR Tropical swimsuit', icon: '👙' },
      { id: 'R038', name: 'Sunset Crown', type: 'accessory', description: 'Legendary beach accessory', icon: '👑' },
      { id: 'R039', name: 'Beach Volleyball Pro', type: 'skill', description: 'Enhanced beach skills', icon: '🏐' }
    ],
    requirements: [
      { type: 'gacha', description: 'Premium rates for UR items', target: 1 },
      { type: 'collection', description: 'Collect summer-themed items' }
    ]
  }
]; 