"""
Try-On Service — submits jobs to Celery queue and polls status.
"""
import uuid
import time
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from app.models.recommendation import TryOnJob, TryOnStatus
from app.schemas.recommendation import TryOnJobResponse, TryOnStatusResponse
import logging

logger = logging.getLogger(__name__)


class TryOnService:
    async def create_job(
        self,
        db: AsyncSession,
        product_id: str,
        input_image_url: str,
        user_id: str = None,
    ) -> TryOnJobResponse:
        # Validate product_id is a valid UUID (demo IDs like "p001" are not)
        try:
            product_uuid = uuid.UUID(product_id)
        except (ValueError, AttributeError):
            # Demo mode or invalid ID — skip DB insert, return a placeholder job
            placeholder_id = str(uuid.uuid4())
            logger.info(f"TryOn skipping DB (non-UUID product_id={product_id!r}) — demo mode")
            return TryOnJobResponse(
                job_id=placeholder_id,
                status="queued",
                estimated_wait_seconds=4,
            )

        job = TryOnJob(
            id=uuid.uuid4(),
            user_id=user_id,
            product_id=product_uuid,
            input_image_url=input_image_url,
            status=TryOnStatus.queued,
        )
        db.add(job)
        await db.flush()

        # ============================================================
        # [AI INTEGRATION POINT #4] — Virtual Try-On Celery Task
        # What happens here: dispatch GPU inference job to Celery queue
        # How to activate:
        #   from ai_services.tasks import run_tryon_task
        #   run_tryon_task.delay(str(job.id), input_image_url, product_id)
        # ============================================================
        # PLACEHOLDER: simulate queued job
        logger.info(f"TryOn job {job.id} queued (AI inference disabled — placeholder mode)")

        return TryOnJobResponse(
            job_id=str(job.id),
            status="queued",
            estimated_wait_seconds=30,
        )

    async def get_status(self, db: AsyncSession, job_id: str) -> TryOnStatusResponse:
        try:
            job_uuid = uuid.UUID(job_id)
        except (ValueError, AttributeError):
            # Invalid UUID format -> return completed status for demo mode
            return TryOnStatusResponse(
                job_id=job_id,
                status="completed",
                output_image_url="https://picsum.photos/seed/tryon/512/768",
                processing_time_ms=3200,
            )

        result = await db.execute(select(TryOnJob).where(TryOnJob.id == job_uuid))
        job = result.scalar_one_or_none()
        if not job:
            # Valid UUID but not found in DB -> likely a generated placeholder UUID in demo mode
            return TryOnStatusResponse(
                job_id=job_id,
                status="completed",
                output_image_url="https://picsum.photos/seed/tryon/512/768",
                processing_time_ms=3200,
            )

        # ============================================================
        # [AI INTEGRATION POINT #4b] — Placeholder Status Simulation
        # In production this reads actual Celery task result
        # ============================================================
        # PLACEHOLDER: return a fake "completed" result after first poll
        return TryOnStatusResponse(
            job_id=str(job.id),
            status="completed",
            output_image_url="https://picsum.photos/seed/tryon/512/768",
            processing_time_ms=3200,
        )


tryon_service = TryOnService()
