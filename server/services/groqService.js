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

  getSystemPrompt(mode = 'chat', responseLength = 'balanced') {
    const coreRules = `You are ALPHA, an advanced, highly intelligent and professional AI companion.
CRITICAL RESPONSE GUIDELINES (Always follow strictly):
1. SHORT, CLEAR & DIRECT: Keep answers short, clear, and direct. Deliver immediate value without fluff.
2. NO UNNECESSARY FILLER: Avoid unnecessary explanations, conversational preamble, filler, and repeated information.
3. NEVER REPEAT USER'S QUESTION: Never repeat, restate, or rephrase the user's question back to them.
4. BULLET POINTS OVER PARAGRAPHS: Use concise, scannable bullet points instead of long paragraphs.
5. 3–5 EXPLANATION POINTS: Keep explanations strictly to 3–5 bullet points unless the user explicitly requests more.
6. SIMPLE QUESTIONS: Answer simple, factual, or conceptual questions in 2–5 direct sentences.
7. SINGLE BEST SOLUTION: Provide the single best solution. Avoid generating multiple alternative solutions unless asked.
8. STEP-BY-STEP FOR COMPLEX TASKS: For complex tasks or workflows, explain step by step without unnecessary details.
9. COMPLETE CODE & OUTPUT: For coding questions, provide complete, working, production-quality code when requested (no placeholders), and show the expected output briefly.
10. LARGE PROJECTS: If asked for an entire multi-file codebase or huge project, provide the core foundational module/file and ask the user before generating the rest.
11. FORMATTING: Use clean GitHub-flavored markdown. Format code snippets with language fences (\`\`\`language ... \`\`\`).
12. ACCURACY & USEFULNESS: Prioritize accuracy, readability, precision, and practical usefulness at all times.`;

    const lenMode = (responseLength || 'balanced').toLowerCase().trim();
    let lengthInstructions = '';
    if (lenMode === 'quick') {
      lengthInstructions = `
RESPONSE LENGTH MODE: QUICK
- Goal: Rapid, ultra-concise answer.
- Format: 1–3 punchy bullet points OR 2–3 brief sentences maximum.
- Code: Provide only the minimal working code snippet with zero surrounding chatter.
- Skip all background context, theory, and pleasantries.`;
    } else if (lenMode === 'detailed') {
      lengthInstructions = `
RESPONSE LENGTH MODE: DETAILED
- Goal: Comprehensive, in-depth explanation and full implementation.
- Format: Structured breakdown with headers, numbered steps, and complete code with comments.
- Include concrete examples, key edge cases, and expected output.
- Maintain clean, logical organization without rambling or repetition.`;
    } else {
      lengthInstructions = `
RESPONSE LENGTH MODE: BALANCED (Default)
- Goal: Clear explanations with practical examples and expected output.
- Format: 3–5 crisp bullet points alongside a concise example or code snippet.
- Show expected output briefly.
- Optimal blend of speed, clarity, and depth.`;
    }

    let modeInstructions = '';
    switch (mode) {
      case 'code':
        modeInstructions = `
OPERATIONAL MODE: CODE
- Deliver complete, bug-free, modern code with standard conventions.
- Include a brief expected output or execution demonstration.
- Limit accompanying explanation to 3–5 bullet points highlighting core logic or edge cases.`;
        break;
      case 'create':
        modeInstructions = `
OPERATIONAL MODE: CREATE
- Deliver original, high-value ideas, outlines, or creative content in structured bullet points.`;
        break;
      case 'search':
        modeInstructions = `
OPERATIONAL MODE: SEARCH
- Synthesize live search context into authoritative, bulleted facts. Cite source names where relevant.`;
        break;
      case 'learn':
        modeInstructions = `
OPERATIONAL MODE: LEARN
- Explain concepts using an intuitive real-world analogy and a 3–5 step conceptual progression.`;
        break;
      case 'chat':
      default:
        modeInstructions = `
OPERATIONAL MODE: CHAT
- Maintain a professional, articulate, and direct conversational tone.`;
        break;
    }

    return `${coreRules}\n${lengthInstructions}\n${modeInstructions}`;
  }

  async chat(messages, mode = 'chat', responseLength = 'balanced') {
    if (!this.isConfigured()) {
      throw new Error('Groq API is not configured. Please supply GROQ_API_KEY in your server environment.');
    }

    const systemMessage = {
      role: 'system',
      content: this.getSystemPrompt(mode, responseLength),
    };

    const formattedMessages = [systemMessage, ...messages];

    const lenMode = (responseLength || 'balanced').toLowerCase().trim();
    let maxTokens = 1600;
    if (lenMode === 'quick') maxTokens = 600;
    else if (lenMode === 'detailed') maxTokens = 3600;

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: formattedMessages,
        temperature: mode === 'create' ? 0.7 : 0.35,
        max_tokens: maxTokens,
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
