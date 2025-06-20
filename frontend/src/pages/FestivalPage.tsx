import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  Search,
  Calendar,
  Clock,
  Gift,
  CheckCircle,
  AlertCircle,
  Music,
  Sparkles
} from 'lucide-react';
import { type Event, type FestivalCardProps, type SortDirection } from '@/types';
import UnifiedFilter, { FilterField, SortOption } from '@/components/features/UnifiedFilter';

function FestivalCard({ festival }: FestivalCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
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
    const start = festival.startDate ? new Date(festival.startDate) : null;
    const end = festival.endDate ? new Date(festival.endDate) : null;
    if (!start || !end) return 'unknown';
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
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-white text-lg truncate">{festival.name}</h3>
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
          
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-yellow-400/20">
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
            {festival.description}
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
            <span className="text-xs font-bold text-white">{formatDate(festival.startDate)}</span>
          </motion.div>
          
          <motion.div 
            className="flex justify-between items-center p-3 bg-dark-primary/30 rounded-lg border border-dark-border/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-400" />
              <span className="text-xs font-medium text-gray-300">End</span>
            </div>
            <span className="text-xs font-bold text-white">{formatDate(festival.endDate)}</span>
          </motion.div>
        </div>

        {/* Rewards */}
        {festival.rewards && festival.rewards.length > 0 && (
          <div className="mb-4">
            <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-xl p-3 border border-yellow-400/20">
              <p className="text-xs font-bold text-yellow-400 mb-2 flex items-center">
                <Gift className="w-3 h-3 mr-1" />
                Festival Rewards ({festival.rewards.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {festival.rewards.slice(0, 3).map((reward, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-dark-primary/50 px-2 py-1 rounded-sm border border-dark-border/30 text-gray-300"
                  >
                    {reward.icon || '🎁'} {reward.name}
                  </span>
                ))}
                {festival.rewards.length > 3 && (
                  <span className="text-xs text-gray-400 px-2 py-1">
                    +{festival.rewards.length - 3} more
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

export default function FestivalPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>('startDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterValues, setFilterValues] = useState({
    search: '',
    status: '',
    dateRange: '',
    version: ''
  });

  const itemsPerPage = 8;

  // Filter fields configuration
  const filterFields: FilterField[] = [
    {
      key: 'search',
      label: 'Search',
      type: 'text',
      placeholder: 'Search festivals...',
      icon: <Search className="w-3 h-3 mr-1" />,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'All Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'ended', label: 'Ended' }
      ],
      icon: <Clock className="w-3 h-3 mr-1" />,
    },
    {
      key: 'version',
      label: 'Version',
      type: 'select',
      placeholder: 'All Versions',
      options: [
        { value: '1.0', label: '1.0' },
        { value: '1.5', label: '1.5' },
        { value: '2.0', label: '2.0' },
        { value: '2.5', label: '2.5' },
        { value: '3.0', label: '3.0' }
      ],
      icon: <Sparkles className="w-3 h-3 mr-1" />,
    }
  ];

  // Sort options
  const sortOptions: SortOption[] = [
    { key: 'name', label: 'Name' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'isActive', label: 'Status' }
  ];

  const filteredAndSortedFestivals = useMemo(() => {
    const filtered = [...allEvents].filter(event => {
      if (event.eventType !== 'festival') return false;
      if (filterValues.search && !event.name.toLowerCase().includes(filterValues.search.toLowerCase()) && 
          !(event.description ?? '').toLowerCase().includes(filterValues.search.toLowerCase())) return false;
      if (filterValues.status) {
        const now = new Date();
        const start = event.startDate ? new Date(event.startDate) : null;
        const end = event.endDate ? new Date(event.endDate) : null;
        const status = (!start || !end)
          ? 'unknown'
          : now < start ? 'upcoming' : now > end ? 'ended' : 'active';
        if (filterValues.status !== status) return false;
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
          aValue = new Date(a[sortBy] ?? 0).getTime();
          bValue = new Date(b[sortBy] ?? 0).getTime();
          break;
        case 'isActive':
          const now = new Date();
          aValue = (a.startDate && a.endDate && new Date(a.startDate) <= now && now <= new Date(a.endDate)) ? 1 : 0;
          bValue = (b.startDate && b.endDate && new Date(b.startDate) <= now && now <= new Date(b.endDate)) ? 1 : 0;
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
  }, [allEvents, filterValues, sortBy, sortDirection]);

  const totalPages = useMemo(() => Math.ceil(filteredAndSortedFestivals.length / itemsPerPage), [filteredAndSortedFestivals.length, itemsPerPage]);
  const paginatedFestivals = useMemo(() => filteredAndSortedFestivals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ), [filteredAndSortedFestivals, currentPage, itemsPerPage]);

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
      status: '',
      dateRange: '',
      version: ''
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Festival Gallery
          </h1>
          <p className="text-gray-400 mt-1">
            Showing {filteredAndSortedFestivals.length} festivals
          </p>
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
          resultCount={filteredAndSortedFestivals.length}
          itemLabel="festivals"
          accentColor="yellow"
          secondaryColor="orange"
          blackTheme={true}
          headerIcon={<Music className="w-4 h-4" />}
        />

        {/* Festival Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {paginatedFestivals.map((festival, index) => (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <FestivalCard festival={festival as any} />
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
              className="p-3 rounded-xl bg-dark-card/70 border border-dark-border/50 text-gray-400 hover:text-white hover:bg-yellow-400/20 disabled:opacity-50 disabled:hover:bg-dark-card/70 disabled:hover:text-gray-400 transition-all"
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
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                        : 'bg-dark-card/70 border border-dark-border/50 text-gray-400 hover:text-white hover:bg-yellow-400/20'
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
              className="p-3 rounded-xl bg-dark-card/70 border border-dark-border/50 text-gray-400 hover:text-white hover:bg-yellow-400/20 disabled:opacity-50 disabled:hover:bg-dark-card/70 disabled:hover:text-gray-400 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredAndSortedFestivals.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-yellow-400/20"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Music className="w-12 h-12 text-yellow-400/60" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-300 mb-3">No festivals found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any festivals matching your current filters. Try adjusting your search criteria.
            </p>
            <motion.button
              onClick={clearFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-400/90 hover:to-orange-500/90 text-black px-8 py-3 rounded-xl font-medium transition-all shadow-lg"
            >
              Clear All Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 