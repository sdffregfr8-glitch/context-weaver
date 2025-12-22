import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  FolderSync, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  File,
  FileJson,
  FileCode,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { ContextFile } from '@/types';

interface ContextSidebarProps {
  files: ContextFile[];
  selectedFile: ContextFile | null;
  isOpen: boolean;
  isSyncing: boolean;
  onToggle: () => void;
  onSelectFile: (file: ContextFile) => void;
  onDeleteFile: (fileId: string) => void;
  onSync: () => void;
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'json':
      return FileJson;
    case 'markdown':
      return FileCode;
    default:
      return File;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function ContextSidebar({
  files,
  selectedFile,
  isOpen,
  isSyncing,
  onToggle,
  onSelectFile,
  onDeleteFile,
  onSync,
}: ContextSidebarProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const sidebarVariants = {
    open: { width: 320, opacity: 1 },
    closed: { width: 56, opacity: 1 },
  };

  const contentVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: isRTL ? 20 : -20 },
  };

  return (
    <motion.aside
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full glass-strong flex flex-col border-e border-border/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              variants={contentVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex items-center gap-2"
            >
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">{t('sidebar.contexts')}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="shrink-0"
        >
          {isOpen ? (
            isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
          ) : (
            isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sync Button */}
      <div className="p-3 border-b border-border/50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size={isOpen ? 'default' : 'icon'}
              onClick={onSync}
              disabled={isSyncing}
              className={`w-full ${isOpen ? '' : 'h-10 w-10'}`}
            >
              {isSyncing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FolderSync className="h-4 w-4" />
              )}
              {isOpen && (
                <motion.span
                  variants={contentVariants}
                  className="ms-2"
                >
                  {t('sidebar.syncFiles')}
                </motion.span>
              )}
            </Button>
          </TooltipTrigger>
          {!isOpen && (
            <TooltipContent side={isRTL ? 'left' : 'right'}>
              <p>{t('sidebar.syncFiles')}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* Files List */}
      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-3 space-y-2">
          <AnimatePresence mode="popLayout">
            {files.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground text-center py-8"
              >
                {isOpen && t('sidebar.noContexts')}
              </motion.p>
            ) : (
              files.map((file) => {
                const FileIcon = getFileIcon(file.type);
                const isSelected = selectedFile?.id === file.id;

                return (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectFile(file)}
                    className={`
                      group relative cursor-pointer rounded-lg p-3 transition-colors
                      ${isSelected 
                        ? 'bg-primary/20 border border-primary/50' 
                        : 'hover:bg-secondary/50 border border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        shrink-0 p-2 rounded-lg
                        ${isSelected ? 'bg-primary/30' : 'bg-secondary'}
                      `}>
                        <FileIcon className="h-4 w-4" />
                      </div>

                      {isOpen && (
                        <motion.div
                          variants={contentVariants}
                          className="flex-1 min-w-0"
                        >
                          <p className="text-sm font-medium truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </motion.div>
                      )}

                      {isOpen && (
                        <motion.div
                          variants={contentVariants}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteFile(file.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </motion.div>
                      )}
                    </div>

                    {isSelected && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-y-0 start-0 w-1 bg-primary rounded-full"
                      />
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Footer */}
      {isOpen && files.length > 0 && (
        <motion.div
          variants={contentVariants}
          className="p-3 border-t border-border/50"
        >
          <p className="text-xs text-muted-foreground text-center">
            {t('sidebar.fileCount', { count: files.length })}
          </p>
        </motion.div>
      )}
    </motion.aside>
  );
}
