"""LlamaIndex tools for Agent Toolbox API."""

from __future__ import annotations

import json
import os
from typing import Any, Dict, Optional

from llama_index.core.tools import AsyncBaseTool, ToolMetadata, ToolOutput

from llamaindex_agent_toolbox.client import AgentToolboxClient, DEFAULT_BASE_URL


def _get_client(
    api_key: Optional[str] = None,
    base_url: Optional[str] = None,
) -> AgentToolboxClient:
    key = api_key or os.environ.get("AGENT_TOOLBOX_API_KEY", "")
    if not key:
        raise ValueError(
            "Agent Toolbox API key is required. "
            "Pass api_key= or set AGENT_TOOLBOX_API_KEY env var."
        )
    url = base_url or os.environ.get("AGENT_TOOLBOX_BASE_URL", DEFAULT_BASE_URL)
    return AgentToolboxClient(api_key=key, base_url=url)


class _AgentToolboxBaseTool(AsyncBaseTool):
    """Base class for all Agent Toolbox LlamaIndex tools."""

    _metadata: ToolMetadata
    _api_key: Optional[str]
    _base_url: Optional[str]

    def __init__(
        self,
        meta: ToolMetadata,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
    ) -> None:
        self._metadata = meta
        self._api_key = api_key
        self._base_url = base_url

    @property
    def metadata(self) -> ToolMetadata:
        return self._metadata

    @property
    def _client(self) -> AgentToolboxClient:
        return _get_client(self._api_key, self._base_url)


# ---------------------------------------------------------------------------
# Search
# ---------------------------------------------------------------------------

class AgentToolboxSearchTool(_AgentToolboxBaseTool):
    """Search the web using Agent Toolbox API (DuckDuckGo backend)."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None) -> None:
        super().__init__(
            meta=ToolMetadata(
                name="agent_toolbox_search",
                description=(
                    "Search the web and get titles, URLs, and snippets. "
                    "Useful for finding up-to-date information on any topic."
                ),
            ),
            api_key=api_key,
            base_url=base_url,
        )

    def call(self, query: str, count: int = 5, **kwargs: Any) -> ToolOutput:
        result = self._client.post("/v1/search", {"query": query, "count": count})
        content = json.dumps(result.get("data", []), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"query": query, "count": count}, raw_output=content)

    async def acall(self, query: str, count: int = 5, **kwargs: Any) -> ToolOutput:
        result = await self._client.apost("/v1/search", {"query": query, "count": count})
        content = json.dumps(result.get("data", []), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"query": query, "count": count}, raw_output=content)


# ---------------------------------------------------------------------------
# Extract
# ---------------------------------------------------------------------------

class AgentToolboxExtractTool(_AgentToolboxBaseTool):
    """Extract readable content from a web page."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None) -> None:
        super().__init__(
            meta=ToolMetadata(
                name="agent_toolbox_extract",
                description=(
                    "Extract the main readable content from a web page URL. "
                    "Returns clean text/markdown, removing ads and navigation."
                ),
            ),
            api_key=api_key,
            base_url=base_url,
        )

    def call(self, url: str, format: str = "markdown", **kwargs: Any) -> ToolOutput:
        result = self._client.post("/v1/extract", {"url": url, "format": format})
        data = result.get("data", {})
        content = data.get("content", json.dumps(data, indent=2))
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"url": url}, raw_output=content)

    async def acall(self, url: str, format: str = "markdown", **kwargs: Any) -> ToolOutput:
        result = await self._client.apost("/v1/extract", {"url": url, "format": format})
        data = result.get("data", {})
        content = data.get("content", json.dumps(data, indent=2))
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"url": url}, raw_output=content)


# ---------------------------------------------------------------------------
# Screenshot
# ---------------------------------------------------------------------------

class AgentToolboxScreenshotTool(_AgentToolboxBaseTool):
    """Take a screenshot of a web page."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None) -> None:
        super().__init__(
            meta=ToolMetadata(
                name="agent_toolbox_screenshot",
                description=(
                    "Capture a screenshot of a web page. Returns base64-encoded PNG. "
                    "Provide url and optional width/height."
                ),
            ),
            api_key=api_key,
            base_url=base_url,
        )

    def call(self, url: str, width: int = 1280, height: int = 720, **kwargs: Any) -> ToolOutput:
        result = self._client.post("/v1/screenshot", {"url": url, "width": width, "height": height})
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"url": url}, raw_output=content)

    async def acall(self, url: str, width: int = 1280, height: int = 720, **kwargs: Any) -> ToolOutput:
        result = await self._client.apost("/v1/screenshot", {"url": url, "width": width, "height": height})
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"url": url}, raw_output=content)


# ---------------------------------------------------------------------------
# Weather
# ---------------------------------------------------------------------------

class AgentToolboxWeatherTool(_AgentToolboxBaseTool):
    """Get current weather and forecast for a location."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None) -> None:
        super().__init__(
            meta=ToolMetadata(
                name="agent_toolbox_weather",
                description=(
                    "Get current weather conditions and forecast for any location. "
                    "Returns temperature, humidity, wind, and multi-day forecast."
                ),
            ),
            api_key=api_key,
            base_url=base_url,
        )

    def call(self, location: str, **kwargs: Any) -> ToolOutput:
        result = self._client.post("/v1/weather", {"location": location})
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"location": location}, raw_output=content)

    async def acall(self, location: str, **kwargs: Any) -> ToolOutput:
        result = await self._client.apost("/v1/weather", {"location": location})
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"location": location}, raw_output=content)


# ---------------------------------------------------------------------------
# Finance
# ---------------------------------------------------------------------------

class AgentToolboxFinanceTool(_AgentToolboxBaseTool):
    """Get stock quotes or currency exchange rates."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None) -> None:
        super().__init__(
            meta=ToolMetadata(
                name="agent_toolbox_finance",
                description=(
                    "Get real-time stock quotes or currency exchange rates. "
                    "For stocks: provide symbol. For exchange: provide from_currency, to_currency, amount."
                ),
            ),
            api_key=api_key,
            base_url=base_url,
        )

    def _payload(self, symbol: Optional[str] = None, type: Optional[str] = "quote",
                 from_currency: Optional[str] = None, to_currency: Optional[str] = None,
                 amount: Optional[float] = None) -> Dict[str, Any]:
        if symbol:
            return {"symbol": symbol, "type": type or "quote"}
        if from_currency and to_currency:
            return {"from": from_currency, "to": to_currency, "amount": amount or 1}
        return {}

    def call(self, symbol: Optional[str] = None, type: Optional[str] = "quote",
             from_currency: Optional[str] = None, to_currency: Optional[str] = None,
             amount: Optional[float] = None, **kwargs: Any) -> ToolOutput:
        p = self._payload(symbol, type, from_currency, to_currency, amount)
        result = self._client.post("/v1/finance", p)
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input=p, raw_output=content)

    async def acall(self, symbol: Optional[str] = None, type: Optional[str] = "quote",
                    from_currency: Optional[str] = None, to_currency: Optional[str] = None,
                    amount: Optional[float] = None, **kwargs: Any) -> ToolOutput:
        p = self._payload(symbol, type, from_currency, to_currency, amount)
        result = await self._client.apost("/v1/finance", p)
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input=p, raw_output=content)


# ---------------------------------------------------------------------------
# Email Validator
# ---------------------------------------------------------------------------

class AgentToolboxEmailValidatorTool(_AgentToolboxBaseTool):
    """Validate an email address (syntax, MX, SMTP, disposable check)."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None) -> None:
        super().__init__(
            meta=ToolMetadata(
                name="agent_toolbox_email_validator",
                description=(
                    "Validate an email address by checking syntax, MX records, "
                    "SMTP reachability, and disposable domain detection. "
                    "Returns verdict: deliverable, risky, undeliverable, or invalid."
                ),
            ),
            api_key=api_key,
            base_url=base_url,
        )

    def call(self, email: str, **kwargs: Any) -> ToolOutput:
        result = self._client.post("/v1/validate-email", {"email": email})
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"email": email}, raw_output=content)

    async def acall(self, email: str, **kwargs: Any) -> ToolOutput:
        result = await self._client.apost("/v1/validate-email", {"email": email})
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"email": email}, raw_output=content)


# ---------------------------------------------------------------------------
# Translate
# ---------------------------------------------------------------------------

class AgentToolboxTranslateTool(_AgentToolboxBaseTool):
    """Translate text between 100+ languages."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None) -> None:
        super().__init__(
            meta=ToolMetadata(
                name="agent_toolbox_translate",
                description=(
                    "Translate text between languages with automatic language detection. "
                    "Supports glossary for preserving specific terms. "
                    "Provide text, target language code, and optional glossary dict."
                ),
            ),
            api_key=api_key,
            base_url=base_url,
        )

    def call(self, text: str, target: str, source: str = "auto",
             glossary: Optional[Dict[str, str]] = None, **kwargs: Any) -> ToolOutput:
        payload: Dict[str, Any] = {"text": text, "target": target, "source": source}
        if glossary:
            payload["glossary"] = glossary
        result = self._client.post("/v1/translate", payload)
        data = result.get("data", {})
        content = data.get("translation", json.dumps(data, indent=2))
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input=payload, raw_output=content)

    async def acall(self, text: str, target: str, source: str = "auto",
                    glossary: Optional[Dict[str, str]] = None, **kwargs: Any) -> ToolOutput:
        payload: Dict[str, Any] = {"text": text, "target": target, "source": source}
        if glossary:
            payload["glossary"] = glossary
        result = await self._client.apost("/v1/translate", payload)
        data = result.get("data", {})
        content = data.get("translation", json.dumps(data, indent=2))
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input=payload, raw_output=content)
