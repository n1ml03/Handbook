import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Shield,
  Heart,
  Target,
  Sparkles,
  Wand2} from 'lucide-react';
import { skillsApi } from '@/services/api';
import { type EnhancedSkill, type SkillCardProps, type SortDirection } from '@/types';
import { addTranslationsToItems, searchInAllLanguages } from '@/services/multiLanguageSearch';
import UnifiedFilter from '@/components/features/UnifiedFilter';
import { createSkillFilterConfig } from '@/components/features/FilterConfigs';

const skillTypes = ['POW', 'TEC', 'STM', 'APL'] as const;
const skillTargets = ['self', 'team', 'enemy'];

const filterFields = createSkillFilterConfig(Array.from(skillTypes), skillTargets);
const sortOptions = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'target', label: 'Target' },
  { key: 'id', label: 'ID' },
];

function SkillCard({ skill }: SkillCardProps) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pow': return 'from-red-400 to-pink-500';
      case 'tec': return 'from-cyan-400 to-blue-500';
      case 'stm': return 'from-yellow-400 to-orange-500';
      case 'apl': return 'from-purple-400 to-pink-500';
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
          <span className="text-xs text-gray-500 font-mono bg-dark-primary/30 px-2 py-1 rounded-sm">
            {skill.id}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<EnhancedSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await skillsApi.getSkills({ limit: 1000 });
        setSkills(response.data as EnhancedSkill[]);
      } catch (err) {
        console.error('Failed to fetch skills:', err);
        setError('Failed to load skills');
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const itemsPerPage = 8;

  // Add multi-language support to skills data
  const multiLanguageSkills = useMemo(() => {
    return addTranslationsToItems(skills);
  }, [skills]);

  const filteredAndSortedSkills = useMemo(() => {
    const filtered = multiLanguageSkills.filter((skill: EnhancedSkill) => {
      if (filterValues.type && skill.type !== filterValues.type) return false;
      if (filterValues.search && !searchInAllLanguages(skill, filterValues.search)) return false;
      if (filterValues.hasEffects && (!skill.effects || skill.effects.length === 0)) return false;
      return true;
    });
    return filtered.sort((a: EnhancedSkill, b: EnhancedSkill) => {
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
  }, [multiLanguageSkills, filterValues, sortBy, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedSkills.length / itemsPerPage);
  const paginatedSkills = filteredAndSortedSkills.slice(
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
    setFilterValues({});
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary flex items-center justify-center">
        <div className="text-white text-lg">Loading skills...</div>
      </div>
    );
  }

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
            Showing {filteredAndSortedSkills.length} of {skills.length} skills
          </p>
        </motion.div>

        {/* Unified Filter Component */}
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
          resultCount={filteredAndSortedSkills.length}
          itemLabel="skills"
          blackTheme={true}
          accentColor="accent-cyan"
          secondaryColor="accent-purple"
        />

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
              <Sparkles className="w-12 h-12 text-accent-cyan/60" />
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