from typing import List, Dict, Any
from groq import AsyncGroq
from server.config import GROQ_API_KEY, AI_MODEL


class GroqService:
    def __init__(self):
        self.api_key = GROQ_API_KEY
        self.model = AI_MODEL
        self._client: AsyncGroq | None = None

    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key.strip() and "your_" not in self.api_key)

    @property
    def client(self) -> AsyncGroq:
        if not self._client:
            self._client = AsyncGroq(api_key=self.api_key)
        return self._client

    async def verify_connection(self) -> bool:
        if not self.is_configured():
            return False
        try:
            res = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": "ping"}],
                max_tokens=5,
            )
            return bool(res and res.choices)
        except Exception as e:
            return False

    def get_system_prompt(self, mode: str = "chat") -> str:
        base = (
            "You are ALPHA, an advanced, highly intelligent futuristic AI companion.\n"
            "You are articulate, insightful, concise when appropriate, and deeply knowledgeable across "
            "programming, mathematics, science, creative writing, and research.\n"
            "Always format your answers with clean GitHub-flavored markdown. "
            "Format code snippets with language fences (```language ... ```)."
        )

        if mode == "code":
            return (
                f"{base}\n"
                "You are currently operating in CODE mode. Focus on writing clean, efficient, modern, modular "
                "code with comments, edge-case explanations, and algorithmic complexity when requested."
            )
        elif mode == "create":
            return (
                f"{base}\n"
                "You are currently operating in CREATE mode. Focus on creative brainstorming, writing, "
                "architectural design, naming, ideation, and crafting compelling concepts."
            )
        elif mode == "search":
            return (
                f"{base}\n"
                "You are currently operating in SEARCH mode. You have access to real-time search context. "
                "Synthesize the search findings into a coherent, well-cited, clear breakdown. Mention source names where relevant."
            )
        elif mode == "learn":
            return (
                f"{base}\n"
                "You are currently operating in LEARN mode. Break down concepts step-by-step with real-world "
                "analogies, beginner-friendly intuitions, and structured takeaways."
            )
        else:
            return (
                f"{base}\n"
                "You are operating in CHAT mode. Engage in natural, supportive, intellectually stimulating conversation."
            )

    async def chat(self, messages: List[Dict[str, str]], mode: str = "chat") -> str:
        if not self.is_configured():
            raise ValueError("Groq API is not configured. Please supply GROQ_API_KEY in your server environment.")

        system_message = {
            "role": "system",
            "content": self.get_system_prompt(mode),
        }

        formatted_messages = [system_message] + messages

        temperature = 0.8 if mode == "create" else 0.4

        try:
            completion = await self.client.chat.completions.create(
                model=self.model,
                messages=formatted_messages,
                temperature=temperature,
                max_tokens=3000,
            )

            content = completion.choices[0].message.content if completion.choices else None
            return content or "No response generated."
        except Exception as err:
            raise RuntimeError(f"Groq API Error: {str(err)}") from err


groq_service = GroqService()
