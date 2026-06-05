"""
Pose Estimator — MediaPipe body landmark detection
[AI INTEGRATION POINT #5]
"""
import numpy as np
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# ============================================================
# [AI INTEGRATION POINT #5] — MediaPipe Pose Estimation
# What happens here: detect 33 body landmarks from user photo
# How to activate:
#   pip install mediapipe
#   import mediapipe as mp
#   mp_pose = mp.solutions.pose
#   pose = mp_pose.Pose(static_image_mode=True, model_complexity=2)
#   results = pose.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
#   landmarks = results.pose_landmarks.landmark
# ============================================================


def estimate_pose(image_bytes: bytes) -> Dict[str, Any]:
    """
    PLACEHOLDER: returns mock body landmarks.
    Replace body with MediaPipe inference.
    """
    logger.info("Pose estimation called — using placeholder mock (MediaPipe not active)")

    # ── ACTIVATE MEDIAPIPE ───────────────────────────────────
    # import mediapipe as mp
    # import cv2, numpy as np
    # mp_pose = mp.solutions.pose
    # with mp_pose.Pose(static_image_mode=True, model_complexity=2) as pose:
    #     nparr = np.frombuffer(image_bytes, np.uint8)
    #     img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    #     results = pose.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    #     if not results.pose_landmarks:
    #         raise ValueError("No human pose detected in image")
    #     lm = results.pose_landmarks.landmark
    #     return {
    #         "landmarks": [{
    #             "x": l.x, "y": l.y, "z": l.z, "visibility": l.visibility
    #         } for l in lm],
    #         "body_front_facing": True,
    #         "shoulder_width_px": abs(lm[11].x - lm[12].x) * img.shape[1],
    #         "torso_height_px": abs(lm[11].y - lm[23].y) * img.shape[0],
    #         "hip_width_px": abs(lm[23].x - lm[24].x) * img.shape[1],
    #     }
    # ────────────────────────────────────────────────────────

    # PLACEHOLDER landmarks (normalised 0-1 coordinates)
    return {
        "landmarks": [{"x": 0.5, "y": float(i) / 33, "z": 0.0, "visibility": 0.99} for i in range(33)],
        "body_front_facing": True,
        "shoulder_width_px": 180.0,
        "torso_height_px": 320.0,
        "hip_width_px": 200.0,
        "image_width": 512,
        "image_height": 768,
        "mock": True,
    }


def validate_pose(pose_data: Dict[str, Any]) -> bool:
    """Check if pose is suitable for try-on."""
    return pose_data.get("body_front_facing", False) and len(pose_data.get("landmarks", [])) >= 20
