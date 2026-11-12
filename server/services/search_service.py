from typing import Dict, Any, List
import httpx
from server.config import LANGSEARCH_API_KEY


class SearchService:
    def __init__(self):
        self.api_key = LANGSEARCH_API_KEY
        self.base_url = "https://api.langsearch.com/v1/web-search"

    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key.strip() and "your_" not in self.api_key)

    async def verify_connection(self) -> bool:
        if not self.is_configured():
            return False
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(
                    self.base_url,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.api_key}",
                    },
                    json={"query": "ping", "count": 1},
                )
                return res.is_success
        except Exception:
            return False

    async def search(self, query: str, count: int = 5) -> Dict[str, Any]:
        if not self.is_configured():
            return {
                "query": query,
                "results": [],
                "error": "LangSearch API key is not configured in server environment.",
            }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    self.base_url,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.api_key}",
                    },
                    json={
                        "query": query,
                        "count": count,
                        "freshness": "noLimit",
                        "summary": True,
                    },
                )

                if not response.is_success:
                    raise RuntimeError(f"LangSearch request failed with status {response.status_code}")

                data = response.json()
                pages = data.get("data", {}).get("webPages", {}).get("value", [])

                results = [
                    {
                        "title": page.get("name") or "Untitled Source",
                        "url": page.get("url") or "",
                        "snippet": page.get("snippet") or page.get("summary") or "",
                    }
                    for page in pages
                ]

                return {"query": query, "results": results}
        except Exception as err:
            return {"query": query, "results": [], "error": str(err)}


search_service = SearchService()
