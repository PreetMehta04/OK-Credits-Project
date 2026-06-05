import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Boolean, DateTime, Numeric, Integer,
    Float, Text, Enum as SAEnum, JSON
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from app.database import Base
import enum


class FabricType(str, enum.Enum):
    silk = "silk"
    cotton = "cotton"
    chiffon = "chiffon"
    georgette = "georgette"
    linen = "linen"
    banarasi = "banarasi"
    kanjivaram = "kanjivaram"
    chanderi = "chanderi"
    organza = "organza"


class CategoryType(str, enum.Enum):
    saree = "saree"
    lehenga = "lehenga"
    salwar = "salwar"
    dupatta = "dupatta"
    blouse = "blouse"


class RegionalStyle(str, enum.Enum):
    banarasi = "banarasi"
    kanjivaram = "kanjivaram"
    paithani = "paithani"
    bandhani = "bandhani"
    phulkari = "phulkari"
    pochampally = "pochampally"
    chikankari = "chikankari"
    sambalpuri = "sambalpuri"
    kerala_kasavu = "kerala_kasavu"
    patola = "patola"


class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_code = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    category = Column(SAEnum(CategoryType), nullable=False)
    fabric = Column(SAEnum(FabricType), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    discount_price = Column(Numeric(10, 2), nullable=True)
    stock_quantity = Column(Integer, default=0)
    color = Column(JSON, nullable=True)           # List of color strings
    occasion_tags = Column(JSON, nullable=True)   # ["wedding","festive",...]
    embroidery_type = Column(JSON, nullable=True) # ["zari","thread",...]
    regional_style = Column(SAEnum(RegionalStyle), nullable=True)
    description = Column(Text, nullable=True)
    blouse_included = Column(Boolean, default=False)
    blouse_suggestions = Column(JSON, nullable=True)
    images = Column(JSON, nullable=True)          # [{url, angle, is_primary}]
    trending_score = Column(Float, default=0.0)
    embedding_vector = Column(JSON, nullable=True)  # Stored as list; pgvector when available
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
