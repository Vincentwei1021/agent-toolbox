"""Basic import and instantiation tests for langchain-agent-toolbox."""

import os
import pytest


def test_imports():
    from langchain_agent_toolbox import (
        AgentToolboxSearchTool,
        AgentToolboxExtractTool,
        AgentToolboxScreenshotTool,
        AgentToolboxWeatherTool,
        AgentToolboxFinanceTool,
        AgentToolboxEmailValidatorTool,
        AgentToolboxTranslateTool,
    )
    assert AgentToolboxSearchTool is not None
    assert AgentToolboxTranslateTool is not None


def test_tool_instantiation():
    from langchain_agent_toolbox import AgentToolboxSearchTool
    tool = AgentToolboxSearchTool(api_key="test-key")
    assert tool.name == "agent_toolbox_search"
    assert "search" in tool.description.lower()


def test_tool_schema():
    from langchain_agent_toolbox import AgentToolboxTranslateTool
    tool = AgentToolboxTranslateTool(api_key="test-key")
    schema = tool.args_schema.model_json_schema()
    assert "text" in schema["properties"]
    assert "target" in schema["properties"]


def test_missing_api_key():
    from langchain_agent_toolbox import AgentToolboxSearchTool
    # Clear env var if set
    os.environ.pop("AGENT_TOOLBOX_API_KEY", None)
    tool = AgentToolboxSearchTool()
    with pytest.raises(ValueError, match="API key is required"):
        tool._run(query="test")
