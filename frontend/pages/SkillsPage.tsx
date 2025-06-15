import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  Search,
  SortAsc,
  Zap,
  Shield,
  Heart,
  Target,
  Sparkles,
  Filter,
  RefreshCw,
  Wand2
} from 'lucide-react';
import { skillsData } from '@/data';
import { skillsDetailedData } from '@/data';
import { addTranslationsToItems, searchInAllLanguages, type MultiLanguageItem } from '@/lib/multiLanguageSearch';

type SortDirection = 'asc' | 'desc';
type SortOption = 'name' | 'type' | 'id';

const skillTypes = ['POW', 'TEC', 'STM', 'APL', 'Support', 'Special'] as const;

interface SkillCardProps {
  skill: any;
}

function SkillCard({ skill }: SkillCardProps) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pow': return 'from-red-400 to-pink-500';
      case 'tec': return 'from-cyan-400 to-blue-500';
      case 'stm': return 'from-yellow-400 to-orange-500';
      case 'apl': return 'from-purple-400 to-pink-500';
      case 'support': return 'from-green-400 to-emerald-500';
      case 'special': return 'from-orange-400 to-red-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pow': return <Zap className="w-4 h-4" />;
      case 'tec': return <Target className="w-4 h-4" />;
      case 'stm': return <Shield className="w-4 h-4" />;
      case 'apl': return <Sparkles className="w-4 h-4" />;
      case 'support': return <Heart className="w-4 h-4" />;
      case 'special': return <Wand2 className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative bg-dark-card/80 backdrop-blur-sm border border-dark-border/50 rounded-2xl p-6 overflow-hidden group"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-pink/5 via-accent-cyan/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-accent-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-white text-lg">{skill.name}</h3>
              <motion.div
                className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getTypeColor(skill.type)} text-white shadow-lg flex items-center space-x-1`}
                whileHover={{ scale: 1.1 }}
              >
                {getTypeIcon(skill.type)}
                <span>{skill.type}</span>
              </motion.div>
            </div>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 rounded-xl flex items-center justify-center border border-accent-cyan/20">
            <span className="text-2xl">{skill.icon || '⚡'}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4 p-3 bg-dark-primary/50 rounded-xl border border-dark-border/30">
          <p className="text-sm text-gray-300 leading-relaxed">{skill.description}</p>
        </div>

        {/* Effects */}
        {skill.effects && skill.effects.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-accent-cyan mb-2 flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              Effects
            </p>
            <div className="space-y-2">
              {skill.effects.map((effect: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-dark-primary/30 rounded-lg border border-dark-border/30">
                  <span className="text-xs text-gray-300 capitalize">{effect.stat} {effect.type}</span>
                  <span className="text-xs font-bold text-accent-cyan">+{effect.value}{effect.type === 'percentage' ? '%' : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ID */}
        <div className="pt-3 border-t border-dark-border/30">
          <span className="text-xs text-gray-500 font-mono bg-dark-primary/30 px-2 py-1 rounded">
            {skill.id}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function SkillsPage() {
  const skills = skillsData;
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filter, setFilter] = useState({
    type: '',
    search: '',
    hasEffects: false
  });

  const itemsPerPage = 8;

  // Sample data if no skills available
  const sampleSkills = useMemo(() => {
    if (skills.length > 0) return skills;
    return skillsDetailedData;
  }, [skills]);

  // Add multi-language support to skills data
  const multiLanguageSkills = useMemo(() => {
    return addTranslationsToItems(sampleSkills);
  }, [sampleSkills]);

  const filteredAndSortedSkills = useMemo(() => {
    let filtered = multiLanguageSkills.filter((skill: any) => {
      if (filter.type && skill.type !== filter.type) return false;
      // Use multi-language search instead of simple string matching
      if (filter.search && !searchInAllLanguages(skill, filter.search)) return false;
      if (filter.hasEffects && (!skill.effects || skill.effects.length === 0)) return false;
      return true;
    });

    return filtered.sort((a: any, b: any) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [multiLanguageSkills, filter, sortBy, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedSkills.length / itemsPerPage);
  const paginatedSkills = filteredAndSortedSkills.slice(
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
      type: '',
      search: '',
      hasEffects: false
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
            Skills Collection
          </h1>
          <p className="text-gray-400 mt-1">
            Showing {filteredAndSortedSkills.length} of {sampleSkills.length} skills
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
                className="w-full bg-dark-card/70 backdrop-blur-sm border border-dark-border/50 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all placeholder-gray-500"
                placeholder="Search skills in all languages..."
              />
              {filter.search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setFilter(prev => ({ ...prev, search: '' }))}
                  className="absolute right-3 top-3 w-4 h-4 text-gray-400 hover:text-accent-cyan transition-colors"
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
                    : 'bg-dark-card/70 border border-dark-border/50 text-gray-400 hover:text-white hover:bg-accent-cyan/20'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
              </motion.button>

              <div className="text-sm text-gray-500 bg-dark-card/50 px-3 py-3 rounded-xl border border-dark-border/50">
                <span className="text-accent-cyan font-medium">{filteredAndSortedSkills.length}</span> found
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
              <div className="bg-dark-card/80 backdrop-blur-xl rounded-3xl border border-dark-border/50 p-6">
                {/* Filter Toggle */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-accent-cyan" />
                    Advanced Filters
                  </h3>
                </div>

                {/* Basic Filters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                    <select
                      value={filter.type}
                      onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full bg-dark-primary/50 border border-dark-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan transition-all"
                    >
                      <option value="">All Types</option>
                      {skillTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Effects</label>
                    <label className="flex items-center space-x-2 mt-3">
                      <input
                        type="checkbox"
                        checked={filter.hasEffects}
                        onChange={(e) => setFilter(prev => ({ ...prev, hasEffects: e.target.checked }))}
                        className="rounded border-dark-border text-accent-pink focus:ring-accent-pink/20"
                      />
                      <span className="text-sm text-gray-300">Has Effects</span>
                    </label>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="text-sm text-gray-400 flex items-center mr-2">
                    <SortAsc className="w-4 h-4 mr-1" />
                    Sort by:
                  </span>
                  <SortButton sortKey="name">Name</SortButton>
                  <SortButton sortKey="type">Type</SortButton>
                  <SortButton sortKey="id">ID</SortButton>
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
                    <span className="text-accent-cyan font-medium">{filteredAndSortedSkills.length}</span> of {sampleSkills.length} skills
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skills Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {paginatedSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <SkillCard skill={skill} />
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
        {filteredAndSortedSkills.length === 0 && (
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
            <h3 className="text-2xl font-bold text-gray-300 mb-3">No skills found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any skills matching your current filters. Try adjusting your search criteria.
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