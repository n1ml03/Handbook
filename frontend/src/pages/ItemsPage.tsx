import { useState, useMemo, useEffect } from 'react';
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
import { cn } from '@/services/utils';
import { Container, Section, Grid, StatusBadge } from '@/components/ui/spacing';
import UnifiedFilter, { FilterField, SortOption as UnifiedSortOption } from '@/components/features/UnifiedFilter';
import { 
  swimsuitsApi,
  accessoriesApi,
  skillsApi,
  bromidesApi
} from '@/services/api';
import { 
  type Swimsuit,
  type Accessory,
  type Skill,
  type Bromide,
  type ItemType,
  type SortDirection,
  type Language,
  type UnifiedItem
} from '@/types';
import React from 'react';

export default function ItemsPage() {
  // State management
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({
    search: '',
    type: 'all',
    rarity: '',
    character: ''
  });

  // Data state
  const [swimsuits, setSwimsuits] = useState<Swimsuit[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [bromides, setBromides] = useState<Bromide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [swimsuitsRes, accessoriesRes, skillsRes, bromidesRes] = await Promise.all([
          swimsuitsApi.getSwimsuits({ limit: 1000 }),
          accessoriesApi.getAccessories({ limit: 1000 }),
          skillsApi.getSkills({ limit: 1000 }),
          bromidesApi.getBromides({ limit: 1000 })
        ]);

        setSwimsuits(swimsuitsRes.data);
        setAccessories(accessoriesRes.data);
        setSkills(skillsRes.data);
        setBromides(bromidesRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load items data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Mock translations for demonstration
  const getItemTranslations = (item: any): any => {
    return {
      EN: { name: item.name, description: item.description || '' },
      CN: { name: `${item.name}`, description: `${item.description || ''}` },
      TW: { name: `${item.name}`, description: `${item.description || ''}` },
      KO: { name: `${item.name}`, description: `${item.description || ''}` },
      JP: { name: `${item.name}`, description: `${item.description || ''}` }
    };
  };

  // Unified items data
  const unifiedItems: UnifiedItem[] = useMemo(() => {
    const items: UnifiedItem[] = [];

    // Add swimsuits
    swimsuits.forEach((swimsuit: Swimsuit) => {
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
    accessories.forEach((accessory: Accessory) => {
      // Check if this is an enhanced accessory with stats
      const enhancedAccessory = accessory as any;
      const accessoryStats = enhancedAccessory.stats ? {
        pow: enhancedAccessory.stats.pow || 0,
        tec: enhancedAccessory.stats.tec || 0,
        stm: enhancedAccessory.stats.stm || 0,
        apl: enhancedAccessory.stats.apl || 0
      } : undefined;

      items.push({
        id: `accessory-${accessory.id}`,
        name: accessory.name,
        type: 'accessory' as ItemType,
        category: accessory.type,
        rarity: accessory.rarity,
        stats: accessoryStats,
        description: accessory.description,
        image: `/images/accessories/${accessory.id}.jpg`,
        translations: getItemTranslations(accessory)
      });
    });

    // Add skills
    skills.forEach((skill: Skill) => {
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
    bromides.forEach((bromide: Bromide) => {
      items.push({
        id: `bromide-${bromide.id}`,
        name: bromide.name,
        type: 'bromide' as ItemType,
        rarity: bromide.rarity,
        character: bromide.character,
        description: bromide.description,
        image: `/images/bromides/${bromide.id}.jpg`,
        translations: getItemTranslations(bromide)
      });
    });

    return items;
  }, [swimsuits, accessories, skills, bromides]);

  // Filtering and sorting
  const filteredAndSortedItems = useMemo(() => {
    const filtered = unifiedItems.filter(item => {
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
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-muted/60 to-muted/40 shrink-0 border-2 border-border/20 flex items-center justify-center group-hover:border-accent-cyan/20 transition-all duration-200">
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
              <Badge variant="outline" className={cn('text-xs mb-3 shadow-xs', getTypeColor(item.type))}>
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
                        <span className="text-sm shrink-0">{info.flag}</span>
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

  // Loading state
  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan"></div>
          <span className="ml-4 text-muted-foreground">Loading items...</span>
        </div>
      </Container>
    );
  }

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
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full text-center py-16"
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-accent-cyan/20"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Package className="w-12 h-12 text-accent-cyan/60" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-300 mb-3">No items found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any items matching your current filters. Try adjusting your search criteria.
            </p>
            <motion.button
              onClick={clearFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-accent-pink to-accent-purple hover:from-accent-pink/90 hover:to-accent-purple/90 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg"
            >
              Clear All Filters
            </motion.button>
          </motion.div>
        ) : (
          filteredAndSortedItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))
        )}
      </Grid>
    </Container>
  );
} 