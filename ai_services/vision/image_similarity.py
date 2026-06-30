"""
Image Similarity Search — CLIP-based visual search
[AI INTEGRATION POINT #9+#3]
"""
import numpy as np
import logging
from typing import List, Tuple
from PIL import Image
import io

from vision.clip_embeddings import generate_image_embedding, generate_text_embedding, CLIP_DIM

logger = logging.getLogger(__name__)


class ImageSimilaritySearch:
    def __init__(self):
        self.embeddings: np.ndarray = None
        self.product_ids: List[str] = []

    def build_index(self, product_images: List[Tuple[str, str]]):
        """
        Build CLIP image index.
        product_images: list of (product_id, image_url)
        [AI INTEGRATION POINT #9] — CLIP image encoding
        """
        # In production: download each image and encode with CLIP
        # PLACEHOLDER: generate mock embeddings
        embeddings = []
        ids = []
        for pid, url in product_images:
            seed = abs(hash(url)) % (2**31)
            rng = np.random.default_rng(seed)
            vec = rng.random(CLIP_DIM).astype(np.float32)
            vec = vec / np.linalg.norm(vec)
            embeddings.append(vec)
            ids.append(pid)

        self.embeddings = np.vstack(embeddings) if embeddings else np.empty((0, CLIP_DIM))
        self.product_ids = ids
        logger.info(f"CLIP image index built: {len(ids)} products")

    def search_by_image(self, image_bytes: bytes, top_k: int = 10) -> List[Tuple[str, float]]:
        """
        Find visually similar products by uploaded image.
        [AI INTEGRATION POINT #9]
        """
        if self.embeddings is None or len(self.product_ids) == 0:
            return []

        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        query_emb = generate_image_embedding(pil_img).reshape(1, -1)

        scores = (self.embeddings @ query_emb.T).flatten()
        top_idx = np.argsort(scores)[::-1][:top_k]
        return [(self.product_ids[i], float(scores[i])) for i in top_idx]


image_search = ImageSimilaritySearch()
