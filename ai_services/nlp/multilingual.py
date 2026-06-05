"""
Multilingual Support — language detection and translation
[AI INTEGRATION POINT #10] [AI INTEGRATION POINT #11]
"""
import logging
from typing import Tuple

logger = logging.getLogger(__name__)

SUPPORTED_LANGUAGES = {"en": "English", "hi": "Hindi", "ta": "Tamil", "bn": "Bengali"}

# ============================================================
# [AI INTEGRATION POINT #10] — Language Detection
# How to activate:
#   pip install langdetect
#   from langdetect import detect
#   lang = detect(text)  # returns ISO 639-1 code
# ============================================================

# ============================================================
# [AI INTEGRATION POINT #11] — Translation
# Option A — OpenAI:
#   response = client.chat.completions.create(
#       model="gpt-4o",
#       messages=[{"role": "user", "content": f"Translate to {lang}: {text}"}]
#   )
# Option B — deep-translator (free):
#   pip install deep-translator
#   from deep_translator import GoogleTranslator
#   translated = GoogleTranslator(source="auto", target=lang).translate(text)
# ============================================================


def detect_language(text: str) -> str:
    """
    PLACEHOLDER: always returns 'en'.
    Replace body with langdetect inference.
    """
    # ── ACTIVATE LANGDETECT ──────────────────────────────────
    # from langdetect import detect, LangDetectException
    # try:
    #     lang = detect(text)
    #     return lang if lang in SUPPORTED_LANGUAGES else "en"
    # except LangDetectException:
    #     return "en"
    # ────────────────────────────────────────────────────────
    return "en"


def translate_to_english(text: str, source_lang: str) -> str:
    """
    PLACEHOLDER: returns text unchanged.
    Replace body with translation API.
    """
    if source_lang == "en":
        return text
    # ── ACTIVATE TRANSLATION ─────────────────────────────────
    # from deep_translator import GoogleTranslator
    # return GoogleTranslator(source=source_lang, target="en").translate(text)
    # ────────────────────────────────────────────────────────
    logger.warning(f"Translation from {source_lang} not active — returning original text")
    return text


def translate_from_english(text: str, target_lang: str) -> str:
    """
    PLACEHOLDER: returns text unchanged.
    Replace body with translation API.
    """
    if target_lang == "en":
        return text
    # ── ACTIVATE TRANSLATION ─────────────────────────────────
    # from deep_translator import GoogleTranslator
    # return GoogleTranslator(source="en", target=target_lang).translate(text)
    # ────────────────────────────────────────────────────────
    logger.warning(f"Translation to {target_lang} not active — returning English text")
    return text


def process_multilingual_message(user_message: str, preferred_language: str = "en") -> Tuple[str, str]:
    """
    Returns (english_message, detected_language).
    Use for processing incoming user messages.
    """
    detected = detect_language(user_message)
    english_text = translate_to_english(user_message, detected)
    return english_text, detected
