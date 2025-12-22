// Final Build Version: 2.2.0 - Stable Deployment
import { useState, useCallback } from 'react';
import type { OllamaResponse, ServerStatus, ContextFile } from '@/types';

export function useOllama(endpoint: string = 'http://5.182.18.219:11434') {
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    isConnected: false,
    isChecking: false,
    lastChecked: null,
    error: null,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const checkHealth = useCallback(async (): Promise<boolean> => {
    setServerStatus(prev => ({ ...prev, isChecking: true, error: null }));
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(`${endpoint}/api/tags`, {
        signal: controller.signal,
        mode: 'cors',
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setServerStatus({
          isConnected: true,
          isChecking: false,
          lastChecked: new Date(),
          availableModels: data.models?.map((m: { name: string }) => m.name) || [],
          error: null,
        });
        return true;
      } else {
        throw new Error(`Server responded with status ${response.status}`);
      }
    } catch (error) {
      console.error('Health check failed:', error);
      
      let errorMessage = 'connection_failed';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'timeout';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'cors_or_network';
        } else {
          errorMessage = error.message;
        }
      }
      
      setServerStatus({
        isConnected: false,
        isChecking: false,
        lastChecked: new Date(),
        error: errorMessage,
      });
      return false;
    }
  }, [endpoint]);

  const generateResponse = useCallback(async (
    prompt: string,
    contextFiles: ContextFile[] = [],
    model: string = 'llama3:latest',
    temperature: number = 0.2,
    topP: number = 0.9
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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 min timeout

      const response = await fetch(`${endpoint}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          system: systemPrompt,
          stream: false,
          options: {
            temperature: temperature,
            top_p: topP,
            num_predict: 2048,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Ollama API error (${response.status}): ${errorText}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response || 'No response generated.';
    } catch (error) {
      console.error('Generation error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. The model might be processing a complex query.');
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error('Cannot connect to Ollama server. Please check CORS settings or server availability.');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  }, [endpoint]);

  return {
    serverStatus,
    isGenerating,
    checkHealth,
    generateResponse,
  };
}
