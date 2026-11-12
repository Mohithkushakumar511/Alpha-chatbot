import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import net from 'net';
import { fileURLToPath } from 'url';

import statusRoutes from './routes/status.js';
import chatRoutes from './routes/chat.js';
import voiceRoutes from './routes/voice.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', statusRoutes);
app.use('/api', chatRoutes);
app.use('/api', voiceRoutes);

const distDir = path.join(rootDir, 'dist');
app.use(express.static(distDir));

app.use('/api', (req, res) => {
  res.status(404).json({ error: `API route ${req.originalUrl} not found` });
});

app.use((req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.json({ message: 'ALPHA backend running. Use Vite frontend on port 5173.' });
    }
  });
});

function checkPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port);
  });
}

async function findAvailablePort(startPort) {
  let port = parseInt(startPort, 10) || 3001;
  for (let i = 0; i < 15; i++) {
    if (await checkPortAvailable(port)) {
      return port;
    }
    port++;
  }
  return startPort;
}

const desiredPort = process.env.SERVER_PORT || 3001;

findAvailablePort(desiredPort).then((port) => {
  app.listen(port, () => {
    console.log(`\n==================================================`);
    console.log(`🤖 ALPHA — Advanced AI Chatbot Backend Engine`);
    console.log(`==================================================`);
    console.log(`⚡ API Server:  http://localhost:${port}`);
    console.log(`🔑 Groq Engine: ${process.env.GROQ_API_KEY ? 'CONFIGURED (' + (process.env.AI_MODEL || 'openai/gpt-oss-120b') + ')' : 'UNCONFIGURED'}`);
    console.log(`🌐 LangSearch:  ${process.env.LANGSEARCH_API_KEY ? 'CONFIGURED' : 'UNCONFIGURED'}`);
    console.log(`🎙️ Voice Engine: ${process.env.FISH_AUDIO_API_KEY ? 'FISH AUDIO' : 'BROWSER WEB SPEECH'}`);
    console.log(`==================================================\n`);
  });
});
