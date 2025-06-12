export interface DetailedSkill {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: string;
  effects: Array<{
    stat: string;
    value: number;
    type: 'percentage' | 'multiplier';
  }>;
}

export const skillsDetailedData: DetailedSkill[] = [
  {
    id: 'SKL001',
    name: 'Power Boost',
    type: 'POW',
    description: 'Increases POW stats by 15% for all team members during competitions. This skill is particularly effective in power-based challenges.',
    icon: '⚡',
    effects: [{ stat: 'pow', value: 15, type: 'percentage' }]
  },
  {
    id: 'SKL002', 
    name: 'Tech Enhancement',
    type: 'TEC',
    description: 'Boosts TEC performance during competitions. Enhances technical abilities and precision in all technical challenges.',
    icon: '🔧',
    effects: [{ stat: 'tec', value: 20, type: 'percentage' }]
  },
  {
    id: 'SKL003',
    name: 'Stamina Recovery',
    type: 'STM',
    description: 'Restores stamina faster between activities. Allows for longer training sessions and better endurance in competitions.',
    icon: '💪',
    effects: [{ stat: 'stm', value: 25, type: 'percentage' }]
  },
  {
    id: 'SKL004',
    name: 'Appeal Master',
    type: 'APL',
    description: 'Significantly increases appeal effectiveness. Makes performances more captivating and engaging for audiences.',
    icon: '✨',
    effects: [{ stat: 'apl', value: 18, type: 'percentage' }]
  },
  {
    id: 'SKL005',
    name: 'Team Support',
    type: 'Support',
    description: 'Provides buffs to all team members. Enhances team coordination and collective performance in group activities.',
    icon: '🤝',
    effects: [{ stat: 'all', value: 10, type: 'percentage' }]
  },
  {
    id: 'SKL006',
    name: 'Special Combo',
    type: 'Special',
    description: 'Unlocks unique combo attacks. Creates powerful synergistic effects when used with compatible skills.',
    icon: '🌟',
    effects: [{ stat: 'combo', value: 30, type: 'multiplier' }]
  },
  {
    id: 'SKL007',
    name: 'Dragon\'s Fury',
    type: 'POW',
    description: 'Channels the primal rage of ancient dragons. Increases power dramatically while providing fire resistance.',
    icon: '🐉',
    effects: [{ stat: 'pow', value: 25, type: 'percentage' }]
  },
  {
    id: 'SKL008',
    name: 'Celestial Wisdom',
    type: 'TEC',
    description: 'Taps into cosmic knowledge and divine insight. Greatly enhances technical precision and magical abilities.',
    icon: '✨',
    effects: [{ stat: 'tec', value: 22, type: 'percentage' }]
  },
  {
    id: 'SKL009',
    name: 'Phoenix Resilience',
    type: 'STM',
    description: 'Grants the legendary endurance of the phoenix. Provides exceptional stamina and regeneration abilities.',
    icon: '🔥',
    effects: [{ stat: 'stm', value: 28, type: 'percentage' }]
  },
  {
    id: 'SKL010',
    name: 'Siren\'s Enchantment',
    type: 'APL',
    description: 'Harnesses the mesmerizing power of sirens. Creates an irresistible aura that captivates all who witness it.',
    icon: '🧜‍♀️',
    effects: [{ stat: 'apl', value: 24, type: 'percentage' }]
  },
  {
    id: 'SKL011',
    name: 'Harmony of Elements',
    type: 'Support',
    description: 'Balances the four classical elements within. Provides steady improvement to all abilities while enhancing team synergy.',
    icon: '🌍',
    effects: [{ stat: 'all', value: 12, type: 'percentage' }]
  },
  {
    id: 'SKL012',
    name: 'Void Mastery',
    type: 'Special',
    description: 'Masters the power of the void itself. Allows manipulation of space and time for incredible strategic advantages.',
    icon: '🌌',
    effects: [{ stat: 'void', value: 40, type: 'multiplier' }]
  },
  {
    id: 'SKL013',
    name: 'Lightning Reflexes',
    type: 'TEC',
    description: 'Achieves lightning-fast reaction times. Dramatically improves response speed and technical execution.',
    icon: '⚡',
    effects: [{ stat: 'tec', value: 26, type: 'percentage' }]
  },
  {
    id: 'SKL014',
    name: 'Titan\'s Strength',
    type: 'POW',
    description: 'Unleashes the tremendous power of ancient titans. Provides overwhelming physical strength and destructive force.',
    icon: '⛰️',
    effects: [{ stat: 'pow', value: 30, type: 'percentage' }]
  },
  {
    id: 'SKL015',
    name: 'Angel\'s Grace',
    type: 'APL',
    description: 'Bestows divine grace and heavenly beauty. Creates an ethereal presence that transcends mortal limitations.',
    icon: '😇',
    effects: [{ stat: 'apl', value: 26, type: 'percentage' }]
  },
  {
    id: 'SKL016',
    name: 'Eternal Endurance',
    type: 'STM',
    description: 'Grants seemingly infinite stamina and willpower. Allows sustained peak performance far beyond normal limits.',
    icon: '♾️',
    effects: [{ stat: 'stm', value: 32, type: 'percentage' }]
  }
]; 