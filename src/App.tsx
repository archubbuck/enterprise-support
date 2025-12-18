import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Phone, MagnifyingGlass, X } from '@phosphor-icons/react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DocumentTile } from '@/components/DocumentTile';
import { DocumentViewer } from '@/components/DocumentViewer';
import { ContactsView } from '@/components/ContactsView';
import { supportDocuments, SupportDocument } from '@/lib/documents';

function App() {
  const [activeTab, setActiveTab] = useState<'documents' | 'contacts'>('documents');
  const [selectedDocument, setSelectedDocument] = useState<SupportDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = supportDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
        <div className="px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Barings Support</h1>
            <p className="text-xs text-primary-foreground/70">IT Help & Documentation</p>
          </div>
        </div>
      </header>

      <Tabs 
        value={activeTab} 
        onValueChange={(v) => setActiveTab(v as 'documents' | 'contacts')}
        className="sticky top-[72px] z-30 bg-card border-b border-border"
      >
        <TabsList className="w-full h-12 p-0 bg-transparent rounded-none grid grid-cols-2">
          <TabsTrigger 
            value="documents" 
            className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2"
          >
            <FileText className="w-4 h-4" weight={activeTab === 'documents' ? 'fill' : 'regular'} />
            Documents
          </TabsTrigger>
          <TabsTrigger 
            value="contacts"
            className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2"
          >
            <Phone className="w-4 h-4" weight={activeTab === 'contacts' ? 'fill' : 'regular'} />
            Contacts
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <ScrollArea className="flex-1">
        {activeTab === 'documents' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 space-y-4"
          >
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search-documents"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 bg-muted/50 border-transparent focus:border-accent focus:bg-card"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto" />
                <p className="text-muted-foreground">No documents found</p>
                <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
                  Clear search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredDocuments.map((doc) => (
                  <DocumentTile
                    key={doc.id}
                    document={doc}
                    onSelect={setSelectedDocument}
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
