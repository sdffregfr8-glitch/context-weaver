// Final Build Version: 3.0.0 - Stable Deployment
import { useState, useCallback } from 'react';
import type { ContextFile } from '@/types';

// Demo files for fallback (when server files are unavailable)
const DEMO_FILES: ContextFile[] = [
  {
    id: '1',
    name: 'project-overview.md',
    path: '/app/context/project-overview.md',
    size: 2048,
    type: 'markdown',
    lastModified: new Date(),
    isLoading: false,
    isSelected: true,
    content: `# Project Overview

## Introduction
This is a comprehensive AI-powered document analysis system designed to help users extract insights from their documents.

## Key Features
- Real-time document processing
- Context-aware responses
- Multi-language support
- Secure file handling

## Architecture
The system uses a modern microservices architecture with:
- Frontend: React with TypeScript
- AI Engine: Ollama with LLaMA 3
- Backend: Edge Functions for API routing`,
  },
  {
    id: '2',
    name: 'api-documentation.json',
    path: '/app/context/api-documentation.json',
    size: 4096,
    type: 'json',
    lastModified: new Date(),
    isLoading: false,
    isSelected: false,
    content: `{
  "api_version": "2.0",
  "endpoints": [
    {
      "path": "/api/analyze",
      "method": "POST",
      "description": "Analyze document content"
    },
    {
      "path": "/api/contexts",
      "method": "GET",
      "description": "List available contexts"
    }
  ],
  "rate_limits": {
    "requests_per_minute": 60,
    "max_file_size_mb": 10
  }
}`,
  },
  {
    id: '3',
    name: 'user-guide.txt',
    path: '/app/context/user-guide.txt',
    size: 1536,
    type: 'text',
    lastModified: new Date(),
    isLoading: false,
    isSelected: false,
    content: `User Guide - AI Context Engine

Getting Started:
1. Upload your documents or sync from server
2. Select the context files you want to analyze
3. Ask questions in natural language
4. Review AI responses with highlighted references

Tips for Best Results:
- Be specific in your questions
- Reference document sections by name
- Use follow-up questions for deeper analysis

Supported File Types:
- Markdown (.md)
- JSON (.json)
- Plain Text (.txt)
- PDF (coming soon)`,
  },
];

interface FileListResponse {
  files: {
    name: string;
    path: string;
    size: number;
    type: string;
    lastModified: string;
  }[];
}

interface FileContentResponse {
  content: string;
}

export function useContextFiles(filesApiPath: string = '/api/files') {
  const [files, setFiles] = useState<ContextFile[]>(DEMO_FILES);
  const [selectedFile, setSelectedFile] = useState<ContextFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isUsingDemoFiles, setIsUsingDemoFiles] = useState(true);

  const getFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const typeMap: Record<string, string> = {
      'md': 'markdown',
      'json': 'json',
      'txt': 'text',
      'js': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'jsx': 'javascript',
      'py': 'python',
      'html': 'html',
      'css': 'css',
    };
    return typeMap[ext] || 'text';
  };

  const syncFiles = useCallback(async () => {
    setIsSyncing(true);
    setLastError(null);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(filesApiPath, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data: FileListResponse = await response.json();
      
      const serverFiles: ContextFile[] = data.files.map((f, index) => ({
        id: `server-${index}-${f.name}`,
        name: f.name,
        path: f.path,
        size: f.size,
        type: getFileType(f.name),
        lastModified: new Date(f.lastModified),
        content: undefined,
        isLoading: false,
        isSelected: false,
      }));

      setFiles(serverFiles);
      setIsUsingDemoFiles(false);
      setLastError(null);
    } catch (error) {
      console.warn('Failed to fetch files from server, using demo files:', error);
      
      let errorMessage = 'sync_failed';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'timeout';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'network_error';
        } else {
          errorMessage = error.message;
        }
      }
      
      setLastError(errorMessage);
      setIsUsingDemoFiles(true);
      
      // Fallback to demo files with refreshed timestamps
      setFiles(DEMO_FILES.map(f => ({
        ...f,
        lastModified: new Date(),
      })));
    } finally {
      setIsSyncing(false);
    }
  }, [filesApiPath]);

  const loadFileContent = useCallback(async (fileId: string) => {
    // Set loading state for specific file
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, isLoading: true } : f
    ));
    
    const file = files.find(f => f.id === fileId);
    if (!file) {
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, isLoading: false } : f
      ));
      return;
    }

    // If content is already loaded (demo files), just select it
    if (file.content) {
      setSelectedFile(file);
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, isLoading: false } : f
      ));
      return;
    }

    // Try to fetch content from server
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${filesApiPath}/${encodeURIComponent(file.name)}`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status}`);
      }

      const data: FileContentResponse = await response.json();
      
      const updatedFile = { ...file, content: data.content, isLoading: false };
      setFiles(prev => prev.map(f => f.id === fileId ? updatedFile : f));
      setSelectedFile(updatedFile);
    } catch (error) {
      console.warn('Failed to load file content:', error);
      // Still select the file but without content
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, isLoading: false } : f
      ));
      setSelectedFile(file);
    }
  }, [files, filesApiPath]);

  // Toggle file selection for context
  const toggleFileSelection = useCallback((fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, isSelected: !f.isSelected } : f
    ));
  }, []);

  // Select all files
  const selectAllFiles = useCallback(() => {
    setFiles(prev => prev.map(f => ({ ...f, isSelected: true })));
  }, []);

  // Deselect all files
  const deselectAllFiles = useCallback(() => {
    setFiles(prev => prev.map(f => ({ ...f, isSelected: false })));
  }, []);

  const addFile = useCallback((file: Omit<ContextFile, 'id'>) => {
    const newFile: ContextFile = {
      ...file,
      id: crypto.randomUUID(),
      isLoading: false,
      isSelected: false,
    };
    setFiles(prev => [...prev, newFile]);
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
  }, [selectedFile]);

  // Get ONLY selected files with content for context
  const getActiveContextContent = useCallback(() => {
    return files.filter(f => f.isSelected && f.content);
  }, [files]);

  // Get count of selected files
  const selectedCount = files.filter(f => f.isSelected).length;

  return {
    files,
    selectedFile,
    isLoading,
    isSyncing,
    lastError,
    isUsingDemoFiles,
    selectedCount,
    syncFiles,
    loadFileContent,
    toggleFileSelection,
    selectAllFiles,
    deselectAllFiles,
    addFile,
    removeFile,
    setSelectedFile,
    getActiveContextContent,
  };
}
