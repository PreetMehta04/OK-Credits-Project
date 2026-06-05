from pydantic import BaseModel, field_validator
from typing import Optional, List, Dict, Any
from decimal import Decimal


class ProductImage(BaseModel):
    url: str
    angle: str = "front"
    is_primary: bool = False


class ProductCreateRequest(BaseModel):
    product_code: str
    name: str
    category: str
    fabric: str
    price: Decimal
    discount_price: Optional[Decimal] = None
    stock_quantity: int = 0
    color: Optional[List[str]] = None
    occasion_tags: Optional[List[str]] = None
    embroidery_type: Optional[List[str]] = None
    regional_style: Optional[str] = None
    description: Optional[str] = None
    blouse_included: bool = False
    blouse_suggestions: Optional[Dict[str, Any]] = None
    images: Optional[List[ProductImage]] = None
    trending_score: float = 0.0

    @field_validator("price")
    @classmethod
    def price_positive(cls, v):
        if v <= 0:
            raise ValueError("Price must be positive")
        return v


class ProductUpdateRequest(BaseModel):
    name: Optional[str] = None
    price: Optional[Decimal] = None
    discount_price: Optional[Decimal] = None
    stock_quantity: Optional[int] = None
    description: Optional[str] = None
    trending_score: Optional[float] = None
    occasion_tags: Optional[List[str]] = None


class ProductResponse(BaseModel):
    id: str
    product_code: str
    name: str
    category: str
    fabric: str
    price: float
    discount_price: Optional[float] = None
    stock_quantity: int
    color: Optional[List[str]] = None
    occasion_tags: Optional[List[str]] = None
    embroidery_type: Optional[List[str]] = None
    regional_style: Optional[str] = None
    description: Optional[str] = None
    blouse_included: bool
    images: Optional[List[Dict]] = None
    trending_score: float

    class Config:
        from_attributes = True


class ProductSearchRequest(BaseModel):
    query: Optional[str] = None
    category: Optional[str] = None
    fabric: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    occasion: Optional[str] = None
    color: Optional[str] = None
    regional_style: Optional[str] = None
    page: int = 1
    page_size: int = 20


class PaginatedProductResponse(BaseModel):
    products: List[ProductResponse]
    total: int
    page: int
    page_size: int
    pages: int
