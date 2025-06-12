export interface Swimsuit {
  id: string;
  name: string;
  character: string;
  rarity: 'N' | 'R' | 'SR' | 'SSR';
  stats: { pow: number; tec: number; stm: number; apl: number };
  skills: Array<{
    id: string;
    name: string;
    type: string;
    description: string;
  }>;
  release: string;
  reappear?: string; // Optional reappear date for limited swimsuits
}

export const swimsuitsData: Swimsuit[] = [
  {
    id: 'summer-casual',
    name: 'Summer Casual',
    character: 'Various',
    rarity: 'SSR' as const,
    stats: { pow: 850, tec: 750, stm: 700, apl: 650 },
    skills: [{
      id: 'summer-skill',
      name: 'Summer Vibes',
      type: 'balanced',
      description: 'Increases all stats by 5%'
    }],
    release: '2023-06-15',
    reappear: '2024-06-15'
  },
  {
    id: 'beach-queen',
    name: 'Beach Queen',
    character: 'Various',
    rarity: 'SR' as const,
    stats: { pow: 950, tec: 850, stm: 800, apl: 750 },
    skills: [{
      id: 'queen-skill',
      name: 'Royal Presence',
      type: 'special',
      description: 'Increases APL by 20%'
    }],
    release: '2023-07-20'
  },
  {
    id: 'tropical-paradise',
    name: 'Tropical Paradise',
    character: 'Various',
    rarity: 'SSR' as const,
    stats: { pow: 800, tec: 780, stm: 720, apl: 680 },
    skills: [{
      id: 'tropical-skill',
      name: 'Paradise Boost',
      type: 'balanced',
      description: 'Increases TEC and APL by 7%'
    }],
    release: '2023-08-10'
  },
  {
    id: 'sunset-bliss',
    name: 'Sunset Bliss',
    character: 'Various',
    rarity: 'R' as const,
    stats: { pow: 650, tec: 600, stm: 580, apl: 720 },
    skills: [{
      id: 'sunset-skill',
      name: 'Golden Hour',
      type: 'appeal',
      description: 'Increases APL by 12% during evening activities'
    }],
    release: '2023-09-01'
  },
  {
    id: 'ocean-depths',
    name: 'Ocean Depths',
    character: 'Various',
    rarity: 'SR' as const,
    stats: { pow: 700, tec: 800, stm: 750, apl: 650 },
    skills: [{
      id: 'depths-skill',
      name: 'Deep Sea Mastery',
      type: 'technical',
      description: 'Increases TEC by 15% in water activities'
    }],
    release: '2023-09-02'
  },
  {
    id: 'crystal-elegance',
    name: 'Crystal Elegance',
    character: 'Various',
    rarity: 'SSR' as const,
    stats: { pow: 720, tec: 780, stm: 760, apl: 850 },
    skills: [{
      id: 'elegance-skill',
      name: 'Radiant Beauty',
      type: 'special',
      description: 'Increases APL by 18% and adds sparkle effect'
    }],
    release: '2023-09-03',
    reappear: '2024-03-03'
  },
  {
    id: 'midnight-mystery',
    name: 'Midnight Mystery',
    character: 'Various',
    rarity: 'SR' as const,
    stats: { pow: 880, tec: 920, stm: 800, apl: 950 },
    skills: [{
      id: 'mystery-skill',
      name: 'Moonlight Enchantment',
      type: 'special',
      description: 'Increases all stats by 8% during night events'
    }],
    release: '2023-09-04'
  },
  {
    id: 'flame-dancer',
    name: 'Flame Dancer',
    character: 'Various',
    rarity: 'SSR' as const,
    stats: { pow: 900, tec: 750, stm: 780, apl: 820 },
    skills: [{
      id: 'flame-skill',
      name: 'Fire Dance',
      type: 'offensive',
      description: 'Increases POW by 20% with burning passion'
    }],
    release: '2023-09-05'
  },
  {
    id: 'winter-frost',
    name: 'Winter Frost',
    character: 'Various',
    rarity: 'SR' as const,
    stats: { pow: 650, tec: 850, stm: 900, apl: 700 },
    skills: [{
      id: 'frost-skill',
      name: 'Ice Shield',
      type: 'defensive',
      description: 'Increases STM by 16% with ice protection'
    }],
    release: '2023-09-06'
  },
  {
    id: 'spring-blossom',
    name: 'Spring Blossom',
    character: 'Various',
    rarity: 'R' as const,
    stats: { pow: 680, tec: 720, stm: 700, apl: 780 },
    skills: [{
      id: 'blossom-skill',
      name: 'Renewal Energy',
      type: 'balanced',
      description: 'Gradually restores stamina during activities'
    }],
    release: '2023-09-07'
  },
  {
    id: 'stellar-guardian',
    name: 'Stellar Guardian',
    character: 'Various',
    rarity: 'SR' as const,
    stats: { pow: 850, tec: 880, stm: 920, apl: 900 },
    skills: [{
      id: 'stellar-skill',
      name: 'Cosmic Protection',
      type: 'defensive',
      description: 'Increases all defensive capabilities by 12%'
    }],
    release: '2023-09-08'
  },
  {
    id: 'rainbow-cascade',
    name: 'Rainbow Cascade',
    character: 'Various',
    rarity: 'SSR' as const,
    stats: { pow: 780, tec: 800, stm: 750, apl: 900 },
    skills: [{
      id: 'rainbow-skill',
      name: 'Spectrum Harmony',
      type: 'balanced',
      description: 'Creates rainbow effects and boosts all stats by 6%'
    }],
    release: '2023-09-09'
  },
  {
    id: 'divine-goddess',
    name: 'Divine Goddess',
    character: 'Various',
    rarity: 'SR' as const,
    stats: { pow: 950, tec: 980, stm: 950, apl: 1000 },
    skills: [{
      id: 'divine-skill',
      name: 'Divine Blessing',
      type: 'special',
      description: 'Grants divine protection and increases all stats by 15%'
    }],
    release: '2023-09-10',
    reappear: '2024-12-10'
  }
]; 