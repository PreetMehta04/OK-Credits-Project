import json
import math
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from fastapi import HTTPException
from app.models.product import Product
from app.schemas.product import ProductCreateRequest, ProductUpdateRequest, ProductSearchRequest
import uuid


class ProductService:
    async def create(self, db: AsyncSession, data: ProductCreateRequest) -> Product:
        product = Product(
            id=uuid.uuid4(),
            **data.model_dump(exclude={"images"}),
            images=[img.model_dump() for img in (data.images or [])],
        )
        db.add(product)
        await db.flush()
        return product

    async def get_by_id(self, db: AsyncSession, product_id: str) -> Product:
        result = await db.execute(select(Product).where(Product.id == product_id))
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    async def get_by_code(self, db: AsyncSession, code: str) -> Product:
        result = await db.execute(select(Product).where(Product.product_code == code))
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    async def search(self, db: AsyncSession, req: ProductSearchRequest):
        query = select(Product)

        if req.category:
            query = query.where(Product.category == req.category)
        if req.fabric:
            query = query.where(Product.fabric == req.fabric)
        if req.min_price:
            query = query.where(Product.price >= req.min_price)
        if req.max_price:
            query = query.where(Product.price <= req.max_price)
        if req.regional_style:
            query = query.where(Product.regional_style == req.regional_style)
        if req.query:
            like = f"%{req.query}%"
            query = query.where(
                or_(Product.name.ilike(like), Product.description.ilike(like))
            )

        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar()

        offset = (req.page - 1) * req.page_size
        result = await db.execute(query.offset(offset).limit(req.page_size))
        products = result.scalars().all()

        return products, total, math.ceil(total / req.page_size)

    async def update(self, db: AsyncSession, product_id: str, data: ProductUpdateRequest) -> Product:
        product = await self.get_by_id(db, product_id)
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(product, field, value)
        await db.flush()
        return product

    async def delete(self, db: AsyncSession, product_id: str):
        product = await self.get_by_id(db, product_id)
        await db.delete(product)

    async def get_trending(self, db: AsyncSession, limit: int = 10) -> List[Product]:
        result = await db.execute(
            select(Product)
            .where(Product.stock_quantity > 0)
            .order_by(Product.trending_score.desc())
            .limit(limit)
        )
        return result.scalars().all()

    async def get_low_stock(self, db: AsyncSession, threshold: int = 5) -> List[Product]:
        result = await db.execute(
            select(Product).where(Product.stock_quantity <= threshold).order_by(Product.stock_quantity)
        )
        return result.scalars().all()


product_service = ProductService()
