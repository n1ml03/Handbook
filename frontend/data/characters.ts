export interface Character {
  id: string;
  name: string;
  level: number;
  type: 'pow' | 'tec' | 'stm' | 'apl';
  stats: { pow: number; tec: number; stm: number; apl: number };
  maxStats: { pow: number; tec: number; stm: number; apl: number };
  accessories: any[];
  birthday: string;
  // Enhanced character details
  profile?: {
    age: number;
    height: string;
    measurements?: {
      bust: number;
      waist: number;
      hips: number;
    };
    bloodType?: string;
    cv?: string; // Voice actor
    occupation?: string;
    hobbies?: string[];
    favoriteFood?: string[];
    favoriteColor?: string;
    personality?: string[];
    story?: {
      title: string;
      content: string;
      image?: string;
    };
    images?: {
      portrait?: string;
      fullBody?: string;
      gallery?: string[];
    };
  };
  swimsuit: {
    id: string;
    name: string;
    character: string;
    rarity: 'N' | 'R' | 'SR' | 'SSR' | 'UR';
    stats: { pow: number; tec: number; stm: number; apl: number };
    skills: Array<{
      id: string;
      name: string;
      type: string;
      description: string;
    }>;
    release: string;
  };
}

export const charactersData: Character[] = [
  {
    id: 'kasumi',
    name: 'Kasumi',
    level: 80,
    type: 'pow' as const,
    stats: { pow: 12500, tec: 11000, stm: 10500, apl: 9500 },
    maxStats: { pow: 15000, tec: 13000, stm: 12000, apl: 11000 },
    accessories: [],
    birthday: '03-08',
    profile: {
      age: 17,
      height: '158cm',
      measurements: {
        bust: 85,
        waist: 55,
        hips: 83
      },
      bloodType: 'A',
      cv: 'Yuka Iguchi',
      occupation: 'High School Student',
      hobbies: ['Karate', 'Cooking', 'Reading'],
      favoriteFood: ['Hamburgers', 'Strawberry Shortcake'],
      favoriteColor: 'Cherry Blossom Pink',
      personality: ['Cheerful', 'Determined', 'Caring', 'Strong-willed'],
      story: {
        title: 'The Fighting Spirit',
        content: 'A spirited young kunoichi with unwavering determination. Kasumi is known for her strong sense of justice and her dedication to protecting those she cares about. Despite her gentle appearance, she possesses incredible fighting skills and never backs down from a challenge.'
      }
    },
    swimsuit: {
      id: 'kasumi-default',
      name: 'Default Outfit',
      character: 'Kasumi',
      rarity: 'SR' as const,
      stats: { pow: 650, tec: 550, stm: 500, apl: 450 },
      skills: [{
        id: 'kasumi-skill',
        name: 'Fighting Spirit',
        type: 'offensive',
        description: 'Increases POW by 10%'
      }],
      release: '2019-03-20'
    }
  },
  {
    id: 'ayane',
    name: 'Ayane',
    level: 80,
    type: 'tec' as const,
    stats: { pow: 11000, tec: 12500, stm: 10000, apl: 9800 },
    maxStats: { pow: 13000, tec: 15000, stm: 12000, apl: 11500 },
    accessories: [],
    birthday: '09-03',
    profile: {
      age: 18,
      height: '157cm',
      measurements: {
        bust: 82,
        waist: 54,
        hips: 80
      },
      bloodType: 'B',
      cv: 'Wakana Yamazaki',
      occupation: 'Ninja',
      hobbies: ['Shuriken throwing', 'Meditation', 'Shadow dancing'],
      favoriteFood: ['Wasabi', 'Green tea', 'Dango'],
      favoriteColor: 'Deep Purple',
      personality: ['Mysterious', 'Loyal', 'Disciplined', 'Elegant'],
      story: {
        title: 'The Shadow Dancer',
        content: 'A skilled kunoichi trained in the ancient arts of ninjutsu. Ayane moves like a shadow, striking with precision and grace. Her mysterious nature hides a deeply loyal heart that beats for those she considers worthy of her protection.'
      }
    },
    swimsuit: {
      id: 'ayane-default',
      name: 'Default Outfit',
      character: 'Ayane',
      rarity: 'SR' as const,
      stats: { pow: 550, tec: 750, stm: 500, apl: 600 },
      skills: [{
        id: 'ayane-skill',
        name: 'Ninjutsu',
        type: 'technical',
        description: 'Increases TEC by 12%'
      }],
      release: '2019-03-20'
    }
  },
  {
    id: 'marie',
    name: 'Marie Rose',
    level: 75,
    type: 'stm' as const,
    stats: { pow: 10500, tec: 11200, stm: 12000, apl: 10100 },
    maxStats: { pow: 12500, tec: 13500, stm: 14500, apl: 12000 },
    accessories: [],
    birthday: '12-25',
    profile: {
      age: 18,
      height: '147cm',
      measurements: {
        bust: 74,
        waist: 52,
        hips: 78
      },
      bloodType: 'AB',
      cv: 'Mai Aizawa',
      occupation: 'Student & Fighter',
      hobbies: ['Russian literature', 'Ballet', 'Chess'],
      favoriteFood: ['Borscht', 'Blini', 'Russian tea'],
      favoriteColor: 'Rose Pink',
      personality: ['Elegant', 'Refined', 'Passionate', 'Artistic'],
      story: {
        title: 'The Russian Rose',
        content: 'A petite but fierce fighter with Russian heritage. Marie Rose combines the grace of ballet with deadly martial arts techniques. Her passion for literature and arts is matched only by her determination in combat.'
      }
    },
    swimsuit: {
      id: 'marie-default',
      name: 'Default Outfit',
      character: 'Marie Rose',
      rarity: 'SR' as const,
      stats: { pow: 500, tec: 600, stm: 700, apl: 550 },
      skills: [{
        id: 'marie-skill',
        name: 'Endurance',
        type: 'defensive',
        description: 'Increases STM by 15%'
      }],
      release: '2019-03-20'
    }
  },
  {
    id: 'honoka',
    name: 'Honoka',
    level: 78,
    type: 'pow' as const,
    stats: { pow: 12200, tec: 10800, stm: 10600, apl: 9900 },
    maxStats: { pow: 14500, tec: 12800, stm: 12500, apl: 11800 },
    accessories: [],
    birthday: '01-27',
    profile: {
      age: 18,
      height: '166cm',
      measurements: {
        bust: 99,
        waist: 59,
        hips: 87
      },
      bloodType: 'O',
      cv: 'Ai Nonaka',
      occupation: 'Pro Wrestler',
      hobbies: ['Wrestling', 'Weightlifting', 'American pop culture'],
      favoriteFood: ['Hamburgers', 'Pizza', 'Protein shakes'],
      favoriteColor: 'Sunny Orange',
      personality: ['Energetic', 'Friendly', 'Optimistic', 'Strong'],
      story: {
        title: 'The Sunny Fighter',
        content: 'A cheerful and energetic professional wrestler with dreams of making it big. Honoka brings sunshine wherever she goes with her infectious smile and positive attitude. Her wrestling techniques are as powerful as her personality is bright.'
      }
    },
    swimsuit: {
      id: 'honoka-default',
      name: 'Default Outfit',
      character: 'Honoka',
      rarity: 'SR' as const,
      stats: { pow: 700, tec: 500, stm: 550, apl: 650 },
      skills: [{
        id: 'honoka-skill',
        name: 'Energy Burst',
        type: 'offensive',
        description: 'Increases POW by 8%'
      }],
      release: '2019-03-20'
    }
  },
  {
    id: 'helena',
    name: 'Helena',
    level: 77,
    type: 'apl' as const,
    stats: { pow: 10000, tec: 10500, stm: 9800, apl: 12800 },
    maxStats: { pow: 12000, tec: 12500, stm: 11500, apl: 15000 },
    accessories: [],
    birthday: '02-14',
    swimsuit: {
      id: 'helena-default',
      name: 'Default Outfit',
      character: 'Helena',
      rarity: 'SR' as const,
      stats: { pow: 450, tec: 550, stm: 500, apl: 750 },
      skills: [{
        id: 'helena-skill',
        name: 'Elegant Grace',
        type: 'appeal',
        description: 'Increases APL by 14%'
      }],
      release: '2019-03-20'
    }
  },
  {
    id: 'kokoro',
    name: 'Kokoro',
    level: 79,
    type: 'tec' as const,
    stats: { pow: 10800, tec: 12000, stm: 10200, apl: 10500 },
    maxStats: { pow: 12800, tec: 14500, stm: 12200, apl: 12500 },
    accessories: [],
    birthday: '06-05',
    swimsuit: {
      id: 'kokoro-default',
      name: 'Default Outfit',
      character: 'Kokoro',
      rarity: 'SR' as const,
      stats: { pow: 500, tec: 700, stm: 550, apl: 600 },
      skills: [{
        id: 'kokoro-skill',
        name: 'Refined Technique',
        type: 'technical',
        description: 'Increases TEC by 11%'
      }],
      release: '2019-03-20'
    }
  },
  {
    id: 'momiji',
    name: 'Momiji',
    level: 81,
    type: 'pow' as const,
    stats: { pow: 12800, tec: 10800, stm: 11000, apl: 9700 },
    maxStats: { pow: 15200, tec: 12800, stm: 13000, apl: 11500 },
    accessories: [],
    birthday: '09-15',
    swimsuit: {
      id: 'momiji-default',
      name: 'Default Outfit',
      character: 'Momiji',
      rarity: 'SR' as const,
      stats: { pow: 750, tec: 500, stm: 600, apl: 500 },
      skills: [{
        id: 'momiji-skill',
        name: 'Ninja Strength',
        type: 'offensive',
        description: 'Increases POW by 13%'
      }],
      release: '2019-03-20'
    }
  },
  {
    id: 'hitomi',
    name: 'Hitomi',
    level: 76,
    type: 'stm' as const,
    stats: { pow: 11200, tec: 10600, stm: 12200, apl: 10000 },
    maxStats: { pow: 13200, tec: 12600, stm: 14500, apl: 12000 },
    accessories: [],
    birthday: '05-25',
    swimsuit: {
      id: 'hitomi-default',
      name: 'Default Outfit',
      character: 'Hitomi',
      rarity: 'SR' as const,
      stats: { pow: 600, tec: 550, stm: 700, apl: 500 },
      skills: [{
        id: 'hitomi-skill',
        name: 'Karate Spirit',
        type: 'defensive',
        description: 'Increases STM by 12%'
      }],
      release: '2019-03-20'
    }
  },
  {
    id: 'leifang',
    name: 'Lei Fang',
    level: 74,
    type: 'tec' as const,
    stats: { pow: 10500, tec: 11800, stm: 10300, apl: 10200 },
    maxStats: { pow: 12500, tec: 14000, stm: 12300, apl: 12200 },
    accessories: [],
    birthday: '04-12',
    swimsuit: {
      id: 'leifang-default',
      name: 'Default Outfit',
      character: 'Lei Fang',
      rarity: 'SR' as const,
      stats: { pow: 500, tec: 650, stm: 550, apl: 550 },
      skills: [{
        id: 'leifang-skill',
        name: 'Martial Focus',
        type: 'technical',
        description: 'Increases TEC by 10%'
      }],
      release: '2019-03-20'
    }
  },
  {
    id: 'tina',
    name: 'Tina',
    level: 82,
    type: 'pow' as const,
    stats: { pow: 13000, tec: 10200, stm: 11500, apl: 10800 },
    maxStats: { pow: 15500, tec: 12200, stm: 13500, apl: 12800 },
    accessories: [],
    birthday: '12-08',
    swimsuit: {
      id: 'tina-default',
      name: 'Default Outfit',
      character: 'Tina',
      rarity: 'SR' as const,
      stats: { pow: 800, tec: 450, stm: 650, apl: 600 },
      skills: [{
        id: 'tina-skill',
        name: 'Wrestling Power',
        type: 'offensive',
        description: 'Increases POW by 16%'
      }],
      release: '2019-03-20'
    }
  },
  {
    id: 'nyotengu',
    name: 'Nyotengu',
    level: 80,
    type: 'apl' as const,
    stats: { pow: 10300, tec: 11000, stm: 10200, apl: 12900 },
    maxStats: { pow: 12300, tec: 13000, stm: 12200, apl: 15200 },
    accessories: [],
    birthday: '11-11',
    swimsuit: {
      id: 'nyotengu-default',
      name: 'Default Outfit',
      character: 'Nyotengu',
      rarity: 'SR' as const,
      stats: { pow: 500, tec: 600, stm: 500, apl: 750 },
      skills: [{
        id: 'nyotengu-skill',
        name: 'Mystical Charm',
        type: 'appeal',
        description: 'Increases APL by 15%'
      }],
      release: '2019-03-20'
    }
  },
  {
    id: 'misaki',
    name: 'Misaki',
    level: 75,
    type: 'stm' as const,
    stats: { pow: 10800, tec: 10900, stm: 11800, apl: 10400 },
    maxStats: { pow: 12800, tec: 12900, stm: 14000, apl: 12400 },
    accessories: [],
    birthday: '08-22',
    swimsuit: {
      id: 'misaki-default',
      name: 'Default Outfit',
      character: 'Misaki',
      rarity: 'SR' as const,
      stats: { pow: 550, tec: 600, stm: 650, apl: 550 },
      skills: [{
        id: 'misaki-skill',
        name: 'Steady Determination',
        type: 'defensive',
        description: 'Increases STM by 11%'
      }],
      release: '2019-03-20'
    }
  }
]; 