export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Agent Toolbox API",
    description:
      "Production-ready REST API providing search, web extraction, weather, finance, and screenshot tools for AI agents and applications.",
    version: "1.0.0",
    contact: { url: "https://github.com/Vincentwei1021/agent-toolbox" },
    license: { name: "MIT" },
  },
  servers: [
    { url: "https://agent-toolbox.example.com", description: "Production" },
    { url: "http://localhost:3100", description: "Local development" },
  ],
  security: [{ BearerAuth: [] }],
  tags: [
    { name: "Search", description: "Web search via DuckDuckGo" },
    { name: "Extract", description: "Web page content extraction" },
    { name: "Weather", description: "Weather forecasts via Open-Meteo" },
    { name: "Finance", description: "Stock quotes and exchange rates" },
    { name: "Screenshot", description: "Web page screenshots via Playwright" },
    { name: "Email", description: "Email address validation" },
    { name: "Translate", description: "Text translation with language detection" },
    { name: "Auth", description: "API key management and usage" },
    { name: "Billing", description: "Subscription management via Creem" },
    { name: "System", description: "Health check and documentation" },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        description: "API key obtained from POST /v1/auth/register. Use as: Authorization: Bearer atb_xxxxx",
      },
    },
    schemas: {
      Meta: {
        type: "object",
        properties: {
          requestId: { type: "string", format: "uuid", example: "75490daa-54be-4a50-8856-248d46b036f4" },
          latencyMs: { type: "number", example: 540 },
          endpoint: { type: "string", example: "/v1/search" },
          timestamp: { type: "string", format: "date-time", example: "2026-03-01T13:43:04.040Z" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", enum: [false] },
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "VALIDATION_ERROR" },
              message: { type: "string", example: "Valid email is required" },
            },
          },
          meta: { "$ref": "#/components/schemas/Meta" },
        },
      },
      SearchResult: {
        type: "object",
        properties: {
          title: { type: "string", example: "OpenAI News" },
          url: { type: "string", format: "uri", example: "https://openai.com/news/" },
          snippet: { type: "string", example: "Stay up to speed on the rapid advancement of AI technology." },
        },
      },
      ExtractData: {
        type: "object",
        properties: {
          content: { type: "string", example: "This domain is for use in documentation examples..." },
          metadata: {
            type: "object",
            properties: {
              title: { type: "string", nullable: true, example: "Example Domain" },
              description: { type: "string", nullable: true },
              author: { type: "string", nullable: true },
              publishedDate: { type: "string", nullable: true },
              siteName: { type: "string", nullable: true },
            },
          },
        },
      },
      WeatherLocation: {
        type: "object",
        properties: {
          name: { type: "string", example: "New York" },
          latitude: { type: "number", example: 40.71427 },
          longitude: { type: "number", example: -74.00597 },
          timezone: { type: "string", example: "America/New_York" },
        },
      },
      WeatherCurrent: {
        type: "object",
        properties: {
          temperature: { type: "number", example: -2 },
          apparentTemperature: { type: "number", example: -7.2 },
          humidity: { type: "integer", example: 46 },
          precipitation: { type: "number", example: 0 },
          weatherCode: { type: "integer", example: 0 },
          weatherDescription: { type: "string", example: "Clear sky" },
          windSpeed: { type: "number", example: 11.9 },
          windDirection: { type: "integer", example: 358 },
        },
      },
      WeatherDaily: {
        type: "object",
        properties: {
          date: { type: "string", format: "date", example: "2026-03-02" },
          weatherCode: { type: "integer", example: 3 },
          weatherDescription: { type: "string", example: "Overcast" },
          temperatureMax: { type: "number", example: 1.6 },
          temperatureMin: { type: "number", example: -4.4 },
          precipitationSum: { type: "number", example: 0 },
          windSpeedMax: { type: "number", example: 15.5 },
        },
      },
      WeatherData: {
        type: "object",
        properties: {
          location: { "$ref": "#/components/schemas/WeatherLocation" },
          current: { "$ref": "#/components/schemas/WeatherCurrent" },
          daily: { type: "array", items: { "$ref": "#/components/schemas/WeatherDaily" } },
        },
      },
      StockQuote: {
        type: "object",
        properties: {
          symbol: { type: "string", example: "AAPL" },
          name: { type: "string", example: "Apple Inc." },
          price: { type: "number", example: 264.18 },
          change: { type: "number", example: -8.77 },
          changePercent: { type: "number", example: -3.21 },
          currency: { type: "string", example: "USD" },
          marketState: { type: "string", example: "REGULAR" },
          exchange: { type: "string", example: "NasdaqGS" },
        },
      },
      ExchangeRate: {
        type: "object",
        properties: {
          from: { type: "string", example: "USD" },
          to: { type: "string", example: "EUR" },
          amount: { type: "number", example: 100 },
          result: { type: "number", example: 84.71 },
          rate: { type: "number", example: 0.8471 },
          date: { type: "string", format: "date", example: "2026-02-27" },
        },
      },
      ScreenshotData: {
        type: "object",
        properties: {
          base64: { type: "string", description: "Base64-encoded PNG image" },
          width: { type: "integer", example: 1280 },
          height: { type: "integer", example: 720 },
          url: { type: "string", format: "uri", example: "https://example.com" },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        description: "Returns service health status, uptime, and version.",
        security: [],
        responses: {
          "200": {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    uptime: { type: "number", example: 3600 },
                    version: { type: "string", example: "1.0.0" },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
                example: { status: "ok", uptime: 3600, version: "1.0.0", timestamp: "2026-03-01T12:00:00.000Z" },
              },
            },
          },
        },
      },
    },
    "/v1/search": {
      post: {
        tags: ["Search"],
        summary: "Search the web",
        description: "Search the web via DuckDuckGo. Returns structured results with titles, URLs, and snippets.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["query"],
                properties: {
                  query: { type: "string", description: "Search query", example: "OpenAI latest news" },
                  count: { type: "integer", minimum: 1, maximum: 10, default: 5, description: "Number of results to return" },
                  lang: { type: "string", default: "en", description: "Language code (ISO 639-1)" },
                },
              },
              example: { query: "OpenAI latest news", count: 3, lang: "en" },
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
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { "$ref": "#/components/schemas/SearchResult" } },
                    meta: { "$ref": "#/components/schemas/Meta" },
                  },
                },
                example: {
                  success: true,
                  data: [
                    { title: "OpenAI News", url: "https://openai.com/news/", snippet: "Stay up to speed on the rapid advancement of AI technology." },
                    { title: "OpenAI gets $110 billion in funding...", url: "https://apnews.com/article/openai-amazon-nvidia", snippet: "ChatGPT maker OpenAI has received $110 billion in investments." },
                  ],
                  meta: { requestId: "75490daa-54be-4a50-8856-248d46b036f4", latencyMs: 767, endpoint: "/v1/search", timestamp: "2026-03-01T13:43:04.040Z" },
                },
              },
            },
          },
          "400": { description: "Validation error", content: { "application/json": { schema: { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized" },
          "429": { description: "Rate limit or usage limit exceeded" },
        },
      },
    },
    "/v1/extract": {
      post: {
        tags: ["Extract"],
        summary: "Extract content from a web page",
        description: "Fetches a URL and extracts clean, readable content using Mozilla Readability. Supports markdown, plain text, and structured JSON output.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: {
                  url: { type: "string", format: "uri", description: "URL to extract content from", example: "https://example.com" },
                  format: { type: "string", enum: ["markdown", "text", "json"], default: "markdown", description: "Output format" },
                },
              },
              example: { url: "https://example.com", format: "text" },
            },
          },
        },
        responses: {
          "200": {
            description: "Extracted content",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { "$ref": "#/components/schemas/ExtractData" },
                    meta: { "$ref": "#/components/schemas/Meta" },
                  },
                },
                example: {
                  success: true,
                  data: {
                    content: "This domain is for use in documentation examples without needing permission.",
                    metadata: { title: "Example Domain", description: null, author: null, publishedDate: null, siteName: null },
                  },
                  meta: { requestId: "ac6d8d96-7b4b-4a06-9389-bc76f03ffda3", latencyMs: 449, endpoint: "/v1/extract", timestamp: "2026-03-02T06:03:56.844Z" },
                },
              },
            },
          },
          "400": { description: "Validation error", content: { "application/json": { schema: { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/v1/weather": {
      post: {
        tags: ["Weather"],
        summary: "Get weather forecast",
        description: "Returns current conditions and 7-day forecast for any location worldwide via Open-Meteo. Provide either a location name or lat/lon coordinates.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  location: { type: "string", description: "City or place name", example: "Tokyo" },
                  lat: { type: "number", description: "Latitude (use with lon instead of location)" },
                  lon: { type: "number", description: "Longitude (use with lat instead of location)" },
                },
              },
              examples: {
                byName: { summary: "By city name", value: { location: "Tokyo" } },
                byCoords: { summary: "By coordinates", value: { lat: 35.6895, lon: 139.6917 } },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Weather data with current conditions and 7-day forecast",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { "$ref": "#/components/schemas/WeatherData" },
                    meta: { "$ref": "#/components/schemas/Meta" },
                  },
                },
              },
            },
          },
          "400": { description: "Validation error — provide location or lat+lon", content: { "application/json": { schema: { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/v1/finance": {
      post: {
        tags: ["Finance"],
        summary: "Get stock quotes or exchange rates",
        description: "Returns real-time stock quotes, historical price data, or currency exchange rates. Provide 'symbol' for stocks or 'from'+'to' for forex.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  symbol: { type: "string", description: "Stock ticker symbol (e.g. AAPL, MSFT)", example: "AAPL" },
                  type: { type: "string", enum: ["quote", "history"], default: "quote", description: "Data type for stock queries" },
                  from: { type: "string", description: "Source currency code (e.g. USD)", example: "USD" },
                  to: { type: "string", description: "Target currency code (e.g. EUR)", example: "EUR" },
                  amount: { type: "number", default: 1, description: "Amount to convert", example: 100 },
                },
              },
              examples: {
                stockQuote: { summary: "Stock quote", value: { symbol: "AAPL" } },
                stockHistory: { summary: "Stock history", value: { symbol: "AAPL", type: "history" } },
                exchangeRate: { summary: "Exchange rate", value: { from: "USD", to: "EUR", amount: 100 } },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Financial data (stock quote or exchange rate)",
            content: {
              "application/json": {
                examples: {
                  stockQuote: {
                    summary: "Stock quote response",
                    value: {
                      success: true,
                      data: { symbol: "AAPL", name: "Apple Inc.", price: 264.18, change: -8.77, changePercent: -3.21, currency: "USD", marketState: "REGULAR", exchange: "NasdaqGS" },
                      meta: { requestId: "74588e65-1277-487a-93e0-0d78778386c1", latencyMs: 160, endpoint: "/v1/finance", timestamp: "2026-03-02T06:03:57.911Z" },
                    },
                  },
                  exchangeRate: {
                    summary: "Exchange rate response",
                    value: {
                      success: true,
                      data: { from: "USD", to: "EUR", amount: 100, result: 84.71, rate: 0.8471, date: "2026-02-27" },
                      meta: { requestId: "791b691f-7bf2-4d79-a77a-51aa8014b662", latencyMs: 477, endpoint: "/v1/finance", timestamp: "2026-03-01T13:43:06.028Z" },
                    },
                  },
                },
              },
            },
          },
          "400": { description: "Validation error", content: { "application/json": { schema: { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/v1/screenshot": {
      post: {
        tags: ["Screenshot"],
        summary: "Take a screenshot of a web page",
        description: "Captures a screenshot of any URL using a headless Chromium browser. Returns a base64-encoded PNG image.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["url"],
                properties: {
                  url: { type: "string", format: "uri", description: "URL to screenshot", example: "https://example.com" },
                  width: { type: "integer", minimum: 320, maximum: 1920, default: 1280, description: "Viewport width in pixels" },
                  height: { type: "integer", minimum: 240, maximum: 1080, default: 720, description: "Viewport height in pixels" },
                  fullPage: { type: "boolean", default: false, description: "Capture the full scrollable page" },
                },
              },
              example: { url: "https://example.com", width: 1280, height: 720, fullPage: false },
            },
          },
        },
        responses: {
          "200": {
            description: "Screenshot captured successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { "$ref": "#/components/schemas/ScreenshotData" },
                    meta: { "$ref": "#/components/schemas/Meta" },
                  },
                },
                example: {
                  success: true,
                  data: { base64: "<base64_png_data>", width: 1280, height: 720, url: "https://example.com" },
                  meta: { requestId: "659400a3-8e83-4620-81ba-ad7c95292b46", latencyMs: 169, endpoint: "/v1/screenshot", timestamp: "2026-03-02T06:03:58.099Z" },
                },
              },
            },
          },
          "400": { description: "Validation error", content: { "application/json": { schema: { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/v1/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register for an API key",
        description: "Register with your email to receive a free API key (1,000 calls/month). If already registered, returns existing key.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", format: "email", example: "user@example.com" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "API key created",
            content: {
              "application/json": {
                example: { success: true, data: { apiKey: "atb_6175c4cbe4d9dde770ed3111953d9a37", plan: "free", limits: { monthly: 1000 } } },
              },
            },
          },
          "200": { description: "Existing key returned (email already registered)" },
          "400": { description: "Invalid email" },
        },
      },
    },
    "/v1/auth/usage": {
      get: {
        tags: ["Auth"],
        summary: "Check API usage",
        description: "Returns current month's usage count, plan info, and per-endpoint breakdown.",
        responses: {
          "200": {
            description: "Usage data",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: {
                    plan: "free",
                    usage: { month: "2026-03", calls: 150, limit: 1000 },
                    endpoints: { "/v1/search": 50, "/v1/extract": 100 },
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/v1/billing/checkout": {
      post: {
        tags: ["Billing"],
        summary: "Create checkout session",
        description: "Creates a Creem checkout session to upgrade your plan. Returns a URL to redirect the user to.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["plan"],
                properties: {
                  plan: { type: "string", enum: ["pro"], description: "Plan to upgrade to", example: "pro" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Checkout session created",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: { checkoutUrl: "https://creem.io/checkout/prod_xxx/ch_xxx", checkoutId: "ch_xxx" },
                },
              },
            },
          },
          "400": { description: "Invalid plan" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/v1/billing/webhook": {
      post: {
        tags: ["Billing"],
        summary: "Creem webhook handler",
        description: "Receives webhook events from Creem for payment lifecycle management. Not for direct use.",
        security: [],
        responses: {
          "200": { description: "Webhook processed" },
          "400": { description: "Invalid signature" },
        },
      },
    },
    "/v1/translate": {
      post: {
        tags: ["Translate"],
        summary: "Translate text",
        description: "Translate text between languages with auto-detection, Markdown preservation, glossary support, and batch processing. Powered by Google Translate (free, no API key).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["target"],
                properties: {
                  text: { type: "string", description: "Text to translate (single mode)", example: "Hello, how are you?" },
                  texts: { type: "array", items: { type: "string" }, description: "Array of texts (batch mode, max 20)", example: ["Hello", "Goodbye"] },
                  target: { type: "string", description: "Target language code (ISO 639-1)", example: "zh" },
                  source: { type: "string", default: "auto", description: "Source language code or 'auto' for detection" },
                  glossary: { type: "object", description: "Term mapping to preserve specific translations", example: { "API": "API", "endpoint": "端点" } },
                },
              },
              examples: {
                single: { summary: "Single text", value: { text: "Hello, how are you?", target: "zh" } },
                batch: { summary: "Batch", value: { texts: ["Hello", "Goodbye"], target: "ja" } },
                glossary: { summary: "With glossary", value: { text: "The API endpoint returns JSON data.", target: "zh", glossary: { "API": "API", "endpoint": "端点", "JSON": "JSON" } } },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Translation result",
            content: {
              "application/json": {
                examples: {
                  single: {
                    summary: "Single translation",
                    value: {
                      success: true,
                      data: { text: "Hello, how are you?", translation: "你好，你好吗？", detectedLanguage: { code: "en", confidence: 0.95 }, target: "zh" },
                      meta: { requestId: "abc-123", latencyMs: 350, endpoint: "/v1/translate", timestamp: "2026-03-02T22:00:00.000Z" },
                    },
                  },
                  batch: {
                    summary: "Batch translation",
                    value: {
                      success: true,
                      data: {
                        translations: [
                          { text: "Hello", translation: "こんにちは", detectedLanguage: { code: "en", confidence: 0.95 }, target: "ja" },
                          { text: "Goodbye", translation: "さようなら", detectedLanguage: { code: "en", confidence: 0.95 }, target: "ja" },
                        ],
                        target: "ja",
                      },
                      meta: { requestId: "def-456", latencyMs: 700, endpoint: "/v1/translate", timestamp: "2026-03-02T22:00:00.000Z" },
                    },
                  },
                },
              },
            },
          },
          "400": { description: "Validation error", content: { "application/json": { schema: { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/v1/validate-email": {
      post: {
        tags: ["Email"],
        summary: "Validate an email address",
        description: "Validates an email address by checking syntax, MX records, SMTP reachability, and disposable domain detection. Zero cost — no external APIs used.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", format: "email", description: "Email address to validate", example: "test@gmail.com" },
                },
              },
              example: { email: "test@gmail.com" },
            },
          },
        },
        responses: {
          "200": {
            description: "Email validation result",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: {
                    email: "test@gmail.com",
                    valid_syntax: true,
                    mx_found: true,
                    mx_records: [{ exchange: "gmail-smtp-in.l.google.com", priority: 5 }],
                    smtp_reachable: true,
                    smtp_response: "250 2.1.5 OK",
                    is_disposable: false,
                    score: 0.95,
                    verdict: "deliverable",
                  },
                  meta: { requestId: "abc-123", latencyMs: 1200, endpoint: "/v1/validate-email", timestamp: "2026-03-02T20:00:00.000Z" },
                },
              },
            },
          },
          "400": { description: "Validation error", content: { "application/json": { schema: { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/v1/geoip": {
      post: {
        tags: ["GeoIP"],
        summary: "IP geolocation lookup",
        description: "Returns geographic location data for an IP address including country, city, region, coordinates, timezone, and ISP information. Uses ip-api.com with 1-hour response caching.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["ip"],
                properties: {
                  ip: { type: "string", description: "IPv4 or IPv6 address to look up", example: "8.8.8.8" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "GeoIP lookup result",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        ip: { type: "string", example: "8.8.8.8" },
                        country: { type: "string", example: "United States" },
                        countryCode: { type: "string", example: "US" },
                        region: { type: "string", example: "VA" },
                        regionName: { type: "string", example: "Virginia" },
                        city: { type: "string", example: "Ashburn" },
                        zip: { type: "string", example: "20149" },
                        lat: { type: "number", example: 39.03 },
                        lon: { type: "number", example: -77.5 },
                        timezone: { type: "string", example: "America/New_York" },
                        isp: { type: "string", example: "Google LLC" },
                        org: { type: "string", example: "Google Public DNS" },
                        as: { type: "string", example: "AS15169 Google LLC" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": { description: "Invalid IP or private IP", content: { "application/json": { schema: { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/v1/docs": {
      get: {
        tags: ["System"],
        summary: "OpenAPI specification",
        description: "Returns this OpenAPI 3.0 specification as JSON.",
        security: [],
        responses: {
          "200": { description: "OpenAPI 3.0 JSON spec" },
        },
      },
    },
  },
};
