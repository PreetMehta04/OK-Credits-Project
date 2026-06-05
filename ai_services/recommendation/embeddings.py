"""
Embedding Generation Service
[AI INTEGRATION POINT #2] — Sentence Transformers / OpenAI Embeddings
"""
import numpy as np
import logging
from typing import List

logger = logging.getLogger(__name__)

# ============================================================
# [AI INTEGRATION POINT #2] — Sentence Transformers Embeddings
# What happens here: encode product text into dense vectors
# How to activate:
#   pip install sentence-transformers
#   model = SentenceTransformer('all-MiniLM-L6-v2')
#   embeddings = model.encode(texts, batch_size=32, normalize_embeddings=True)
# ============================================================

EMBEDDING_DIM = 384  # all-MiniLM-L6-v2 output dimension


def build_product_text(product: dict) -> str:
    """Combine product attributes into a single text for embedding."""
    parts = [
        product.get("name", ""),
        product.get("fabric", ""),
        product.get("regional_style", ""),
        " ".join(product.get("occasion_tags") or []),
        " ".join(product.get("color") or []),
        " ".join(product.get("embroidery_type") or []),
        product.get("description", ""),
    ]
    return " | ".join(p for p in parts if p).lower()


def generate_text_embedding(text: str) -> np.ndarray:
    """
    PLACEHOLDER: generates a deterministic mock embedding.
    Replace body with real SentenceTransformer inference.
    """
    # ── ACTIVATE AI ─────────────────────────────────────────
    # from sentence_transformers import SentenceTransformer
    # _model = SentenceTransformer("all-MiniLM-L6-v2")
    # return _model.encode(text, normalize_embeddings=True)
    # ────────────────────────────────────────────────────────
    rng = np.random.default_rng(abs(hash(text)) % (2**31))
    vec = rng.random(EMBEDDING_DIM).astype(np.float32)
    return vec / np.linalg.norm(vec)  # normalize


def generate_batch_embeddings(texts: List[str]) -> np.ndarray:
    """
    PLACEHOLDER: batch encode texts.
    Replace body with:
        return _model.encode(texts, batch_size=32, normalize_embeddings=True)
    """
    return np.vstack([generate_text_embedding(t) for t in texts])


def generate_product_embedding(product: dict) -> np.ndarray:
    """Generate embedding for a product dict."""
    text = build_product_text(product)
    return generate_text_embedding(text)
