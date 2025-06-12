import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  Search,
  SortAsc,
  Zap,
  Heart,
  User,
  Filter,
  RefreshCw
} from 'lucide-react';
import { charactersData } from '@/data';

type SortDirection = 'asc' | 'desc';
type SortOption = 'name' | 'type' | 'level' | 'pow' | 'tec' | 'stm' | 'apl' | 'total';

interface GirlCardProps {
  girl: any;
  onClick?: () => void;
}

function GirlCard({ girl, onClick }: GirlCardProps) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pow': return 'from-red-400 to-pink-500';
      case 'tec': return 'from-cyan-400 to-blue-500';
      case 'stm': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getStatColor = (stat: string) => {
    switch (stat.toLowerCase()) {
      case 'pow': return 'text-red-400';
      case 'tec': return 'text-cyan-400';
      case 'stm': return 'text-yellow-400';
      case 'apl': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const totalStats = girl.stats.pow + girl.stats.tec + girl.stats.stm + girl.stats.apl;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative bg-dark-card/80 backdrop-blur-sm border border-dark-border/50 rounded-2xl p-6 overflow-hidden group cursor-pointer transition-all duration-300 hover:border-accent-cyan/50"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-pink/5 via-accent-cyan/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-accent-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-white text-lg">{girl.name}</h3>
              <motion.div
                className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getTypeColor(girl.type)} text-white shadow-lg`}
                whileHover={{ scale: 1.1 }}
              >
                {girl.type.toUpperCase()}
              </motion.div>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <span className="flex items-center">
                <Zap className="w-4 h-4 mr-1 text-accent-gold" />
                Level {girl.level}
              </span>
              <span className="flex items-center">
                <Heart className="w-4 h-4 mr-1 text-accent-pink" />
                {girl.birthday}
              </span>
            </div>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 rounded-xl flex items-center justify-center border border-accent-cyan/20">
            <User className="w-8 h-8 text-accent-cyan" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {Object.entries(girl.stats).map(([stat, value]) => (
            <motion.div 
              key={stat} 
              className="flex justify-between items-center p-2 bg-dark-primary/30 rounded-lg border border-dark-border/30"
              whileHover={{ scale: 1.05 }}
            >
              <span className={`uppercase font-bold text-xs ${getStatColor(stat)}`}>
                {stat}
              </span>
              <span className="font-bold text-white">{value as number}</span>
            </motion.div>
          ))}
        </div>

        {/* Equipped Items */}
        <div className="space-y-3">
          {/* Swimsuit */}
          {girl.swimsuit && (
            <div className="bg-dark-primary/50 rounded-xl p-3 border border-dark-border/30">
              <p className="text-xs font-bold text-accent-cyan mb-2 flex items-center">
                <Zap className="w-3 h-3 mr-1" />
                Equipped Swimsuit
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white font-medium truncate">{girl.swimsuit.name}</span>
                <span className={`text-xs font-bold ${
                  girl.swimsuit.rarity === 'SSR' ? 'text-yellow-400' :
                  girl.swimsuit.rarity === 'SR' ? 'text-purple-400' :
                  'text-blue-400'
                }`}>
                  {girl.swimsuit.rarity}
                </span>
              </div>
            </div>
          )}

          {/* Accessories */}
          {girl.accessories.length > 0 && (
            <div className="bg-dark-primary/50 rounded-xl p-3 border border-dark-border/30">
              <p className="text-xs font-bold text-accent-purple mb-2 flex items-center">
                <Zap className="w-3 h-3 mr-1" />
                Accessories ({girl.accessories.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {girl.accessories.slice(0, 3).map((accessory: any) => (
                  <span 
                    key={accessory.id}
                    className="text-xs bg-accent-purple/20 text-accent-purple px-2 py-1 rounded border border-accent-purple/30"
                  >
                    {accessory.type}
                  </span>
                ))}
                {girl.accessories.length > 3 && (
                  <span className="text-xs text-gray-400 px-2 py-1">
                    +{girl.accessories.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ID and Click Indicator */}
        <div className="mt-4 pt-3 border-t border-dark-border/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-mono bg-dark-primary/30 px-2 py-1 rounded">
              {girl.id}
            </span>
            <motion.div
              className="text-xs text-accent-cyan/60 group-hover:text-accent-cyan transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              Click to view details →
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GirlListPage() {
  const navigate = useNavigate();
  const girls = charactersData;
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filter, setFilter] = useState({
    type: '',
    search: '',
    minLevel: '',
    maxLevel: '',
    minPow: '',
    minTec: '',
    minStm: '',
    minApl: '',
    hasSwimsuit: false,
    hasAccessories: false
  });

  const itemsPerPage = 8;

  const filteredAndSortedGirls = useMemo(() => {
    let filtered = girls.filter(girl => {
      if (filter.type && girl.type !== filter.type) return false;
      if (filter.search && !girl.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
      if (filter.minLevel && girl.level < parseInt(filter.minLevel)) return false;
      if (filter.maxLevel && girl.level > parseInt(filter.maxLevel)) return false;
      if (filter.minPow && girl.stats.pow < parseInt(filter.minPow)) return false;
      if (filter.minTec && girl.stats.tec < parseInt(filter.minTec)) return false;
      if (filter.minStm && girl.stats.stm < parseInt(filter.minStm)) return false;
      if (filter.minApl && girl.stats.apl < parseInt(filter.minApl)) return false;
      if (filter.hasSwimsuit && !girl.swimsuit) return false;
      if (filter.hasAccessories && girl.accessories.length === 0) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'type':
          aValue = a.type.toLowerCase();
          bValue = b.type.toLowerCase();
          break;
        case 'level':
          aValue = a.level;
          bValue = b.level;
          break;
        case 'pow':
          aValue = a.stats.pow;
          bValue = b.stats.pow;
          break;
        case 'tec':
          aValue = a.stats.tec;
          bValue = b.stats.tec;
          break;
        case 'stm':
          aValue = a.stats.stm;
          bValue = b.stats.stm;
          break;
        case 'apl':
          aValue = a.stats.apl;
          bValue = b.stats.apl;
          break;
        case 'total':
          aValue = a.stats.pow + a.stats.tec + a.stats.stm + a.stats.apl;
          bValue = b.stats.pow + b.stats.tec + b.stats.stm + b.stats.apl;
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
  }, [girls, filter, sortBy, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedGirls.length / itemsPerPage);
  const paginatedGirls = filteredAndSortedGirls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const types = ['pow', 'tec', 'stm'];

  const handleSortChange = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
  };

  const clearFilters = () => {
    setFilter({
      type: '',
      search: '',
      minLevel: '',
      maxLevel: '',
      minPow: '',
      minTec: '',
      minStm: '',
      minApl: '',
      hasSwimsuit: false,
      hasAccessories: false
    });
    setCurrentPage(1);
  };

  const getStatColor = (statType: string) => {
    switch (statType) {
      case 'pow': return 'text-red-400';
      case 'tec': return 'text-cyan-400';
      case 'stm': return 'text-yellow-400';
      case 'apl': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const SortButton = ({ sortKey, children }: { sortKey: SortOption; children: React.ReactNode }) => (
    <motion.button
      onClick={() => handleSortChange(sortKey)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        sortBy === sortKey 
          ? 'bg-gradient-to-r from-accent-pink to-accent-purple text-white shadow-lg' 
          : 'bg-dark-card/50 border border-dark-border hover:bg-accent-pink/10 text-gray-300 hover:border-accent-pink/30'
      }`}
    >
      <span>{children}</span>
      {sortBy === sortKey && (
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: sortDirection === 'asc' ? 0 : 180 }}
          transition={{ duration: 0.2 }}
        >
          <SortAsc className="w-3 h-3" />
        </motion.div>
      )}
    </motion.button>
  );

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
            Girl Collection
          </h1>
          <p className="text-gray-400 mt-1">
            Showing {filteredAndSortedGirls.length} of {girls.length} girls
          </p>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                className="w-full bg-muted/70 backdrop-blur-sm border border-border/50 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all placeholder-muted-foreground"
                placeholder="Search girls..."
              />
              {filter.search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setFilter(prev => ({ ...prev, search: '' }))}
                  className="absolute right-3 top-3 w-4 h-4 text-muted-foreground hover:text-accent-cyan transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${
                  showFilters 
                    ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white shadow-lg' 
                    : 'bg-muted/70 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent-cyan/20'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
              </motion.button>

              <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-3 rounded-xl border border-border/50">
                <span className="text-accent-cyan font-medium">{filteredAndSortedGirls.length}</span> found
              </div>
            </div>
          </div>
        </motion.div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <div className="doax-card p-6">
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-foreground flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-accent-cyan" />
                    Advanced Filters
                  </h3>
                  <button
                    onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                    className="text-sm text-accent-cyan hover:text-accent-pink transition-colors flex items-center"
                  >
                    {isFilterExpanded ? 'Show Less Stats' : 'Show Stat Filters'}
                    <motion.div
                      animate={{ rotate: isFilterExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-1"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </button>
                </div>

                {/* Quick Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                    <input
                      type="text"
                      value={filter.search}
                      onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full bg-dark-primary/50 border border-dark-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan transition-all"
                      placeholder="Search girls..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                    <select
                      value={filter.type}
                      onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full bg-dark-primary/50 border border-dark-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan transition-all"
                    >
                      <option value="">All Types</option>
                      {types.map(type => (
                        <option key={type} value={type}>{type.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Min Level</label>
                    <input
                      type="number"
                      value={filter.minLevel}
                      onChange={(e) => setFilter(prev => ({ ...prev, minLevel: e.target.value }))}
                      className="w-full bg-dark-primary/50 border border-dark-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan transition-all"
                      placeholder="Min"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Level</label>
                    <input
                      type="number"
                      value={filter.maxLevel}
                      onChange={(e) => setFilter(prev => ({ ...prev, maxLevel: e.target.value }))}
                      className="w-full bg-dark-primary/50 border border-dark-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan transition-all"
                      placeholder="Max"
                      min="1"
                    />
                  </div>
                </div>

                {/* Equipment Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Equipment</label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-3 bg-dark-primary/30 rounded-xl border border-dark-border/50 hover:border-accent-cyan/50 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filter.hasSwimsuit}
                          onChange={(e) => setFilter(prev => ({ ...prev, hasSwimsuit: e.target.checked }))}
                          className="rounded border-dark-border text-accent-pink focus:ring-accent-pink/20"
                        />
                        <span className="text-sm text-gray-300">Has Swimsuit</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 bg-dark-primary/30 rounded-xl border border-dark-border/50 hover:border-accent-cyan/50 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filter.hasAccessories}
                          onChange={(e) => setFilter(prev => ({ ...prev, hasAccessories: e.target.checked }))}
                          className="rounded border-dark-border text-accent-pink focus:ring-accent-pink/20"
                        />
                        <span className="text-sm text-gray-300">Has Accessories</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Extended Filters */}
                <AnimatePresence>
                  {isFilterExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {(['pow', 'tec', 'stm', 'apl'] as const).map((stat) => (
                          <div key={stat}>
                            <label className={`block text-sm font-medium mb-2 flex items-center ${getStatColor(stat)}`}>
                              <Zap className="w-3 h-3 mr-1" />
                              Min {stat.toUpperCase()}
                            </label>
                            <input
                              type="number"
                              value={filter[`min${stat.charAt(0).toUpperCase() + stat.slice(1)}` as keyof typeof filter] as string}
                              onChange={(e) => setFilter(prev => ({ 
                                ...prev, 
                                [`min${stat.charAt(0).toUpperCase() + stat.slice(1)}`]: e.target.value 
                              }))}
                              className="w-full bg-dark-primary/50 border border-dark-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan transition-all"
                              placeholder="0"
                              min="0"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sort Options */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="text-sm text-gray-400 flex items-center mr-2">
                    <SortAsc className="w-4 h-4 mr-1" />
                    Sort by:
                  </span>
                  <SortButton sortKey="name">Name</SortButton>
                  <SortButton sortKey="type">Type</SortButton>
                  <SortButton sortKey="level">Level</SortButton>
                  <SortButton sortKey="total">Total Power</SortButton>
                </div>

                {/* Filter Actions */}
                <div className="flex items-center justify-between">
                  <motion.button
                    onClick={clearFilters}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-accent-pink/20 to-accent-purple/20 hover:from-accent-pink/30 hover:to-accent-purple/30 text-accent-pink border border-accent-pink/30 rounded-xl px-6 py-2 text-sm font-medium transition-all"
                  >
                    Clear All Filters
                  </motion.button>
                  <div className="text-sm text-gray-500">
                    <span className="text-accent-cyan font-medium">{filteredAndSortedGirls.length}</span> of {girls.length} girls
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Girl Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {paginatedGirls.map((girl, index) => (
              <motion.div
                key={girl.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GirlCard 
                  girl={girl} 
                  onClick={() => navigate(`/girls/${girl.id}`)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-2 mt-8"
          >
            <motion.button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl bg-dark-card/70 border border-dark-border/50 text-gray-400 hover:text-white hover:bg-accent-cyan/20 disabled:opacity-50 disabled:hover:bg-dark-card/70 disabled:hover:text-gray-400 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            
            <div className="flex space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <motion.button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white shadow-lg'
                        : 'bg-dark-card/70 border border-dark-border/50 text-gray-400 hover:text-white hover:bg-accent-cyan/20'
                    }`}
                  >
                    {page}
                  </motion.button>
                );
              })}
            </div>
            
            <motion.button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl bg-dark-card/70 border border-dark-border/50 text-gray-400 hover:text-white hover:bg-accent-cyan/20 disabled:opacity-50 disabled:hover:bg-dark-card/70 disabled:hover:text-gray-400 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredAndSortedGirls.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-accent-cyan/20"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Search className="w-12 h-12 text-accent-cyan/60" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-300 mb-3">No girls found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any girls matching your current filters. Try adjusting your search criteria.
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
        )}
      </div>
    </div>
  );
} 