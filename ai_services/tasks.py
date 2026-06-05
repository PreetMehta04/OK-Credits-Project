"""
Celery Tasks — async GPU inference tasks
"""
import asyncio
import logging
import os
from worker import app

logger = logging.getLogger(__name__)


@app.task(name="tasks.run_tryon", bind=True, max_retries=2)
def run_tryon(self, job_id: str, user_image_url: str, product_id: str, saree_description: str = "traditional saree"):
    """
    Virtual try-on inference task.
    [AI INTEGRATION POINT #4+#5+#6+#7+#8]
    Runs the full pipeline on GPU worker.
    """
    import httpx
    import io
    import uuid

    logger.info(f"TryOn task started: job_id={job_id}")

    try:
        # Download user image
        with httpx.Client() as client:
            resp = client.get(user_image_url, timeout=30)
            user_image_bytes = resp.content

        # Run pipeline
        from tryon.pipeline import pipeline
        result_bytes = asyncio.run(
            pipeline.run(user_image_bytes, f"https://picsum.photos/seed/{product_id}/400/600", saree_description)
        )

        # Save result
        output_filename = f"tryon_{uuid.uuid4()}.jpg"
        output_path = os.path.join("uploads", output_filename)
        with open(output_path, "wb") as f:
            f.write(result_bytes)

        output_url = f"/uploads/{output_filename}"

        # Update job status in DB (via HTTP to backend service)
        with httpx.Client() as client:
            client.patch(
                f"http://backend:8000/api/v1/tryon/jobs/{job_id}",
                json={"status": "completed", "output_image_url": output_url},
                timeout=10,
            )

        logger.info(f"TryOn task complete: job_id={job_id}")
        return {"status": "completed", "output_url": output_url}

    except Exception as exc:
        logger.error(f"TryOn task failed: {exc}")
        raise self.retry(exc=exc, countdown=5)


@app.task(name="tasks.generate_embeddings")
def generate_embeddings(product_ids: list):
    """
    Batch embedding generation for products.
    [AI INTEGRATION POINT #2]
    """
    logger.info(f"Generating embeddings for {len(product_ids)} products")
    # In production: fetch products from DB, generate embeddings, update vector store
    # PLACEHOLDER: log only
    return {"generated": len(product_ids)}
