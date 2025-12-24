// Final Build Version: 3.0.0 - Stable Deployment
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { ContextSidebar } from '@/components/ContextSidebar';
import { ContextPreview } from '@/components/ContextPreview';
import { ChatArea } from '@/components/ChatArea';
import { useOllama } from '@/hooks/useOllama';
import { useContextFiles } from '@/hooks/useContextFiles';
import { useServerSettings } from '@/hooks/useServerSettings';
import { useToast } from '@/hooks/use-toast';
import type { Message } from '@/types';

const Index = () => {
  const { i18n, t } = useTranslation();
  const { toast } = useToast();
  
  // Server settings
  const { settings, updateSettings, resetSettings, DEFAULT_SETTINGS } = useServerSettings();
  
  // Ollama hook with dynamic endpoint
  const { serverStatus, isGenerating, checkHealth, generateResponse, setOnDisconnect } = useOllama(settings.ollamaEndpoint);
  
  // Context files hook with dynamic API path
  const {
    files,
    selectedFile,
    isSyncing,
    lastError,
    isUsingDemoFiles,
    selectedCount,
    syncFiles,
    loadFileContent,
    toggleFileSelection,
    removeFile,
    setSelectedFile,
    getActiveContextContent,
  } = useContextFiles(settings.filesApiPath);

  const [sidebarOpen, setSidebarOpen] = useState(false); // Closed by default on mobile
  const [previewOpen, setPreviewOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Set RTL on mount and language change
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Check if on desktop for sidebar default state
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    setSidebarOpen(isDesktop);
  }, []);

  // Set disconnect callback for auto alerts
  useEffect(() => {
    setOnDisconnect(() => {
      toast({
        variant: 'destructive',
        title: t('chat.serverDisconnected'),
        description: t('errors.networkError'),
      });
    });
  }, [setOnDisconnect, toast, t]);

  // Show sync error toast
  useEffect(() => {
    if (lastError && lastError !== 'sync_failed') {
      toast({
        variant: 'destructive',
        title: t('errors.syncFailed'),
        description: lastError === 'network_error' 
          ? t('errors.networkError')
          : lastError === 'timeout'
          ? t('errors.timeoutError')
          : lastError,
      });
    }
  }, [lastError, toast, t]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!serverStatus.isConnected) {
      toast({
        variant: 'destructive',
        title: t('errors.connectionFailed'),
        description: t('chat.serverOffline'),
      });
      return;
    }

    // Check if any context is selected
    const contextFiles = getActiveContextContent();
    if (contextFiles.length === 0) {
      toast({
        variant: 'default',
        title: t('chat.noContextSelected'),
        description: t('sidebar.noContexts'),
      });
    }

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
      const response = await generateResponse(
        content, 
        contextFiles,
        settings.model,
        settings.temperature,
        settings.topP
      );

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
        title: t('errors.connectionFailed'),
        description: error instanceof Error ? error.message : t('errors.noResponse'),
      });
    }
  }, [serverStatus.isConnected, generateResponse, getActiveContextContent, settings, toast, t]);

  const handleSelectFile = useCallback((file: typeof selectedFile) => {
    if (file) {
      loadFileContent(file.id);
      setPreviewOpen(true);
    }
  }, [loadFileContent]);

  const handleSync = useCallback(async () => {
    await syncFiles();
    if (isUsingDemoFiles) {
      toast({
        title: t('sidebar.demoMode'),
        description: t('errors.syncFailed'),
      });
    }
  }, [syncFiles, isUsingDemoFiles, toast, t]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
    toast({
      title: t('actions.clear'),
      description: t('chat.clearConfirmDesc'),
    });
  }, [toast, t]);

  // Memoize context files for export
  const activeContextFiles = useMemo(() => getActiveContextContent(), [getActiveContextContent]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        serverStatus={serverStatus}
        onRefreshStatus={checkHealth}
        previewOpen={previewOpen}
        onTogglePreview={() => setPreviewOpen(prev => !prev)}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        sidebarOpen={sidebarOpen}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetSettings={resetSettings}
        defaultSettings={DEFAULT_SETTINGS}
        messages={messages}
        contextFiles={activeContextFiles}
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
            onSync={handleSync}
            onToggleSelection={toggleFileSelection}
            selectedCount={selectedCount}
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
                  onSync={handleSync}
                  onToggleSelection={toggleFileSelection}
                  selectedCount={selectedCount}
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
            onClearChat={handleClearChat}
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
