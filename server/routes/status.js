import express from 'express';
import { groqService } from '../services/groqService.js';
import { searchService } from '../services/searchService.js';
import { voiceService } from '../services/voiceService.js';

const router = express.Router();

let statusCache = null;
let lastCheckTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds cache to avoid rate limits

router.get('/status', async (req, res) => {
  const now = Date.now();
  if (statusCache && now - lastCheckTime < CACHE_TTL_MS) {
    return res.json(statusCache);
  }

  try {
    const [groqConnected, searchConnected, voiceConnected] = await Promise.all([
      groqService.verifyConnection(),
      searchService.verifyConnection(),
      voiceService.verifyConnection(),
    ]);

    statusCache = {
      server: {
        online: true,
        label: 'Online',
      },
      groq: {
        connected: groqConnected,
        configured: groqService.isConfigured(),
        model: groqService.model,
        label: groqConnected ? 'Connected' : groqService.isConfigured() ? 'Available' : 'Unconfigured',
      },
      langSearch: {
        connected: searchConnected,
        configured: searchService.isConfigured(),
        label: searchConnected ? 'Connected' : searchService.isConfigured() ? 'Available' : 'Unconfigured',
      },
      voice: {
        fishAudio: voiceConnected,
        browserSpeechFallback: true,
        available: true,
        label: voiceConnected ? 'Fish Audio Active' : 'Browser Speech Active',
      },
      timestamp: new Date().toISOString(),
    };

    lastCheckTime = now;
    res.json(statusCache);
  } catch (err) {
    res.status(500).json({
      server: { online: true, label: 'Online' },
      groq: { connected: false, label: 'Error' },
      langSearch: { connected: false, label: 'Error' },
      voice: { available: true, label: 'Browser Speech Active' },
      error: err.message,
    });
  }
});

export default router;
