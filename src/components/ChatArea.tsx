import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import type { Message } from '@/types';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  serverConnected: boolean;
}

export function ChatArea({ 
  messages, 
  isLoading, 
  onSendMessage,
  serverConnected 
}: ChatAreaProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
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
