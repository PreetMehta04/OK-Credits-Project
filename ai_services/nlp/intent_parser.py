"""
Intent Parser — extract structured preferences from natural language
[AI INTEGRATION POINT #1]
"""
import re
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# ============================================================
# [AI INTEGRATION POINT #1] — OpenAI GPT-4o Function Calling
# What happens here: send user message to GPT-4o with a
#   structured function schema for preference extraction
# How to activate:
#   pip install openai
#   client = openai.OpenAI(api_key=OPENAI_API_KEY)
#   response = client.chat.completions.create(
#       model="gpt-4o",
#       messages=[
#           {"role": "system", "content": STYLIST_SYSTEM_PROMPT},
#           {"role": "user", "content": user_message},
#       ],
#       tools=[{"type": "function", "function": PREFERENCE_EXTRACTION_SCHEMA}],
#       tool_choice="required",
#   )
#   args = json.loads(response.choices[0].message.tool_calls[0].function.arguments)
# ============================================================

PREFERENCE_EXTRACTION_SCHEMA = {
    "name": "extract_saree_preferences",
    "description": "Extract structured saree shopping preferences from user message",
    "parameters": {
        "type": "object",
        "properties": {
            "budget_min": {"type": "number", "description": "Minimum budget in INR"},
            "budget_max": {"type": "number", "description": "Maximum budget in INR"},
            "occasion": {"type": "array", "items": {"type": "string"},
                         "description": "Occasions like wedding, party, casual"},
            "fabric": {"type": "array", "items": {"type": "string"},
                       "description": "Fabric types like silk, cotton, chiffon"},
            "color": {"type": "array", "items": {"type": "string"}},
            "embroidery": {"type": "array", "items": {"type": "string"}},
            "regional_style": {"type": "string"},
            "body_type": {"type": "string"},
            "celebrity_inspired": {"type": "string"},
        },
    },
}

STYLIST_SYSTEM_PROMPT = """
You are SareeAI, an expert Indian ethnic wear stylist.
Your job is to understand customer needs and extract structured preferences.
Be conversational, warm, and helpful. Speak in the customer's language.
Always extract preferences as structured data using the provided function.
"""


def parse_intent_rule_based(message: str, existing: Dict = None) -> Dict[str, Any]:
    """
    PLACEHOLDER: rule-based intent extraction using regex and keywords.
    Replace/augment with LLM function calling (see docstring above).
    """
    prefs = dict(existing or {})
    msg = message.lower()

    # Occasion
    for occ in ["wedding", "party", "casual", "festive", "religious", "office", "reception", "puja"]:
        if occ in msg:
            prefs.setdefault("occasion", [])
            if occ not in prefs["occasion"]:
                prefs["occasion"].append(occ)

    # Fabric
    for fab in ["silk", "cotton", "chiffon", "georgette", "banarasi", "linen", "organza", "chanderi"]:
        if fab in msg:
            prefs.setdefault("fabric", [])
            if fab not in prefs["fabric"]:
                prefs["fabric"].append(fab)

    # Budget — extract numbers
    budget_match = re.search(r"(?:under|below|within|₹|rs\.?)\s*(\d[\d,]*)", msg)
    if budget_match:
        prefs["budget_max"] = int(budget_match.group(1).replace(",", ""))

    range_match = re.search(r"(\d[\d,]*)\s*(?:to|-)\s*(\d[\d,]*)", msg)
    if range_match:
        prefs["budget_min"] = int(range_match.group(1).replace(",", ""))
        prefs["budget_max"] = int(range_match.group(2).replace(",", ""))

    # Colors
    for color in ["red", "blue", "green", "pink", "gold", "white", "purple", "yellow",
                  "maroon", "peach", "beige", "orange", "black", "navy"]:
        if color in msg:
            prefs.setdefault("color", [])
            if color not in prefs["color"]:
                prefs["color"].append(color)

    # Regional styles
    for style in ["kanjivaram", "banarasi", "paithani", "bandhani", "phulkari",
                  "pochampally", "sambalpuri", "kerala kasavu", "patola"]:
        if style in msg:
            prefs["regional_style"] = style

    return prefs


def generate_ai_response(
    conversation_history: list,
    preferences: Dict[str, Any],
    language: str = "en",
) -> str:
    """
    PLACEHOLDER: scripted response based on conversation step.
    Replace body with OpenAI GPT-4o response generation.
    """
    # ── ACTIVATE OpenAI ──────────────────────────────────────
    # client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
    # messages = [{"role": "system", "content": STYLIST_SYSTEM_PROMPT}]
    # messages += conversation_history
    # response = client.chat.completions.create(
    #     model="gpt-4o", messages=messages, temperature=0.7
    # )
    # return response.choices[0].message.content
    # ────────────────────────────────────────────────────────

    user_steps = sum(1 for m in conversation_history if m.get("role") == "user")
    occ = (preferences.get("occasion") or ["your occasion"])[0]

    responses = [
        "Namaste! I'm your AI Saree Stylist 🌸 What brings you here today — is there a special occasion?",
        f"A {occ}! How lovely. What is your approximate budget?",
        "Wonderful! Which fabric do you prefer — silk, cotton, georgette, or chiffon?",
        "Any specific colours in mind?",
        "Excellent taste! Let me find your perfect matches right now ✨",
    ]
    return responses[min(user_steps, len(responses) - 1)]
