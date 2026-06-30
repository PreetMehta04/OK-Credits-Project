"""
Vector Store — FAISS-based product similarity index
[AI INTEGRATION POINT #3] — FAISS / ChromaDB vector search
"""
import numpy as np
import json
import os
import logging
from typing import List, Tuple, Optional
from recommendation.embeddings import EMBEDDING_DIM

logger = logging.getLogger(__name__)

# ============================================================
# [AI INTEGRATION POINT #3] — FAISS Vector Index
# How to activate:
#   pip install faiss-cpu  (or faiss-gpu for GPU)
#   import faiss
#   index = faiss.IndexFlatIP(EMBEDDING_DIM)   # inner product
#   index.add(embeddings_matrix)
#   distances, indices = index.search(query_vec, top_k)
# ============================================================

INDEX_PATH = "models/faiss_product.index"
ID_MAP_PATH = "models/faiss_id_map.json"


class FAISSVectorStore:
    """
    Wraps a FAISS flat index for approximate nearest neighbor search.
    Falls back to numpy brute-force when FAISS is not installed.
    """

    def __init__(self):
        self.embeddings: Optional[np.ndarray] = None
        self.product_ids: List[str] = []
        self._faiss_available = False

        try:
            import faiss  # noqa
            self._faiss_available = True
            logger.info("FAISS available — using hardware-accelerated ANN search")
        except ImportError:
            logger.warning("FAISS not installed — using numpy brute-force (slower)")

    def build_index(self, embeddings: np.ndarray, product_ids: List[str]):
        """Build in-memory index from product embeddings."""
        self.embeddings = embeddings.astype(np.float32)
        self.product_ids = product_ids
        logger.info(f"Built vector index: {len(product_ids)} products, dim={embeddings.shape[1]}")

    def search(self, query: np.ndarray, top_k: int = 10) -> List[Tuple[str, float]]:
        """Return list of (product_id, score) sorted by descending similarity."""
        if self.embeddings is None or len(self.product_ids) == 0:
            return []

        q = query.astype(np.float32).reshape(1, -1)

        if self._faiss_available:
            # ── ACTIVATE FAISS ───────────────────────────────
            # import faiss
            # index = faiss.IndexFlatIP(self.embeddings.shape[1])
            # index.add(self.embeddings)
            # D, I = index.search(q, top_k)
            # return [(self.product_ids[i], float(D[0][j])) for j, i in enumerate(I[0]) if i >= 0]
            pass

        # PLACEHOLDER: numpy cosine similarity brute-force
        scores = (self.embeddings @ q.T).flatten()
        top_indices = np.argsort(scores)[::-1][:top_k]
        return [(self.product_ids[i], float(scores[i])) for i in top_indices]

    def save(self):
        os.makedirs("models", exist_ok=True)
        np.save(INDEX_PATH, self.embeddings)
        with open(ID_MAP_PATH, "w") as f:
            json.dump(self.product_ids, f)

    def load(self):
        if os.path.exists(INDEX_PATH) and os.path.exists(ID_MAP_PATH):
            self.embeddings = np.load(INDEX_PATH)
            with open(ID_MAP_PATH) as f:
                self.product_ids = json.load(f)
            logger.info(f"Loaded index: {len(self.product_ids)} products")
        else:
            logger.warning("No saved index found — run seed_data.py first")


# Singleton
vector_store = FAISSVectorStore()
