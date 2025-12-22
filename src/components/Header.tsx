import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Bot, Eye, EyeOff, Menu, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServerStatus } from './ServerStatus';
import { LanguageToggle } from './LanguageToggle';
import { SettingsModal } from './SettingsModal';
import { ExportButton } from './ExportButton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ServerStatus as ServerStatusType, Message, ContextFile } from '@/types';
import type { ServerSettings } from '@/hooks/useServerSettings';

interface HeaderProps {
  serverStatus: ServerStatusType;
  onRefreshStatus: () => void;
  previewOpen: boolean;
  onTogglePreview: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  settings: ServerSettings;
  onUpdateSettings: (updates: Partial<ServerSettings>) => void;
  onResetSettings: () => void;
  defaultSettings: ServerSettings;
  messages: Message[];
  contextFiles: ContextFile[];
}

export function Header({
  serverStatus,
  onRefreshStatus,
  previewOpen,
  onTogglePreview,
  onToggleSidebar,
  sidebarOpen,
  settings,
  onUpdateSettings,
  onResetSettings,
  defaultSettings,
  messages,
  contextFiles,
}: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="glass-strong border-b border-border/50 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left - Logo & Toggle */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-gradient">{t('app.title')}</h1>
              <p className="text-xs text-muted-foreground">{t('app.subtitle')}</p>
            </div>
          </motion.div>
        </div>

        {/* Center - Status with Error Indicator */}
        <div className="hidden md:flex items-center gap-2">
          <ServerStatus status={serverStatus} onRefresh={onRefreshStatus} />
          
          {serverStatus.error && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-destructive/10 border border-destructive/30">
                    <AlertTriangle className="h-3 w-3 text-destructive" />
                    <span className="text-xs text-destructive">
                      {serverStatus.error === 'cors_or_network' 
                        ? t('status.corsError') 
                        : serverStatus.error === 'timeout'
                        ? t('status.timeout')
                        : t('status.offline')}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-sm">
                    {serverStatus.error === 'cors_or_network'
                      ? t('errors.corsError')
                      : serverStatus.error === 'timeout'
                      ? t('errors.timeoutError')
                      : t('errors.connectionFailed')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          <ExportButton messages={messages} contextFiles={contextFiles} />
          
          <SettingsModal
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            onResetSettings={onResetSettings}
            defaultSettings={defaultSettings}
          />
          
          <LanguageToggle />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onTogglePreview}
            className="glass"
          >
            {previewOpen ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Status */}
      <div className="md:hidden mt-3 space-y-2">
        <ServerStatus status={serverStatus} onRefresh={onRefreshStatus} />
        
        {serverStatus.error && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-destructive/10 border border-destructive/30 text-xs">
            <AlertTriangle className="h-3 w-3 text-destructive" />
            <span className="text-destructive">
              {serverStatus.error === 'cors_or_network'
                ? t('errors.corsError')
                : serverStatus.error === 'timeout'
                ? t('errors.timeoutError')
                : t('errors.connectionFailed')}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
