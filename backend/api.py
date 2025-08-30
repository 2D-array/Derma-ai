"""FastAPI backend for skincare RAG application."""

import logging
from typing import Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config.settings import get_settings

settings = get_settings()
from backend.models import (
    RecommendationRequest, 
    RecommendationResponse, 
    SkincareRecommendation,
    UserQuestionnaire
)
from backend.rag_pipeline import SkincareRAGPipeline

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global RAG pipeline instance
rag_pipeline = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    global rag_pipeline
    
    # Startup
    logger.info("Initializing RAG pipeline...")
    try:
        rag_pipeline = SkincareRAGPipeline()
        rag_pipeline.initialize_vector_store()
        logger.info("RAG pipeline initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize RAG pipeline: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")


# Create FastAPI app
app = FastAPI(
    title="Skincare RAG API",
    description="AI-powered skincare recommendations based on dermatology literature",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_rag_pipeline() -> SkincareRAGPipeline:
    """Dependency to get RAG pipeline instance."""
    if rag_pipeline is None:
        raise HTTPException(status_code=500, detail="RAG pipeline not initialized")
    return rag_pipeline


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Skincare RAG API is running"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "API is operational"}


@app.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(
    request: RecommendationRequest,
    pipeline: SkincareRAGPipeline = Depends(get_rag_pipeline)
) -> RecommendationResponse:
    """Generate skincare recommendations based on user questionnaire."""
    
    try:
        logger.info("Processing recommendation request")
        
        # Generate recommendations using RAG pipeline
        recommendations_dict = pipeline.generate_recommendations(request.questionnaire)
        
        # Create recommendation object
        recommendations = SkincareRecommendation(
            morning_routine=recommendations_dict.get("morning_routine", []),
            evening_routine=recommendations_dict.get("evening_routine", []),
            lifestyle_tips=recommendations_dict.get("lifestyle_tips", []),
            remedies=recommendations_dict.get("remedies", []),
            sources=recommendations_dict.get("sources", []),
            warnings=recommendations_dict.get("warnings", [])
        )
        
        # Create user profile summary
        concerns_str = ", ".join([c.value for c in request.questionnaire.concerns])
        user_profile_summary = (
            f"User with {request.questionnaire.skin_type.value} skin type, "
            f"primary concerns: {concerns_str}"
        )
        
        # Medical disclaimer
        disclaimer = (
            "These recommendations are for informational purposes only and are based on "
            "general dermatological literature. They do not constitute medical advice. "
            "For persistent skin issues or severe conditions, please consult a qualified dermatologist."
        )
        
        return RecommendationResponse(
            recommendations=recommendations,
            user_profile_summary=user_profile_summary,
            disclaimer=disclaimer,
            success=True
        )
    
    except Exception as e:
        logger.error(f"Error processing recommendation request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate recommendations: {str(e)}"
        )


@app.post("/rebuild-index")
async def rebuild_vector_index(
    pipeline: SkincareRAGPipeline = Depends(get_rag_pipeline)
):
    """Rebuild the vector store index (admin endpoint)."""
    try:
        logger.info("Rebuilding vector store index...")
        pipeline.initialize_vector_store(force_rebuild=True)
        return {"message": "Vector store index rebuilt successfully"}
    
    except Exception as e:
        logger.error(f"Error rebuilding index: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to rebuild index: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.api:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True
    )