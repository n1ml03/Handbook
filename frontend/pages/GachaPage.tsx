import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  Search,
  SortAsc,
  Filter,
  RefreshCw,
  Calendar,
  Clock,
  Gift,
  CheckCircle,
  AlertCircle,
  Diamond,
  Zap
} from 'lucide-react';
import { eventsData, type Event } from '@/data';

type SortDirection = 'asc' | 'desc';
type SortOption = 'name' | 'startDate' | 'endDate' | 'isActive';

interface GachaCardProps {
  gacha: Event;
}

function GachaCard({ gacha }: GachaCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = () => {
    const now = new Date();
    const start = new Date(gacha.startDate);
    const end = new Date(gacha.endDate);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'ended';
    return 'active';
  };

  const status = getEventStatus();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative bg-dark-card/80 backdrop-blur-sm border border-dark-border/50 rounded-2xl p-6 overflow-hidden group"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-pink-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-white text-lg truncate">{gacha.name}</h3>
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                  status === 'active' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : status === 'upcoming'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {status === 'active' ? (
                  <CheckCircle className="w-3 h-3" />
                ) : status === 'upcoming' ? (
                  <Clock className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                {status.toUpperCase()}
              </motion.div>
            </div>
          </div>
          
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-400/20">
            <Diamond className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
            {gacha.description}
          </p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          <motion.div 
            className="flex justify-between items-center p-3 bg-dark-primary/30 rounded-lg border border-dark-border/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-400" />
              <span className="text-xs font-medium text-gray-300">Start</span>
            </div>
            <span className="text-xs font-bold text-white">{formatDate(gacha.startDate)}</span>
          </motion.div>
          
          <motion.div 
            className="flex justify-between items-center p-3 bg-dark-primary/30 rounded-lg border border-dark-border/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-400" />
              <span className="text-xs font-medium text-gray-300">End</span>
            </div>
            <span className="text-xs font-bold text-white">{formatDate(gacha.endDate)}</span>
          </motion.div>
        </div>

        {/* Gacha Information */}
        <div className="mb-4">
          <div className="bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-xl p-3 border border-purple-400/20">
            <p className="text-xs font-bold text-purple-400 mb-2 flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Pull Information
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-300">
                <span className="font-medium">Rate:</span> Enhanced SSR
              </div>
              <div className="text-gray-300">
                <span className="font-medium">Guarantee:</span> 10x Pull
              </div>
            </div>
          </div>
        </div>

        {/* Rewards */}
        {gacha.rewards && gacha.rewards.length > 0 && (
          <div className="mb-4">
            <div className="bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-xl p-3 border border-purple-400/20">
              <p className="text-xs font-bold text-purple-400 mb-2 flex items-center">
                <Gift className="w-3 h-3 mr-1" />
                Featured Items ({gacha.rewards.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {gacha.rewards.slice(0, 3).map((reward, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-dark-primary/50 px-2 py-1 rounded border border-dark-border/30 text-gray-300"
                  >
                    {reward.icon || '💎'} {reward.name}
                  </span>
                ))}
                {gacha.rewards.length > 3 && (
                  <span className="text-xs text-gray-400 px-2 py-1">
                    +{gacha.rewards.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function GachaPage() {
  const allEvents = eventsData;
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('startDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filter, setFilter] = useState({
    search: '',
    status: '',
    dateRange: '',
    version: ''
  });

  const itemsPerPage = 8;

  const filteredAndSortedGachas = useMemo(() => {
    let filtered = [...allEvents, ...eventsData].filter(event => {
      if (event.type !== 'gacha') return false;
      
      if (filter.search && !event.name.toLowerCase().includes(filter.search.toLowerCase()) && 
          !event.description.toLowerCase().includes(filter.search.toLowerCase())) return false;
      
      if (filter.status) {
        const now = new Date();
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        const status = now < start ? 'upcoming' : now > end ? 'ended' : 'active';
        if (filter.status !== status) return false;
      }
      
      return true;
    });

    return filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'startDate':
        case 'endDate':
          aValue = new Date(a[sortBy]).getTime();
          bValue = new Date(b[sortBy]).getTime();
          break;
        case 'isActive':
          const now = new Date();
          aValue = new Date(a.startDate) <= now && now <= new Date(a.endDate) ? 1 : 0;
          bValue = new Date(b.startDate) <= now && now <= new Date(b.endDate) ? 1 : 0;
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
  }, [allEvents, filter, sortBy, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedGachas.length / itemsPerPage);
  const paginatedGachas = filteredAndSortedGachas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      search: '',
      status: '',
      dateRange: '',
      version: ''
    });
    setCurrentPage(1);
  };

  const SortButton = ({ sortKey, children }: { sortKey: SortOption; children: React.ReactNode }) => (
    <motion.button
      onClick={() => handleSortChange(sortKey)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        sortBy === sortKey 
          ? 'bg-gradient-to-r from-gray-900 to-black text-white shadow-lg border border-gray-700' 
          : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-900/50 border border-gray-700/50'
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-600 bg-clip-text text-transparent">
            Gacha Gallery
          </h1>
          <p className="text-gray-400 mt-1">
            Showing {filteredAndSortedGachas.length} gacha events
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
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                className="w-full bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 transition-all placeholder-gray-500 text-white"
                placeholder="Search gacha events..."
              />
              {filter.search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setFilter(prev => ({ ...prev, search: '' }))}
                  className="absolute right-3 top-3 w-4 h-4 text-gray-400 hover:text-purple-400 transition-colors"
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
                    ? 'bg-gradient-to-r from-gray-900 to-black text-white shadow-lg border border-gray-700' 
                    : 'bg-gray-800/70 border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-900/50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
              </motion.button>

              <div className="text-sm text-gray-500 bg-gray-900/50 px-3 py-3 rounded-xl border border-gray-700/50">
                <span className="text-gray-300 font-medium">{filteredAndSortedGachas.length}</span> found
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
              <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-gray-400" />
                    Advanced Filters
                  </h3>
                </div>

                {/* Filter Options */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select
                      value={filter.status}
                      onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-500 transition-all text-white"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="ended">Ended</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Version</label>
                    <select
                      value={filter.version}
                      onChange={(e) => setFilter(prev => ({ ...prev, version: e.target.value }))}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-500 transition-all text-white"
                    >
                      <option value="">All Versions</option>
                      <option value="1.0">1.0</option>
                      <option value="1.5">1.5</option>
                      <option value="2.0">2.0</option>
                      <option value="2.5">2.5</option>
                      <option value="3.0">3.0</option>
                    </select>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="text-sm text-gray-400 flex items-center mr-2">
                    <SortAsc className="w-4 h-4 mr-1" />
                    Sort by:
                  </span>
                  <SortButton sortKey="name">Name</SortButton>
                  <SortButton sortKey="startDate">Start Date</SortButton>
                  <SortButton sortKey="endDate">End Date</SortButton>
                  <SortButton sortKey="isActive">Status</SortButton>
                </div>

                {/* Filter Actions */}
                <div className="flex items-center justify-between">
                  <motion.button
                    onClick={clearFilters}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-400/20 to-pink-500/20 hover:from-purple-400/30 hover:to-pink-500/30 text-purple-400 border border-purple-400/30 rounded-xl px-6 py-2 text-sm font-medium transition-all"
                  >
                    Clear All Filters
                  </motion.button>
                  <div className="text-sm text-gray-500">
                    <span className="text-purple-400 font-medium">{filteredAndSortedGachas.length}</span> gacha events
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gacha Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {paginatedGachas.map((gacha, index) => (
              <motion.div
                key={gacha.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GachaCard gacha={gacha} />
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
              className="p-3 rounded-xl bg-dark-card/70 border border-dark-border/50 text-gray-400 hover:text-white hover:bg-purple-400/20 disabled:opacity-50 disabled:hover:bg-dark-card/70 disabled:hover:text-gray-400 transition-all"
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
                        ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-lg'
                        : 'bg-dark-card/70 border border-dark-border/50 text-gray-400 hover:text-white hover:bg-purple-400/20'
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
              className="p-3 rounded-xl bg-dark-card/70 border border-dark-border/50 text-gray-400 hover:text-white hover:bg-purple-400/20 disabled:opacity-50 disabled:hover:bg-dark-card/70 disabled:hover:text-gray-400 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredAndSortedGachas.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-purple-400/20"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Diamond className="w-12 h-12 text-purple-400/60" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-300 mb-3">No gacha events found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any gacha events matching your current filters. Try adjusting your search criteria.
            </p>
            <motion.button
              onClick={clearFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-400/90 hover:to-pink-500/90 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg"
            >
              Clear All Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 