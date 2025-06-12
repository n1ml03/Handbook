export interface DetailedAccessory {
  id: string;
  name: string;
  type: string;
  rarity: string;
  stats: {
    pow: number;
    tec: number;
    stm: number;
    apl: number;
  };
  skill: string;
  icon: string;
}

export const accessoriesDetailedData: DetailedAccessory[] = [
  {
    id: 'ACC001',
    name: 'Ocean Pearl Necklace',
    type: 'Necklace',
    rarity: 'SSR',
    stats: { pow: 0, tec: 25, stm: 0, apl: 15 },
    skill: 'Increases TEC performance in water-based activities by 20%',
    icon: '📿'
  },
  {
    id: 'ACC002',
    name: 'Crystal Earrings',
    type: 'Earrings',
    rarity: 'SR',
    stats: { pow: 10, tec: 0, stm: 0, apl: 20 },
    skill: 'Boosts appeal when performing special moves',
    icon: '💎'
  },
  {
    id: 'ACC003',
    name: 'Power Bracelet',
    type: 'Bracelet',
    rarity: 'SR',
    stats: { pow: 30, tec: 0, stm: 10, apl: 0 },
    skill: 'Increases physical strength during competitions',
    icon: '⚡'
  },
  {
    id: 'ACC004',
    name: 'Stamina Ring',
    type: 'Ring',
    rarity: 'R',
    stats: { pow: 5, tec: 0, stm: 25, apl: 5 },
    skill: 'Reduces stamina consumption during training',
    icon: '💍'
  },
  {
    id: 'ACC005',
    name: 'Tropical Hair Pin',
    type: 'Hair',
    rarity: 'R',
    stats: { pow: 0, tec: 15, stm: 0, apl: 10 },
    skill: 'Enhances performance in tropical environments',
    icon: '🌺'
  },
  {
    id: 'ACC006',
    name: 'Lucky Charm',
    type: 'Other',
    rarity: 'N',
    stats: { pow: 5, tec: 5, stm: 5, apl: 5 },
    skill: 'Slightly improves all stats across the board',
    icon: '🍀'
  },
  {
    id: 'ACC007',
    name: 'Dragon Scale Bracelet',
    type: 'Bracelet',
    rarity: 'UR',
    stats: { pow: 40, tec: 20, stm: 30, apl: 10 },
    skill: 'Grants dragon-like strength and fire resistance',
    icon: '🐉'
  },
  {
    id: 'ACC008',
    name: 'Moonstone Tiara',
    type: 'Head',
    rarity: 'SSR',
    stats: { pow: 5, tec: 20, stm: 10, apl: 35 },
    skill: 'Enhances magical abilities under moonlight',
    icon: '👑'
  },
  {
    id: 'ACC009',
    name: 'Phoenix Wing Anklet',
    type: 'Anklet',
    rarity: 'UR',
    stats: { pow: 35, tec: 25, stm: 25, apl: 15 },
    skill: 'Provides rebirth energy and flame protection',
    icon: '🦅'
  },
  {
    id: 'ACC010',
    name: 'Starlight Choker',
    type: 'Necklace',
    rarity: 'SSR',
    stats: { pow: 10, tec: 30, stm: 15, apl: 25 },
    skill: 'Channels cosmic energy for enhanced performance',
    icon: '⭐'
  },
  {
    id: 'ACC011',
    name: 'Ice Crystal Gloves',
    type: 'Gloves',
    rarity: 'SR',
    stats: { pow: 20, tec: 25, stm: 20, apl: 5 },
    skill: 'Provides ice elemental power and precision',
    icon: '🧤'
  },
  {
    id: 'ACC012',
    name: 'Thunder God Ring',
    type: 'Ring',
    rarity: 'UR',
    stats: { pow: 45, tec: 15, stm: 20, apl: 20 },
    skill: 'Harnesses lightning power for devastating attacks',
    icon: '⚡'
  },
  {
    id: 'ACC013',
    name: 'Rose Petal Corsage',
    type: 'Corsage',
    rarity: 'SR',
    stats: { pow: 5, tec: 15, stm: 10, apl: 30 },
    skill: 'Spreads enchanting fragrance that boosts charm',
    icon: '🌹'
  },
  {
    id: 'ACC014',
    name: 'Golden Sun Medallion',
    type: 'Medallion',
    rarity: 'SSR',
    stats: { pow: 30, tec: 20, stm: 25, apl: 25 },
    skill: 'Radiates solar energy for balanced enhancement',
    icon: '☀️'
  },
  {
    id: 'ACC015',
    name: 'Mystic Rune Armband',
    type: 'Armband',
    rarity: 'UR',
    stats: { pow: 25, tec: 35, stm: 30, apl: 30 },
    skill: 'Ancient runes provide mysterious power amplification',
    icon: '🔮'
  },
  {
    id: 'ACC016',
    name: 'Celestial Halo',
    type: 'Halo',
    rarity: 'UR',
    stats: { pow: 20, tec: 30, stm: 35, apl: 40 },
    skill: 'Divine blessing that purifies and strengthens the soul',
    icon: '😇'
  }
]; 