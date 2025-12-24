import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import type { Message } from '@/types';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  serverConnected: boolean;
  onClearChat: () => void;
}

export function ChatArea({ 
  messages, 
  isLoading, 
  onSendMessage,
  serverConnected,
  onClearChat,
}: ChatAreaProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smart auto-scroll: only scroll if user is near bottom
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current && !isUserScrolling) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [isUserScrolling]);

  // Handle user scroll
  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    // If user scrolled up more than 100px, stop auto-scroll
    if (distanceFromBottom > 100) {
      setIsUserScrolling(true);
    } else {
      setIsUserScrolling(false);
    }
    
    // Reset after inactivity
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      if (distanceFromBottom <= 100) {
        setIsUserScrolling(false);
      }
    }, 1500);
  }, []);

  // Attach scroll listener
  useEffect(() => {
    const scrollContainer = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Clear Chat Button */}
      {messages.length > 0 && (
        <div className="flex justify-end px-4 py-2 border-b border-border/30">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive gap-2">
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t('actions.clear')}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-strong">
              <AlertDialogHeader>
                <AlertDialogTitle>{t('chat.clearConfirmTitle', 'مسح المحادثة؟')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('chat.clearConfirmDesc', 'سيتم حذف جميع الرسائل نهائياً. هل أنت متأكد؟')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onClearChat}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {t('actions.clear')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <ScrollArea className="flex-1 custom-scrollbar" ref={scrollRef}>
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="relative"
              >
                <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 glow-primary">
                  <Bot className="h-12 w-12 text-primary" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-2 -end-2"
                >
                  <Sparkles className="h-6 w-6 text-accent" />
                </motion.div>
              </motion.div>

              <h2 className="text-2xl font-bold text-gradient mb-3">
                {t('app.title')}
              </h2>
              <p className="text-muted-foreground max-w-md">
                {t('chat.greeting')}
              </p>

              {/* Quick actions */}
              <div className="flex flex-wrap gap-3 mt-8 justify-center">
                {[
                  'Summarize my documents',
                  'Find key insights',
                  'Explain the structure',
                ].map((action, idx) => (
                  <motion.button
                    key={action}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSendMessage(action)}
                    className="px-4 py-2 glass rounded-xl text-sm hover:bg-secondary/50 transition-colors"
                  >
                    {action}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage key={message.id} message={message} index={index} />
            ))
          )}
        </div>
      </ScrollArea>

      <ChatInput 
        onSend={onSendMessage} 
        isLoading={isLoading}
        disabled={!serverConnected}
      />
    </div>
  );
}
