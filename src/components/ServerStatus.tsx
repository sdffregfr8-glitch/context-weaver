import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { ServerStatus as ServerStatusType } from '@/types';

interface ServerStatusProps {
  status: ServerStatusType;
  onRefresh: () => void;
}

export function ServerStatus({ status, onRefresh }: ServerStatusProps) {
  const { t } = useTranslation();

  const getStatusColor = () => {
    if (status.isChecking) return 'status-connecting';
    return status.isConnected ? 'status-online' : 'status-offline';
  };

  const getStatusText = () => {
    if (status.isChecking) return t('status.connecting');
    return status.isConnected ? t('status.online') : t('status.offline');
  };

  return (
    <div className="flex items-center gap-3 glass rounded-xl px-4 py-2">
      <div className="flex items-center gap-2">
        <Server className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          {t('status.serverStatus')}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <motion.div
          className={`h-2.5 w-2.5 rounded-full ${getStatusColor()}`}
          animate={status.isChecking ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
        />
        <AnimatePresence mode="wait">
          <motion.span
            key={getStatusText()}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className={`text-sm font-medium ${
              status.isConnected ? 'text-success' : 'text-muted-foreground'
            }`}
          >
            {getStatusText()}
          </motion.span>
        </AnimatePresence>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onRefresh}
            disabled={status.isChecking}
          >
            <RefreshCw
              className={`h-4 w-4 ${status.isChecking ? 'animate-spin' : ''}`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('actions.refresh')}</p>
        </TooltipContent>
      </Tooltip>

      <AnimatePresence>
        {status.isConnected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Wifi className="h-4 w-4 text-success" />
          </motion.div>
        )}
        {!status.isConnected && !status.isChecking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <WifiOff className="h-4 w-4 text-destructive" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
