import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
AI_MODEL = os.getenv("AI_MODEL", "openai/gpt-oss-120b").strip()
LANGSEARCH_API_KEY = os.getenv("LANGSEARCH_API_KEY", "").strip()
FISH_AUDIO_API_KEY = os.getenv("FISH_AUDIO_API_KEY", "").strip()
FISH_AUDIO_VOICE_ID = os.getenv("FISH_AUDIO_VOICE_ID", "9bd4fc7e630341749d8f1ade472f410c").strip()
FISH_AUDIO_MODEL = os.getenv("FISH_AUDIO_MODEL", "s2.1-pro-free").strip()
SERVER_PORT = int(os.getenv("SERVER_PORT", "3001"))
