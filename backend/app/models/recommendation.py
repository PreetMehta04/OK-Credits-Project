import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, JSON, Enum as SAEnum, ForeignKey
from app.database import Base, GUID
import enum


class TryOnStatus(str, enum.Enum):
    queued = "queued"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class RecommendationSession(Base):
    __tablename__ = "recommendation_sessions"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=True)
    session_token = Column(String(64), unique=True, index=True)
    preferences = Column(JSON, nullable=True)
    conversation_history = Column(JSON, default=list)
    recommended_products = Column(JSON, default=list)
    feedback_score = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class TryOnJob(Base):
    __tablename__ = "tryon_jobs"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=True)
    product_id = Column(GUID(), ForeignKey("products.id"), nullable=False)
    input_image_url = Column(String, nullable=False)
    output_image_url = Column(String, nullable=True)
    status = Column(SAEnum(TryOnStatus), default=TryOnStatus.queued)
    processing_time_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    event_type = Column(String(50), nullable=False, index=True)
    user_id = Column(GUID(), nullable=True)
    product_id = Column(GUID(), nullable=True)
    event_metadata = Column("metadata", JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
