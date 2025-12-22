import { useState, useCallback } from 'react';
import type { OllamaResponse, ServerStatus, ContextFile } from '@/types';

const OLLAMA_ENDPOINT = 'http://5.182.18.219:11434';

export function useOllama() {
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    isConnected: false,
    isChecking: false,
    lastChecked: null,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const checkHealth = useCallback(async (): Promise<boolean> => {
    setServerStatus(prev => ({ ...prev, isChecking: true }));
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${OLLAMA_ENDPOINT}/api/tags`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setServerStatus({
          isConnected: true,
          isChecking: false,
          lastChecked: new Date(),
          availableModels: data.models?.map((m: { name: string }) => m.name) || [],
        });
        return true;
      }
    } catch (error) {
      console.error('Health check failed:', error);
    }
    
    setServerStatus({
      isConnected: false,
      isChecking: false,
      lastChecked: new Date(),
    });
    return false;
  }, []);

  const generateResponse = useCallback(async (
    prompt: string,
    contextFiles: ContextFile[] = []
  ): Promise<string> => {
    setIsGenerating(true);

    try {
      // Build context injection
      let contextBlock = '';
      if (contextFiles.length > 0) {
        const contextParts = contextFiles
          .filter(f => f.content)
          .map(f => `--- START: ${f.name} ---\n${f.content}\n--- END: ${f.name} ---`);
        
        if (contextParts.length > 0) {
          contextBlock = `\n\n=== CONTEXT STARTS HERE ===\n${contextParts.join('\n\n')}\n=== CONTEXT ENDS HERE ===\n\n`;
        }
      }

      const systemPrompt = `You are an intelligent AI assistant specialized in document analysis. You provide accurate, helpful responses based on the context provided. Always cite specific parts of the documents when relevant. Respond in the same language as the user's question.${contextBlock}`;

      const response = await fetch(`${OLLAMA_ENDPOINT}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3:latest',
          prompt: prompt,
          system: systemPrompt,
          stream: false,
          options: {
            temperature: 0.2,
            top_p: 0.9,
            num_predict: 2048,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response || 'No response generated.';
    } catch (error) {
      console.error('Generation error:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    serverStatus,
    isGenerating,
    checkHealth,
    generateResponse,
  };
}
