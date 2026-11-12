from fastapi import APIRouter, Response, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from server.services.voice_service import voice_service

router = APIRouter()


class TTSRequest(BaseModel):
    text: str = ""


@router.post("/voice/tts")
async def text_to_speech(req: TTSRequest):
    if not req.text or not req.text.strip():
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": "Text is required for TTS synthesis."},
        )

    try:
        audio_buffer = await voice_service.text_to_speech(req.text)
        return Response(
            content=audio_buffer,
            media_type="audio/mpeg",
            headers={"Content-Length": str(len(audio_buffer))},
        )
    except Exception as err:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": str(err) or "TTS synthesis failed.",
                "fallbackToBrowser": True,
            },
        )
