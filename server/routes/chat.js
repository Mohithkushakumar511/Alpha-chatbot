import express from 'express';
import { groqService } from '../services/groqService.js';
import { searchService } from '../services/searchService.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
  const { messages, mode = 'chat' } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required and must not be empty.' });
  }

  try {
    let searchSources = [];
    const formattedMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // If Search mode, query LangSearch and enrich prompt
    if (mode === 'search') {
      const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
      const query = lastUserMsg?.content || '';

      if (query && searchService.isConfigured()) {
        const searchRes = await searchService.search(query, 4);
        searchSources = searchRes.results || [];

        if (searchSources.length > 0) {
          const contextText = searchSources
            .map((s, idx) => `[Source ${idx + 1}]: "${s.title}" (${s.url})\nSummary: ${s.snippet}`)
            .join('\n\n');

          formattedMessages.push({
            role: 'system',
            content: `The user asked: "${query}". Real-time web search results from LangSearch:\n\n${contextText}\n\nSynthesize an authoritative, clear answer incorporating these facts. Cite sources by name where relevant.`,
          });
        }
      }
    }

    const reply = await groqService.chat(formattedMessages, mode);

    res.json({
      reply,
      mode,
      sources: searchSources,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({
      error: err.message || 'An error occurred while generating the AI response.',
    });
  }
});

export default router;
