"""LlamaIndex Data Agent using Agent Toolbox tools."""

import asyncio
import sys
from llamaindex_agent_toolbox import AgentToolbox

try:
    from llama_index.core.agent.workflow import FunctionAgent
    from llama_index.llms.openai import OpenAI
except ImportError:
    print("Install: pip install llama-index-core llama-index-llms-openai")
    sys.exit(1)

query = sys.argv[1] if len(sys.argv) > 1 else "Investigate the domain openai.com"

toolbox = AgentToolbox()  # uses AGENT_TOOLBOX_API_KEY env var
tools = toolbox.get_tools()

llm = OpenAI(model="gpt-4o-mini")
agent = FunctionAgent(tools=tools, llm=llm)

async def main():
    response = await agent.run(query)
    print("\n" + "="*60)
    print("INVESTIGATION REPORT")
    print("="*60)
    print(response)

asyncio.run(main())
