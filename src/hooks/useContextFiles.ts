import { useState, useCallback } from 'react';
import type { ContextFile } from '@/types';

// Demo files for showcase (since we can't access server filesystem from browser)
const DEMO_FILES: ContextFile[] = [
  {
    id: '1',
    name: 'project-overview.md',
    path: '/app/context/project-overview.md',
    size: 2048,
    type: 'markdown',
    lastModified: new Date(),
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

export function useContextFiles() {
  const [files, setFiles] = useState<ContextFile[]>(DEMO_FILES);
  const [selectedFile, setSelectedFile] = useState<ContextFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const syncFiles = useCallback(async () => {
    setIsSyncing(true);
    
    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In production, this would fetch from the server
    setFiles(DEMO_FILES.map(f => ({
      ...f,
      lastModified: new Date(),
    })));
    
    setIsSyncing(false);
  }, []);

  const loadFileContent = useCallback(async (fileId: string) => {
    setIsLoading(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const file = files.find(f => f.id === fileId);
    if (file) {
      setSelectedFile(file);
    }
    
    setIsLoading(false);
  }, [files]);

  const addFile = useCallback((file: Omit<ContextFile, 'id'>) => {
    const newFile: ContextFile = {
      ...file,
      id: crypto.randomUUID(),
    };
    setFiles(prev => [...prev, newFile]);
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
  }, [selectedFile]);

  const getActiveContextContent = useCallback(() => {
    return files.filter(f => f.content);
  }, [files]);

  return {
    files,
    selectedFile,
    isLoading,
    isSyncing,
    syncFiles,
    loadFileContent,
    addFile,
    removeFile,
    setSelectedFile,
    getActiveContextContent,
  };
}
