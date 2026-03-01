export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Agent Toolbox API",
    description: "A REST API providing search, web extraction, weather, finance, and screenshot tools for AI agents.",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:3100", description: "Local development" }],
  security: [{ BearerAuth: [] }],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      Meta: {
        type: "object",
        properties: {
          requestId: { type: "string" },
          latencyMs: { type: "number" },
          endpoint: { type: "string" },
          timestamp: { type: "string" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", enum: [false] },
          error: {
            type: "object",
            properties: {
              code: { type: "string" },
              message: { type: "string" },
            },
          },
          meta: { $ref: "#/components/schemas/Meta" },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        security: [],
        responses: {
          "200": {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    uptime: { type: "number" },
                    version: { type: "string" },
                    timestamp: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/v1/search": {
      post: {
        summary: "Search the web via DuckDuckGo",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["query"],
                properties: {
                  query: { type: "string", description: "Search query" },
                  count: { type: "integer", minimum: 1, maximum: 10, default: 5 },
                  lang: { type: "string", default: "en" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Search results",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          url: { type: "string" },
                          snippet: { type: "string" },
                        },
                      },
                    },
                    meta: { $ref: "#/components/schemas/Meta" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/v1/extract": {
      post: {
        summary: "Extract content from a web page",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: {
                  url: { type: "string", description: "URL to extract content from" },
                  format: { type: "string", enum: ["markdown", "text", "json"], default: "markdown" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Extracted content" },
        },
      },
    },
    "/v1/weather": {
      post: {
        summary: "Get weather forecast",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  location: { type: "string", description: "City or place name" },
                  lat: { type: "number", description: "Latitude" },
                  lon: { type: "number", description: "Longitude" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Weather data" },
        },
      },
    },
    "/v1/finance": {
      post: {
        summary: "Get stock quotes or exchange rates",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  {
                    type: "object",
                    required: ["symbol"],
                    properties: {
                      symbol: { type: "string", description: "Stock ticker symbol" },
                      type: { type: "string", enum: ["quote", "history"], default: "quote" },
                    },
                  },
                  {
                    type: "object",
                    required: ["from", "to"],
                    properties: {
                      from: { type: "string", description: "Source currency code" },
                      to: { type: "string", description: "Target currency code" },
                      amount: { type: "number", default: 1 },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          "200": { description: "Financial data" },
        },
      },
    },
    "/v1/screenshot": {
      post: {
        summary: "Take a screenshot of a web page",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: {
                  url: { type: "string", description: "URL to screenshot" },
                  width: { type: "integer", default: 1280, maximum: 1920 },
                  height: { type: "integer", default: 720, maximum: 1080 },
                  fullPage: { type: "boolean", default: false },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Screenshot as base64 PNG" },
        },
      },
    },
    "/v1/docs": {
      get: {
        summary: "OpenAPI specification",
        security: [],
        responses: {
          "200": { description: "OpenAPI 3.0 spec" },
        },
      },
    },
  },
};
