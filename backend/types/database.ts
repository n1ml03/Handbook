// Database entity types for the backend service

export interface Character {
  id: string;
  name: string;
  nameJp?: string;
  nameEn?: string;
  nameZh?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewCharacter {
  id: string;
  name: string;
  nameJp?: string;
  nameEn?: string;
  nameZh?: string;
}

export interface Skill {
  id: string;
  name: string;
  type: string;
  description?: string;
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewSkill {
  id: string;
  name: string;
  type: string;
  description?: string;
  icon?: string;
}

export interface Swimsuit {
  id: string;
  name: string;
  characterId: string;
  rarity: 'SSR' | 'SR' | 'R';
  pow: number;
  tec: number;
  stm: number;
  apl: number;
  releaseDate: Date;
  reappearDate?: Date;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewSwimsuit {
  id: string;
  name: string;
  characterId: string;
  rarity: 'SSR' | 'SR' | 'R';
  pow: number;
  tec: number;
  stm: number;
  apl: number;
  releaseDate: Date;
  reappearDate?: Date;
  image?: string;
}

export interface Girl {
  id: string;
  name: string;
  type: 'pow' | 'tec' | 'stm';
  level: number;
  pow: number;
  tec: number;
  stm: number;
  apl: number;
  maxPow: number;
  maxTec: number;
  maxStm: number;
  maxApl: number;
  birthday: Date;
  swimsuitId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewGirl {
  id: string;
  name: string;
  type: 'pow' | 'tec' | 'stm';
  level: number;
  pow: number;
  tec: number;
  stm: number;
  apl: number;
  maxPow: number;
  maxTec: number;
  maxStm: number;
  maxApl: number;
  birthday: Date;
  swimsuitId?: string;
}

export interface Accessory {
  id: string;
  name: string;
  type: 'head' | 'face' | 'hand';
  skillId: string;
  pow?: number;
  tec?: number;
  stm?: number;
  apl?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewAccessory {
  id: string;
  name: string;
  type: 'head' | 'face' | 'hand';
  skillId: string;
  pow?: number;
  tec?: number;
  stm?: number;
  apl?: number;
}

export interface VenusBoard {
  id: number;
  girlId: string;
  pow: number;
  tec: number;
  stm: number;
  apl: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewVenusBoard {
  girlId: string;
  pow: number;
  tec: number;
  stm: number;
  apl: number;
}
