"""Basic import and instantiation tests for llamaindex-agent-toolbox."""

import os
import pytest


def test_imports():
    from llamaindex_agent_toolbox import (
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
    from llamaindex_agent_toolbox import AgentToolboxSearchTool
    tool = AgentToolboxSearchTool(api_key="test-key")
    assert tool.metadata.name == "agent_toolbox_search"
    assert "search" in tool.metadata.description.lower()


def test_tool_metadata():
    from llamaindex_agent_toolbox import AgentToolboxTranslateTool
    tool = AgentToolboxTranslateTool(api_key="test-key")
    assert tool.metadata.name == "agent_toolbox_translate"
    assert "translate" in tool.metadata.description.lower()


def test_missing_api_key():
    from llamaindex_agent_toolbox import AgentToolboxSearchTool
    os.environ.pop("AGENT_TOOLBOX_API_KEY", None)
    tool = AgentToolboxSearchTool()
    with pytest.raises(ValueError, match="API key is required"):
        tool.call(query="test")
