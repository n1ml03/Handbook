export interface Bromide {
  id: string;
  name: string;
  type: string;
  rarity: string;
  description: string;
  character: string | null;
  effects: Array<{
    description: string;
    value: number;
    type: string;
  }>;
  source: string;
}

export const bromidesData: Bromide[] = [
  {
    id: 'BR001',
    name: 'Honoka Beach Day',
    type: 'Character',
    rarity: 'SSR',
    description: 'Honoka enjoying a sunny day at the beach',
    character: 'Honoka',
    effects: [
      { description: 'Appeal boost in beach volleyball', value: 15, type: 'percentage' }
    ],
    source: 'Summer Event 2023'
  },
  {
    id: 'BR002',
    name: 'Sunset Paradise',
    type: 'Scene',
    rarity: 'SR',
    description: 'Beautiful sunset view from the resort',
    character: null,
    effects: [
      { description: 'Mood boost for all characters', value: 10, type: 'percentage' }
    ],
    source: 'Photo Contest'
  },
  {
    id: 'BR003',
    name: 'Kasumi Training',
    type: 'Character',
    rarity: 'SR',
    description: 'Kasumi in intense training session',
    character: 'Kasumi',
    effects: [
      { description: 'Training efficiency increase', value: 20, type: 'percentage' }
    ],
    source: 'Training Event'
  },
  {
    id: 'DF001',
    name: 'Golden Frame',
    type: 'Frame',
    rarity: 'SSR',
    description: 'Luxurious golden decorative frame',
    character: null,
    effects: [
      { description: 'Prestige bonus', value: 25, type: 'percentage' }
    ],
    source: 'VIP Reward'
  },
  {
    id: 'DF002',
    name: 'Ocean Waves Background',
    type: 'Background',
    rarity: 'R',
    description: 'Animated ocean waves background',
    character: null,
    effects: [
      { description: 'Relaxation effect', value: 5, type: 'percentage' }
    ],
    source: 'Beach Collection'
  },
  {
    id: 'DS001',
    name: 'Heart Stickers',
    type: 'Sticker',
    rarity: 'N',
    description: 'Cute heart-shaped stickers',
    character: null,
    effects: [],
    source: 'Daily Login'
  },
  {
    id: 'DE001',
    name: 'Sparkle Effect',
    type: 'Effect',
    rarity: 'SR',
    description: 'Magical sparkle overlay effect',
    character: null,
    effects: [
      { description: 'Visual appeal enhancement', value: 15, type: 'percentage' }
    ],
    source: 'Effect Collection'
  },
  {
    id: 'BR004',
    name: 'Helena Elegance',
    type: 'Character',
    rarity: 'SSR',
    description: 'Helena showcasing her graceful movements',
    character: 'Helena',
    effects: [
      { description: 'Appeal performance boost', value: 18, type: 'percentage' }
    ],
    source: 'Elegance Contest'
  },
  {
    id: 'BR005',
    name: 'Tropical Storm',
    type: 'Scene',
    rarity: 'SR',
    description: 'Dramatic storm clouds over tropical waters',
    character: null,
    effects: [
      { description: 'Power boost in stormy weather', value: 12, type: 'percentage' }
    ],
    source: 'Weather Collection'
  },
  {
    id: 'BR006',
    name: 'Ayane Shadow',
    type: 'Character',
    rarity: 'SSR',
    description: 'Ayane demonstrating her ninja techniques',
    character: 'Ayane',
    effects: [
      { description: 'Technique mastery boost', value: 22, type: 'percentage' }
    ],
    source: 'Ninja Festival'
  },
  {
    id: 'DF003',
    name: 'Diamond Frame',
    type: 'Frame',
    rarity: 'UR',
    description: 'Ultra-luxury diamond-encrusted frame',
    character: null,
    effects: [
      { description: 'Maximum prestige bonus', value: 35, type: 'percentage' }
    ],
    source: 'Premium VIP Reward'
  },
  {
    id: 'DF004',
    name: 'Cherry Blossom Background',
    type: 'Background',
    rarity: 'SR',
    description: 'Animated falling cherry blossoms',
    character: null,
    effects: [
      { description: 'Spring energy boost', value: 8, type: 'percentage' }
    ],
    source: 'Spring Festival'
  },
  {
    id: 'DS002',
    name: 'Star Stickers',
    type: 'Sticker',
    rarity: 'R',
    description: 'Glittering star-shaped stickers',
    character: null,
    effects: [
      { description: 'Luck enhancement', value: 3, type: 'percentage' }
    ],
    source: 'Weekly Login'
  },
  {
    id: 'DE002',
    name: 'Lightning Effect',
    type: 'Effect',
    rarity: 'SSR',
    description: 'Dynamic lightning bolt overlay',
    character: null,
    effects: [
      { description: 'Power enhancement effect', value: 20, type: 'percentage' }
    ],
    source: 'Storm Collection'
  },
  {
    id: 'BR007',
    name: 'Marie Rose Cuteness',
    type: 'Character',
    rarity: 'SR',
    description: 'Marie Rose in her most adorable pose',
    character: 'Marie Rose',
    effects: [
      { description: 'Charm factor increase', value: 16, type: 'percentage' }
    ],
    source: 'Cute Contest'
  },
  {
    id: 'DF005',
    name: 'Moonlight Frame',
    type: 'Frame',
    rarity: 'SR',
    description: 'Ethereal moonlight-themed frame',
    character: null,
    effects: [
      { description: 'Night activity bonus', value: 18, type: 'percentage' }
    ],
    source: 'Midnight Collection'
  },
  {
    id: 'DE003',
    name: 'Fire Aura',
    type: 'Effect',
    rarity: 'UR',
    description: 'Blazing fire aura surrounding character',
    character: null,
    effects: [
      { description: 'Ultimate power enhancement', value: 30, type: 'percentage' }
    ],
    source: 'Legendary Collection'
  }
]; 