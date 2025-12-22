import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { ContextFile, ContextReference } from '@/types';

interface ContextPreviewProps {
  file: ContextFile | null;
  isOpen: boolean;
  references?: ContextReference[];
  onClose: () => void;
}

export function ContextPreview({
  file,
  isOpen,
  references = [],
  onClose,
}: ContextPreviewProps) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const isRTL = i18n.language === 'ar';

  const handleCopy = async () => {
    if (file?.content) {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      toast({
        description: 'Content copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const highlightContent = (content: string) => {
    if (!references.length) return content;

    // Simple highlighting - in production, use proper line matching
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const isHighlighted = references.some(
        ref => ref.startLine && ref.endLine && 
        idx >= ref.startLine && idx <= ref.endLine
      );
      
      return isHighlighted ? (
        <span key={idx} className="context-highlight block">{line}</span>
      ) : (
        <span key={idx} className="block">{line}</span>
      );
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: isRTL ? -320 : 320 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isRTL ? -320 : 320 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-80 h-full glass-strong border-s border-border/50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">{t('contextPreview.title')}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {file ? (
            <>
              {/* File Info */}
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{file.path}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {references.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20"
                  >
                    <p className="text-xs text-primary">
                      {t('contextPreview.references')}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <ScrollArea className="flex-1 custom-scrollbar">
                <div className="p-4">
                  <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground/90">
                    {file.content ? highlightContent(file.content) : 'Loading...'}
                  </pre>
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  {t('contextPreview.noContent')}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
