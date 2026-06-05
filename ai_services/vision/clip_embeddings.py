"""
CLIP Embeddings — image and text embeddings via CLIP
[AI INTEGRATION POINT #9]
"""
import numpy as np
import logging
from typing import Union
from PIL import Image

logger = logging.getLogger(__name__)

CLIP_DIM = 512  # openai/clip-vit-base-patch32

# ============================================================
# [AI INTEGRATION POINT #9] — CLIP Embeddings
# What happens here: encode images and text into shared vector space
# How to activate:
#   pip install transformers pillow
#   from transformers import CLIPProcessor, CLIPModel
#   _model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
#   _processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
#
#   Text: inputs = _processor(text=[text], return_tensors="pt", padding=True)
#         outputs = _model.get_text_features(**inputs)
#
#   Image: inputs = _processor(images=pil_image, return_tensors="pt")
#          outputs = _model.get_image_features(**inputs)
# ============================================================


def generate_text_embedding(text: str) -> np.ndarray:
    """
    PLACEHOLDER: deterministic mock text embedding.
    Replace body with CLIP text encoder.
    """
    # ── ACTIVATE CLIP ────────────────────────────────────────
    # inputs = _processor(text=[text], return_tensors="pt", padding=True)
    # with torch.no_grad():
    #     feat = _model.get_text_features(**inputs)
    # vec = feat[0].numpy()
    # return vec / np.linalg.norm(vec)
    # ────────────────────────────────────────────────────────
    rng = np.random.default_rng(abs(hash(text)) % (2**31))
    vec = rng.random(CLIP_DIM).astype(np.float32)
    return vec / np.linalg.norm(vec)


def generate_image_embedding(pil_image: Image.Image) -> np.ndarray:
    """
    PLACEHOLDER: deterministic mock image embedding.
    Replace body with CLIP image encoder.
    """
    # ── ACTIVATE CLIP ───────────────────────────────���────────
    # inputs = _processor(images=pil_image, return_tensors="pt")
    # with torch.no_grad():
    #     feat = _model.get_image_features(**inputs)
    # vec = feat[0].numpy()
    # return vec / np.linalg.norm(vec)
    # ────────────────────────────────────────────────────────
    seed = abs(hash(str(pil_image.size))) % (2**31)
    rng = np.random.default_rng(seed)
    vec = rng.random(CLIP_DIM).astype(np.float32)
    return vec / np.linalg.norm(vec)
