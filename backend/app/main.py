import json
import logging
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from app.api.v1.router import api_router
from app.config import settings
from app.core.middleware import LoggingMiddleware
from app.core.rate_limiter import limiter
from app.database import engine, Base, AsyncSessionLocal
from app.models.product import Product
import os

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s — %(name)s — %(levelname)s — %(message)s",
)
logger = logging.getLogger(__name__)


def _get_sample_product_path() -> Path:
    return Path(__file__).resolve().parents[2] / "data" / "sample_products.json"


async def _seed_sample_products(session: AsyncSession) -> None:
    result = await session.execute(select(func.count()).select_from(Product))
    product_count = result.scalar_one()
    if product_count > 0:
        logger.info("Sample products already present in database.")
        return

    sample_file = _get_sample_product_path()
    if not sample_file.exists():
        logger.warning("Sample products file not found: %s", sample_file)
        return

    with sample_file.open("r", encoding="utf-8") as f:
        product_data = json.load(f)

    products_to_add = []
    for item in product_data:
        product_payload = {key: value for key, value in item.items() if key != "id"}
        products_to_add.append(Product(**product_payload))

    session.add_all(products_to_add)
    await session.commit()
    logger.info("Seeded %d sample products into database.", len(products_to_add))


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("SareeAI backend starting up...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables ready.")

    async with AsyncSessionLocal() as session:
        await _seed_sample_products(session)

    yield
    logger.info("SareeAI backend shutting down.")
    await engine.dispose()


app = FastAPI(
    title="SareeAI API",
    description="AI-powered ethnic wear recommendation and virtual try-on platform",
    version="1.0.0",
    lifespan=lifespan,
)

# Rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging middleware
app.add_middleware(LoggingMiddleware)

# Static files for uploads
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# API routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "sareeai-backend", "version": "1.0.0"}
