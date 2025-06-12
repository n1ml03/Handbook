export interface Accessory {
  id: string;
  name: string;
  type: 'head' | 'face' | 'hand' | 'body';
  skill: {
    id: string;
    name: string;
    type: string;
    description: string;
  };
  stats: { [key: string]: number };
}

export const accessoriesData: Accessory[] = [
  {
    id: 'power-headband',
    name: 'Power Headband',
    type: 'head' as const,
    skill: {
      id: 'headband-skill',
      name: 'Focus Power',
      type: 'offensive',
      description: 'Increases POW by 200'
    },
    stats: { pow: 200 }
  },
  {
    id: 'tech-glasses',
    name: 'Technical Glasses',
    type: 'face' as const,
    skill: {
      id: 'glasses-skill',
      name: 'Enhanced Vision',
      type: 'technical',
      description: 'Increases TEC by 180'
    },
    stats: { tec: 180 }
  },
  {
    id: 'stamina-gloves',
    name: 'Endurance Gloves',
    type: 'hand' as const,
    skill: {
      id: 'gloves-skill',
      name: 'Lasting Power',
      type: 'defensive',
      description: 'Increases STM by 150'
    },
    stats: { stm: 150 }
  },
  {
    id: 'crystal-crown',
    name: 'Crystal Crown',
    type: 'head' as const,
    skill: {
      id: 'crown-skill',
      name: 'Royal Authority',
      type: 'appeal',
      description: 'Increases APL by 220'
    },
    stats: { apl: 220 }
  },
  {
    id: 'precision-visor',
    name: 'Precision Visor',
    type: 'face' as const,
    skill: {
      id: 'visor-skill',
      name: 'Enhanced Analysis',
      type: 'technical',
      description: 'Increases TEC by 190'
    },
    stats: { tec: 190 }
  },
  {
    id: 'strength-bracers',
    name: 'Strength Bracers',
    type: 'hand' as const,
    skill: {
      id: 'bracers-skill',
      name: 'Mighty Grip',
      type: 'offensive',
      description: 'Increases POW by 210'
    },
    stats: { pow: 210 }
  },
  {
    id: 'vitality-charm',
    name: 'Vitality Charm',
    type: 'body' as const,
    skill: {
      id: 'charm-skill',
      name: 'Life Force',
      type: 'defensive',
      description: 'Increases STM by 170'
    },
    stats: { stm: 170 }
  },
  {
    id: 'dragon-mask',
    name: 'Dragon Mask',
    type: 'face' as const,
    skill: {
      id: 'dragon-skill',
      name: 'Dragon Spirit',
      type: 'offensive',
      description: 'Increases POW by 200'
    },
    stats: { pow: 200 }
  },
  {
    id: 'guardian-gauntlets',
    name: 'Guardian Gauntlets',
    type: 'hand' as const,
    skill: {
      id: 'guardian-skill',
      name: 'Protective Barrier',
      type: 'defensive',
      description: 'Increases STM by 160'
    },
    stats: { stm: 160 }
  },
  {
    id: 'phoenix-pendant',
    name: 'Phoenix Pendant',
    type: 'body' as const,
    skill: {
      id: 'phoenix-skill',
      name: 'Rebirth Energy',
      type: 'balanced',
      description: 'Increases all stats by 50'
    },
    stats: { pow: 50, tec: 50, stm: 50, apl: 50 }
  },
  {
    id: 'sage-spectacles',
    name: 'Sage Spectacles',
    type: 'face' as const,
    skill: {
      id: 'sage-skill',
      name: 'Wisdom Enhancement',
      type: 'technical',
      description: 'Increases TEC by 200'
    },
    stats: { tec: 200 }
  },
  {
    id: 'warrior-wraps',
    name: 'Warrior Wraps',
    type: 'hand' as const,
    skill: {
      id: 'warrior-skill',
      name: 'Battle Hardened',
      type: 'offensive',
      description: 'Increases POW by 180'
    },
    stats: { pow: 180 }
  },
  {
    id: 'eternal-locket',
    name: 'Eternal Locket',
    type: 'body' as const,
    skill: {
      id: 'eternal-skill',
      name: 'Timeless Beauty',
      type: 'appeal',
      description: 'Increases APL by 240'
    },
    stats: { apl: 240 }
  }
]; 