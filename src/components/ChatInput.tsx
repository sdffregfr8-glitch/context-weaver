import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isLoading && !disabled) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4"
    >
      <div className="glass-strong rounded-2xl p-2 flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chat.placeholder')}
            disabled={isLoading || disabled}
            className={`
              min-h-[48px] max-h-[150px] resize-none border-0 bg-transparent
              focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-3
              placeholder:text-muted-foreground/60
              ${isRTL ? 'text-right' : 'text-left'}
            `}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          
          {/* Character indicator */}
          <AnimatePresence>
            {input.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-2 end-2 text-xs text-muted-foreground"
              >
                {input.length}/4000
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || disabled}
            size="icon"
            className={`
              h-12 w-12 rounded-xl shrink-0 transition-all
              ${input.trim() && !isLoading 
                ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-primary' 
                : 'bg-secondary'
              }
            `}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className={isRTL ? 'rotate-180' : ''}
                >
                  <Send className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>

      {/* Hint */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <Sparkles className="h-3 w-3 text-primary/60" />
        <p className="text-xs text-muted-foreground/60">
          Shift + Enter for new line
        </p>
      </div>
    </motion.div>
  );
}
