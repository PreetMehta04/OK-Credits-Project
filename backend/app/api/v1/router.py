import os
import uuid
from pathlib import Path
from typing import List, Optional
from decimal import Decimal

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, Form
from sqlalchemy.ext.asyncio import AsyncSession

import openai

from app.config import settings
# API key paste here in backend/.env as OPENAI_API_KEY
openai.api_key = settings.OPENAI_API_KEY
from app.database import get_db
from app.schemas.product import ProductSearchRequest, PaginatedProductResponse, ProductResponse, ProductCreateRequest, ProductImage
from app.schemas.recommendation import (
    ChatRequest,
    ChatResponse,
    RecommendedProduct,
    TryOnJobResponse,
    TryOnStatusResponse,
)
from app.services.product_service import product_service
from app.services.recommendation_service import recommendation_service
from app.services.tryon_service import tryon_service

api_router = APIRouter()

UPLOADS_DIR = Path("uploads")
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


@api_router.get("/products", response_model=PaginatedProductResponse)
async def list_products(
    query: ProductSearchRequest = Depends(),
    db: AsyncSession = Depends(get_db),
):
    products, total, pages = await product_service.search(db, query)
    return {
        "products": products,
        "total": total,
        "page": query.page,
        "page_size": query.page_size,
        "pages": pages,
    }


@api_router.get("/products/trending", response_model=List[ProductResponse])
async def trending_products(db: AsyncSession = Depends(get_db)):
    products = await product_service.get_trending(db)
    return products


@api_router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str, db: AsyncSession = Depends(get_db)):
    # Support product code lookup for demo paths like /products/demo-2
    try:
        return await product_service.get_by_code(db, product_id)
    except HTTPException:
        # Fallback to UUID search if `product_id` is a UUID string
        return await product_service.get_by_id(db, product_id)


@api_router.post("/recommend/chat", response_model=ChatResponse)
async def recommend_chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
):
    return await recommendation_service.handle_chat(db, request)


@api_router.get("/recommend/trending", response_model=List[RecommendedProduct])
async def recommend_trending(db: AsyncSession = Depends(get_db)):
    products = await product_service.get_trending(db)
    recommendations = [
        RecommendedProduct(
            id=str(product.id),
            product_code=product.product_code,
            name=product.name,
            fabric=product.fabric,
            price=float(product.price),
            discount_price=float(product.discount_price) if product.discount_price else None,
            images=product.images,
            match_score=1.0,
            explanation="Trending now",
            occasion_tags=product.occasion_tags,
        )
        for product in products
    ]
    return recommendations


@api_router.post("/tryon/upload")
async def upload_tryon_image(file: UploadFile = File(...)):
    suffix = Path(file.filename).suffix or ".bin"
    filename = f"{uuid.uuid4()}{suffix}"
    file_path = UPLOADS_DIR / filename
    contents = await file.read()
    file_path.write_bytes(contents)
    return {"image_url": f"/uploads/{filename}"}


@api_router.post("/tryon/generate", response_model=TryOnJobResponse)
async def generate_tryon(
    product_id: str,
    input_image_url: str,
    db: AsyncSession = Depends(get_db),
):
    return await tryon_service.create_job(db, product_id, input_image_url)


@api_router.get("/tryon/status/{job_id}", response_model=TryOnStatusResponse)
async def tryon_status(job_id: str, db: AsyncSession = Depends(get_db)):
    return await tryon_service.get_status(db, job_id)


@api_router.post("/admin/products/upload", response_model=ProductResponse)
async def admin_upload_product(
    file: UploadFile = File(...),
    product_code: str = Form(...),
    name: str = Form(...),
    category: str = Form(...),
    fabric: str = Form(...),
    price: float = Form(...),
    discount_price: Optional[float] = Form(None),
    stock_quantity: int = Form(default=0),
    description: Optional[str] = Form(None),
    regional_style: Optional[str] = Form(None),
    blouse_included: bool = Form(default=False),
    db: AsyncSession = Depends(get_db),
):
    """Admin endpoint to upload a new product with image"""
    try:
        # Save uploaded image
        suffix = Path(file.filename).suffix or ".jpg"
        filename = f"{uuid.uuid4()}{suffix}"
        file_path = UPLOADS_DIR / filename
        contents = await file.read()
        file_path.write_bytes(contents)
        image_url = f"/uploads/{filename}"

        # Create product with image
        product_data = ProductCreateRequest(
            product_code=product_code,
            name=name,
            category=category,
            fabric=fabric,
            price=Decimal(str(price)),
            discount_price=Decimal(str(discount_price)) if discount_price else None,
            stock_quantity=stock_quantity,
            description=description,
            regional_style=regional_style,
            blouse_included=blouse_included,
            images=[ProductImage(url=image_url, angle="front", is_primary=True)],
        )
        
        product = await product_service.create(db, product_data)
        await db.commit()
        await db.refresh(product)
        
        return ProductResponse(
            id=str(product.id),
            product_code=product.product_code,
            name=product.name,
            category=product.category,
            fabric=product.fabric,
            price=float(product.price),
            discount_price=float(product.discount_price) if product.discount_price else None,
            stock_quantity=product.stock_quantity,
            description=product.description,
            regional_style=product.regional_style,
            blouse_included=product.blouse_included,
            images=product.images,
            trending_score=product.trending_score,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to upload product: {str(e)}")
