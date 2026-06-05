"""
Celery Worker — async task queue for GPU inference
"""
from celery import Celery
import os

BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/1")
RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/2")

app = Celery("sareeai", broker=BROKER_URL, backend=RESULT_BACKEND)

app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_routes={
        "tasks.run_tryon": {"queue": "tryon"},
        "tasks.generate_embeddings": {"queue": "embeddings"},
    },
)

import tasks  # noqa — ensures tasks are registered
