"""
Body Segmentation — U2Net / SAM person mask
[AI INTEGRATION POINT #6]
"""
import numpy as np
import logging
from PIL import Image
import io

logger = logging.getLogger(__name__)

# ============================================================
# [AI INTEGRATION POINT #6] — U2Net Body Segmentation
# What happens here: generate binary person mask from user photo
# How to activate (U2Net):
#   Download u2net.pth to models/
#   pip install torch torchvision
#   Load model and run inference:
#     model = U2NET(3, 1)
#     model.load_state_dict(torch.load("models/u2net.pth"))
#     mask = run_u2net_inference(image)
#
# Alternative (SAM — Segment Anything Model):
#   pip install segment-anything
#   sam = sam_model_registry["vit_h"](checkpoint="models/sam_vit_h.pth")
#   predictor = SamPredictor(sam)
#   predictor.set_image(image)
#   masks, _, _ = predictor.predict(point_coords=..., point_labels=...)
# ============================================================


def segment_person(image_bytes: bytes) -> dict:
    """
    PLACEHOLDER: returns a solid rectangular mask.
    Replace body with U2Net or SAM inference.
    """
    logger.info("Body segmentation called — using placeholder mask (U2Net not active)")

    # ── ACTIVATE U2NET ───────────────────────────────────────
    # from tryon._u2net_helper import run_u2net
    # img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    # mask = run_u2net(img)  # returns PIL Image, mode='L'
    # return {"mask": mask, "has_person": True}
    # ────────────────────────────────────────────────────────

    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    w, h = img.size

    # PLACEHOLDER: white rectangle as person mask
    mask = Image.new("L", (w, h), 0)
    from PIL import ImageDraw
    draw = ImageDraw.Draw(mask)
    draw.rectangle([int(w * 0.2), 0, int(w * 0.8), h], fill=255)

    return {"mask": mask, "has_person": True, "mock": True}


def apply_background_removal(image_bytes: bytes, mask: Image.Image) -> Image.Image:
    """Apply segmentation mask to remove background."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    img_np = np.array(img)
    mask_np = np.array(mask.resize(img.size))
    img_np[:, :, 3] = mask_np
    return Image.fromarray(img_np)
