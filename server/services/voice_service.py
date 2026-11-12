import httpx
from server.config import FISH_AUDIO_API_KEY, FISH_AUDIO_VOICE_ID, FISH_AUDIO_MODEL


class VoiceService:
    def __init__(self):
        self.api_key = FISH_AUDIO_API_KEY
        self.voice_id = FISH_AUDIO_VOICE_ID
        self.model = FISH_AUDIO_MODEL
        self.base_url = "https://api.fish.audio/v1/tts"

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
                    json={"text": "test", "reference_id": self.voice_id},
                )
                return res.status_code == 200
        except Exception:
            return False

    async def text_to_speech(self, text: str) -> bytes:
        if not self.is_configured():
            raise RuntimeError("Fish Audio API key is not configured.")

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                self.base_url,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.api_key}",
                },
                json={
                    "text": text[:500],
                    "reference_id": self.voice_id,
                    "format": "mp3",
                },
            )

            if not response.is_success:
                raise RuntimeError(f"Fish Audio API returned status {response.status_code}")

            return response.content


voice_service = VoiceService()
