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
import { ThemeSelector } from '@/components/ThemeSelector';
import { loadSupportDocuments, SupportDocument, initializeDocuments } from '@/lib/documents';
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
        (doc.type === 'image' && isImageEnabled);

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
    <div className="min-h-screen bg-white flex flex-col neo-brutalist brutalist-grain">
      {/* Neo-Brutalist Header with Asymmetric Layout */}
      <header className="px-5 pt-8 pb-6 border-b-4 border-black relative">
        <div className="flex items-start gap-4 mb-3">
          {/* Bold geometric logo */}
          <div className="relative">
            <div className="w-14 h-14 bg-[#CCFF00] border-3 border-black flex items-center justify-center relative"
                 style={{ boxShadow: '4px 4px 0 #000' }}>
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-black">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"/>
              </svg>
            </div>
            {/* Offline status indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#CCFF00] border-2 border-black"></div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-black tracking-tighter text-black uppercase" 
                style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.05em' }}>
              {config.appName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {config.appSubtitle}
              </span>
              <span className="px-2 py-0.5 bg-black text-[#CCFF00] text-[9px] font-black uppercase tracking-widest"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                OFFLINE
              </span>
            </div>
          </div>
          
          <ThemeSelector />
        </div>
        
        {/* Technical grid pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-black via-[#CCFF00] to-black opacity-50"></div>
      </header>

      {/* Brutalist Tab Navigation */}
      <nav className="px-5 py-4 bg-gray-100">
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 font-bold text-xs uppercase tracking-wider transition-all border-3 border-black ${
              activeTab === 'documents'
                ? 'bg-[#CCFF00] text-black'
                : 'bg-white text-black hover:bg-gray-200'
            }`}
            style={{ 
              fontFamily: "'JetBrains Mono', monospace",
              boxShadow: activeTab === 'documents' ? '4px 4px 0 #000' : '2px 2px 0 #000',
              transform: activeTab === 'documents' ? 'translate(-2px, -2px)' : 'none'
            }}
          >
            <FileText className="w-5 h-5" weight="bold" />
            <span>DOCS</span>
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 font-bold text-xs uppercase tracking-wider transition-all border-3 border-black ${
              activeTab === 'contacts'
                ? 'bg-[#CCFF00] text-black'
                : 'bg-white text-black hover:bg-gray-200'
            }`}
            style={{ 
              fontFamily: "'JetBrains Mono', monospace",
              boxShadow: activeTab === 'contacts' ? '4px 4px 0 #000' : '2px 2px 0 #000',
              transform: activeTab === 'contacts' ? 'translate(-2px, -2px)' : 'none'
            }}
          >
            <Phone className="w-5 h-5" weight="bold" />
            <span>CONTACT</span>
          </button>
        </div>
      </nav>

      <ScrollArea className="flex-1 bg-white">
        {activeTab === 'documents' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-5 py-6 space-y-6"
          >
            {/* Brutalist Search Bar */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <MagnifyingGlass className="w-5 h-5 text-black" weight="bold" />
              </div>
              <Input
                id="search-documents"
                placeholder="SEARCH ARCHIVES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-14 bg-white border-3 border-black text-black font-bold uppercase tracking-wide placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black"
                style={{ 
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  boxShadow: 'inset 3px 3px 0 rgba(0,0,0,0.1)'
                }}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-black hover:bg-gray-800 border-2 border-black"
                  onClick={() => setSearchQuery('')}
                  style={{ boxShadow: '2px 2px 0 #000' }}
                >
                  <X className="w-4 h-4 text-[#CCFF00]" weight="bold" />
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
              <div className="text-center py-20 space-y-4">
                <div className="w-20 h-20 bg-white border-4 border-black flex items-center justify-center mx-auto"
                     style={{ boxShadow: '6px 6px 0 #000' }}>
                  <FileText className="w-10 h-10 text-black animate-pulse" weight="bold" />
                </div>
                <div>
                  <p className="text-sm font-black text-black uppercase tracking-widest"
                     style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    LOADING ARCHIVES...
                  </p>
                  <div className="mt-3 h-1 w-32 mx-auto bg-gray-200 overflow-hidden">
                    <div className="h-full w-1/3 bg-[#CCFF00] animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-20 h-20 bg-white border-4 border-black flex items-center justify-center mx-auto"
                     style={{ boxShadow: '6px 6px 0 #000' }}>
                  <FileText className="w-10 h-10 text-gray-400" weight="bold" />
                </div>
                <div>
                  <p className="text-sm font-black text-black uppercase tracking-widest"
                     style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    NO RESULTS FOUND
                  </p>
                  <p className="text-xs text-gray-600 mt-2 uppercase tracking-wide"
                     style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    TRY DIFFERENT SEARCH TERMS
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSearchQuery('')} 
                  className="bg-[#CCFF00] text-black border-3 border-black font-black uppercase tracking-wider hover:bg-[#A3CC00]"
                  style={{ 
                    fontFamily: "'JetBrains Mono', monospace",
                    boxShadow: '3px 3px 0 #000'
                  }}
                >
                  CLEAR SEARCH
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Document count indicator */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-600"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {filteredDocuments.length} DOCUMENT{filteredDocuments.length !== 1 ? 'S' : ''} AVAILABLE
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#CCFF00] border border-black"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-600"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      OFFLINE MODE
                    </span>
                  </div>
                </div>
                
                {filteredDocuments.map((doc, index) => (
                  <div key={doc.id} className="brutalist-stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                    <DocumentTile
                      document={doc}
                      onSelect={setSelectedDocument}
                    />
                  </div>
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
