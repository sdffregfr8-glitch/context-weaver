import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Message, ContextFile } from '@/types';

interface ExportButtonProps {
  messages: Message[];
  contextFiles: ContextFile[];
}

export function ExportButton({ messages, contextFiles }: ExportButtonProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleExport = () => {
    if (messages.length === 0) {
      toast({
        variant: 'destructive',
        title: t('export.noMessages'),
        description: t('export.noMessagesDescription'),
      });
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    // Build export content
    let content = `# Context Weaver - Conversation Export\n`;
    content += `## Date: ${new Date().toLocaleString()}\n\n`;
    
    // Context files used
    if (contextFiles.length > 0) {
      content += `---\n## Context Files Used\n\n`;
      contextFiles.forEach(file => {
        content += `### ${file.name}\n`;
        content += `Path: ${file.path}\n`;
        content += `\`\`\`\n${file.content || 'Content not loaded'}\n\`\`\`\n\n`;
      });
    }
    
    // Conversation
    content += `---\n## Conversation\n\n`;
    messages.forEach(msg => {
      const role = msg.role === 'user' ? '👤 User' : '🤖 AI';
      const time = new Date(msg.timestamp).toLocaleTimeString();
      content += `### ${role} (${time})\n\n${msg.content}\n\n`;
    });

    // Create and download file
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `context-weaver-export-${timestamp}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: t('export.success'),
      description: t('export.successDescription'),
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleExport}
      className="glass"
      title={t('export.title')}
    >
      <Download className="h-4 w-4" />
    </Button>
  );
}
