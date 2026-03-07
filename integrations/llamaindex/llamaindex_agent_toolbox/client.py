"""HTTP client for Agent Toolbox API."""

from __future__ import annotations

from typing import Any, Dict, Optional

import httpx


DEFAULT_BASE_URL = "https://api.toolboxlite.com"
DEFAULT_TIMEOUT = 30.0


class AgentToolboxClient:
    """Thin HTTP client for the Agent Toolbox REST API."""

    def __init__(
        self,
        api_key: str,
        base_url: str = DEFAULT_BASE_URL,
        timeout: float = DEFAULT_TIMEOUT,
    ) -> None:
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "x-api-key": self.api_key,
            "Content-Type": "application/json",
        }

    def post(self, endpoint: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Synchronous POST request."""
        url = f"{self.base_url}{endpoint}"
        with httpx.Client(timeout=self.timeout) as client:
            resp = client.post(url, json=payload, headers=self._headers())
            resp.raise_for_status()
            return resp.json()

    async def apost(self, endpoint: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Async POST request."""
        url = f"{self.base_url}{endpoint}"
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, json=payload, headers=self._headers())
            resp.raise_for_status()
            return resp.json()
