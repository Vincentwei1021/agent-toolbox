"""LangChain Research Agent using Agent Toolbox tools."""

import sys
from langchain_agent_toolbox import AgentToolbox
from langchain.agents import initialize_agent, AgentType

# Use any LangChain-compatible LLM
try:
    from langchain_openai import ChatOpenAI
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
except ImportError:
    print("Install langchain-openai: pip install langchain-openai")
    sys.exit(1)

topic = sys.argv[1] if len(sys.argv) > 1 else "AI agents in production"

# Get all 13 tools (or pick specific ones)
toolbox = AgentToolbox()  # uses AGENT_TOOLBOX_API_KEY env var
tools = toolbox.get_tools()

agent = initialize_agent(
    tools, llm,
    agent=AgentType.OPENAI_FUNCTIONS,
    verbose=True,
)

result = agent.run(
    f"Research the topic '{topic}'. "
    f"1) Search the web for recent information. "
    f"2) Get the latest news about it. "
    f"3) Extract content from the most relevant result. "
    f"4) Summarize your findings in a structured report."
)
print("\n" + "="*60)
print("RESEARCH REPORT")
print("="*60)
print(result)
