"""
Recommendation Ranker — hybrid scoring formula
"""
import math
from typing import List, Dict, Any


def score_products(
    candidates: List[Dict[str, Any]],
    vector_scores: Dict[str, float],
    preferences: Dict[str, Any],
) -> List[Dict[str, Any]]:
    """
    Hybrid scoring:
    score = 0.40 * vector_similarity
          + 0.20 * price_match
          + 0.20 * occasion_match
          + 0.10 * trending_score
          + 0.10 * stock_availability
    """
    budget_max = preferences.get("budget_max", float("inf"))
    budget_min = preferences.get("budget_min", 0)
    budget_mid = (budget_min + budget_max) / 2 if budget_max != float("inf") else 5000
    preferred_occasions = set(preferences.get("occasion") or [])

    scored = []
    for product in candidates:
        pid = str(product["id"])

        # Vector similarity (0–1)
        vscore = vector_scores.get(pid, 0.5)

        # Price score: Gaussian centered on budget midpoint
        price = float(product.get("price", 5000))
        price_score = math.exp(-((price - budget_mid) ** 2) / (2 * (budget_mid * 0.4 + 1) ** 2))

        # Occasion match (binary)
        product_occasions = set(product.get("occasion_tags") or [])
        occasion_score = 1.0 if preferred_occasions & product_occasions else 0.3

        # Trending score (0–1, normalised from raw float)
        trending = min(float(product.get("trending_score", 0.5)), 1.0)

        # Stock availability
        stock = min(product.get("stock_quantity", 0) / 10, 1.0)

        final_score = (
            0.40 * vscore
            + 0.20 * price_score
            + 0.20 * occasion_score
            + 0.10 * trending
            + 0.10 * stock
        )

        explanation = _build_explanation(product, preferences, occasion_score, price_score)

        scored.append({**product, "match_score": round(final_score, 3), "explanation": explanation})

    return sorted(scored, key=lambda x: x["match_score"], reverse=True)


def _build_explanation(product, preferences, occasion_score, price_score):
    parts = []
    if preferences.get("fabric") and product.get("fabric") in (preferences.get("fabric") or []):
        parts.append(f"{product['fabric']} fabric match")
    if occasion_score >= 1.0:
        parts.append("perfect for your occasion")
    if price_score >= 0.7:
        parts.append("within your budget")
    if product.get("regional_style"):
        parts.append(f"authentic {product['regional_style']} style")
    return "Recommended because: " + (", ".join(parts) if parts else "highly trending pick")
