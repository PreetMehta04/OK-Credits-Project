import imghdr
import html
import os
from fastapi import HTTPException, UploadFile
from PIL import Image
import io

ALLOWED_IMAGE_TYPES = {"jpeg", "png"}
MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
MIN_DIMENSION = 256
MAX_DIMENSION = 4096


async def validate_image_upload(file: UploadFile) -> bytes:
    """
    Validates uploaded image for safety and correctness.
    Checks: magic bytes, file size, dimensions, strips EXIF.
    """
    contents = await file.read()

    # Check file size
    if len(contents) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="Image too large. Max 10MB.")

    # Check magic bytes (not just filename extension)
    detected_type = imghdr.what(None, h=contents)
    if detected_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image type '{detected_type}'. Only JPEG and PNG allowed.",
        )

    # Validate dimensions and strip EXIF
    try:
        img = Image.open(io.BytesIO(contents))
        w, h = img.size
        if w < MIN_DIMENSION or h < MIN_DIMENSION:
            raise HTTPException(status_code=400, detail="Image too small. Min 256x256.")
        if w > MAX_DIMENSION or h > MAX_DIMENSION:
            raise HTTPException(status_code=400, detail="Image too large. Max 4096x4096.")

        # Strip EXIF metadata
        clean_img = Image.new(img.mode, img.size)
        clean_img.putdata(list(img.getdata()))
        buf = io.BytesIO()
        fmt = "JPEG" if detected_type == "jpeg" else "PNG"
        clean_img.save(buf, format=fmt)
        return buf.getvalue()
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Could not process image.")


def sanitize_text(text: str) -> str:
    """Escape HTML characters to prevent XSS."""
    return html.escape(str(text).strip())


def safe_filename(filename: str) -> str:
    """Prevent path traversal attacks in filenames."""
    return os.path.basename(filename).replace("..", "").replace("/", "").replace("\\", "")
