import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  Search,
  ShoppingCart,
  Coins,
  Tag,
  Gem,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import UnifiedFilter, { FilterField, SortOption, SortDirection } from '@/components/features/UnifiedFilter';
import { type ShopItem, type ShopItemCardProps, type ShopItemType, type Currency, type ShopItemRarity } from '@/types';
import { shopItemsApi } from '@/services/api';



function ShopItemCard({ item }: ShopItemCardProps) {
  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'coins': return <Coins className="w-4 h-4" />;
      case 'gems': return <Gem className="w-4 h-4" />;
      case 'tickets': return <Tag className="w-4 h-4" />;
      default: return <Coins className="w-4 h-4" />;
    }
  };

  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case 'coins': return 'text-yellow-400';
      case 'gems': return 'text-purple-400';
      case 'tickets': return 'text-green-400';
      default: return 'text-yellow-400';
    }
  };

  const finalPrice = item.discount ? Math.floor(item.price * (1 - item.discount / 100)) : item.price;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative bg-dark-card/80 backdrop-blur-sm border border-dark-border/50 rounded-2xl p-8 overflow-hidden group"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-pink/5 via-accent-cyan/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-accent-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-white text-lg truncate">{item.name}</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 rounded-xl flex items-center justify-center border border-accent-cyan/20">
              <span className="text-2xl">{item.image}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Type and Category */}
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="w-4 h-4 text-accent-cyan" />
          <span className="text-xs text-gray-400">
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.category}
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 rounded-xl p-3 border border-accent-cyan/20">
            <p className="text-xs font-bold text-accent-cyan mb-2">Price</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={getCurrencyColor(item.currency)}>
                  {getCurrencyIcon(item.currency)}
                </div>
                <div className="flex items-center gap-2">
                  {item.discount && (
                    <span className="text-xs text-gray-400 line-through">
                      {item.price}
                    </span>
                  )}
                  <span className={`text-lg font-bold ${getCurrencyColor(item.currency)}`}>
                    {finalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features/Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {item.featured && (
              <span className="text-xs bg-yellow-500/20 px-2 py-1 rounded-sm border border-yellow-500/30 text-yellow-400">
                ⭐Featured
              </span>
            )}
            {item.isNew && (
              <span className="text-xs bg-green-500/20 px-2 py-1 rounded-sm border border-green-500/30 text-green-400">
                🆕New
              </span>
            )}
            {item.discount && (
              <span className="text-xs bg-red-500/20 px-2 py-1 rounded-sm border border-red-500/30 text-red-400">
                🔥-{item.discount}%
              </span>
            )}
            {item.limitedTime && (
              <span className="text-xs bg-orange-500/20 px-2 py-1 rounded-sm border border-orange-500/30 text-orange-400">
                ⏰Limited
              </span>
            )}
            <span className="text-xs bg-accent-pink/20 px-2 py-1 rounded-sm border border-accent-pink/30 text-accent-pink">
              #{item.rarity}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [activeSection, setActiveSection] = useState<'owner' | 'event' | 'venus' | 'vip'>('owner');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterValues, setFilterValues] = useState({
    search: '',
    type: '',
    rarity: '',
    currency: '',
    inStock: false,
    isNew: false,
    hasDiscount: false,
    featured: false,
    priceMin: '',
    priceMax: ''
  });

  // API state
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  const itemsPerPage = 8;

  // Load shop items from API
  const loadShopItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sort: sortBy,
        order: sortDirection,
        section: activeSection,
        ...(filterValues.search && { search: filterValues.search }),
        ...(filterValues.type && { type: filterValues.type as ShopItemType }),
        ...(filterValues.rarity && { rarity: filterValues.rarity as ShopItemRarity }),
        ...(filterValues.currency && { currency: filterValues.currency as Currency }),
        ...(filterValues.inStock && { inStock: filterValues.inStock }),
        ...(filterValues.isNew && { isNew: filterValues.isNew }),
        ...(filterValues.hasDiscount && { hasDiscount: filterValues.hasDiscount }),
        ...(filterValues.featured && { featured: filterValues.featured }),
        ...(filterValues.priceMin && { priceMin: parseInt(filterValues.priceMin) }),
        ...(filterValues.priceMax && { priceMax: parseInt(filterValues.priceMax) }),
      };

      const response = await shopItemsApi.getShopItems(params);
      setShopItems(response.data || []);
      setTotalItems(response.pagination?.total || 0);

      // Extract available types for filter options
      if (!availableTypes.length) {
        const types = [...new Set(response.data?.map((item: ShopItem) => item.type) || [])];
        setAvailableTypes(types);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load shop items');
      setShopItems([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  // Load data when dependencies change
  useEffect(() => {
    loadShopItems();
  }, [currentPage, activeSection, sortBy, sortDirection, filterValues]);

  // Reset page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [activeSection, filterValues]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Filter fields configuration
  const filterFields: FilterField[] = [
    {
      key: 'search',
      label: 'Search',
      type: 'text',
      placeholder: `Search in ${activeSection} collection...`,
      icon: <Search className="w-3 h-3 mr-1" />,
    },
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      placeholder: 'All Types',
      options: availableTypes.map(type => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1)
      })),
      icon: <ShoppingCart className="w-3 h-3 mr-1" />,
    },
    {
      key: 'rarity',
      label: 'Rarity',
      type: 'select',
      placeholder: 'All Rarities',
      options: ['common', 'rare', 'epic', 'legendary'].map(rarity => ({
        value: rarity,
        label: rarity.charAt(0).toUpperCase() + rarity.slice(1)
      })),
      icon: <Gem className="w-3 h-3 mr-1" />,
    },
    {
      key: 'currency',
      label: 'Currency',
      type: 'select',
      placeholder: 'All Currencies',
      options: ['coins', 'gems', 'tickets'].map(currency => ({
        value: currency,
        label: currency.charAt(0).toUpperCase() + currency.slice(1)
      })),
      icon: <Coins className="w-3 h-3 mr-1" />,
    },
    {
      key: 'priceMin',
      label: 'Min Price',
      type: 'number',
      placeholder: '0',
      min: 0,
      icon: <Coins className="w-3 h-3 mr-1" />,
    },
    {
      key: 'priceMax',
      label: 'Max Price',
      type: 'number',
      placeholder: '999999',
      min: 0,
      icon: <Coins className="w-3 h-3 mr-1" />,
    },
    {
      key: 'inStock',
      label: 'In Stock Only',
      type: 'checkbox',
      icon: <Tag className="w-3 h-3 mr-1" />,
    },
    {
      key: 'isNew',
      label: 'New Items',
      type: 'checkbox',
      icon: <Tag className="w-3 h-3 mr-1" />,
    },
    {
      key: 'hasDiscount',
      label: 'On Sale',
      type: 'checkbox',
      icon: <Tag className="w-3 h-3 mr-1" />,
    },
    {
      key: 'featured',
      label: 'Featured',
      type: 'checkbox',
      icon: <Tag className="w-3 h-3 mr-1" />,
    }
  ];

  // Sort options
  const sortOptions: SortOption[] = [
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price' },
    { key: 'rarity', label: 'Rarity' },
    { key: 'type', label: 'Type' }
  ];



  const handleFilterChange = (key: string, value: any) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (newSortBy: string, newDirection: SortDirection) => {
    setSortBy(newSortBy);
    setSortDirection(newDirection);
  };

  const clearFilters = () => {
    setFilterValues({
      search: '',
      type: '',
      rarity: '',
      currency: '',
      inStock: false,
      isNew: false,
      hasDiscount: false,
      featured: false,
      priceMin: '',
      priceMax: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-pink via-accent-cyan to-accent-purple bg-clip-text text-transparent">
            Shop
          </h1>
          <p className="text-gray-400 mt-1">
            Discover exclusive collections for every style
          </p>
        </motion.div>

        {/* Section Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="doax-card p-2">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'owner', label: 'Owner'},
                { key: 'event', label: 'Event'},
                { key: 'venus', label: 'Venus'},
                { key: 'vip', label: 'VIP' }
              ].map((section) => (
                <button
                  key={section.key}
                  onClick={() => {
                    setActiveSection(section.key as any);
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium min-w-0 ${
                    activeSection === section.key
                      ? 'bg-gradient-to-r from-accent-pink to-accent-purple text-white'
                      : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>{section.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

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
          resultCount={totalItems}
          itemLabel="items"
          accentColor="accent-pink"
          secondaryColor="accent-purple"
          blackTheme={true}
          headerIcon={<ShoppingCart className="w-4 h-4" />}
        />

        {/* Shop Items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">
              {activeSection === 'owner' && 'Owner Collection'}
              {activeSection === 'event' && 'Event Collection'}
              {activeSection === 'venus' && 'Venus Collection'}
              {activeSection === 'vip' && 'VIP Collection'}
            </h3>
            <div className="text-sm text-muted-foreground">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </div>
              ) : (
                `${totalItems} item${totalItems !== 1 ? 's' : ''}`
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {Array.from({ length: itemsPerPage }, (_, index) => (
                <div key={index} className="bg-dark-card/80 backdrop-blur-sm border border-dark-border/50 rounded-2xl p-8 animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="h-6 bg-gray-700 rounded mb-2 w-3/4"></div>
                    </div>
                    <div className="w-16 h-16 bg-gray-700 rounded-xl"></div>
                  </div>
                  <div className="h-4 bg-gray-700 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-gray-700 rounded mb-4 w-2/3"></div>
                  <div className="h-20 bg-gray-700 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-700 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Shop Items Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {shopItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <ShopItemCard item={item} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? 'bg-gradient-to-r from-accent-pink to-accent-purple' : ''}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && shopItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <motion.div
              className="w-32 h-32 bg-gradient-to-br from-accent-pink/30 to-accent-purple/30 rounded-3xl flex items-center justify-center mx-auto mb-8 border-2 border-accent-cyan/30 shadow-lg"
              animate={{ scale: [1, 1.08, 1], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <ShoppingCart className="w-16 h-16 text-accent-cyan/70" />
            </motion.div>
            <h3 className="text-2xl font-extrabold text-white mb-2 drop-shadow-lg">
              No items found in the {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Collection
            </h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto text-base">
              We couldn't find any shop items matching your current filters in the <span className="text-accent-cyan font-semibold">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</span> section.<br />
              Try adjusting your search criteria, clearing filters, or browsing a different section.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={clearFilters}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-accent-pink to-accent-purple hover:from-accent-pink/90 hover:to-accent-purple/90 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg"
              >
                Clear All Filters
              </motion.button>
              <button
                onClick={() => setActiveSection('owner')}
                className="px-6 py-3 rounded-xl bg-muted/70 hover:bg-muted/90 text-muted-foreground font-medium border border-accent-cyan/20 transition-colors"
              >
                Browse Owner Collection
              </button>
              <button
                onClick={() => setActiveSection('event')}
                className="px-6 py-3 rounded-xl bg-muted/70 hover:bg-muted/90 text-muted-foreground font-medium border border-accent-cyan/20 transition-colors"
              >
                Browse Event Collection
              </button>
              <button
                onClick={() => setActiveSection('venus')}
                className="px-6 py-3 rounded-xl bg-muted/70 hover:bg-muted/90 text-muted-foreground font-medium border border-accent-cyan/20 transition-colors"
              >
                Browse Venus Collection
              </button>
              <button
                onClick={() => setActiveSection('vip')}
                className="px-6 py-3 rounded-xl bg-muted/70 hover:bg-muted/90 text-muted-foreground font-medium border border-accent-cyan/20 transition-colors"
              >
                Browse VIP Collection
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 