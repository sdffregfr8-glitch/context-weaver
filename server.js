// Express Backend Server for Context Files API
// Version: 1.0.0

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CONTEXT_DIR = process.env.CONTEXT_DIR || '/app/context';

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Helper function to get file type
function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase().slice(1);
  const typeMap = {
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
}

// API: List all context files
app.get('/api/files', async (req, res) => {
  try {
    // Check if context directory exists
    if (!fs.existsSync(CONTEXT_DIR)) {
      console.log(`Context directory not found: ${CONTEXT_DIR}`);
      return res.json({ files: [], message: 'Context directory not found' });
    }

    const items = fs.readdirSync(CONTEXT_DIR);
    const files = [];

    for (const item of items) {
      const fullPath = path.join(CONTEXT_DIR, item);
      const stat = fs.statSync(fullPath);

      // Only include files, not directories
      if (stat.isFile()) {
        files.push({
          name: item,
          path: fullPath,
          size: stat.size,
          type: getFileType(item),
          lastModified: stat.mtime.toISOString(),
        });
      }
    }

    console.log(`Found ${files.length} files in ${CONTEXT_DIR}`);
    res.json({ files });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files', details: error.message });
  }
});

// API: Get file content by name
app.get('/api/files/:filename', async (req, res) => {
  try {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(CONTEXT_DIR, filename);

    // Security check: prevent path traversal
    const resolvedPath = path.resolve(filePath);
    const resolvedContextDir = path.resolve(CONTEXT_DIR);
    
    if (!resolvedPath.startsWith(resolvedContextDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const stat = fs.statSync(filePath);

    res.json({
      name: filename,
      content: content,
      size: stat.size,
      type: getFileType(filename),
      lastModified: stat.mtime.toISOString(),
    });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read file', details: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    contextDir: CONTEXT_DIR,
    contextDirExists: fs.existsSync(CONTEXT_DIR)
  });
});

// Serve static files from dist folder (production build)
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Context directory: ${CONTEXT_DIR}`);
  console.log(`📋 API endpoints:`);
  console.log(`   - GET /api/files - List all context files`);
  console.log(`   - GET /api/files/:filename - Get file content`);
  console.log(`   - GET /api/health - Health check`);
});
