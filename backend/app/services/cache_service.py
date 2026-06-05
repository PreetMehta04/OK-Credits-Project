import json
from typing import Optional, Any
import redis.asyncio as aioredis
from app.config import settings

_redis: Optional[aioredis.Redis] = None


async def get_redis_client() -> aioredis.Redis:
    global _redis
    if _redis is None:
        _redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    return _redis


async def cache_get(key: str) -> Optional[Any]:
    r = await get_redis_client()
    val = await r.get(key)
    if val:
        return json.loads(val)
    return None


async def cache_set(key: str, value: Any, ttl_seconds: int = 300):
    r = await get_redis_client()
    await r.setex(key, ttl_seconds, json.dumps(value, default=str))


async def cache_delete(key: str):
    r = await get_redis_client()
    await r.delete(key)


async def invalidate_product_cache():
    r = await get_redis_client()
    keys = await r.keys("products:*")
    if keys:
        await r.delete(*keys)
