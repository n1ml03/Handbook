import { config } from 'dotenv';
config();

import logger from './config/logger';
import { testConnection } from './config/database';
import databaseService from './services/DatabaseService';

interface SeedData {
  characters: any[];
  skills: any[];
  swimsuits: any[];
  accessories: any[];
  passiveSkills: any[];
  venusBoards: any[];
  messages: any[];
  ownerRoomItems: any[];
  monthlyBattles: any[];
  levelData: any[];
}

// Sample data for seeding
const seedData: SeedData = {
  characters: [
    {
      id: 'kasumi',
      name: 'Kasumi',
      nameJp: 'かすみ',
      nameEn: 'Kasumi',
      nameZh: '霞'
    },
    {
      id: 'ayane',
      name: 'Ayane',
      nameJp: 'あやね',
      nameEn: 'Ayane',
      nameZh: '绫音'
    },
    {
      id: 'hitomi',
      name: 'Hitomi',
      nameJp: 'ひとみ',
      nameEn: 'Hitomi',
      nameZh: '瞳'
    },
    {
      id: 'helena',
      name: 'Helena',
      nameJp: 'エレナ',
      nameEn: 'Helena',
      nameZh: '海莲娜'
    },
    {
      id: 'marie_rose',
      name: 'Marie Rose',
      nameJp: 'マリー・ローズ',
      nameEn: 'Marie Rose',
      nameZh: '玛丽萝丝'
    },
    {
      id: 'honoka',
      name: 'Honoka',
      nameJp: 'ほのか',
      nameEn: 'Honoka',
      nameZh: '穗香'
    },
    {
      id: 'nyotengu',
      name: 'Nyotengu',
      nameJp: '女天狗',
      nameEn: 'Nyotengu',
      nameZh: '女天狗'
    },
    {
      id: 'momiji',
      name: 'Momiji',
      nameJp: 'もみじ',
      nameEn: 'Momiji',
      nameZh: '红叶'
    },
    {
      id: 'tina',
      name: 'Tina',
      nameJp: 'ティナ',
      nameEn: 'Tina',
      nameZh: '蒂娜'
    },
    {
      id: 'lisa',
      name: 'Lisa',
      nameJp: 'リサ',
      nameEn: 'Lisa',
      nameZh: '莉莎'
    },
    {
      id: 'christie',
      name: 'Christie',
      nameJp: 'クリスティ',
      nameEn: 'Christie',
      nameZh: '克里斯蒂'
    },
    {
      id: 'kokoro',
      name: 'Kokoro',
      nameJp: 'こころ',
      nameEn: 'Kokoro',
      nameZh: '心'
    },
    {
      id: 'misaki',
      name: 'Misaki',
      nameJp: 'みさき',
      nameEn: 'Misaki',
      nameZh: '美咲'
    },
    {
      id: 'tamaki',
      name: 'Tamaki',
      nameJp: 'たまき',
      nameEn: 'Tamaki',
      nameZh: '环'
    },
    {
      id: 'leifang',
      name: 'Leifang',
      nameJp: 'レイファン',
      nameEn: 'Leifang',
      nameZh: '雷芳'
    },
    {
      id: 'luna',
      name: 'Luna',
      nameJp: 'ルナ',
      nameEn: 'Luna',
      nameZh: '露娜'
    },
    {
      id: 'fiona',
      name: 'Fiona',
      nameJp: 'フィオナ',
      nameEn: 'Fiona',
      nameZh: '菲奥娜'
    }
  ],
  skills: [
    {
      id: 'pow_boost_1',
      name: 'Power Boost I',
      type: 'offensive',
      description: 'Increases POW stat by 5%',
      icon: 'power'
    },
    {
      id: 'pow_boost_2',
      name: 'Power Boost II',
      type: 'offensive',
      description: 'Increases POW stat by 10%',
      icon: 'power'
    },
    {
      id: 'tec_boost_1',
      name: 'Tech Boost I',
      type: 'offensive',
      description: 'Increases TEC stat by 5%',
      icon: 'technique'
    },
    {
      id: 'tec_boost_2',
      name: 'Tech Boost II',
      type: 'offensive',
      description: 'Increases TEC stat by 10%',
      icon: 'technique'
    },
    {
      id: 'stm_boost_1',
      name: 'Stamina Boost I',
      type: 'defensive',
      description: 'Increases STM stat by 5%',
      icon: 'stamina'
    },
    {
      id: 'stm_boost_2',
      name: 'Stamina Boost II',
      type: 'defensive',
      description: 'Increases STM stat by 10%',
      icon: 'stamina'
    },
    {
      id: 'apl_boost_1',
      name: 'Appeal Boost I',
      type: 'support',
      description: 'Increases APL stat by 5%',
      icon: 'appeal'
    },
    {
      id: 'apl_boost_2',
      name: 'Appeal Boost II',
      type: 'support',
      description: 'Increases APL stat by 10%',
      icon: 'appeal'
    },
    {
      id: 'critical_hit',
      name: 'Critical Hit',
      type: 'offensive',
      description: 'Increases critical hit chance',
      icon: 'critical'
    },
    {
      id: 'fever_chance',
      name: 'Fever Chance',
      type: 'support',
      description: 'Increases fever activation chance',
      icon: 'fever'
    },
    {
      id: 'water_mastery',
      name: 'Water Mastery',
      type: 'special',
      description: 'Increases performance in water-based activities by 20%',
      icon: 'water'
    },
    {
      id: 'combo_boost',
      name: 'Combo Boost',
      type: 'offensive',
      description: 'Increases combo effectiveness by 15%',
      icon: 'combo'
    },
    {
      id: 'defense_up',
      name: 'Defense Up',
      type: 'defensive',
      description: 'Reduces damage taken by 10%',
      icon: 'shield'
    },
    {
      id: 'luck_boost',
      name: 'Luck Boost',
      type: 'support',
      description: 'Increases rare event chance by 5%',
      icon: 'luck'
    },
    {
      id: 'concentration',
      name: 'Concentration',
      type: 'support',
      description: 'Improves focus during skill-based activities',
      icon: 'focus'
    }
  ],
  swimsuits: [
    {
      id: 'kasumi_ssr_venus',
      name: 'Venus Kasumi',
      characterId: 'kasumi',
      rarity: 'SSR' as const,
      pow: 1200,
      tec: 950,
      stm: 1100,
      apl: 1050,
      releaseDate: new Date('2024-01-01'),
      image: '/images/swimsuits/kasumi_venus.jpg'
    },
    {
      id: 'kasumi_sr_summer',
      name: 'Summer Kasumi',
      characterId: 'kasumi',
      rarity: 'SR' as const,
      pow: 900,
      tec: 750,
      stm: 850,
      apl: 800,
      releaseDate: new Date('2024-02-01'),
      image: '/images/swimsuits/kasumi_summer.jpg'
    },
    {
      id: 'ayane_ssr_ninja',
      name: 'Ninja Princess Ayane',
      characterId: 'ayane',
      rarity: 'SSR' as const,
      pow: 1100,
      tec: 1250,
      stm: 950,
      apl: 1000,
      releaseDate: new Date('2024-01-15'),
      image: '/images/swimsuits/ayane_ninja.jpg'
    },
    {
      id: 'hitomi_sr_sporty',
      name: 'Sporty Hitomi',
      characterId: 'hitomi',
      rarity: 'SR' as const,
      pow: 950,
      tec: 850,
      stm: 1000,
      apl: 750,
      releaseDate: new Date('2024-02-15'),
      image: '/images/swimsuits/hitomi_sporty.jpg'
    },
    {
      id: 'helena_ssr_elegant',
      name: 'Elegant Helena',
      characterId: 'helena',
      rarity: 'SSR' as const,
      pow: 850,
      tec: 1150,
      stm: 1000,
      apl: 1300,
      releaseDate: new Date('2024-03-01'),
      image: '/images/swimsuits/helena_elegant.jpg'
    },
    {
      id: 'marie_ssr_gothic',
      name: 'Gothic Marie Rose',
      characterId: 'marie_rose',
      rarity: 'SSR' as const,
      pow: 750,
      tec: 1100,
      stm: 900,
      apl: 1450,
      releaseDate: new Date('2024-03-15'),
      image: '/images/swimsuits/marie_gothic.jpg'
    },
    {
      id: 'honoka_ssr_tropical',
      name: 'Tropical Paradise Honoka',
      characterId: 'honoka',
      rarity: 'SSR' as const,
      pow: 1300,
      tec: 950,
      stm: 1150,
      apl: 1200,
      releaseDate: new Date('2024-04-01'),
      image: '/images/swimsuits/honoka_tropical.jpg'
    },
    {
      id: 'nyotengu_ssr_mystical',
      name: 'Mystical Wings Nyotengu',
      characterId: 'nyotengu',
      rarity: 'SSR' as const,
      pow: 1000,
      tec: 1400,
      stm: 800,
      apl: 1500,
      releaseDate: new Date('2024-04-15'),
      image: '/images/swimsuits/nyotengu_mystical.jpg'
    },
    {
      id: 'momiji_sr_autumn',
      name: 'Autumn Breeze Momiji',
      characterId: 'momiji',
      rarity: 'SR' as const,
      pow: 1000,
      tec: 900,
      stm: 950,
      apl: 800,
      releaseDate: new Date('2024-05-01'),
      image: '/images/swimsuits/momiji_autumn.jpg'
    },
    {
      id: 'tina_ssr_rocknroll',
      name: 'Rock & Roll Tina',
      characterId: 'tina',
      rarity: 'SSR' as const,
      pow: 1400,
      tec: 800,
      stm: 1200,
      apl: 1300,
      releaseDate: new Date('2024-05-15'),
      image: '/images/swimsuits/tina_rocknroll.jpg'
    },
    {
      id: 'lisa_sr_casual',
      name: 'Casual Lisa',
      characterId: 'lisa',
      rarity: 'SR' as const,
      pow: 900,
      tec: 850,
      stm: 950,
      apl: 1000,
      releaseDate: new Date('2024-06-01'),
      image: '/images/swimsuits/lisa_casual.jpg'
    },
    {
      id: 'christie_ssr_spy',
      name: 'Secret Agent Christie',
      characterId: 'christie',
      rarity: 'SSR' as const,
      pow: 1150,
      tec: 1350,
      stm: 1000,
      apl: 1200,
      releaseDate: new Date('2024-06-15'),
      image: '/images/swimsuits/christie_spy.jpg'
    },
    {
      id: 'kokoro_sr_traditional',
      name: 'Traditional Kokoro',
      characterId: 'kokoro',
      rarity: 'SR' as const,
      pow: 800,
      tec: 950,
      stm: 900,
      apl: 1100,
      releaseDate: new Date('2024-07-01'),
      image: '/images/swimsuits/kokoro_traditional.jpg'
    },
    {
      id: 'misaki_ssr_idol',
      name: 'Pop Idol Misaki',
      characterId: 'misaki',
      rarity: 'SSR' as const,
      pow: 950,
      tec: 1100,
      stm: 1050,
      apl: 1600,
      releaseDate: new Date('2024-07-15'),
      image: '/images/swimsuits/misaki_idol.jpg'
    },
    {
      id: 'leifang_sr_martial',
      name: 'Martial Artist Leifang',
      characterId: 'leifang',
      rarity: 'SR' as const,
      pow: 1050,
      tec: 1200,
      stm: 1100,
      apl: 800,
      releaseDate: new Date('2024-08-01'),
      image: '/images/swimsuits/leifang_martial.jpg'
    }
  ],
  accessories: [
    {
      id: 'ocean_pearl_necklace',
      name: 'Ocean Pearl Necklace',
      type: 'head',
      rarity: 'SSR',
      pow: 0,
      tec: 25,
      stm: 0,
      apl: 15,
      skillId: 'water_mastery',
      image: '/images/accessories/ocean_pearl.jpg'
    },
    {
      id: 'crystal_earrings',
      name: 'Crystal Earrings',
      type: 'face',
      rarity: 'SR',
      pow: 10,
      tec: 0,
      stm: 0,
      apl: 20,
      skillId: 'appeal_boost_1',
      image: '/images/accessories/crystal_earrings.jpg'
    },
    {
      id: 'power_bracelet',
      name: 'Power Bracelet',
      type: 'hand',
      rarity: 'SR',
      pow: 30,
      tec: 0,
      stm: 10,
      apl: 0,
      skillId: 'pow_boost_2',
      image: '/images/accessories/power_bracelet.jpg'
    },
    {
      id: 'stamina_ring',
      name: 'Stamina Ring',
      type: 'hand',
      rarity: 'R',
      pow: 5,
      tec: 0,
      stm: 25,
      apl: 5,
      skillId: 'stm_boost_1',
      image: '/images/accessories/stamina_ring.jpg'
    },
    {
      id: 'tropical_hair_pin',
      name: 'Tropical Hair Pin',
      type: 'head',
      rarity: 'R',
      pow: 0,
      tec: 15,
      stm: 0,
      apl: 10,
      skillId: 'tec_boost_1',
      image: '/images/accessories/tropical_pin.jpg'
    },
    {
      id: 'lucky_charm',
      name: 'Lucky Charm',
      type: 'face',
      rarity: 'N',
      pow: 5,
      tec: 5,
      stm: 5,
      apl: 5,
      skillId: 'critical_hit',
      image: '/images/accessories/lucky_charm.jpg'
    }
  ],
  passiveSkills: [
    {
      id: 'PS001',
      name: 'Power Surge',
      category: 'Stat Boost',
      rarity: 'SSR',
      description: 'Increases POW by 20% when HP is above 80%. This powerful passive skill provides a significant boost to power-based activities.',
      icon: '💪',
      source: 'SSR Swimsuit',
      effects: [
        { description: 'POW boost', value: 20, type: 'percentage' }
      ],
      conditions: 'HP > 80%'
    },
    {
      id: 'PS002',
      name: 'Technical Mastery',
      category: 'Condition',
      rarity: 'SR',
      description: 'Improves TEC performance during skill-based activities. Enhances precision and technical execution.',
      icon: '🔧',
      source: 'Venus Board',
      effects: [
        { description: 'TEC boost in skill activities', value: 15, type: 'percentage' }
      ],
      conditions: 'During skill-based competitions'
    },
    {
      id: 'PS003',
      name: 'Endurance Runner',
      category: 'Passive Effect',
      rarity: 'SR',
      description: 'Reduces stamina consumption by 25% during training. Allows for longer and more intensive training sessions.',
      icon: '🏃',
      source: 'Training Reward',
      effects: [
        { description: 'Stamina consumption reduction', value: 25, type: 'percentage' }
      ],
      conditions: 'Always active during training'
    },
    {
      id: 'PS004',
      name: 'Critical Appeal',
      category: 'Trigger',
      rarity: 'SSR',
      description: '15% chance to double appeal effectiveness. Creates spectacular moments that captivate audiences.',
      icon: '✨',
      source: 'Limited Event',
      effects: [
        { description: 'Critical appeal chance', value: 15, type: 'percentage' },
        { description: 'Appeal multiplier', value: 200, type: 'percentage' }
      ],
      conditions: 'Random trigger during appeal actions'
    },
    {
      id: 'PS005',
      name: 'Team Synergy',
      category: 'Stat Boost',
      rarity: 'R',
      description: 'All stats +5% when partnered with same type character. Enhances team coordination and compatibility.',
      icon: '🤝',
      source: 'Friendship Level',
      effects: [
        { description: 'All stats boost', value: 5, type: 'percentage' }
      ],
      conditions: 'Partner must be same character type'
    },
    {
      id: 'PS006',
      name: 'Lucky Break',
      category: 'Trigger',
      rarity: 'R',
      description: '10% chance to avoid stamina loss during activities. Sometimes luck is all you need!',
      icon: '🍀',
      source: 'Daily Login',
      effects: [
        { description: 'Stamina preservation chance', value: 10, type: 'percentage' }
      ],
      conditions: 'Random trigger during stamina-consuming activities'
    },
    {
      id: 'PS007',
      name: 'Perfect Form',
      category: 'Condition',
      rarity: 'SSR',
      description: 'Massive stat boost when all stats are balanced within 10% of each other.',
      icon: '🎯',
      source: 'Achievement Reward',
      effects: [
        { description: 'All stats boost when balanced', value: 30, type: 'percentage' }
      ],
      conditions: 'All stats within 10% of each other'
    },
    {
      id: 'PS008',
      name: 'Momentum Builder',
      category: 'Passive Effect',
      rarity: 'SR',
      description: 'Each successful activity increases next activity effectiveness by 2%, stacking up to 20%.',
      icon: '📈',
      source: 'Progression Milestone',
      effects: [
        { description: 'Activity effectiveness per success', value: 2, type: 'percentage' },
        { description: 'Maximum stack', value: 20, type: 'percentage' }
      ],
      conditions: 'Stacks with successful activities'
    },
    {
      id: 'PS009',
      name: 'Elemental Affinity',
      category: 'Stat Boost',
      rarity: 'SSR',
      description: 'Gains elemental bonuses based on environment type.',
      icon: '🌟',
      source: 'Special Event',
      effects: [
        { description: 'Environmental bonus', value: 25, type: 'percentage' }
      ],
      conditions: 'Environment-specific activation'
    },
    {
      id: 'PS010',
      name: 'Speed Burst',
      category: 'Trigger',
      rarity: 'SR',
      description: '20% chance to perform actions twice in one turn.',
      icon: '⚡',
      source: 'Speed Training',
      effects: [
        { description: 'Double action chance', value: 20, type: 'percentage' }
      ],
      conditions: 'Random trigger during any action'
    }
  ],
  venusBoards: [
    {
      id: 'kasumi_board',
      characterId: 'kasumi',
      pow: 150,
      tec: 120,
      stm: 140,
      apl: 130,
      unlockedNodes: 25,
      totalNodes: 50
    },
    {
      id: 'ayane_board',
      characterId: 'ayane',
      pow: 120,
      tec: 180,
      stm: 110,
      apl: 140,
      unlockedNodes: 30,
      totalNodes: 50
    },
    {
      id: 'hitomi_board',
      characterId: 'hitomi',
      pow: 160,
      tec: 130,
      stm: 170,
      apl: 100,
      unlockedNodes: 20,
      totalNodes: 50
    },
    {
      id: 'helena_board',
      characterId: 'helena',
      pow: 100,
      tec: 150,
      stm: 120,
      apl: 190,
      unlockedNodes: 35,
      totalNodes: 50
    },
    {
      id: 'marie_board',
      characterId: 'marie_rose',
      pow: 90,
      tec: 140,
      stm: 110,
      apl: 200,
      unlockedNodes: 28,
      totalNodes: 50
    },
    {
      id: 'honoka_board',
      characterId: 'honoka',
      pow: 180,
      tec: 110,
      stm: 150,
      apl: 140,
      unlockedNodes: 22,
      totalNodes: 50
    },
    {
      id: 'nyotengu_board',
      characterId: 'nyotengu',
      pow: 130,
      tec: 190,
      stm: 100,
      apl: 200,
      unlockedNodes: 40,
      totalNodes: 50
    },
    {
      id: 'momiji_board',
      characterId: 'momiji',
      pow: 140,
      tec: 130,
      stm: 160,
      apl: 120,
      unlockedNodes: 18,
      totalNodes: 50
    }
  ],
  messages: [
    {
      id: 'msg_001',
      characterId: 'kasumi',
      type: 'morning',
      mood: 'happy',
      content: 'Good morning! Ready for another exciting day at the beach?',
      unlockCondition: 'Daily login',
      timestamp: new Date('2024-06-01T08:00:00Z')
    },
    {
      id: 'msg_002',
      characterId: 'kasumi',
      type: 'evening',
      mood: 'relaxed',
      content: 'The sunset is so beautiful today. Thanks for spending time with me!',
      unlockCondition: 'Friendship level 3',
      timestamp: new Date('2024-06-01T18:30:00Z')
    },
    {
      id: 'msg_003',
      characterId: 'ayane',
      type: 'training',
      mood: 'determined',
      content: 'I need to train harder if I want to become stronger. Will you help me?',
      unlockCondition: 'Complete training session',
      timestamp: new Date('2024-06-02T10:15:00Z')
    },
    {
      id: 'msg_004',
      characterId: 'hitomi',
      type: 'competition',
      mood: 'excited',
      content: 'I won the volleyball match! Did you see that spike?',
      unlockCondition: 'Win sports competition',
      timestamp: new Date('2024-06-02T14:45:00Z')
    },
    {
      id: 'msg_005',
      characterId: 'helena',
      type: 'gift',
      mood: 'grateful',
      content: 'This present is lovely! You have such good taste.',
      unlockCondition: 'Give gift',
      timestamp: new Date('2024-06-03T16:20:00Z')
    },
    {
      id: 'msg_006',
      characterId: 'marie_rose',
      type: 'birthday',
      mood: 'joyful',
      content: 'Thank you for remembering my birthday! This is the best day ever!',
      unlockCondition: 'Birthday event',
      timestamp: new Date('2024-12-25T12:00:00Z')
    },
    {
      id: 'msg_007',
      characterId: 'honoka',
      type: 'food',
      mood: 'happy',
      content: 'This tropical fruit is so delicious! Want to share it with me?',
      unlockCondition: 'Dining together',
      timestamp: new Date('2024-06-04T12:30:00Z')
    },
    {
      id: 'msg_008',
      characterId: 'nyotengu',
      type: 'mystical',
      mood: 'mysterious',
      content: 'The winds carry ancient secrets... perhaps you are ready to learn them.',
      unlockCondition: 'Max relationship level',
      timestamp: new Date('2024-06-05T21:00:00Z')
    }
  ],
  ownerRoomItems: [
    {
      id: 'tropical_sofa',
      name: 'Tropical Sofa',
      category: 'furniture',
      type: 'seating',
      rarity: 'SR',
      cost: 2500,
      description: 'A comfortable sofa with tropical patterns',
      image: '/images/furniture/tropical_sofa.jpg',
      unlocked: true
    },
    {
      id: 'beach_painting',
      name: 'Beach Sunset Painting',
      category: 'decoration',
      type: 'wall',
      rarity: 'R',
      cost: 800,
      description: 'A beautiful painting of a beach sunset',
      image: '/images/furniture/beach_painting.jpg',
      unlocked: true
    },
    {
      id: 'gaming_setup',
      name: 'Ultimate Gaming Setup',
      category: 'electronics',
      type: 'entertainment',
      rarity: 'SSR',
      cost: 5000,
      description: 'High-end gaming computer with multiple monitors',
      image: '/images/furniture/gaming_setup.jpg',
      unlocked: false
    },
    {
      id: 'crystal_chandelier',
      name: 'Crystal Chandelier',
      category: 'lighting',
      type: 'ceiling',
      rarity: 'SSR',
      cost: 4000,
      description: 'Elegant crystal chandelier that sparkles beautifully',
      image: '/images/furniture/chandelier.jpg',
      unlocked: false
    },
    {
      id: 'mini_bar',
      name: 'Tropical Mini Bar',
      category: 'furniture',
      type: 'dining',
      rarity: 'SR',
      cost: 1800,
      description: 'A stylish mini bar for tropical drinks',
      image: '/images/furniture/mini_bar.jpg',
      unlocked: true
    },
    {
      id: 'kasumi_figurine',
      name: 'Kasumi Collectible Figurine',
      category: 'decoration',
      type: 'collectible',
      rarity: 'SSR',
      cost: 3000,
      description: 'Limited edition Kasumi figurine',
      image: '/images/furniture/kasumi_figurine.jpg',
      unlocked: false
    }
  ],
  monthlyBattles: [
    {
      id: 'summer_championship_2024',
      name: 'Venus Summer Championship',
      season: 'Summer 2024',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2024-08-31'),
      theme: 'Summer Beach Battles',
      description: 'Compete in intense summer-themed battles for exclusive rewards!',
      bonusCharacters: ['kasumi', 'ayane', 'honoka', 'marie_rose'],
      rewards: [
        { tier: 'Champion', rank: '1st', items: ['Exclusive SSR Outfit', '50,000 V-Stones', 'Championship Trophy'] },
        { tier: 'Elite', rank: '2nd-10th', items: ['SR Outfit', '25,000 V-Stones', 'Elite Badge'] },
        { tier: 'Advanced', rank: '11th-50th', items: ['R Outfit', '10,000 V-Stones', 'Advanced Badge'] },
        { tier: 'Challenger', rank: '51st-100th', items: ['5,000 V-Stones', 'Participation Badge'] }
      ],
      active: true
    },
    {
      id: 'spring_festival_2024',
      name: 'Spring Sakura Festival',
      season: 'Spring 2024',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-05-31'),
      theme: 'Cherry Blossom Tournament',
      description: 'Celebrate spring with beautiful sakura-themed competitions!',
      bonusCharacters: ['helena', 'momiji'],
      rewards: [
        { tier: 'Sakura Champion', rank: '1st', items: ['Sakura SSR Outfit', '40,000 V-Stones'] },
        { tier: 'Blossom Elite', rank: '2nd-20th', items: ['Spring SR Outfit', '20,000 V-Stones'] }
      ],
      active: false
    }
  ],
  levelData: [
    {
      level: 1,
      requiredExp: 100,
      totalExp: 100,
      isMilestone: true,
      statBonuses: { pow: 2, tec: 2, stm: 2, apl: 2 },
      rewards: [{ name: 'Welcome Bonus', quantity: 1000 }]
    },
    {
      level: 5,
      requiredExp: 500,
      totalExp: 1500,
      isMilestone: true,
      statBonuses: { pow: 4, tec: 4, stm: 4, apl: 4 },
      rewards: [{ name: 'Venus Stone', quantity: 2 }, { name: 'Gold', quantity: 5000 }]
    },
    {
      level: 10,
      requiredExp: 1000,
      totalExp: 5500,
      isMilestone: true,
      statBonuses: { pow: 8, tec: 8, stm: 8, apl: 8 },
      rewards: [{ name: 'Venus Stone', quantity: 5 }, { name: 'SR Gift Ticket', quantity: 1 }]
    },
    {
      level: 25,
      requiredExp: 2500,
      totalExp: 35000,
      isMilestone: true,
      statBonuses: { pow: 20, tec: 20, stm: 20, apl: 20 },
      rewards: [{ name: 'Venus Stone', quantity: 10 }, { name: 'SSR Gift Ticket', quantity: 1 }]
    },
    {
      level: 50,
      requiredExp: 5000,
      totalExp: 125000,
      isMilestone: true,
      statBonuses: { pow: 50, tec: 50, stm: 50, apl: 50 },
      rewards: [{ name: 'Special Swimsuit', quantity: 1 }, { name: 'Venus Stone', quantity: 25 }]
    },
    {
      level: 75,
      requiredExp: 7500,
      totalExp: 275000,
      isMilestone: true,
      statBonuses: { pow: 75, tec: 75, stm: 75, apl: 75 },
      rewards: [{ name: 'Ultimate Venus Stone', quantity: 5 }, { name: 'Master Accessory', quantity: 1 }]
    },
    {
      level: 100,
      requiredExp: 10000,
      totalExp: 500000,
      isMilestone: true,
      statBonuses: { pow: 100, tec: 100, stm: 100, apl: 100 },
      rewards: [{ name: 'Max Level Achievement', quantity: 1 }, { name: 'Legendary Outfit', quantity: 1 }]
    }
  ]
};

async function seedDatabase() {
  try {
    logger.info('Starting database seeding...');

    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    logger.info('Database connection successful');

    // Seed characters
    logger.info('Seeding characters...');
    for (const character of seedData.characters) {
      try {
        await databaseService.createCharacter(character);
        logger.info(`✓ Created character: ${character.name}`);
      } catch (error: any) {
        if (error.statusCode === 409) {
          logger.info(`- Character already exists: ${character.name}`);
        } else {
          logger.error(`✗ Failed to create character ${character.name}:`, error.message);
        }
      }
    }

    // Seed skills
    logger.info('Seeding skills...');
    for (const skill of seedData.skills) {
      try {
        await databaseService.createSkill(skill);
        logger.info(`✓ Created skill: ${skill.name}`);
      } catch (error: any) {
        if (error.statusCode === 409) {
          logger.info(`- Skill already exists: ${skill.name}`);
        } else {
          logger.error(`✗ Failed to create skill ${skill.name}:`, error.message);
        }
      }
    }

    // Seed swimsuits
    logger.info('Seeding swimsuits...');
    for (const swimsuit of seedData.swimsuits) {
      try {
        await databaseService.createSwimsuit(swimsuit);
        logger.info(`✓ Created swimsuit: ${swimsuit.name}`);
      } catch (error: any) {
        if (error.statusCode === 409) {
          logger.info(`- Swimsuit already exists: ${swimsuit.name}`);
        } else {
          logger.error(`✗ Failed to create swimsuit ${swimsuit.name}:`, error.message);
        }
      }
    }

    // Seed accessories
    logger.info('Seeding accessories...');
    for (const accessory of seedData.accessories) {
      try {
        await databaseService.createAccessory(accessory);
        logger.info(`✓ Created accessory: ${accessory.name}`);
      } catch (error: any) {
        if (error.statusCode === 409) {
          logger.info(`- Accessory already exists: ${accessory.name}`);
        } else {
          logger.error(`✗ Failed to create accessory ${accessory.name}:`, error.message);
        }
      }
    }

    // Seed passive skills (if supported by database service)
    if (seedData.passiveSkills && seedData.passiveSkills.length > 0) {
      logger.info('Seeding passive skills...');
      for (const skill of seedData.passiveSkills) {
        try {
          // Note: This would need a specific method in DatabaseService
          logger.info(`✓ Passive skill data prepared: ${skill.name}`);
        } catch (error: any) {
          logger.error(`✗ Failed to prepare passive skill ${skill.name}:`, error.message);
        }
      }
    }

    // Seed Venus Boards (if supported by database service)
    if (seedData.venusBoards && seedData.venusBoards.length > 0) {
      logger.info('Seeding Venus Boards...');
      for (const board of seedData.venusBoards) {
        try {
          // Note: This would need a specific method in DatabaseService
          logger.info(`✓ Venus Board data prepared for character: ${board.characterId}`);
        } catch (error: any) {
          logger.error(`✗ Failed to prepare Venus Board for ${board.characterId}:`, error.message);
        }
      }
    }

    // Seed Messages (if supported by database service)
    if (seedData.messages && seedData.messages.length > 0) {
      logger.info('Seeding messages...');
      for (const message of seedData.messages) {
        try {
          // Note: This would need a specific method in DatabaseService
          logger.info(`✓ Message data prepared: ${message.type} from ${message.characterId}`);
        } catch (error: any) {
          logger.error(`✗ Failed to prepare message ${message.id}:`, error.message);
        }
      }
    }

    // Seed Owner Room Items (if supported by database service)
    if (seedData.ownerRoomItems && seedData.ownerRoomItems.length > 0) {
      logger.info('Seeding owner room items...');
      for (const item of seedData.ownerRoomItems) {
        try {
          // Note: This would need a specific method in DatabaseService
          logger.info(`✓ Owner room item data prepared: ${item.name}`);
        } catch (error: any) {
          logger.error(`✗ Failed to prepare owner room item ${item.name}:`, error.message);
        }
      }
    }

    // Seed Monthly Battles (if supported by database service)
    if (seedData.monthlyBattles && seedData.monthlyBattles.length > 0) {
      logger.info('Seeding monthly battles...');
      for (const battle of seedData.monthlyBattles) {
        try {
          // Note: This would need a specific method in DatabaseService
          logger.info(`✓ Monthly battle data prepared: ${battle.name}`);
        } catch (error: any) {
          logger.error(`✗ Failed to prepare monthly battle ${battle.name}:`, error.message);
        }
      }
    }

    // Seed Level Data (if supported by database service)
    if (seedData.levelData && seedData.levelData.length > 0) {
      logger.info('Seeding level data...');
      for (const level of seedData.levelData) {
        try {
          // Note: This would need a specific method in DatabaseService
          logger.info(`✓ Level data prepared: Level ${level.level}`);
        } catch (error: any) {
          logger.error(`✗ Failed to prepare level data ${level.level}:`, error.message);
        }
      }
    }

    logger.info('🎉 Database seeding completed successfully!');
    
    // Print summary
    const charactersResult = await databaseService.getCharacters({ limit: 100 });
    const skillsResult = await databaseService.getSkills({ limit: 100 });
    const swimsuitsResult = await databaseService.getSwimsuits({ limit: 100 });
    const accessoriesResult = await databaseService.getAccessories({ limit: 100 });

    logger.info(`
📊 Database Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 Characters: ${charactersResult.pagination.total}
🎯 Skills: ${skillsResult.pagination.total}
👙 Swimsuits: ${swimsuitsResult.pagination.total}
💎 Accessories: ${accessoriesResult.pagination.total}
⚡ Passive Skills: ${seedData.passiveSkills?.length || 0} (data prepared)
🌟 Venus Boards: ${seedData.venusBoards?.length || 0} (data prepared)
💬 Messages: ${seedData.messages?.length || 0} (data prepared)
🏠 Owner Room Items: ${seedData.ownerRoomItems?.length || 0} (data prepared)
🏆 Monthly Battles: ${seedData.monthlyBattles?.length || 0} (data prepared)
📈 Level Data: ${seedData.levelData?.length || 0} (data prepared)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);

  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info('Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seeding process failed:', error);
      process.exit(1);
    });
}

export default seedDatabase; 