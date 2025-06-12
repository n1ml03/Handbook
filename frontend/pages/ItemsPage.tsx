import React, { useState, useMemo } from 'react';
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

const ItemsPage: React.FC = () => {
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

      // Text search (multi-language)
      const searchText = (filterValues.search || '').toLowerCase();
      const translation = item.translations?.[selectedLanguage];
      const nameMatch = !searchText ||
        item.name.toLowerCase().includes(searchText) ||
        (translation?.name.toLowerCase().includes(searchText)) ||
        (item.description?.toLowerCase().includes(searchText)) ||
        (translation?.description?.toLowerCase().includes(searchText));

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
          const aName = a.translations?.[selectedLanguage]?.name || a.name;
          const bName = b.translations?.[selectedLanguage]?.name || b.name;
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
  }, [unifiedItems, filterValues, selectedLanguage, sortBy, sortDirection]);

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
      placeholder: `Search items in ${selectedLanguage}...`,
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
  ], [selectedLanguage, uniqueRarities, uniqueCharacters]);

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
  const ItemCard = ({ item }: { item: UnifiedItem }) => {
    const translation = item.translations?.[selectedLanguage];
    const displayName = translation?.name || item.name;
    const displayDescription = translation?.description || item.description;

    return (
      <div className="doax-card hover:border-accent-cyan/50 transition-all duration-200 cursor-pointer group">
        <div className="flex items-start gap-4 mb-4">
          {/* Item Icon */}
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/50 flex-shrink-0 border border-border/30 flex items-center justify-center">
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

          {/* Item Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-accent-cyan transition-colors">
                {displayName}
              </h3>
              {item.rarity && (
                <Badge className={cn('text-xs font-medium flex-shrink-0', getRarityColor(item.rarity))}>
                  <Star className="w-3 h-3 mr-1" />
                  {item.rarity}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className={cn('text-xs', getTypeColor(item.type))}>
                {getTypeIcon(item.type)}
                <span className="ml-1 capitalize">{item.type}</span>
              </Badge>
              {item.character && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>{item.character}</span>
                </div>
              )}
            </div>

            {displayDescription && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {displayDescription}
              </p>
            )}

            {item.stats && (
              <div className="grid grid-cols-2 gap-1 text-xs">
                {Object.entries(item.stats).slice(0, 4).map(([stat, value]) => (
                  <div key={stat} className="flex justify-between">
                    <span className="text-muted-foreground uppercase">{stat}:</span>
                    <span className="font-medium text-accent-cyan">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Container>
      {/* Header */}
      <Section
        title="Items Collection"
        description={`Browse and search through ${unifiedItems.length} items with multi-language support`}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status="info">
              {filteredAndSortedItems.length} found
            </StatusBadge>
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm p-3 rounded-lg border border-border/50">
              <span className="text-sm font-medium text-muted-foreground">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                className="bg-background/80 border border-border/50 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/20 transition-all"
              >
                <option value="EN">🇺🇸 EN</option>
                <option value="CN">🇨🇳 CN</option>
                <option value="TW">🇹🇼 TW</option>
                <option value="KO">🇰🇷 KO</option>
                <option value="JP">🇯🇵 JP</option>
              </select>
            </div>
          </div>
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
        totalCount={unifiedItems.length}
        itemLabel="items"
        accentColor="accent-pink"
        secondaryColor="accent-purple"
        blackTheme={true}
        headerIcon={<Package className="w-4 h-4" />}
      />

      {/* Items Grid */}
      <Grid cols={3} gap="md">
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
};

export default ItemsPage; 