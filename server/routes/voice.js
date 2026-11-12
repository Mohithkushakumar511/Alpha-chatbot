import express from 'express';
import { voiceService } from '../services/voiceService.js';

const router = express.Router();

router.post('/voice/tts', async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Text is required for TTS synthesis.' });
  }

  try {
    const audioBuffer = await voiceService.textToSpeech(text);
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
    });
    res.send(audioBuffer);
  } catch (err) {
    res.status(500).json({
      error: err.message || 'TTS synthesis failed.',
      fallbackToBrowser: true,
    });
  }
});

export default router;
