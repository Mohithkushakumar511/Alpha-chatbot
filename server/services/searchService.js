export class SearchService {
  get apiKey() {
    return process.env.LANGSEARCH_API_KEY || '';
  }

  get baseUrl() {
    return 'https://api.langsearch.com/v1/web-search';
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
          query: 'ping',
          count: 1,
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async search(query, count = 5) {
    if (!this.isConfigured()) {
      return {
        query,
        results: [],
        error: 'LangSearch API key is not configured in server environment.',
      };
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          query,
          count,
          freshness: 'noLimit',
          summary: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`LangSearch request failed with status ${response.status}`);
      }

      const json = await response.json();
      const pages = json?.data?.webPages?.value || [];

      const results = pages.map((page) => ({
        title: page.name || 'Untitled Source',
        url: page.url || '',
        snippet: page.snippet || page.summary || '',
      }));

      return {
        query,
        results,
      };
    } catch (err) {
      console.error('LangSearch search error:', err);
      return {
        query,
        results: [],
        error: err.message,
      };
    }
  }
}

export const searchService = new SearchService();
