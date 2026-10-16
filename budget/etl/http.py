"""Small JSON client for the USAspending API: retries with backoff and an on-disk response cache,
so re-running a fetch step only asks for what is missing."""
from __future__ import annotations

import hashlib
import json
import time
import urllib.error
import urllib.request
from pathlib import Path

from .common import BUILD_DIR

API = "https://api.usaspending.gov/api/v2/"
CACHE_DIR = BUILD_DIR / "cache" / "usaspending"
HEADERS = {"Content-Type": "application/json", "Accept": "application/json",
           "User-Agent": "budget-etl (defense tech budget research)"}


def call(path: str, body: dict | None = None, cache: bool = True, retries: int = 5, timeout: int = 120):
    """POSTs `body` (or GETs when None) to the API path and returns the decoded JSON."""
    url = API + path.lstrip("/")
    data = None if body is None else json.dumps(body, sort_keys=True).encode()
    key = hashlib.sha1(url.encode() + (data or b"")).hexdigest()
    cached = CACHE_DIR / key[:2] / f"{key}.json"
    if cache and cached.exists():
        return json.loads(cached.read_text())
    delay = 2.0
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, data=data, headers=HEADERS, method="POST" if data else "GET")
            with urllib.request.urlopen(req, timeout=timeout) as r:
                out = json.loads(r.read())
            if cache:
                cached.parent.mkdir(parents=True, exist_ok=True)
                cached.write_text(json.dumps(out))
            return out
        except urllib.error.HTTPError as e:
            if e.code in (400, 404, 422):  # the request itself is wrong; retrying will not help
                raise RuntimeError(f"{url}: HTTP {e.code} {e.read()[:300]!r}") from e
            err = e
        except Exception as e:  # noqa: BLE001 - network hiccups, timeouts
            err = e
        if attempt < retries - 1:
            time.sleep(delay)
            delay *= 2
    raise RuntimeError(f"{url}: gave up after {retries} attempts: {err}")
