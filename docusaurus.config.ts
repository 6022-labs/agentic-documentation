import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// Override at build time for staging/local builds; llms.txt and sitemap.xml emit absolute URLs from it.
const siteUrl = process.env.DOCS_URL ?? "https://docs.agentic.6022.io";

const config: Config = {
  title: "6022 Protocol",
  tagline: "An open protocol for AI agents to recognise, reach and pay each other",
  favicon: "img/logo-192x192.png",

  future: {
    v4: true,
  },

  url: siteUrl,
  baseUrl: "/",

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },

  themes: [
    "@docusaurus/theme-mermaid",
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  stylesheets: [
    {
      href: "https://fonts.googleapis.com/css2?family=Geist:wght@400..700&family=Geist+Mono:wght@400;500&display=swap",
      type: "text/css",
    },
  ],

  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          // No landing page: the docs are the site.
          { from: "/", to: "/docs/intro" },
          // Pages of the previous layout, still linked from outside (e.g. the agent skills).
          { from: "/docs/users/external-agents", to: "/docs/teams/external-agents" },
          { from: "/docs/users/general-philosophy", to: "/docs/philosophy" },
          { from: "/docs/users/intro", to: "/docs/intro" },
          { from: "/docs/users/some-use-cases", to: "/docs/examples" },
          { from: "/docs/users/llm/hosted-providers", to: "/docs/agent/models" },
          { from: "/docs/users/llm/hosting-options", to: "/docs/agent/models" },
          { from: "/docs/users/llm/intro", to: "/docs/agent/models" },
          { from: "/docs/users/llm/local-ollama", to: "/docs/agent/models" },
          { from: "/docs/users/llm/tee-enclave", to: "/docs/agent/models" },
          { from: "/docs/users/llm/troubleshooting", to: "/docs/agent/models" },
          { from: "/docs/users/mcp/available-mcps", to: "/docs/agent/mcp-servers" },
          { from: "/docs/users/mcp/best-practice", to: "/docs/agent/mcp-servers" },
          { from: "/docs/users/mcp/configuration", to: "/docs/agent/tools" },
          { from: "/docs/users/mcp/intro", to: "/docs/agent/tools" },
          { from: "/docs/users/mcp/troubleshooting", to: "/docs/agent/tools" },
          { from: "/docs/users/memory/context-primary-keys", to: "/docs/teams/memory" },
          { from: "/docs/users/memory/intro", to: "/docs/teams/memory" },
          { from: "/docs/users/memory/memory-hydration", to: "/docs/agent/memory" },
          { from: "/docs/users/memory/memory-strategies", to: "/docs/teams/memory" },
          { from: "/docs/users/memory/threading-phase", to: "/docs/teams/memory" },
          { from: "/docs/users/orchestrator/actions-menu", to: "/docs/teams/orchestrator" },
          { from: "/docs/users/orchestrator/agent-configuration", to: "/docs/agent/deploy" },
          { from: "/docs/users/orchestrator/creating-agent", to: "/docs/teams/orchestrator" },
          { from: "/docs/users/orchestrator/intro", to: "/docs/teams/orchestrator" },
          { from: "/docs/users/slack/commands", to: "/docs/teams/slack-commands" },
          { from: "/docs/users/slack/intro", to: "/docs/teams/slack" },
          { from: "/docs/users/prompting/agent-types", to: "/docs/teams/prompting/intro" },
          { from: "/docs/users/prompting/conversation-flow", to: "/docs/teams/prompting/intro" },
          { from: "/docs/users/prompting/expert-prompts", to: "/docs/teams/prompting/expert" },
          { from: "/docs/users/prompting/facilitator-prompts", to: "/docs/teams/prompting/facilitator" },
          { from: "/docs/users/prompting/human-digital-twin", to: "/docs/teams/prompting/human" },
          { from: "/docs/users/prompting/intro", to: "/docs/teams/prompting/intro" },
          { from: "/docs/users/prompting/prompt-dynamic-fields", to: "/docs/teams/prompting/fields" },
          { from: "/docs/users/prompting/prompt-templates", to: "/docs/teams/prompting/intro" },
          { from: "/docs/users/prompting/prompt-writing-guide", to: "/docs/teams/prompting/intro" },
          { from: "/docs/developers/api-reference/context-primary-keys", to: "/docs/teams/memory" },
          { from: "/docs/developers/api-reference/memory-hydration", to: "/docs/agent/memory" },
          { from: "/docs/developers/domains/agent-identity", to: "/docs/developers/architecture" },
          { from: "/docs/developers/domains/agent-reasoning", to: "/docs/developers/architecture" },
          { from: "/docs/developers/domains/agent-knowledge", to: "/docs/agent/memory" },
          { from: "/docs/developers/domains/channels-and-integrations", to: "/docs/developers/architecture" },
          { from: "/docs/category/domains", to: "/docs/developers/architecture" },
          { from: "/docs/category/api-reference", to: "/docs/developers/api-reference/intro" },
        ],
      },
    ],
    [
      "docusaurus-plugin-llms",
      {
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        generateMarkdownFiles: true,
        docsDir: "docs",
        // Sidebar order: Docs, Teams, then Reference. Paths include docs/ because the plugin matches bare file names anywhere (matchBase).
        includeOrder: [
          "intro",
          "quickstart",
          "concepts/identity",
          "concepts/discovery",
          "concepts/messaging",
          "concepts/payments",
          "guides/create-identity",
          "guides/publish-agent",
          "guides/charge",
          "guides/verify",
          "guides/call-agent",
          "guides/pay",
          "agent/deploy",
          "agent/identity",
          "agent/models",
          "agent/tools",
          "agent/mcp-servers",
          "agent/memory",
          "agent/payments",
          "agent/**",
          "runtimes/hermes",
          "runtimes/openclaw",
          "runtimes/skills",
          "runtimes/**",
          "troubleshooting",
          "examples",
          "philosophy",
          "teams/overview",
          "teams/orchestrator",
          "teams/slack",
          "teams/slack-commands",
          "teams/agent-design",
          "teams/external-agents",
          "teams/memory",
          "teams/prompting/intro",
          "teams/prompting/facilitator",
          "teams/prompting/expert",
          "teams/prompting/human",
          "teams/prompting/fields",
          "teams/**",
          "developers/intro",
          "developers/architecture",
          "developers/api-reference/intro",
          "developers/api-reference/authentication",
          "developers/api-reference/agents",
          "developers/api-reference/conversations",
          "developers/api-reference/config-and-wallet",
          "developers/api-reference/**",
          "developers/integrations/slack-bridge-setup",
          "developers/integrations/building-mcps",
          "developers/**",
        ].map((page) => (page.endsWith("**") ? `docs/${page}` : `docs/${page}.md`)),
        excludeImports: true,
        removeDuplicateHeadings: true,
      },
    ],
  ],

  onBrokenLinks: "throw",

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/6022-labs/agentic-documentation/tree/main/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    mermaid: {
      theme: { light: "neutral", dark: "dark" },
      // Natural size, so phones scroll wide diagrams instead of shrinking them (see custom.css).
      options: {
        fontFamily: "Geist, system-ui, sans-serif",
        flowchart: { useMaxWidth: false },
        sequence: { useMaxWidth: false },
      },
    },
    image: "img/logo.png",
    navbar: {
      title: "6022 Protocol",
      logo: {
        alt: "",
        src: "img/logo.png",
        // "/" is only a client redirect, not a route.
        href: "/docs/intro",
      },
      items: [
        { type: "docSidebar", sidebarId: "docs", position: "left", label: "Docs" },
        { type: "docSidebar", sidebarId: "teams", position: "left", label: "Teams" },
        { type: "docSidebar", sidebarId: "reference", position: "left", label: "Reference" },
        { type: "search", position: "right" },
        {
          href: "https://github.com/6022-labs",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            { label: "Introduction", to: "/docs/intro" },
            { label: "Quickstart", to: "/docs/quickstart" },
            { label: "Teams", to: "/docs/teams/overview" },
            { label: "Reference", to: "/docs/developers/intro" },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Telegram",
              href: "https://t.me/protocol6022",
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/company/6022-protocol",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/6022-labs/agentic-documentation",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} 6022`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
