// System Build: v1.1.0-Production-Ready
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { ContextSidebar } from '@/components/ContextSidebar';
import { ContextPreview } from '@/components/ContextPreview';
import { ChatArea } from '@/components/ChatArea';
import { useOllama } from '@/hooks/useOllama';
import { useContextFiles } from '@/hooks/useContextFiles';
import { useToast } from '@/hooks/use-toast';
import type { Message } from '@/types';

const Index = () => {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const { serverStatus, isGenerating, checkHealth, generateResponse } = useOllama();
  const {
    files,
    selectedFile,
    isSyncing,
    syncFiles,
    loadFileContent,
    removeFile,
    setSelectedFile,
    getActiveContextContent,
  } = useContextFiles();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Set RTL on mount
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Check health on mount
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);

    try {
      const contextFiles = getActiveContextContent();
      const response = await generateResponse(content, contextFiles);

      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { ...msg, content: response, isLoading: false }
            : msg
        )
      );
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate response',
      });
    }
  }, [generateResponse, getActiveContextContent, toast]);

  const handleSelectFile = useCallback((file: typeof selectedFile) => {
    if (file) {
      loadFileContent(file.id);
      setPreviewOpen(true);
    }
  }, [loadFileContent]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        serverStatus={serverStatus}
        onRefreshStatus={checkHealth}
        previewOpen={previewOpen}
        onTogglePreview={() => setPreviewOpen(prev => !prev)}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <ContextSidebar
            files={files}
            selectedFile={selectedFile}
            isOpen={sidebarOpen}
            isSyncing={isSyncing}
            onToggle={() => setSidebarOpen(prev => !prev)}
            onSelectFile={handleSelectFile}
            onDeleteFile={removeFile}
            onSync={syncFiles}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            >
              <motion.div
                initial={{ x: i18n.language === 'ar' ? 320 : -320 }}
                animate={{ x: 0 }}
                exit={{ x: i18n.language === 'ar' ? 320 : -320 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-y-0 start-0 w-80"
              >
                <ContextSidebar
                  files={files}
                  selectedFile={selectedFile}
                  isOpen={true}
                  isSyncing={isSyncing}
                  onToggle={() => setSidebarOpen(false)}
                  onSelectFile={handleSelectFile}
                  onDeleteFile={removeFile}
                  onSync={syncFiles}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <main className="flex-1 flex overflow-hidden">
          <ChatArea
            messages={messages}
            isLoading={isGenerating}
            onSendMessage={handleSendMessage}
            serverConnected={serverStatus.isConnected}
          />
        </main>

        {/* Context Preview */}
        <ContextPreview
          file={selectedFile}
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      </div>
    </div>
  );
};

export default Index;
