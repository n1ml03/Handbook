import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Gem,
  Shirt,
  Image,
  Zap,
  User,
  Package,
  Star,
  Tag,
  Search
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Container, Section, Grid, StatusBadge } from '@/components/ui/spacing';
import UnifiedFilter, { FilterField, SortOption as UnifiedSortOption } from '@/components/UnifiedFilter';
import {
  swimsuitsData,
  accessoriesData,
  skillsData,
  bromidesData} from '@/data';
import React from 'react';

type ItemType = 'all' | 'swimsuit' | 'accessory' | 'skill' | 'bromide';

type SortDirection = 'asc' | 'desc';

type Language = 'EN' | 'CN' | 'TW' | 'KO' | 'JP';

interface UnifiedItem {
  id: string;
  name: string;
  type: ItemType;
  category?: string;
  rarity?: string;
  stats?: { [key: string]: number };
  skill?: any;
  character?: string;
  description?: string;
  image?: string;
  translations?: {
    [key in Language]?: {
      name: string;
      description?: string;
    };
  };
}

export default function ItemsPage() {
  // State management
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('EN');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({
    search: '',
    type: 'all',
    rarity: '',
    character: ''
  });

  // Mock translations for demonstration
  const getItemTranslations = (item: any): any => {
    return {
      EN: { name: item.name, description: item.description || '' },
      CN: { name: `中文_${item.name}`, description: `中文_${item.description || ''}` },
      TW: { name: `繁體_${item.name}`, description: `繁體_${item.description || ''}` },
      KO: { name: `한국_${item.name}`, description: `한국_${item.description || ''}` },
      JP: { name: `日本_${item.name}`, description: `日本_${item.description || ''}` }
    };
  };

  // Unified items data
  const unifiedItems: UnifiedItem[] = useMemo(() => {
    const items: UnifiedItem[] = [];

    // Add swimsuits
    swimsuitsData.forEach(swimsuit => {
      items.push({
        id: `swimsuit-${swimsuit.id}`,
        name: swimsuit.name,
        type: 'swimsuit' as ItemType,
        rarity: swimsuit.rarity,
        stats: swimsuit.stats,
        character: swimsuit.character,
        image: `/images/swimsuits/${swimsuit.id}.jpg`,
        translations: getItemTranslations(swimsuit)
      });
    });

    // Add accessories
    accessoriesData.forEach(accessory => {
      items.push({
        id: `accessory-${accessory.id}`,
        name: accessory.name,
        type: 'accessory' as ItemType,
        category: accessory.type,
        stats: accessory.stats,
        skill: accessory.skill,
        image: `/images/accessories/${accessory.id}.jpg`,
        translations: getItemTranslations(accessory)
      });
    });

    // Add skills
    skillsData.forEach(skill => {
      items.push({
        id: `skill-${skill.id}`,
        name: skill.name,
        type: 'skill' as ItemType,
        category: skill.type,
        description: skill.description,
        image: `/images/skills/${skill.id}.jpg`,
        translations: getItemTranslations(skill)
      });
    });

    // Add bromides
    bromidesData.forEach(bromide => {
      items.push({
        id: `bromide-${bromide.id}`,
        name: bromide.name,
        type: 'bromide' as ItemType,
        rarity: bromide.rarity,
        image: `/images/bromides/${bromide.id}.jpg`,
        translations: getItemTranslations(bromide)
      });
    });

    return items;
  }, []);

  // Filtering and sorting
  const filteredAndSortedItems = useMemo(() => {
    let filtered = unifiedItems.filter(item => {
      // Type filter
      const typeMatch = filterValues.type === 'all' || item.type === filterValues.type;

      // Text search (multi-language) - Search across ALL languages
      const searchText = (filterValues.search || '').toLowerCase();
      
      if (!searchText) {
        var nameMatch = true;
      } else {
        // Search in original name and description
        const originalNameMatch = item.name.toLowerCase().includes(searchText);
        const originalDescMatch = item.description?.toLowerCase().includes(searchText) || false;
        
        // Search across ALL language translations
        const translationMatches = Object.values(item.translations || {}).some(translation => {
          const nameMatch = translation?.name?.toLowerCase().includes(searchText) || false;
          const descMatch = translation?.description?.toLowerCase().includes(searchText) || false;
          return nameMatch || descMatch;
        });
        
        var nameMatch = originalNameMatch || originalDescMatch || translationMatches;
      }

      // Rarity filter
      const rarityMatch = !filterValues.rarity || item.rarity === filterValues.rarity;

      // Character filter
      const characterMatch = !filterValues.character || item.character === filterValues.character;

      return typeMatch && nameMatch && rarityMatch && characterMatch;
    });

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          const aName = a.translations?.['EN']?.name || a.name;
          const bName = b.translations?.['EN']?.name || b.name;
          comparison = aName.localeCompare(bName);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'stats':
          const aTotal = a.stats ? Object.values(a.stats).reduce((sum, val) => sum + val, 0) : 0;
          const bTotal = b.stats ? Object.values(b.stats).reduce((sum, val) => sum + val, 0) : 0;
          comparison = aTotal - bTotal;
          break;
        case 'rarity':
          const rarityOrder = { 'SSR': 3, 'SR': 2, 'R': 1, '': 0 };
          comparison = (rarityOrder[a.rarity as keyof typeof rarityOrder] || 0) -
                      (rarityOrder[b.rarity as keyof typeof rarityOrder] || 0);
          break;
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [unifiedItems, filterValues, sortBy, sortDirection]);

  // Get unique values for filters
  const uniqueRarities = useMemo(() =>
    [...new Set(unifiedItems.map(item => item.rarity).filter(Boolean))], [unifiedItems]);
  const uniqueCharacters = useMemo(() =>
    [...new Set(unifiedItems.map(item => item.character).filter(Boolean))], [unifiedItems]);

  // Create filter configuration
  const filterFields: FilterField[] = useMemo(() => [
    {
      key: 'search',
      label: 'Search',
      type: 'text',
      placeholder: 'Search items in all languages...',
      icon: <Search className="w-3 h-3 mr-1" />,
    },
    {
      key: 'type',
      label: 'Item Type',
      type: 'select',
      placeholder: 'All Types',
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'swimsuit', label: 'Swimsuits' },
        { value: 'accessory', label: 'Accessories' },
        { value: 'skill', label: 'Skills' },
        { value: 'bromide', label: 'Bromides' }
      ],
      icon: <Tag className="w-3 h-3 mr-1" />,
    },
    {
      key: 'rarity',
      label: 'Rarity',
      type: 'select',
      placeholder: 'All Rarities',
      options: uniqueRarities.map(r => ({ value: r!, label: r! })),
      icon: <Star className="w-3 h-3 mr-1" />,
    },
    {
      key: 'character',
      label: 'Character',
      type: 'select',
      placeholder: 'All Characters',
      options: uniqueCharacters.map(c => ({ value: c!, label: c! })),
      icon: <User className="w-3 h-3 mr-1" />,
    }
  ], [uniqueRarities, uniqueCharacters]);

  // Sort options
  const sortOptions: UnifiedSortOption[] = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'rarity', label: 'Rarity' },
    { key: 'stats', label: 'Stats' }
  ];

  // Helper functions
  const getTypeIcon = (type: ItemType) => {
    switch (type) {
      case 'swimsuit': return <Shirt className="w-4 h-4" />;
      case 'accessory': return <Gem className="w-4 h-4" />;
      case 'skill': return <Zap className="w-4 h-4" />;
      case 'bromide': return <Image className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: ItemType) => {
    switch (type) {
      case 'swimsuit': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'accessory': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'skill': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'bromide': return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'SSR': return 'text-yellow-400 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/30';
      case 'SR': return 'text-purple-400 bg-gradient-to-r from-purple-400/20 to-pink-400/20 border-purple-400/30';
      case 'R': return 'text-blue-400 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 border-blue-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  // Filter and sort handlers
  const handleFilterChange = (key: string, value: any) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilterValues({
      search: '',
      type: 'all',
      rarity: '',
      character: ''
    });
    setSortBy('name');
    setSortDirection('asc');
  };

  const handleSortChange = (newSortBy: string, direction: SortDirection) => {
    setSortBy(newSortBy);
    setSortDirection(direction);
  };

  // Item card component
  const ItemCard = React.memo(function ItemCard({ item }: { item: UnifiedItem }) {
    const translation = item.translations?.['EN'];
    const displayName = translation?.name || item.name;
    const displayDescription = translation?.description || item.description;

    // Language flag emojis with names
    const languageInfo = {
      EN: { flag: '🇺🇸', name: 'EN' },
      CN: { flag: '🇨🇳', name: 'CN' },
      TW: { flag: '🇹🇼', name: 'TW' },
      KO: { flag: '🇰🇷', name: 'KO' },
      JP: { flag: '🇯🇵', name: 'JP' }
    };

    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        className="relative bg-card/80 backdrop-blur-sm border border-border/30 rounded-xl p-6 mt-2 overflow-hidden group cursor-pointer"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-pink/5 via-accent-cyan/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-accent-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          {/* Header Section */}
          <div className="flex items-start gap-4 mb-6">
            {/* Enhanced Item Icon */}
            <div className="relative">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-muted/60 to-muted/40 flex-shrink-0 border-2 border-border/20 flex items-center justify-center group-hover:border-accent-cyan/20 transition-all duration-200">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={cn(
                    'w-full h-full flex items-center justify-center text-muted-foreground',
                    item.image ? 'hidden' : 'flex'
                  )}
                >
                  {getTypeIcon(item.type)}
                </div>
              </div>
              
              {/* Rarity badge - positioned as overlay */}
              {item.rarity && (
                <div className="absolute -top-2 -right-2">
                  <Badge className={cn('text-xs font-bold shadow-lg', getRarityColor(item.rarity))}>
                    <Star className="w-3 h-3 mr-1" />
                    {item.rarity}
                  </Badge>
                </div>
              )}
            </div>

            {/* Item Type Badge */}
            <div className="flex-1 min-w-0">
              <Badge variant="outline" className={cn('text-xs mb-3 shadow-sm', getTypeColor(item.type))}>
                {getTypeIcon(item.type)}
                <span className="ml-1 capitalize font-medium">{item.type}</span>
              </Badge>
            </div>
          </div>

          {/* Name Section - Enhanced Visual */}
          <div className="mb-6">
            {/* Primary Name with modern styling */}
            <div className="mb-4 p-4 bg-gradient-to-r from-accent-cyan/5 via-accent-cyan/10 to-transparent rounded-lg border border-accent-cyan/10 group-hover:border-accent-cyan/15 transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-accent-cyan rounded-full"></div>
                <span className="text-xs font-medium text-accent-cyan/80 uppercase tracking-wider">
                  Primary (EN)
                </span>
              </div>
              <h3 className="font-bold text-foreground text-lg leading-tight">
                {displayName}
              </h3>
            </div>
            
            {/* All Language Translations - Enhanced Cards */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Other Languages
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(languageInfo).map(([lang, info]) => {
                  const langTranslation = item.translations?.[lang as Language];
                  const langName = langTranslation?.name || item.name;
                  
                  // Skip if it's the same as the primary name to avoid duplication
                  if (lang === 'EN') return null;
                  
                  return (
                    <div 
                      key={lang} 
                      className="flex items-center gap-3 p-3 bg-card/40 rounded-lg border border-border/20 hover:bg-card/50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm flex-shrink-0">{info.flag}</span>
                        <span className="text-xs font-medium text-muted-foreground/60 bg-muted/30 px-2 py-1 rounded-md">
                          {info.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground/90 flex-1 min-w-0 truncate">
                        {langName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Character & Description */}
          <div className="space-y-3 mb-6">
            {item.character && (
              <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg border border-border/10">
                <User className="w-4 h-4 text-accent-cyan" />
                <span className="text-sm font-medium text-foreground">{item.character}</span>
              </div>
            )}

            {displayDescription && (
              <div className="p-3 bg-muted/10 rounded-lg border border-border/10">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {displayDescription}
                </p>
              </div>
            )}
          </div>

          {/* Stats Section - Enhanced */}
          {item.stats && (
            <div className="p-4 bg-gradient-to-br from-accent-cyan/5 to-transparent rounded-lg border border-accent-cyan/10">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-accent-cyan" />
                <span className="text-sm font-semibold text-foreground">Stats</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(item.stats).slice(0, 4).map(([stat, value]) => (
                  <div key={stat} className="flex justify-between items-center p-2 bg-card/40 rounded-md border border-border/10">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat}</span>
                    <span className="font-bold text-accent-cyan text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  });

  return (
    <Container>
      {/* Header */}
      <Section
        title="Items Collection"
        description={`Browse and search through ${unifiedItems.length} items with multi-language support`}
        action={
          <StatusBadge status="info">
            {filteredAndSortedItems.length} found
          </StatusBadge>
        }
      />

      {/* Search and Filter Controls */}
      <UnifiedFilter
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filterFields={filterFields}
        sortOptions={sortOptions}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        resultCount={filteredAndSortedItems.length}
        itemLabel="items"
        accentColor="accent-pink"
        secondaryColor="accent-purple"
        blackTheme={true}
        headerIcon={<Package className="w-4 h-4" />}
      />

      {/* Items Grid */}
      <Grid cols={3} gap="md" className="pt-2">
        {filteredAndSortedItems.length === 0 ? (
          <div className="col-span-full doax-card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">No items found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search filters or search terms</p>
            <button
              onClick={clearFilters}
              className="bg-accent-cyan/10 text-accent-cyan px-4 py-2 rounded-lg font-medium hover:bg-accent-cyan/20 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredAndSortedItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))
        )}
      </Grid>
    </Container>
  );
} 