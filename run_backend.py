#!/usr/bin/env python3
"""Script to run the FastAPI backend server."""

import uvicorn
from config.settings import get_settings

settings = get_settings()

if __name__ == "__main__":
    print("🚀 Starting Skincare RAG Backend Server...")
    print(f"📍 Server will be available at: http://{settings.API_HOST}:{settings.API_PORT}")
    print(f"📚 Using documents from: {settings.DATA_PATH}")
    print(f"🤖 LLM Model: {settings.LLM_MODEL}")
    print(f"🔍 Embedding Model: {settings.EMBEDDING_MODEL}")
    print("=" * 50)
    
    uvicorn.run(
        "backend.api:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=False,
        log_level="info"
    )