export class VoiceService {
  get apiKey() {
    return process.env.FISH_AUDIO_API_KEY || '';
  }

  get voiceId() {
    return process.env.FISH_AUDIO_VOICE_ID || '9bd4fc7e630341749d8f1ade472f410c';
  }

  get model() {
    return process.env.FISH_AUDIO_MODEL || 's2.1-pro-free';
  }

  get baseUrl() {
    return 'https://api.fish.audio/v1/tts';
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
          text: 'test',
          reference_id: this.voiceId,
        }),
      });
      // 200 means active and has quota. 402 or 401 means unavailable
      return res.status === 200;
    } catch {
      return false;
    }
  }

  async textToSpeech(text) {
    if (!this.isConfigured()) {
      throw new Error('Fish Audio API key is not configured.');
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        text: text.slice(0, 500),
        reference_id: this.voiceId,
        format: 'mp3',
      }),
    });

    if (!response.ok) {
      throw new Error(`Fish Audio API returned status ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}

export const voiceService = new VoiceService();
