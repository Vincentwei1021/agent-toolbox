"""LangChain tools for Agent Toolbox API."""

from __future__ import annotations

import json
import os
from typing import Any, Dict, List, Optional, Type

from langchain_core.callbacks import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from langchain_core.tools import BaseTool
from pydantic import BaseModel, Field

from langchain_agent_toolbox.client import AgentToolboxClient, DEFAULT_BASE_URL


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


# ---------------------------------------------------------------------------
# Search
# ---------------------------------------------------------------------------

class SearchInput(BaseModel):
    query: str = Field(description="Search query string")
    count: int = Field(default=5, description="Number of results (1-10)")


class AgentToolboxSearchTool(BaseTool):
    """Search the web using Agent Toolbox API (DuckDuckGo backend)."""

    name: str = "agent_toolbox_search"
    description: str = (
        "Search the web and get titles, URLs, and snippets. "
        "Useful for finding up-to-date information on any topic."
    )
    args_schema: Type[BaseModel] = SearchInput
    api_key: Optional[str] = None
    base_url: Optional[str] = None

    def _run(
        self,
        query: str,
        count: int = 5,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        client = _get_client(self.api_key, self.base_url)
        result = client.post("/v1/search", {"query": query, "count": count})
        return json.dumps(result.get("data", []), indent=2)

    async def _arun(
        self,
        query: str,
        count: int = 5,
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ) -> str:
        client = _get_client(self.api_key, self.base_url)
        result = await client.apost("/v1/search", {"query": query, "count": count})
        return json.dumps(result.get("data", []), indent=2)


# ---------------------------------------------------------------------------
# Extract
# ---------------------------------------------------------------------------

class ExtractInput(BaseModel):
    url: str = Field(description="URL to extract content from")
    format: str = Field(default="markdown", description="Output format: markdown, text, or json")


class AgentToolboxExtractTool(BaseTool):
    """Extract readable content from a web page."""

    name: str = "agent_toolbox_extract"
    description: str = (
        "Extract the main readable content from a web page URL. "
        "Returns clean text/markdown, removing ads and navigation."
    )
    args_schema: Type[BaseModel] = ExtractInput
    api_key: Optional[str] = None
    base_url: Optional[str] = None

    def _run(
        self,
        url: str,
        format: str = "markdown",
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        client = _get_client(self.api_key, self.base_url)
        result = client.post("/v1/extract", {"url": url, "format": format})
        data = result.get("data", {})
        return data.get("content", json.dumps(data, indent=2))

    async def _arun(
        self,
        url: str,
        format: str = "markdown",
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ) -> str:
        client = _get_client(self.api_key, self.base_url)
        result = await client.apost("/v1/extract", {"url": url, "format": format})
        data = result.get("data", {})
        return data.get("content", json.dumps(data, indent=2))


# ---------------------------------------------------------------------------
# Screenshot
# ---------------------------------------------------------------------------

class ScreenshotInput(BaseModel):
    url: str = Field(description="URL to screenshot")
    width: int = Field(default=1280, description="Viewport width in pixels")
    height: int = Field(default=720, description="Viewport height in pixels")


class AgentToolboxScreenshotTool(BaseTool):
    """Take a screenshot of a web page."""

    name: str = "agent_toolbox_screenshot"
    description: str = (
        "Capture a screenshot of a web page. "
        "Returns base64-encoded PNG image data."
    )
    args_schema: Type[BaseModel] = ScreenshotInput
    api_key: Optional[str] = None
    base_url: Optional[str] = None

    def _run(
        self,
        url: str,
        width: int = 1280,
        height: int = 720,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        client = _get_client(self.api_key, self.base_url)
        result = client.post("/v1/screenshot", {"url": url, "width": width, "height": height})
        return json.dumps(result.get("data", {}), indent=2)

    async def _arun(
        self,
        url: str,
        width: int = 1280,
        height: int = 720,
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ) -> str:
        client = _get_client(self.api_key, self.base_url)
        result = await client.apost("/v1/screenshot", {"url": url, "width": width, "height": height})
        return json.dumps(result.get("data", {}), indent=2)


# ---------------------------------------------------------------------------
# Weather
# ---------------------------------------------------------------------------

class WeatherInput(BaseModel):
    location: str = Field(description="City name or location")


class AgentToolboxWeatherTool(BaseTool):
    """Get current weather and forecast for a location."""

    name: str = "agent_toolbox_weather"
    description: str = (
        "Get current weather conditions and forecast for any location. "
        "Returns temperature, humidity, wind, and multi-day forecast."
    )
    args_schema: Type[BaseModel] = WeatherInput
    api_key: Optional[str] = None
    base_url: Optional[str] = None

    def _run(
        self,
        location: str,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        client = _get_client(self.api_key, self.base_url)
        result = client.post("/v1/weather", {"location": location})
        return json.dumps(result.get("data", {}), indent=2)

    async def _arun(
        self,
        location: str,
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ) -> str:
        client = _get_client(self.api_key, self.base_url)
        result = await client.apost("/v1/weather", {"location": location})
        return json.dumps(result.get("data", {}), indent=2)


# ---------------------------------------------------------------------------
# Finance
# ---------------------------------------------------------------------------

class FinanceInput(BaseModel):
    symbol: Optional[str] = Field(default=None, description="Stock ticker symbol (e.g. AAPL)")
    type: Optional[str] = Field(default="quote", description="Request type: quote or exchange")
    from_currency: Optional[str] = Field(default=None, description="Source currency code (for exchange)", alias="from")
    to_currency: Optional[str] = Field(default=None, description="Target currency code (for exchange)", alias="to")
    amount: Optional[float] = Field(default=None, description="Amount to convert (for exchange)")

    class Config:
        populate_by_name = True


class AgentToolboxFinanceTool(BaseTool):
    """Get stock quotes or currency exchange rates."""

    name: str = "agent_toolbox_finance"
    description: str = (
        "Get real-time stock quotes or currency exchange rates. "
        "For stocks: provide symbol (e.g. 'AAPL'). "
        "For exchange rates: provide from, to, and amount."
    )
    args_schema: Type[BaseModel] = FinanceInput
    api_key: Optional[str] = None
    base_url: Optional[str] = None

    def _run(
        self,
        symbol: Optional[str] = None,
        type: Optional[str] = "quote",
        from_currency: Optional[str] = None,
        to_currency: Optional[str] = None,
        amount: Optional[float] = None,
        run_manager: Optional[CallbackManagerForToolRun] = None,
        **kwargs: Any,
    ) -> str:
        client = _get_client(self.api_key, self.base_url)
        payload: Dict[str, Any] = {}
        if symbol:
            payload = {"symbol": symbol, "type": type or "quote"}
        elif from_currency and to_currency:
            payload = {"from": from_currency, "to": to_currency, "amount": amount or 1}
        result = client.post("/v1/finance", payload)
        return json.dumps(result.get("data", {}), indent=2)

    async def _arun(
        self,
        symbol: Optional[str] = None,
        type: Optional[str] = "quote",
        from_currency: Optional[str] = None,
        to_currency: Optional[str] = None,
        amount: Optional[float] = None,
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
        **kwargs: Any,
    ) -> str:
        client = _get_client(self.api_key, self.base_url)
        payload: Dict[str, Any] = {}
        if symbol:
            payload = {"symbol": symbol, "type": type or "quote"}
        elif from_currency and to_currency:
            payload = {"from": from_currency, "to": to_currency, "amount": amount or 1}
        result = await client.apost("/v1/finance", payload)
        return json.dumps(result.get("data", {}), indent=2)


# ---------------------------------------------------------------------------
# Email Validator
# ---------------------------------------------------------------------------

class EmailValidatorInput(BaseModel):
    email: str = Field(description="Email address to validate")


class AgentToolboxEmailValidatorTool(BaseTool):
    """Validate an email address (syntax, MX, SMTP, disposable check)."""

    name: str = "agent_toolbox_email_validator"
    description: str = (
        "Validate an email address by checking syntax, MX records, "
        "SMTP reachability, and disposable domain detection. "
        "Returns a verdict: deliverable, risky, undeliverable, or invalid."
    )
    args_schema: Type[BaseModel] = EmailValidatorInput
    api_key: Optional[str] = None
    base_url: Optional[str] = None

    def _run(
        self,
        email: str,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        client = _get_client(self.api_key, self.base_url)
        result = client.post("/v1/validate-email", {"email": email})
        return json.dumps(result.get("data", {}), indent=2)

    async def _arun(
        self,
        email: str,
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ) -> str:
        client = _get_client(self.api_key, self.base_url)
        result = await client.apost("/v1/validate-email", {"email": email})
        return json.dumps(result.get("data", {}), indent=2)


# ---------------------------------------------------------------------------
# Translate
# ---------------------------------------------------------------------------

class TranslateInput(BaseModel):
    text: str = Field(description="Text to translate")
    target: str = Field(description="Target language code (e.g. zh, ja, es, fr)")
    source: str = Field(default="auto", description="Source language code or 'auto'")
    glossary: Optional[Dict[str, str]] = Field(default=None, description="Optional glossary: {term: translation}")


class AgentToolboxTranslateTool(BaseTool):
    """Translate text between 100+ languages."""

    name: str = "agent_toolbox_translate"
    description: str = (
        "Translate text between languages with automatic language detection. "
        "Supports glossary for preserving specific terms. "
        "Provide target language code (e.g. 'zh' for Chinese, 'ja' for Japanese)."
    )
    args_schema: Type[BaseModel] = TranslateInput
    api_key: Optional[str] = None
    base_url: Optional[str] = None

    def _run(
        self,
        text: str,
        target: str,
        source: str = "auto",
        glossary: Optional[Dict[str, str]] = None,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        client = _get_client(self.api_key, self.base_url)
        payload: Dict[str, Any] = {"text": text, "target": target, "source": source}
        if glossary:
            payload["glossary"] = glossary
        result = client.post("/v1/translate", payload)
        data = result.get("data", {})
        return data.get("translation", json.dumps(data, indent=2))

    async def _arun(
        self,
        text: str,
        target: str,
        source: str = "auto",
        glossary: Optional[Dict[str, str]] = None,
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ) -> str:
        client = _get_client(self.api_key, self.base_url)
        payload: Dict[str, Any] = {"text": text, "target": target, "source": source}
        if glossary:
            payload["glossary"] = glossary
        result = await client.apost("/v1/translate", payload)
        data = result.get("data", {})
        return data.get("translation", json.dumps(data, indent=2))
