"""
Recommendation Engine — main orchestrator
"""
import logging
from typing import List, Dict, Any
from recommendation.embeddings import generate_text_embedding, generate_product_embedding
from recommendation.vector_store import vector_store
from recommendation.ranker import score_products


logger = logging.getLogger(__name__)


class RecommendationEngine:
    def __init__(self):
        self._products_cache: Dict[str, Dict] = {}

    def index_products(self, products: List[Dict[str, Any]]):
        """
        Build FAISS index from product list.
        Call this at startup after loading products from DB.
        [AI INTEGRATION POINT #2+#3] — generates embeddings then builds FAISS index
        """
        import numpy as np

        embeddings = []
        ids = []
        for p in products:
            emb = generate_product_embedding(p)
            embeddings.append(emb)
            ids.append(str(p["id"]))
            self._products_cache[str(p["id"])] = p

        if embeddings:
            matrix = np.vstack(embeddings)
            vector_store.build_index(matrix, ids)
            logger.info(f"Indexed {len(products)} products")

    def recommend(
        self, preferences: Dict[str, Any], top_k: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Full recommendation pipeline:
        1. Convert preferences to query embedding
        2. Vector search for candidates
        3. Hybrid re-rank
        4. Return top_k with explanations
        """
        query_text = _preferences_to_text(preferences)
        query_embedding = generate_text_embedding(query_text)

        # Step 2: vector search
        candidates_raw = vector_store.search(query_embedding, top_k=top_k * 3)
        vector_scores = {pid: score for pid, score in candidates_raw}

        # Step 3: fetch product dicts for candidates
        candidate_products = [
            self._products_cache[pid]
            for pid, _ in candidates_raw
            if pid in self._products_cache
        ]

        if not candidate_products:
            # Fallback: return all cached products
            candidate_products = list(self._products_cache.values())

        # Step 4: hybrid rank
        ranked = score_products(candidate_products, vector_scores, preferences)
        return ranked[:top_k]


def _preferences_to_text(prefs: Dict[str, Any]) -> str:
    parts = []
    if prefs.get("occasion"):
        parts.append(f"occasion: {' '.join(prefs['occasion'])}")
    if prefs.get("fabric"):
        parts.append(f"fabric: {' '.join(prefs['fabric'])}")
    if prefs.get("color"):
        parts.append(f"color: {' '.join(prefs['color'])}")
    if prefs.get("regional_style"):
        parts.append(f"style: {prefs['regional_style']}")
    if prefs.get("budget_max"):
        parts.append(f"budget up to {prefs['budget_max']}")
    return " | ".join(parts) or "traditional Indian saree"


engine = RecommendationEngine()
