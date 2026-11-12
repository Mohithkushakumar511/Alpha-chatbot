import asyncio
import time
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from fastapi import APIRouter
from fastapi.responses import JSONResponse

from server.services.groq_service import groq_service
from server.services.search_service import search_service
from server.services.voice_service import voice_service

router = APIRouter()

status_cache: Optional[Dict[str, Any]] = None
last_check_time: float = 0.0
CACHE_TTL_SECONDS = 15.0


@router.get("/status")
async def get_status():
    global status_cache, last_check_time

    now = time.time()
    if status_cache and (now - last_check_time) < CACHE_TTL_SECONDS:
        return status_cache

    try:
        groq_connected, search_connected, voice_connected = await asyncio.gather(
            groq_service.verify_connection(),
            search_service.verify_connection(),
            voice_service.verify_connection(),
            return_exceptions=True,
        )

        groq_ok = groq_connected is True
        search_ok = search_connected is True
        voice_ok = voice_connected is True

        groq_configured = groq_service.is_configured()
        search_configured = search_service.is_configured()

        status_cache = {
            "server": {
                "online": True,
                "label": "Online",
            },
            "groq": {
                "connected": groq_ok,
                "configured": groq_configured,
                "model": groq_service.model,
                "label": "Connected" if groq_ok else ("Available" if groq_configured else "Unconfigured"),
            },
            "langSearch": {
                "connected": search_ok,
                "configured": search_configured,
                "label": "Connected" if search_ok else ("Available" if search_configured else "Unconfigured"),
            },
            "voice": {
                "fishAudio": voice_ok,
                "browserSpeechFallback": True,
                "available": True,
                "label": "Fish Audio Active" if voice_ok else "Browser Speech Active",
            },
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

        last_check_time = now
        return status_cache

    except Exception as err:
        return JSONResponse(
            status_code=500,
            content={
                "server": {"online": True, "label": "Online"},
                "groq": {"connected": False, "label": "Error"},
                "langSearch": {"connected": False, "label": "Error"},
                "voice": {"available": True, "label": "Browser Speech Active"},
                "error": str(err),
            },
        )
