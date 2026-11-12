from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from server.services.groq_service import groq_service
from server.services.search_service import search_service

router = APIRouter()


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(default_factory=list)
    mode: Optional[str] = "chat"


@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if not request.messages or len(request.messages) == 0:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": "Messages array is required and must not be empty."},
        )

    try:
        search_sources: List[Dict[str, Any]] = []
        formatted_messages = [
            {"role": m.role, "content": m.content}
            for m in request.messages
        ]

        mode = request.mode or "chat"

        if mode == "search":
            last_user_msg = next(
                (m for m in reversed(request.messages) if m.role == "user"), None
            )
            query = last_user_msg.content if last_user_msg else ""

            if query and search_service.is_configured():
                search_res = await search_service.search(query, 4)
                search_sources = search_res.get("results", [])

                if search_sources:
                    context_text = "\n\n".join(
                        f"[Source {idx + 1}]: \"{s.get('title')}\" ({s.get('url')})\nSummary: {s.get('snippet')}"
                        for idx, s in enumerate(search_sources)
                    )

                    formatted_messages.append({
                        "role": "system",
                        "content": (
                            f'The user asked: "{query}". Real-time web search results from LangSearch:\n\n'
                            f"{context_text}\n\n"
                            "Synthesize an authoritative, clear answer incorporating these facts. Cite sources by name where relevant."
                        ),
                    })

        reply = await groq_service.chat(formatted_messages, mode)

        return {
            "reply": reply,
            "mode": mode,
            "sources": search_sources,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    except Exception as err:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": str(err) or "An error occurred while generating the AI response."},
        )
