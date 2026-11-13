import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from server.config import (
    SERVER_PORT,
    GROQ_API_KEY,
    AI_MODEL,
    LANGSEARCH_API_KEY,
    FISH_AUDIO_API_KEY,
    BASE_DIR,
    FRONTEND_URL,
)
from server.routes.status import router as status_router
from server.routes.chat import router as chat_router
from server.routes.voice import router as voice_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    groq_status = (
        f"CONFIGURED ({AI_MODEL})"
        if (GROQ_API_KEY and not GROQ_API_KEY.startswith("your_"))
        else "UNCONFIGURED"
    )
    langsearch_status = (
        "CONFIGURED"
        if (LANGSEARCH_API_KEY and not LANGSEARCH_API_KEY.startswith("your_"))
        else "UNCONFIGURED"
    )
    voice_status = (
        "FISH AUDIO"
        if (FISH_AUDIO_API_KEY and not FISH_AUDIO_API_KEY.startswith("your_"))
        else "BROWSER WEB SPEECH"
    )

    print("\n==================================================")
    print("ALPHA -- Advanced AI Chatbot Backend Engine (FastAPI)")
    print("==================================================")
    print(f"API Server:   http://localhost:{SERVER_PORT}")
    print(f"Groq Engine:  {groq_status}")
    print(f"LangSearch:   {langsearch_status}")
    print(f"Voice Engine: {voice_status}")
    print("==================================================\n")
    yield


app = FastAPI(
    title="ALPHA — Advanced AI Chatbot Backend",
    version="1.0.0",
    lifespan=lifespan,
)

cors_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

if FRONTEND_URL:
    for url in FRONTEND_URL.split(","):
        cleaned = url.strip().rstrip("/")
        if cleaned and cleaned not in cors_origins:
            cors_origins.append(cleaned)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(status_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(voice_router, prefix="/api")

dist_dir = BASE_DIR / "dist"
if dist_dir.exists() and dist_dir.is_dir():
    app.mount("/assets", StaticFiles(directory=str(dist_dir / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = dist_dir / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        index_file = dist_dir / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return JSONResponse({"message": "ALPHA FastAPI backend running. Use Vite frontend on port 5173."})
else:
    @app.get("/")
    async def root():
        return {"message": "ALPHA FastAPI backend running. Use Vite frontend on port 5173."}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.main:app", host="0.0.0.0", port=SERVER_PORT, reload=True)
