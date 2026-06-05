from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    language: str = "en"


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    language: str = "en"


class RecommendedProduct(BaseModel):
    id: str
    product_code: str
    name: str
    fabric: str
    price: float
    discount_price: Optional[float] = None
    images: Optional[List[Dict]] = None
    match_score: float
    explanation: str
    occasion_tags: Optional[List[str]] = None


class ChatResponse(BaseModel):
    session_id: str
    message: str
    recommendations: Optional[List[RecommendedProduct]] = None
    quick_replies: Optional[List[str]] = None


class PreferenceRequest(BaseModel):
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    occasion: Optional[List[str]] = None
    fabric: Optional[List[str]] = None
    color: Optional[List[str]] = None
    embroidery: Optional[List[str]] = None
    regional_style: Optional[str] = None
    body_type: Optional[str] = None
    drape_style: Optional[str] = None


class TryOnRequest(BaseModel):
    product_id: str


class TryOnJobResponse(BaseModel):
    job_id: str
    status: str
    estimated_wait_seconds: Optional[int] = None


class TryOnStatusResponse(BaseModel):
    job_id: str
    status: str
    output_image_url: Optional[str] = None
    processing_time_ms: Optional[int] = None
    error: Optional[str] = None
