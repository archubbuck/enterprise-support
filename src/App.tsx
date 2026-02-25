import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Phone, MagnifyingGlass, X } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DocumentTile } from '@/components/DocumentTile';
import { DocumentViewer } from '@/components/DocumentViewer';
import { ContactsView } from '@/components/ContactsView';
import { TagFilter } from '@/components/TagFilter';
import { loadSupportDocuments, SupportDocument, initializeDocuments, loadDocumentContent } from '@/lib/documents';
import { useFeaturePreview } from '@/hooks/useFeaturePreview';
import { useAppConfig } from '@/hooks/useAppConfig';

function App() {
  const { config, loading: configLoading, error: configError } = useAppConfig();
  const [activeTab, setActiveTab] = useState<'documents' | 'contacts'>('documents');
  const [selectedDocument, setSelectedDocument] = useState<SupportDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<SupportDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const isTagFilteringEnabled = useFeaturePreview('tagFiltering');
  const isPdfEnabled = useFeaturePreview('pdfDocuments');
  const isWordEnabled = useFeaturePreview('wordDocuments');
  const isImageEnabled = useFeaturePreview('imageDocuments');

  // Initialize documents module and load documents when config is ready
  useEffect(() => {
    if (!config) return;
    
    // Initialize documents module with config
    initializeDocuments(config);
    
    loadSupportDocuments().then(docs => {
      setDocuments(docs);
      setIsLoading(false);
    });
  }, [config]);

  // Extract all unique tags from documents
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    documents.forEach(doc => {
      doc.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Text search filter
      const matchesSearch = 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Tag filter (only if feature is enabled)
      const matchesTags = !isTagFilteringEnabled || selectedTags.length === 0 ||
        (doc.tags && selectedTags.every(tag => doc.tags.includes(tag)));

      // Feature flag filter - check if document type is enabled
      const isTypeEnabled = 
        doc.type === 'markdown' || // markdown is always enabled
        (doc.type === 'pdf' && isPdfEnabled) ||
        (doc.type === 'word' && isWordEnabled) ||
        (doc.type === 'image' && isImageEnabled) ||
        doc.type === 'unknown'; // unknown types visible but handled in viewer

      return matchesSearch && matchesTags && isTypeEnabled;
    });
  }, [documents, searchQuery, selectedTags, isTagFilteringEnabled, isPdfEnabled, isWordEnabled, isImageEnabled]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
  };

  // Load document content on-demand when user selects a tile
  const handleSelectDocument = async (doc: SupportDocument) => {
    if (doc.type === 'markdown' && !doc.content) {
      const content = await loadDocumentContent(doc);
      setSelectedDocument({ ...doc, content });
    } else {
      setSelectedDocument(doc);
    }
  };

  // Show loading state while config is loading
  if (configLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto animate-pulse">
            <FileText className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state if config failed to load
  if (configError || !config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <div className="text-center space-y-3 max-w-md">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <X className="w-6 h-6 text-destructive" />
          </div>
          <p className="text-sm font-medium text-foreground">Failed to load configuration</p>
          <p className="text-sm text-muted-foreground">{configError?.message || 'Please try refreshing the page.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-5 py-4 mb-4 bg-[var(--bxd-blue-140)]">
        <div className="flex items-center gap-3">
          <img src="/barings-logo.svg" alt="Barings" className="h-7" />
          <div className="w-px h-6 bg-[var(--inverse-on-surface)]/40" />
          <h1 className="text-lg font-semibold tracking-tight text-[var(--inverse-on-surface)] flex-1">{config.appName}</h1>
        </div>
      </header>

      <nav className="px-5 mb-4">
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'documents'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4" weight={activeTab === 'documents' ? 'fill' : 'regular'} />
            Documents
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'contacts'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Phone className="w-4 h-4" weight={activeTab === 'contacts' ? 'fill' : 'regular'} />
            Contacts
          </button>
        </div>
      </nav>

      <ScrollArea className="flex-1">
        {activeTab === 'documents' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-5 pb-6 space-y-4"
          >
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search-documents"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 h-10 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-accent"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-transparent"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>

            {isTagFilteringEnabled && (
              <TagFilter
                availableTags={availableTags}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
                onClearAll={handleClearAllTags}
              />
            )}

            {isLoading ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto animate-pulse">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Loading documents...</p>
                </div>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">No documents found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="text-accent">
                  Clear search
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredDocuments.map((doc) => (
                  <DocumentTile
                    key={doc.id}
                    document={doc}
                    onSelect={handleSelectDocument}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'contacts' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ContactsView />
          </motion.div>
        )}
      </ScrollArea>

      <AnimatePresence>
        {selectedDocument && (
          <DocumentViewer
            document={selectedDocument}
            onBack={() => setSelectedDocument(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
