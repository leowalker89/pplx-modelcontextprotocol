# Perplexity MCP Server

An MCP server that provides web search capabilities using Perplexity's API.

## Prerequisites

- Node.js (v14 or higher)
- A Perplexity API key (get one at <https://www.perplexity.ai/settings/api>)
- Claude Desktop App

## Installation

1. Clone this repository:

```bash
git clone [your-repo-url]
cd perplexity-server
```

2. Install dependencies:

```bash
npm install
```

3. Build the server:

```bash
npm run build
```

## Configuration

1. Get your Perplexity API key from <https://www.perplexity.ai/settings/api>

2. Add the server to Claude's config file at `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "perplexity-server": {
      "command": "node",
      "args": [
        "/absolute/path/to/perplexity-server/build/index.js"
      ],
      "env": {
        "PERPLEXITY_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Replace `/absolute/path/to` with the actual path to where you cloned the repository.

## Usage

After configuring the server and restarting Claude, you can use the search tool:

```typescript
<use_mcp_tool>
<server_name>perplexity-server</server_name>
<tool_name>search</tool_name>
<arguments>
{
  "query": "your search query here"
}
</arguments>
</use_mcp_tool>
```

The server will return search results from Perplexity's Sonar model.

## Development

To modify the server:

1. Edit `src/index.ts`
2. Rebuild with `npm run build`
3. Restart Claude to load the changes

## License

MIT
