export interface Skill {
  id: string;
  name: string;
  type: string;
  description: string;
}

export const skillsData: Skill[] = [
  {
    id: 'power-boost',
    name: 'Power Boost',
    type: 'offensive',
    description: 'Increases POW by 15%'
  },
  {
    id: 'technique-master',
    name: 'Technique Master',
    type: 'technical',
    description: 'Increases TEC by 12%'
  },
  {
    id: 'stamina-boost',
    name: 'Stamina Boost',
    type: 'defensive',
    description: 'Increases STM by 10%'
  },
  {
    id: 'appeal-charm',
    name: 'Appeal Charm',
    type: 'special',
    description: 'Increases APL by 18%'
  },
  {
    id: 'balanced-growth',
    name: 'Balanced Growth',
    type: 'balanced',
    description: 'Increases all stats by 6%'
  },
  {
    id: 'fire-storm',
    name: 'Fire Storm',
    type: 'offensive',
    description: 'Increases POW by 20% with burning effect'
  },
  {
    id: 'ice-precision',
    name: 'Ice Precision',
    type: 'technical',
    description: 'Increases TEC by 16% with freeze chance'
  },
  {
    id: 'earth-shield',
    name: 'Earth Shield',
    type: 'defensive',
    description: 'Increases STM by 14% with damage reduction'
  },
  {
    id: 'wind-grace',
    name: 'Wind Grace',
    type: 'special',
    description: 'Increases APL by 22% with speed boost'
  },
  {
    id: 'harmony-flow',
    name: 'Harmony Flow',
    type: 'balanced',
    description: 'Increases all stats by 8% with healing'
  },
  {
    id: 'lightning-strike',
    name: 'Lightning Strike',
    type: 'offensive',
    description: 'Increases POW by 18% with critical chance'
  },
  {
    id: 'water-mastery',
    name: 'Water Mastery',
    type: 'technical',
    description: 'Increases TEC by 14% in water activities'
  },
  {
    id: 'mountain-endurance',
    name: 'Mountain Endurance',
    type: 'defensive',
    description: 'Increases STM by 16% with resistance'
  },
  {
    id: 'starlight-charm',
    name: 'Starlight Charm',
    type: 'special',
    description: 'Increases APL by 20% at night'
  },
  {
    id: 'divine-blessing',
    name: 'Divine Blessing',
    type: 'balanced',
    description: 'Increases all stats by 10% with luck boost'
  }
]; 