import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, RotateCcw, Server, FileText, Cpu, Thermometer, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { ServerSettings } from '@/hooks/useServerSettings';

interface SettingsModalProps {
  settings: ServerSettings;
  onUpdateSettings: (updates: Partial<ServerSettings>) => void;
  onResetSettings: () => void;
  defaultSettings: ServerSettings;
}

export function SettingsModal({
  settings,
  onUpdateSettings,
  onResetSettings,
  defaultSettings,
}: SettingsModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setLocalSettings(settings);
    }
  };

  const handleSave = () => {
    onUpdateSettings(localSettings);
    toast({
      title: t('settings.saved'),
      description: t('settings.savedDescription'),
    });
    setOpen(false);
  };

  const handleReset = () => {
    setLocalSettings(defaultSettings);
    onResetSettings();
    toast({
      title: t('settings.reset'),
      description: t('settings.resetDescription'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="glass">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-strong sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            {t('settings.title')}
          </DialogTitle>
          <DialogDescription>
            {t('settings.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Ollama Endpoint */}
          <div className="space-y-2">
            <Label htmlFor="endpoint" className="flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              {t('settings.ollamaEndpoint')}
            </Label>
            <Input
              id="endpoint"
              value={localSettings.ollamaEndpoint}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, ollamaEndpoint: e.target.value }))}
              placeholder="http://localhost:11434"
              className="glass"
              dir="ltr"
            />
            <p className="text-xs text-muted-foreground">
              {t('settings.endpointHint')}
            </p>
          </div>

          {/* Files API Path */}
          <div className="space-y-2">
            <Label htmlFor="filesPath" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              {t('settings.filesApiPath')}
            </Label>
            <Input
              id="filesPath"
              value={localSettings.filesApiPath}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, filesApiPath: e.target.value }))}
              placeholder="/api/files"
              className="glass"
              dir="ltr"
            />
          </div>

          {/* Model */}
          <div className="space-y-2">
            <Label htmlFor="model" className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              {t('settings.model')}
            </Label>
            <Input
              id="model"
              value={localSettings.model}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, model: e.target.value }))}
              placeholder="llama3:latest"
              className="glass"
              dir="ltr"
            />
          </div>

          {/* Temperature */}
          <div className="space-y-3">
            <Label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-primary" />
                {t('settings.temperature')}
              </span>
              <span className="text-sm text-muted-foreground">{localSettings.temperature.toFixed(2)}</span>
            </Label>
            <Slider
              value={[localSettings.temperature]}
              onValueChange={([value]) => setLocalSettings(prev => ({ ...prev, temperature: value }))}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
          </div>

          {/* Top P */}
          <div className="space-y-3">
            <Label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-primary" />
                {t('settings.topP')}
              </span>
              <span className="text-sm text-muted-foreground">{localSettings.topP.toFixed(2)}</span>
            </Label>
            <Slider
              value={[localSettings.topP]}
              onValueChange={([value]) => setLocalSettings(prev => ({ ...prev, topP: value }))}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="glass"
          >
            <RotateCcw className="h-4 w-4 me-2" />
            {t('settings.resetButton')}
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="glass"
            >
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave} className="glow-primary">
              {t('common.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
