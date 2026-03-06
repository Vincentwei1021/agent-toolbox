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


# ---------------------------------------------------------------------------
# GeoIP
# ---------------------------------------------------------------------------

class AgentToolboxGeoIPTool(_AgentToolboxBaseTool):
    """Look up geolocation information for an IP address."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None) -> None:
        super().__init__(
            meta=ToolMetadata(
                name="agent_toolbox_geoip",
                description="Get geolocation data for an IP address including country, city, ISP, coordinates, and timezone.",
            ),
            api_key=api_key, base_url=base_url,
        )

    def call(self, ip: str, **kwargs: Any) -> ToolOutput:
        result = self._client.post("/v1/geoip", {"ip": ip})
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"ip": ip}, raw_output=content)

    async def acall(self, ip: str, **kwargs: Any) -> ToolOutput:
        result = await self._client.apost("/v1/geoip", {"ip": ip})
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"ip": ip}, raw_output=content)


# ---------------------------------------------------------------------------
# News
# ---------------------------------------------------------------------------

class AgentToolboxNewsTool(_AgentToolboxBaseTool):
    """Search for recent news articles."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None) -> None:
        super().__init__(
            meta=ToolMetadata(
                name="agent_toolbox_news",
                description="Search for recent news articles on any topic. Returns titles, sources, URLs, and publication dates.",
            ),
            api_key=api_key, base_url=base_url,
        )

    def call(self, query: str, category: Optional[str] = None, language: str = "en", limit: int = 5, **kwargs: Any) -> ToolOutput:
        payload: Dict[str, Any] = {"query": query, "language": language, "limit": limit}
        if category:
            payload["category"] = category
        result = self._client.post("/v1/news", payload)
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input=payload, raw_output=content)

    async def acall(self, query: str, category: Optional[str] = None, language: str = "en", limit: int = 5, **kwargs: Any) -> ToolOutput:
        payload: Dict[str, Any] = {"query": query, "language": language, "limit": limit}
        if category:
            payload["category"] = category
        result = await self._client.apost("/v1/news", payload)
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input=payload, raw_output=content)


# ---------------------------------------------------------------------------
# WHOIS
# ---------------------------------------------------------------------------

class AgentToolboxWhoisTool(_AgentToolboxBaseTool):
    """Look up WHOIS information for a domain."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None) -> None:
        super().__init__(
            meta=ToolMetadata(
                name="agent_toolbox_whois",
                description="Get WHOIS registration data for a domain including registrar, creation date, expiry date, name servers, and registrant info.",
            ),
            api_key=api_key, base_url=base_url,
        )

    def call(self, domain: str, **kwargs: Any) -> ToolOutput:
        result = self._client.post("/v1/whois", {"domain": domain})
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"domain": domain}, raw_output=content)

    async def acall(self, domain: str, **kwargs: Any) -> ToolOutput:
        result = await self._client.apost("/v1/whois", {"domain": domain})
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"domain": domain}, raw_output=content)


# ---------------------------------------------------------------------------
# DNS
# ---------------------------------------------------------------------------

class AgentToolboxDnsTool(_AgentToolboxBaseTool):
    """Query DNS records for a domain."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None) -> None:
        super().__init__(
            meta=ToolMetadata(
                name="agent_toolbox_dns",
                description="Query DNS records for a domain. Supports A, AAAA, CNAME, MX, NS, TXT, SOA, SRV, and CAA record types.",
            ),
            api_key=api_key, base_url=base_url,
        )

    def call(self, domain: str, type: str = "A", **kwargs: Any) -> ToolOutput:
        result = self._client.post("/v1/dns", {"domain": domain, "type": type})
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"domain": domain, "type": type}, raw_output=content)

    async def acall(self, domain: str, type: str = "A", **kwargs: Any) -> ToolOutput:
        result = await self._client.apost("/v1/dns", {"domain": domain, "type": type})
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"domain": domain, "type": type}, raw_output=content)


# ---------------------------------------------------------------------------
# PDF Extract
# ---------------------------------------------------------------------------

class AgentToolboxPdfExtractTool(_AgentToolboxBaseTool):
    """Extract text content from a PDF file."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None) -> None:
        super().__init__(
            meta=ToolMetadata(
                name="agent_toolbox_pdf_extract",
                description="Extract text content from a PDF file given its URL. Supports up to 10MB files.",
            ),
            api_key=api_key, base_url=base_url,
        )

    def call(self, url: str, maxPages: Optional[int] = None, **kwargs: Any) -> ToolOutput:
        payload: Dict[str, Any] = {"url": url}
        if maxPages is not None:
            payload["maxPages"] = maxPages
        result = self._client.post("/v1/pdf-extract", payload)
        data = result.get("data", {})
        content = data.get("text", json.dumps(data, indent=2))
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input=payload, raw_output=content)

    async def acall(self, url: str, maxPages: Optional[int] = None, **kwargs: Any) -> ToolOutput:
        payload: Dict[str, Any] = {"url": url}
        if maxPages is not None:
            payload["maxPages"] = maxPages
        result = await self._client.apost("/v1/pdf-extract", payload)
        data = result.get("data", {})
        content = data.get("text", json.dumps(data, indent=2))
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input=payload, raw_output=content)


# ---------------------------------------------------------------------------
# QR Code
# ---------------------------------------------------------------------------

class AgentToolboxQrTool(_AgentToolboxBaseTool):
    """Generate a QR code image."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None) -> None:
        super().__init__(
            meta=ToolMetadata(
                name="agent_toolbox_qr",
                description="Generate a QR code image from text or a URL. Returns base64-encoded PNG or SVG data.",
            ),
            api_key=api_key, base_url=base_url,
        )

    def call(self, text: str, format: str = "png", width: int = 300, **kwargs: Any) -> ToolOutput:
        result = self._client.post("/v1/qr", {"text": text, "format": format, "width": width})
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"text": text}, raw_output=content)

    async def acall(self, text: str, format: str = "png", width: int = 300, **kwargs: Any) -> ToolOutput:
        result = await self._client.apost("/v1/qr", {"text": text, "format": format, "width": width})
        content = json.dumps(result.get("data", {}), indent=2)
        return ToolOutput(content=content, tool_name=self.metadata.name, raw_input={"text": text}, raw_output=content)


# ---------------------------------------------------------------------------
# Unified AgentToolbox — get all 13 tools at once
# ---------------------------------------------------------------------------

from typing import List

class AgentToolbox:
    """Convenience wrapper to get all 13 Agent Toolbox tools."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None) -> None:
        self.api_key = api_key
        self.base_url = base_url

    def get_tools(self) -> List[AsyncBaseTool]:
        """Return all 13 Agent Toolbox tools as LlamaIndex tool instances."""
        kw = {}
        if self.api_key:
            kw["api_key"] = self.api_key
        if self.base_url:
            kw["base_url"] = self.base_url
        return [
            AgentToolboxSearchTool(**kw),
            AgentToolboxExtractTool(**kw),
            AgentToolboxScreenshotTool(**kw),
            AgentToolboxWeatherTool(**kw),
            AgentToolboxFinanceTool(**kw),
            AgentToolboxEmailValidatorTool(**kw),
            AgentToolboxTranslateTool(**kw),
            AgentToolboxGeoIPTool(**kw),
            AgentToolboxNewsTool(**kw),
            AgentToolboxWhoisTool(**kw),
            AgentToolboxDnsTool(**kw),
            AgentToolboxPdfExtractTool(**kw),
            AgentToolboxQrTool(**kw),
        ]
