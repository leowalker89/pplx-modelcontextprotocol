# Perplexity MCP Server

An MCP server that provides web search capabilities using Perplexity's API with automatic model selection based on query intent.

<a href="https://glama.ai/mcp/servers/6qmvjay9z5">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/6qmvjay9z5/badge" alt="Perplexity Server MCP server" />
</a>

## Quick Start

**Before starting Cursor, run this command in your terminal:**

```bash
cd perplexity-mcp && docker build -t mcp/perplexity-ask ./perplexity-ask
```

That's it! Now you can start Cursor and use the Perplexity tools.

## Prerequisites

- Docker
- A Perplexity API key (get one at <https://www.perplexity.ai/settings/api>)
- Cursor IDE with MCP support

## Installation

### Installing via Git

1. Clone this repository:

    ```bash
    git clone https://github.com/leowalker89/pplx-modelcontextprotocol.git
    cd pplx-modelcontextprotocol
    ```

2. Build the Docker image:

    ```bash
    docker build -t mcp/perplexity-ask ./perplexity-ask
    ```

## Configuration

1. Get your Perplexity API key from <https://www.perplexity.ai/settings/api>

2. Add the server to Cursor's MCP config file at `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "perplexity-ask": {
      "name": "perplexity-ask",
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "PERPLEXITY_API_KEY",
        "mcp/perplexity-ask"
      ],
      "env": {
        "PERPLEXITY_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Replace `your-api-key-here` with your actual Perplexity API key.

## Available Tools

This server provides three specialized Perplexity tools:

- **perplexity_ask** - General-purpose search using the `sonar-pro` model
- **perplexity_research** - Deep research using the `sonar-deep-research` model
- **perplexity_reason** - Complex reasoning using the `sonar-reasoning-pro` model

## Usage

After configuring the server and restarting Cursor, you can ask Claude to search for information. The AI will automatically select the most appropriate tool based on your query:

- General questions: "What's the latest news about SpaceX?"
- Research queries: "I need comprehensive research on quantum computing"
- Reasoning tasks: "Help me work through this complex problem step-by-step"

You can also explicitly request a specific tool:
- "Use the perplexity_ask tool to search for..."
- "Use the perplexity_research tool to research..."
- "Use the perplexity_reason tool to analyze..."

## Development

To modify the server:

1. Edit `perplexity-ask/index.ts`
2. Rebuild the Docker image: `docker build -t mcp/perplexity-ask ./perplexity-ask`
3. Restart Cursor to load the changes

## License

MIT