"""
Recommendation Service — orchestrates AI recommendation pipeline.
Calls AI service for embeddings and ranking.
"""
import httpx
import secrets
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.recommendation import RecommendationSession
from app.models.product import Product
from app.schemas.recommendation import ChatRequest, ChatResponse, RecommendedProduct, PreferenceRequest
from app.config import settings
import uuid
import logging

logger = logging.getLogger(__name__)

# Mock quick replies for the conversational flow
QUICK_REPLIES_BY_STEP = {
    0: ["Wedding", "Party", "Casual", "Festive", "Religious"],
    1: ["Under ₹2000", "₹2000–₹5000", "₹5000–₹15000", "Above ₹15000"],
    2: ["Silk", "Cotton", "Chiffon", "Georgette", "Banarasi"],
    3: ["Red", "Blue", "Green", "Pink", "Gold", "White", "Purple"],
}


class RecommendationService:
    async def handle_chat(
        self, db: AsyncSession, request: ChatRequest
    ) -> ChatResponse:
        # Get or create session
        session = await self._get_or_create_session(db, request.session_id)

        # Store user message
        history = session.conversation_history or []
        history.append({"role": "user", "content": request.message, "lang": request.language})

        step = len([m for m in history if m["role"] == "user"])

        # ============================================================
        # [AI INTEGRATION POINT #1] — OpenAI GPT-4o Intent Parser
        # What happens here: send conversation history to GPT-4o,
        # extract structured preferences {occasion, budget, fabric...}
        # How to activate:
        #   pip install openai
        #   Set OPENAI_API_KEY in .env
        #   Call: client.chat.completions.create(model="gpt-4o", ...)
        # ============================================================
        # PLACEHOLDER: Rule-based preference extraction
        preferences = self._extract_preferences_mock(request.message, session.preferences or {})
        session.preferences = preferences

        # ============================================================
        # [AI INTEGRATION POINT #13] — Multilingual Response
        # What happens here: detect language, generate response in EN,
        # translate back to user's preferred language
        # How to activate: see ai_services/nlp/multilingual.py
        # ============================================================
        # PLACEHOLDER: English only response
        ai_message, quick_replies = self._generate_response_mock(step, preferences)

        history.append({"role": "assistant", "content": ai_message})
        session.conversation_history = history

        # Fetch recommendations if enough preferences collected
        recommendations = []
        if step >= 2 and preferences.get("occasion"):
            recommendations = await self._fetch_recommendations(db, preferences)
            session.recommended_products = [r.id for r in recommendations]

        await db.flush()

        return ChatResponse(
            session_id=str(session.id),
            message=ai_message,
            recommendations=recommendations if recommendations else None,
            quick_replies=quick_replies,
        )

    def _extract_preferences_mock(self, message: str, existing: dict) -> dict:
        """
        PLACEHOLDER for AI intent parsing.
        Extracts keywords from user message.
        """
        msg = message.lower()
        prefs = dict(existing)

        # Occasion detection
        for occ in ["wedding", "party", "casual", "festive", "religious", "office"]:
            if occ in msg:
                prefs["occasion"] = [occ]

        # Fabric detection
        for fab in ["silk", "cotton", "chiffon", "georgette", "banarasi", "linen"]:
            if fab in msg:
                prefs.setdefault("fabric", []).append(fab)

        # Budget detection
        if "under 2000" in msg or "₹2000" in msg:
            prefs["budget_max"] = 2000
        elif "5000" in msg:
            prefs["budget_max"] = 5000
        elif "15000" in msg or "15,000" in msg:
            prefs["budget_max"] = 15000

        # Color detection
        for color in ["red", "blue", "green", "pink", "gold", "white", "purple", "yellow"]:
            if color in msg:
                prefs.setdefault("color", []).append(color)

        return prefs

    def _generate_response_mock(self, step: int, prefs: dict):
        """
        PLACEHOLDER for AI response generation.
        Returns scripted conversational responses.
        """
        quick_replies = QUICK_REPLIES_BY_STEP.get(step, [])

        if step == 1:
            return (
                "Wonderful! What is the occasion you're shopping for?",
                QUICK_REPLIES_BY_STEP[0],
            )
        if step == 2:
            occ = prefs.get("occasion", ["this occasion"])[0]
            return (
                f"Great choice for a {occ}! What is your budget range?",
                QUICK_REPLIES_BY_STEP[1],
            )
        if step == 3:
            return (
                "Which fabric do you prefer?",
                QUICK_REPLIES_BY_STEP[2],
            )
        if step >= 4:
            return (
                "Here are your personalised saree recommendations based on your preferences! ✨",
                ["Show more options", "Change budget", "Different fabric"],
            )

        return ("Hello! I'm your AI Saree Stylist. What brings you here today?", QUICK_REPLIES_BY_STEP[0])

    async def _fetch_recommendations(
        self, db: AsyncSession, preferences: dict
    ) -> List[RecommendedProduct]:
        """
        Fetch products matching preferences and score them.
        """
        # ============================================================
        # [AI INTEGRATION POINT #3] — Vector Similarity Search
        # What happens here: convert preferences to embedding,
        # search FAISS/ChromaDB for nearest product vectors
        # How to activate: see ai_services/recommendation/vector_store.py
        # ============================================================
        # PLACEHOLDER: Simple SQL filter + mock scoring
        query = select(Product).where(Product.stock_quantity > 0)

        if preferences.get("budget_max"):
            query = query.where(Product.price <= preferences["budget_max"])
        if preferences.get("fabric"):
            query = query.where(Product.fabric.in_(preferences["fabric"]))

        query = query.order_by(Product.trending_score.desc()).limit(10)
        result = await db.execute(query)
        products = result.scalars().all()

        recommendations = []
        for i, p in enumerate(products):
            score = round(0.95 - i * 0.05, 2)
            rec = RecommendedProduct(
                id=str(p.id),
                product_code=p.product_code,
                name=p.name,
                fabric=p.fabric,
                price=float(p.price),
                discount_price=float(p.discount_price) if p.discount_price else None,
                images=p.images,
                match_score=score,
                explanation=f"Matches your {'budget and ' if preferences.get('budget_max') else ''}"
                            f"{'fabric preference' if preferences.get('fabric') else 'style preferences'}",
                occasion_tags=p.occasion_tags,
            )
            recommendations.append(rec)

        return recommendations

    async def _get_or_create_session(
        self, db: AsyncSession, session_id: Optional[str]
    ) -> RecommendationSession:
        if session_id:
            result = await db.execute(
                select(RecommendationSession).where(RecommendationSession.id == session_id)
            )
            session = result.scalar_one_or_none()
            if session:
                return session

        session = RecommendationSession(
            id=uuid.uuid4(),
            session_token=secrets.token_urlsafe(32),
        )
        db.add(session)
        await db.flush()
        return session


recommendation_service = RecommendationService()
