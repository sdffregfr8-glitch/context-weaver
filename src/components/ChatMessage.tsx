import { motion } from 'framer-motion';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import type { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.05 + 0.1, type: 'spring' }}
        className={`
          shrink-0 h-10 w-10 rounded-xl flex items-center justify-center
          ${isUser 
            ? 'bg-gradient-to-br from-primary to-accent' 
            : 'glass border border-border/50'
          }
        `}
      >
        {isUser ? (
          <User className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Bot className="h-5 w-5 text-primary" />
        )}
      </motion.div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`
            group relative px-5 py-4 
            ${isUser ? 'message-user' : 'message-ai'}
          `}
        >
          {message.isLoading ? (
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex gap-1"
              >
                <span className="h-2 w-2 bg-primary rounded-full" />
                <span className="h-2 w-2 bg-primary rounded-full" style={{ animationDelay: '0.2s' }} />
                <span className="h-2 w-2 bg-primary rounded-full" style={{ animationDelay: '0.4s' }} />
              </motion.div>
            </div>
          ) : (
            <>
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    code: ({ children }) => (
                      <code className="px-1.5 py-0.5 rounded bg-secondary/50 font-mono text-xs">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="p-3 rounded-lg bg-secondary/50 overflow-x-auto my-2">
                        {children}
                      </pre>
                    ),
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {/* Copy button */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute -bottom-2 end-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 glass"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Timestamp */}
        <p className={`text-xs text-muted-foreground mt-1.5 ${isUser ? 'text-end' : 'text-start'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}
