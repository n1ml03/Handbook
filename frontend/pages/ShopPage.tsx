import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  Search,
  ShoppingCart,
  Coins,
  Tag,
  Gem
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import UnifiedFilter, { FilterField, SortOption, SortDirection } from '@/components/UnifiedFilter';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'swimsuit' | 'accessory' | 'decoration' | 'currency' | 'booster';
  category: string;
  section: 'owner' | 'event' | 'venus' | 'vip';
  price: number;
  currency: 'coins' | 'gems' | 'tickets';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
  inStock: boolean;
  isNew: boolean;
  discount?: number;
  limitedTime?: boolean;
  featured?: boolean;
}

// Mock data for shop items
const mockShopItems: ShopItem[] = [
  // Owner Section Items
  {
    id: '1',
    name: 'Royal Owner Crown',
    description: 'A majestic crown that shows your royal status in the game.',
    type: 'accessory',
    category: 'Royal',
    section: 'owner',
    price: 5000,
    currency: 'gems',
    rarity: 'legendary',
    image: '👑',
    inStock: true,
    isNew: true,
    featured: true
  },
  {
    id: '2',
    name: 'Owner Villa Decoration',
    description: 'Luxurious villa decoration for your private space.',
    type: 'decoration',
    category: 'Villa',
    section: 'owner',
    price: 3000,
    currency: 'coins',
    rarity: 'epic',
    image: '🏛️',
    inStock: true,
    isNew: false
  },
  {
    id: '3',
    name: 'Executive Suit',
    description: 'Professional attire perfect for business meetings.',
    type: 'swimsuit',
    category: 'Formal',
    section: 'owner',
    price: 2500,
    currency: 'gems',
    rarity: 'rare',
    image: '👔',
    inStock: true,
    isNew: true,
    discount: 10
  },

  // Event Section Items
  {
    id: '4',
    name: 'Festival Kimono',
    description: 'Beautiful traditional kimono for special events.',
    type: 'swimsuit',
    category: 'Traditional',
    section: 'event',
    price: 1800,
    currency: 'tickets',
    rarity: 'epic',
    image: '👘',
    inStock: true,
    isNew: true,
    limitedTime: true
  },
  {
    id: '5',
    name: 'Party Mask',
    description: 'Mysterious mask for masquerade parties.',
    type: 'accessory',
    category: 'Party',
    section: 'event',
    price: 800,
    currency: 'coins',
    rarity: 'rare',
    image: '🎭',
    inStock: true,
    isNew: false,
    featured: true
  },
  {
    id: '6',
    name: 'Event Stage',
    description: 'A spectacular stage for hosting events.',
    type: 'decoration',
    category: 'Stage',
    section: 'event',
    price: 4000,
    currency: 'gems',
    rarity: 'legendary',
    image: '🎪',
    inStock: true,
    isNew: true,
    discount: 25
  },

  // Venus Section Items
  {
    id: '7',
    name: 'Venus Love Dress',
    description: 'Enchanting dress inspired by the goddess of love.',
    type: 'swimsuit',
    category: 'Goddess',
    section: 'venus',
    price: 3500,
    currency: 'gems',
    rarity: 'legendary',
    image: '💃',
    inStock: true,
    isNew: true,
    featured: true
  },
  {
    id: '8',
    name: 'Cupid Wings',
    description: 'Beautiful angel wings that symbolize love.',
    type: 'accessory',
    category: 'Wings',
    section: 'venus',
    price: 2000,
    currency: 'gems',
    rarity: 'epic',
    image: '🪶',
    inStock: true,
    isNew: false
  },
  {
    id: '9',
    name: 'Love Garden',
    description: 'A romantic garden filled with roses and hearts.',
    type: 'decoration',
    category: 'Garden',
    section: 'venus',
    price: 2800,
    currency: 'coins',
    rarity: 'rare',
    image: '🌹',
    inStock: true,
    isNew: true,
    discount: 15
  },

  // VIP Section Items
  {
    id: '10',
    name: 'VIP Diamond Suit',
    description: 'Exclusive diamond-encrusted outfit for VIP members.',
    type: 'swimsuit',
    category: 'Exclusive',
    section: 'vip',
    price: 10000,
    currency: 'gems',
    rarity: 'legendary',
    image: '💎',
    inStock: true,
    isNew: true,
    featured: true
  },
  {
    id: '11',
    name: 'Platinum Card',
    description: 'Exclusive VIP access card with special privileges.',
    type: 'accessory',
    category: 'VIP',
    section: 'vip',
    price: 5000,
    currency: 'gems',
    rarity: 'legendary',
    image: '💳',
    inStock: true,
    isNew: false
  },
  {
    id: '12',
    name: 'VIP Lounge',
    description: 'Luxurious private lounge for VIP members only.',
    type: 'decoration',
    category: 'Lounge',
    section: 'vip',
    price: 15000,
    currency: 'gems',
    rarity: 'legendary',
    image: '🛋️',
    inStock: true,
    isNew: true,
    discount: 20
  }
];

interface ShopItemCardProps {
  item: ShopItem;
}

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
              <span className="text-xs bg-yellow-500/20 px-2 py-1 rounded border border-yellow-500/30 text-yellow-400">
                ⭐Featured
              </span>
            )}
            {item.isNew && (
              <span className="text-xs bg-green-500/20 px-2 py-1 rounded border border-green-500/30 text-green-400">
                🆕New
              </span>
            )}
            {item.discount && (
              <span className="text-xs bg-red-500/20 px-2 py-1 rounded border border-red-500/30 text-red-400">
                🔥-{item.discount}%
              </span>
            )}
            {item.limitedTime && (
              <span className="text-xs bg-orange-500/20 px-2 py-1 rounded border border-orange-500/30 text-orange-400">
                ⏰Limited
              </span>
            )}
            <span className="text-xs bg-accent-pink/20 px-2 py-1 rounded border border-accent-pink/30 text-accent-pink">
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

  const itemsPerPage = 8;

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
      options: [...new Set(mockShopItems.map(item => item.type))].sort().map(type => ({
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

  const filteredAndSortedItems = useMemo(() => {
    let filtered = mockShopItems.filter(item => {
      // Filter by active section first
      if (item.section !== activeSection) return false;
      
      if (filterValues.search && !item.name.toLowerCase().includes(filterValues.search.toLowerCase()) && 
          !item.description.toLowerCase().includes(filterValues.search.toLowerCase())) return false;
      
      if (filterValues.type && item.type !== filterValues.type) return false;
      if (filterValues.rarity && item.rarity !== filterValues.rarity) return false;
      if (filterValues.currency && item.currency !== filterValues.currency) return false;
      if (filterValues.inStock && !item.inStock) return false;
      if (filterValues.isNew && !item.isNew) return false;
      if (filterValues.hasDiscount && !item.discount) return false;
      if (filterValues.featured && !item.featured) return false;
      if (filterValues.priceMin && item.price < parseInt(filterValues.priceMin)) return false;
      if (filterValues.priceMax && item.price > parseInt(filterValues.priceMax)) return false;
      
      return true;
    });

    return filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'type':
          aValue = a.type.toLowerCase();
          bValue = b.type.toLowerCase();
          break;
        case 'rarity':
          const rarityOrder = { 'legendary': 4, 'epic': 3, 'rare': 2, 'common': 1 };
          aValue = rarityOrder[a.rarity as keyof typeof rarityOrder] || 0;
          bValue = rarityOrder[b.rarity as keyof typeof rarityOrder] || 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (typeof aValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [mockShopItems, filterValues, sortBy, sortDirection, activeSection]);

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
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
    setCurrentPage(1);
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
                { key: 'owner', label: 'Owner', icon: '👑' },
                { key: 'event', label: 'Event', icon: '🎭' },
                { key: 'venus', label: 'Venus', icon: '💕' },
                { key: 'vip', label: 'VIP', icon: '💎' }
              ].map((section) => (
                <button
                  key={section.key}
                  onClick={() => {
                    setActiveSection(section.key as any);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium min-w-0 ${
                    activeSection === section.key
                      ? 'bg-gradient-to-r from-accent-pink to-accent-purple text-white'
                      : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>{section.icon}</span>
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
          resultCount={filteredAndSortedItems.length}
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
              {activeSection === 'owner' && '👑 Owner Collection'}
              {activeSection === 'event' && '🎭 Event Collection'}
              {activeSection === 'venus' && '💕 Venus Collection'}
              {activeSection === 'vip' && '💎 VIP Collection'}
            </h3>
            <div className="text-sm text-muted-foreground">
              {filteredAndSortedItems.length} item{filteredAndSortedItems.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {paginatedItems.map((item, index) => (
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
        {filteredAndSortedItems.length === 0 && (
          <div className="doax-card p-8 text-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">
              No items match your current filters. Try adjusting your search criteria.
            </p>
            <Button onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 