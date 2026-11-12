export class GroqService {
  get apiKey() {
    return process.env.GROQ_API_KEY || '';
  }

  get model() {
    return process.env.AI_MODEL || 'openai/gpt-oss-120b';
  }

  get baseUrl() {
    return 'https://api.groq.com/openai/v1/chat/completions';
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim() && !this.apiKey.includes('your_'));
  }

  async verifyConnection() {
    if (!this.isConfigured()) return false;
    try {
      const res = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5,
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  getSystemPrompt(mode = 'chat') {
    const base = `You are ALPHA, an advanced, highly intelligent futuristic AI companion.
You are articulate, insightful, concise when appropriate, and deeply knowledgeable across programming, mathematics, science, creative writing, and research.
Always format your answers with clean GitHub-flavored markdown. Format code snippets with language fences (\`\`\`language ... \`\`\`).`;

    switch (mode) {
      case 'code':
        return `${base}
You are currently operating in CODE mode. Focus on writing clean, efficient, modern, modular code with comments, edge-case explanations, and algorithmic complexity when requested.`;
      case 'create':
        return `${base}
You are currently operating in CREATE mode. Focus on creative brainstorming, writing, architectural design, naming, ideation, and crafting compelling concepts.`;
      case 'search':
        return `${base}
You are currently operating in SEARCH mode. You have access to real-time search context. Synthesize the search findings into a coherent, well-cited, clear breakdown. Mention source names where relevant.`;
      case 'learn':
        return `${base}
You are currently operating in LEARN mode. Break down concepts step-by-step with real-world analogies, beginner-friendly intuitions, and structured takeaways.`;
      case 'chat':
      default:
        return `${base}
You are operating in CHAT mode. Engage in natural, supportive, intellectually stimulating conversation.`;
    }
  }

  async chat(messages, mode = 'chat') {
    if (!this.isConfigured()) {
      throw new Error('Groq API is not configured. Please supply GROQ_API_KEY in your server environment.');
    }

    const systemMessage = {
      role: 'system',
      content: this.getSystemPrompt(mode),
    };

    const formattedMessages = [systemMessage, ...messages];

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: formattedMessages,
        temperature: mode === 'create' ? 0.8 : 0.4,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `Groq API Error (${response.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMsg = errorJson.error.message;
        }
      } catch {
        errorMsg = errorText || errorMsg;
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response generated.';
  }
}

export const groqService = new GroqService();
