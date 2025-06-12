import React, { useState, useEffect } from 'react';
import { Search, FileText, Tags, Calendar, User, Filter, SortAsc, RefreshCw, ArrowLeft, Edit3, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { documentsData, documentCategoriesData, type Document, type DocumentCategory } from '@/data';
import TiptapEditor from '@/components/TiptapEditor';
import { Container, Card, Stack, Inline, StatusBadge } from '@/components/ui/spacing';
import { SaveButton } from '@/components/ui/loading';

type SortDirection = 'asc' | 'desc';
type SortOption = 'date' | 'title' | 'category' | 'author';
type ViewMode = 'list' | 'document';

const DocumentPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(documentsData);
  const [documentCategories, setDocumentCategories] = useState<DocumentCategory[]>(documentCategoriesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [authorFilter, setAuthorFilter] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && doc.isPublished) ||
                         (statusFilter === 'draft' && !doc.isPublished);
    const matchesAuthor = !authorFilter || doc.author.toLowerCase().includes(authorFilter.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesStatus && matchesAuthor;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'author':
        comparison = a.author.localeCompare(b.author);
        break;
    }
    
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setEditedContent(document.content);
    setViewMode('document');
    setIsEditMode(false);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedDocument(null);
    setIsEditMode(false);
    setEditedContent('');
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit mode
      setIsEditMode(false);
      setEditedContent(selectedDocument?.content || '');
    } else {
      // Enter edit mode
      setIsEditMode(true);
      setEditedContent(selectedDocument?.content || '');
    }
  };

  const handleSaveDocument = async () => {
    if (!selectedDocument) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the document in the list
      setDocuments(prev => prev.map(doc =>
        doc.id === selectedDocument.id
          ? { ...doc, content: editedContent, updatedAt: new Date().toISOString().split('T')[0] }
          : doc
      ));

      // Update selected document
      setSelectedDocument(prev => prev ? { ...prev, content: editedContent } : null);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSortChange = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setStatusFilter('all');
    setAuthorFilter('');
    setSortBy('date');
    setSortDirection('desc');
  };

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewMode === 'document') {
          handleBackToList();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  const SortButton = ({ sortKey, children }: { sortKey: SortOption; children: React.ReactNode }) => (
    <motion.button
      onClick={() => handleSortChange(sortKey)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'px-3 py-2 rounded-lg transition-all flex items-center gap-1 text-sm font-medium',
        sortBy === sortKey
          ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white shadow-md'
          : 'bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-accent-cyan/20'
      )}
    >
      {children}
      {sortBy === sortKey && (
        <SortAsc className={cn('w-3 h-3 transition-transform', sortDirection === 'desc' && 'rotate-180')} />
      )}
    </motion.button>
  );

  const extractPlainText = (content: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // List View Component
  const ListView = () => (
    <>
      {/* Header */}
      <div className="doax-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-pink to-accent-purple bg-clip-text text-transparent">
              Documentation Center
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive guides and tutorials for DOAX Venus Vacation
            </p>
          </div>
        </div>
      </div>

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-muted/70 backdrop-blur-sm border border-border/50 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/20 transition-all placeholder-muted-foreground"
              placeholder="Search documents, content, or tags..."
            />
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setSearchTerm('')}
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
              <span className="text-accent-cyan font-medium">{filteredDocuments.length}</span> found
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-accent-cyan" />
                  Advanced Filters
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-background/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan transition-all"
                  >
                    <option value="all">All Categories</option>
                    {documentCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
                    className="w-full bg-background/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan transition-all"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Author</label>
                  <input
                    type="text"
                    value={authorFilter}
                    onChange={(e) => setAuthorFilter(e.target.value)}
                    className="w-full bg-background/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan transition-all"
                    placeholder="Filter by author..."
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="text-sm text-muted-foreground flex items-center mr-2">
                  <SortAsc className="w-4 h-4 mr-1" />
                  Sort by:
                </span>
                <SortButton sortKey="date">Date</SortButton>
                <SortButton sortKey="title">Title</SortButton>
                <SortButton sortKey="category">Category</SortButton>
                <SortButton sortKey="author">Author</SortButton>
              </div>

              <div className="flex items-center justify-between">
                <motion.button
                  onClick={clearFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-accent-pink/20 to-accent-purple/20 hover:from-accent-pink/30 hover:to-accent-purple/30 text-accent-pink border border-accent-pink/30 rounded-xl px-6 py-2 text-sm font-medium transition-all"
                >
                  Clear All Filters
                </motion.button>
                <div className="text-sm text-muted-foreground">
                  <span className="text-accent-cyan font-medium">{filteredDocuments.length}</span> of {documents.length} documents
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Grid */}
      <div className="space-y-6">
        {filteredDocuments.length === 0 ? (
          <div className="doax-card p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground">Try adjusting your search filters</p>
          </div>
        ) : (
          filteredDocuments.map((document) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="doax-card overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group"
              onClick={() => handleDocumentClick(document)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-accent-pink transition-colors">
                        {document.title}
                      </h3>
                      {!document.isPublished && (
                        <Badge variant="secondary" className="text-xs">Draft</Badge>
                      )}
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          documentCategories.find(cat => cat.id === document.category)?.color
                        )}
                      >
                        {documentCategories.find(cat => cat.id === document.category)?.name || document.category}
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-muted-foreground leading-relaxed line-clamp-3">
                        {extractPlainText(document.content).slice(0, 300)}
                        {extractPlainText(document.content).length > 300 && '...'}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {document.tags.slice(0, 5).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tags className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {document.tags.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{document.tags.length - 5} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{document.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Updated {document.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6 text-accent-cyan group-hover:text-accent-pink transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </>
  );

  // Document View Component
  const DocumentView = () => (
    <Container>
      <Card>
        <Inline align="between" className="mb-6">
          <Button
            onClick={handleBackToList}
            variant="outline"
            className="px-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </Button>

          <Inline spacing="sm">
            {isEditMode ? (
              <>
                <SaveButton
                  isSaving={isSaving}
                  onClick={handleSaveDocument}
                >
                  Save Changes
                </SaveButton>
                <Button
                  onClick={handleEditToggle}
                  variant="outline"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={handleEditToggle}
                variant="outline"
                className="hover:bg-accent-pink/10 hover:text-accent-pink"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Document
              </Button>
            )}
          </Inline>
        </Inline>

        <Stack spacing="lg">
          <div>
            <Inline spacing="md" className="mb-4">
              <h1 className="text-3xl font-bold text-foreground">
                {selectedDocument?.title}
              </h1>
              {!selectedDocument?.isPublished && (
                <Badge variant="secondary">Draft</Badge>
              )}
              {isEditMode && (
                <StatusBadge status="info">
                  <Edit3 className="w-3 h-3" />
                  Editing
                </StatusBadge>
              )}
              <Badge
                variant="outline"
                className={cn(
                  documentCategories.find(cat => cat.id === selectedDocument?.category)?.color
                )}
              >
                {documentCategories.find(cat => cat.id === selectedDocument?.category)?.name || selectedDocument?.category}
              </Badge>
            </Inline>

            <Inline spacing="sm" wrap className="mb-4">
              {selectedDocument?.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tags className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </Inline>

            <Inline spacing="lg" className="text-sm text-muted-foreground">
              <Inline spacing="sm">
                <User className="w-4 h-4" />
                <span>{selectedDocument?.author}</span>
              </Inline>
              <Inline spacing="sm">
                <Calendar className="w-4 h-4" />
                <span>Created {selectedDocument?.createdAt}</span>
              </Inline>
              <Inline spacing="sm">
                <Calendar className="w-4 h-4" />
                <span>Updated {selectedDocument?.updatedAt}</span>
              </Inline>
            </Inline>
          </div>
        </Stack>
      </Card>

      <Card className={cn(
        "overflow-hidden transition-all duration-300",
        isEditMode ? "p-4" : "p-8"
      )}>
        {isEditMode ? (
          <Stack spacing="md">
            <Inline align="between" className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Edit Document Content
              </h3>
              <Inline spacing="sm" className="text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>Live preview available in editor</span>
              </Inline>
            </Inline>

            <TiptapEditor
              content={editedContent}
              onChange={setEditedContent}
              editable={true}
              placeholder="Start writing your document content..."
              showToolbar={true}
              showCharacterCount={true}
              showWordCount={true}
              mode="full"
              className="min-h-[400px]"
            />
          </Stack>
        ) : (
          <div className="prose prose-lg max-w-none">
            <TiptapEditor
              content={selectedDocument?.content || ''}
              onChange={() => {}}
              editable={false}
              showToolbar={false}
              className="border-0 p-0 bg-transparent min-h-[200px]"
            />
          </div>
        )}
      </Card>
    </Container>
  );

  return (
    <Container>
      <AnimatePresence mode="wait">
        {viewMode === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ListView />
          </motion.div>
        )}

        {viewMode === 'document' && selectedDocument && (
          <motion.div
            key="document"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <DocumentView />
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default DocumentPage; 