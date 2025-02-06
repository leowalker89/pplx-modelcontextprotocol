#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const API_KEY = process.env.PERPLEXITY_API_KEY;
if (!API_KEY) {
  throw new Error('PERPLEXITY_API_KEY environment variable is required');
}

interface SearchResponse {
  choices: [{
    message: {
      content: string;
    };
  }];
}

const isValidSearchArgs = (args: any): args is { query: string } =>
  typeof args === 'object' &&
  args !== null &&
  typeof args.query === 'string' &&
  args.query.trim().length > 0;

class PerplexityServer {
  private server: Server;
  private axiosInstance;

  constructor() {
    this.server = new Server(
      {
        name: 'perplexity-search-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.axiosInstance = axios.create({
      baseURL: 'https://api.perplexity.ai',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'search',
          description: 'Search the web using Perplexity AI',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The search query',
              },
            },
            required: ['query'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== 'search') {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      if (!isValidSearchArgs(request.params.arguments)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          'Invalid search arguments. Query must be a non-empty string.'
        );
      }

      try {
        const response = await this.axiosInstance.post<SearchResponse>('/chat/completions', {
          model: 'sonar',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that searches the web for accurate information.'
            },
            {
              role: 'user',
              content: request.params.arguments.query
            }
          ]
        });

        if (response.data.choices && response.data.choices.length > 0) {
          return {
            content: [
              {
                type: 'text',
                text: response.data.choices[0].message.content,
              },
            ],
          };
        } else {
          throw new Error('No response content received');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.error?.message ||
            error.response?.data?.detail ||
            error.message;
          console.error('Full error:', JSON.stringify(error.response?.data, null, 2));
          return {
            content: [
              {
                type: 'text',
                text: `Perplexity API error: ${errorMessage}`,
              },
            ],
            isError: true,
          };
        }
        throw error;
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Perplexity Search MCP server running on stdio');
  }
}

const server = new PerplexityServer();
server.run().catch(console.error);
