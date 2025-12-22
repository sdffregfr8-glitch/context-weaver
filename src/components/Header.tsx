import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Bot, Eye, EyeOff, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServerStatus } from './ServerStatus';
import { LanguageToggle } from './LanguageToggle';
import type { ServerStatus as ServerStatusType } from '@/types';

interface HeaderProps {
  serverStatus: ServerStatusType;
  onRefreshStatus: () => void;
  previewOpen: boolean;
  onTogglePreview: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Header({
  serverStatus,
  onRefreshStatus,
  previewOpen,
  onTogglePreview,
  onToggleSidebar,
  sidebarOpen,
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

        {/* Center - Status */}
        <div className="hidden md:block">
          <ServerStatus status={serverStatus} onRefresh={onRefreshStatus} />
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
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
      <div className="md:hidden mt-3">
        <ServerStatus status={serverStatus} onRefresh={onRefreshStatus} />
      </div>
    </header>
  );
}
