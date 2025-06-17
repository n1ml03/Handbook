// Type definitions only - no mock data
export interface Character {
  id: string;
  name: string;
  nameJp?: string;
  nameEn?: string;
  nameZh?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  type: string;
  description?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Swimsuit {
  id: string;
  name: string;
  characterId: string;
  character?: string; // Character name for display
  rarity: 'SSR' | 'SR' | 'R';
  pow: number;
  tec: number;
  stm: number;
  apl: number;
  stats: {
    pow: number;
    tec: number;
    stm: number;
    apl: number;
  };
  skills?: Array<{
    id: string;
    name: string;
    type: string;
    description?: string;
  }>;
  release?: string; // Release date for display
  reappear?: string; // Reappear date for display
  releaseDate?: string;
  reappearDate?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateLog {
  id: string;
  version: string;
  title: string;
  content: string;
  description: string;
  date: string;
  tags: string[];
  isPublished: boolean;
  technicalDetails: string[];
  bugFixes: string[];
  screenshots: string[];
  metrics?: {
    performanceImprovement: string;
    userSatisfaction: string;
    bugReports: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
  rewards?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface Accessory {
  id: string;
  name: string;
  rarity: 'SSR' | 'SR' | 'R';
  type: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Bromide {
  id: string;
  name: string;
  character?: string;
  rarity: 'SSR' | 'SR' | 'R';
  category: string;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Character profile interfaces
export interface CharacterProfile {
  age?: number;
  height?: string;
  bloodType?: string;
  cv?: string;
  occupation?: string;
  favoriteColor?: string;
  measurements?: {
    bust: number;
    waist: number;
    hips: number;
  };
  hobbies?: string[];
  favoriteFood?: string[];
  personality?: string[];
  images?: {
    portrait?: string;
    gallery?: string[];
  };
  story?: {
    title: string;
    content: string;
    image?: string;
  };
}

// Girl interface for extended character data with gameplay stats
export interface Girl {
  id: string;
  name: string;
  type: 'pow' | 'tec' | 'stm';
  level: number;
  stats: {
    pow: number;
    tec: number;
    stm: number;
    apl: number;
  };
  maxStats: {
    pow: number;
    tec: number;
    stm: number;
    apl: number;
  };
  birthday: string;
  swimsuitId?: string;
  swimsuit?: Swimsuit;
  accessories: Accessory[];
  profile?: CharacterProfile;
  createdAt?: string;
  updatedAt?: string;
}

// =============================================================================
// MISSING TYPES - Comprehensive additions
// =============================================================================

// Common utility types used across pages
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'gallery' | 'showcase' | 'minimal' | 'list' | 'card' | 'table';
export type FilterType = 'text' | 'select' | 'number' | 'checkbox' | 'range' | 'date';

// Language and localization types
export type Language = 'EN' | 'CN' | 'TW' | 'KO' | 'JP';
export interface Translation {
  name: string;
  description?: string;
}
export type Translations = Record<Language, Translation>;

// Multi-language support for items
export interface MultiLanguageItem {
  id: string;
  name: string;
  description?: string;
  translations?: Translations;
}

// Memory/Gallery types (MemoriesPage)
export interface Memory {
  id: string;
  name: string;
  description: string;
  type: 'photo' | 'video' | 'story' | 'scene';
  date: string;
  characters: string[];
  tags: string[];
  thumbnail: string;
  favorite: boolean;
  unlocked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Shop types (ShopPage)
export type ShopSection = 'owner' | 'event' | 'venus' | 'vip';
export type ShopItemType = 'swimsuit' | 'accessory' | 'decoration' | 'currency' | 'booster';
export type ShopItemRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type Currency = 'coins' | 'gems' | 'tickets';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: ShopItemType;
  category: string;
  section: ShopSection;
  price: number;
  currency: Currency;
  rarity: ShopItemRarity;
  image: string;
  inStock: boolean;
  isNew: boolean;
  discount?: number;
  limitedTime?: boolean;
  featured?: boolean;
}

// Owner Room types (OwnerRoomPage)
export interface RoomTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  unlocked: boolean;
  cost: number;
}

export interface FurnitureItem {
  id: string;
  name: string;
  cost: number;
  unlocked: boolean;
}

export interface FurnitureCategory {
  name: string;
  icon: React.ReactNode;
  items: FurnitureItem[];
}

export interface RoomLayout {
  id: string;
  name: string;
  description: string;
}

export interface PlacedFurniture {
  id: string;
  position: {
    x: number;
    y: number;
  };
}

export interface RoomSettings {
  lighting: number[];
  ambiance: number[];
  privacy: number[];
}

// Filter and Sort types (used across multiple pages)
export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: FilterType;
  placeholder?: string;
  options?: FilterOption[];
  min?: number;
  max?: number;
  icon?: React.ReactNode;
  color?: string;
  gridCols?: number;
}

export interface SortOption {
  key: string;
  label: string;
}

// Enhanced Event types with specific subtypes
export interface Festival extends Event {
  eventType: 'festival';
  rewards: EventReward[];
  version?: string;
}

export interface GachaEvent extends Event {
  eventType: 'gacha';
  rewards: GachaReward[];
  rates?: GachaRates;
  bannerImage?: string;
}

export interface EventReward {
  id: string;
  name: string;
  icon?: string;
  type: 'item' | 'currency' | 'costume' | 'accessory';
  quantity?: number;
}

export interface GachaReward extends EventReward {
  rarity: 'SSR' | 'SR' | 'R' | 'N';
  rate: number; // Drop rate percentage
}

export interface GachaRates {
  ssr: number;
  sr: number;
  r: number;
  n: number;
}

// Enhanced Skill types
export interface SkillEffect {
  stat: 'pow' | 'tec' | 'stm' | 'apl';
  type: 'flat' | 'percentage';
  value: number;
}

export interface EnhancedSkill extends Skill {
  effects?: SkillEffect[];
  target?: 'self' | 'team' | 'enemy';
  cooldown?: number;
  duration?: number;
  skillLevel?: number;
  maxLevel?: number;
}

// Enhanced Bromide types
export interface BromideEffect {
  description: string;
  type: 'flat' | 'percentage';
  value?: number;
}

export interface EnhancedBromide extends Bromide {
  effects?: BromideEffect[];
  source?: string;
  version?: string;
  unlockCondition?: string;
}

// Enhanced Accessory types
export interface AccessoryStats {
  pow: number;
  tec: number;
  stm: number;
  apl: number;
}

export interface EnhancedAccessory extends Accessory {
  stats?: AccessoryStats;
  skill?: string;
  skillEffect?: string;
  category?: string;
  setBonus?: string;
  maxLevel?: number;
  currentLevel?: number;
}

// Admin/Management types (AdminPage)
export interface AdminSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  lastUpdated: string;
  status: 'active' | 'inactive' | 'draft';
}

export interface CSVValidationError {
  row: number;
  column: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface CSVPreviewData {
  headers: string[];
  rows: any[][];
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: CSVValidationError[];
}

export interface ColumnMapping {
  csvColumn: string;
  dbField: string;
  isRequired: boolean;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'array';
}

export interface ImportProgress {
  stage: 'uploading' | 'parsing' | 'validating' | 'importing' | 'complete';
  progress: number;
  processedRows: number;
  totalRows: number;
  errors: number;
  message: string;
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'json';
  selectedColumns: string[];
  filters: {
    dateRange?: { start: string; end: string };
    categories?: string[];
    status?: string[];
    searchText?: string;
  };
  includeHeaders: boolean;
  customFilename?: string;
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  duration?: number;
}

// Document management types (DocumentPage)
export type DocumentViewMode = 'list' | 'document';
export type DocumentSection = 'checklist-creation' | 'checking-guide';

export interface DocumentSectionInfo {
  id: DocumentSection;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  status: 'active' | 'inactive' | 'draft';
}

// Items page unified types
export type ItemType = 'all' | 'swimsuit' | 'accessory' | 'skill' | 'bromide';

export interface UnifiedItem {
  id: string;
  name: string;
  type: ItemType;
  category?: string;
  rarity?: string;
  stats?: Record<string, number>;
  skill?: any;
  character?: string;
  description?: string;
  image?: string;
  translations?: Translations;
}

// Card component props (used across pages)
export interface SwimsuitCardProps {
  swimsuit: Swimsuit;
  viewMode?: ViewMode;
  onClick?: () => void;
}

export interface GirlCardProps {
  girl: Girl;
  onClick?: () => void;
}

export interface MemoryCardProps {
  memory: Memory;
  onToggleFavorite: (id: string) => void;
}

export interface SkillCardProps {
  skill: EnhancedSkill;
  onClick?: () => void;
}

export interface AccessoryCardProps {
  accessory: EnhancedAccessory;
  onClick?: () => void;
}

export interface BromideCardProps {
  bromide: EnhancedBromide;
  onClick?: () => void;
}

export interface ShopItemCardProps {
  item: ShopItem;
  onPurchase?: (item: ShopItem) => void;
}

export interface FestivalCardProps {
  festival: Festival;
  onClick?: () => void;
}

export interface GachaCardProps {
  gacha: GachaEvent;
  onClick?: () => void;
}

// Pagination types
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

// Error and loading states
export interface ErrorState {
  message: string;
  code?: string;
  details?: any;
}

export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
  timestamp: string;
}

// Search and filter state types
export interface SearchState {
  query: string;
  filters: Record<string, any>;
  sortBy: string;
  sortDirection: SortDirection;
  currentPage: number;
  itemsPerPage: number;
}

export interface FilterState {
  search: string;
  categories: string[];
  tags: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  customFilters: Record<string, any>;
}

// Theme and styling types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

export interface ComponentTheme {
  colors: ThemeColors;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}

// Re-export utility types from services
export * from '../services/utils';

// Default document categories for reference
export const documentCategoriesData: DocumentCategory[] = [
  { 
    id: 'checklist-creation', 
    name: 'Checklist Creation', 
    description: 'Guides for creating effective checklists',
    color: 'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10'
  },
  { 
    id: 'checking-guide', 
    name: 'Checking Guide', 
    description: 'Step-by-step verification procedures',
    color: 'text-accent-purple border-accent-purple/30 bg-accent-purple/10'
  },
  { 
    id: 'general', 
    name: 'General', 
    description: 'General documentation',
    color: 'text-accent-pink border-accent-pink/30 bg-accent-pink/10'
  },
  { 
    id: 'tutorial', 
    name: 'Tutorial', 
    description: 'Tutorial guides',
    color: 'text-accent-gold border-accent-gold/30 bg-accent-gold/10'
  },
  { 
    id: 'reference', 
    name: 'Reference', 
    description: 'Reference materials',
    color: 'text-green-400 border-green-400/30 bg-green-400/10'
  }
]; 