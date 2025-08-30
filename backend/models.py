"""Pydantic models for API request/response schemas."""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum


class SkinType(str, Enum):
    """Skin type options."""
    OILY = "oily"
    DRY = "dry"
    SENSITIVE = "sensitive"
    COMBINATION = "combination"
    NORMAL = "normal"


class SkinConcern(str, Enum):
    """Common skin concerns."""
    ACNE = "acne"
    PIGMENTATION = "pigmentation"
    WRINKLES = "wrinkles"
    DULLNESS = "dullness"
    DARK_SPOTS = "dark_spots"
    REDNESS = "redness"
    LARGE_PORES = "large_pores"
    UNEVEN_TEXTURE = "uneven_texture"


class UserQuestionnaire(BaseModel):
    """User questionnaire data model."""
    
    # Basic skin information
    skin_type: SkinType = Field(..., description="Primary skin type")
    concerns: List[SkinConcern] = Field(..., description="List of skin concerns")
    
    # Allergies and sensitivities
    allergies: Optional[str] = Field(None, description="Known allergies or sensitivities")
    sensitive_ingredients: Optional[List[str]] = Field(None, description="Ingredients to avoid")
    
    # Preferences
    prefers_natural: bool = Field(False, description="Preference for natural products")
    budget_range: Optional[str] = Field(None, description="Budget preference (low/medium/high)")
    product_preferences: Optional[List[str]] = Field(None, description="Preferred product types")
    
    # Lifestyle factors
    sun_exposure: Optional[str] = Field(None, description="Daily sun exposure level")
    stress_level: Optional[str] = Field(None, description="Stress level (low/medium/high)")
    sleep_quality: Optional[str] = Field(None, description="Sleep quality")
    diet_notes: Optional[str] = Field(None, description="Dietary factors affecting skin")
    
    # Additional information
    current_routine: Optional[str] = Field(None, description="Current skincare routine")
    additional_notes: Optional[str] = Field(None, description="Any additional information")


class SkincareRecommendation(BaseModel):
    """Skincare recommendation response model."""
    
    morning_routine: List[str] = Field(..., description="Morning skincare routine steps")
    evening_routine: List[str] = Field(..., description="Evening skincare routine steps")
    lifestyle_tips: List[str] = Field(..., description="Lifestyle recommendations")
    remedies: List[str] = Field(..., description="Specific remedies for concerns")
    
    # Metadata
    confidence_score: Optional[float] = Field(None, description="Confidence in recommendations")
    sources: List[str] = Field(..., description="Source documents used")
    warnings: Optional[List[str]] = Field(None, description="Important warnings or disclaimers")


class RecommendationRequest(BaseModel):
    """Request model for getting recommendations."""
    questionnaire: UserQuestionnaire
    max_recommendations: Optional[int] = Field(5, description="Maximum number of recommendations per category")


class RecommendationResponse(BaseModel):
    """Response model for recommendations."""
    recommendations: SkincareRecommendation
    user_profile_summary: str = Field(..., description="Summary of user's skin profile")
    disclaimer: str = Field(..., description="Medical disclaimer")
    success: bool = Field(True, description="Request success status")
    message: Optional[str] = Field(None, description="Additional message or error")