"""
Try-On Pipeline — orchestrates the full virtual try-on flow
"""
import io
import time
import logging
import httpx
from PIL import Image

from tryon.pose_estimator import estimate_pose, validate_pose
from tryon.segmentation import segment_person
from tryon.cloth_warper import warp_saree
from tryon.diffusion import run_inpainting

logger = logging.getLogger(__name__)


class TryOnPipeline:
    """
    Full pipeline:
    1. Validate & load user image
    2. Pose estimation
    3. Body segmentation
    4. Cloth warping
    5. Diffusion inpainting
    6. Post-processing & save
    """

    async def run(
        self,
        user_image_bytes: bytes,
        saree_image_url: str,
        saree_description: str = "traditional saree",
    ) -> bytes:
        start = time.time()
        logger.info("Starting try-on pipeline...")

        # Step 1: Pose estimation
        logger.info("Step 1/5: Pose estimation")
        pose_data = estimate_pose(user_image_bytes)
        if not validate_pose(pose_data):
            raise ValueError("Could not detect a full-body front-facing pose. Please upload a clearer photo.")

        # Step 2: Body segmentation
        logger.info("Step 2/5: Body segmentation")
        seg_result = segment_person(user_image_bytes)
        person_mask = seg_result["mask"]

        # Step 3: Load saree image
        logger.info("Step 3/5: Loading saree")
        async with httpx.AsyncClient() as client:
            resp = await client.get(saree_image_url, timeout=10)
            resp.raise_for_status()
            saree_bytes = resp.content

        # Step 4: Cloth warping
        logger.info("Step 4/5: Cloth warping")
        person_image = Image.open(io.BytesIO(user_image_bytes)).convert("RGBA")
        warped_cloth = warp_saree(saree_bytes, pose_data, person_image.width, person_image.height)

        # Step 5: Diffusion inpainting
        logger.info("Step 5/5: Diffusion inpainting")
        result_image = run_inpainting(person_image, warped_cloth, person_mask, saree_description)

        # Encode output
        out = io.BytesIO()
        result_image.save(out, format="JPEG", quality=90)
        elapsed = round(time.time() - start, 2)
        logger.info(f"Try-on pipeline complete in {elapsed}s")
        return out.getvalue()


pipeline = TryOnPipeline()
