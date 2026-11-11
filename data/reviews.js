/**
 * REVIEWS DATA
 * Transparent software reviews with verifiable benchmark metrics.
 * Defined as window.REVIEWS_DATA for offline file:// compatibility.
 */

const REVIEWS_DATA = [
  {
    id: "obsidian",
    name: "Obsidian",
    tagline: "A second brain, for you, forever.",
    category: "Productivity",
    rating: 4.8,
    date: "2026-10-15",
    version: "v1.7.4",
    verdict: "The gold standard for offline-first personal knowledge management with total data sovereignty and an unbeatable community plugin ecosystem.",
    summary: "Obsidian is a personal knowledge management (PKM) tool that stores all notes in plain Markdown format on your local filesystem. Without proprietary database locks, your thoughts and documentation remain readable decades into the future.",
    pros: [
      "100% of data is stored locally in standard plain Markdown (.md) files",
      "Interactive graph view for visualizing interconnected concepts",
      "Thousands of extensible community plugins from Dataview to Canvas",
      "Instant full-vault search indexing without requiring an internet connection"
    ],
    cons: [
      "Official sync service (Obsidian Sync) is a paid add-on",
      "Slightly steeper learning curve for advanced multi-plugin configurations"
    ],
    scores: {
      ux: 88,
      performance: 95,
      value: 98,
      extensibility: 99,
      overall: 95
    },
    specs: {
      platform: "macOS, Windows, Linux, iOS, Android",
      license: "Free (Personal) / $50/user (Commercial)",
      techStack: "Electron + Local File System",
      author: "Dynalist Inc."
    }
  },
  {
    id: "zed-editor",
    name: "Zed Editor",
    tagline: "High-performance, multiplayer code editor.",
    category: "Developer Tools",
    rating: 4.7,
    date: "2026-10-28",
    version: "v0.158",
    verdict: "Blazing fast Rust-based code editor with GPU rendering, making it the strongest modern contender against VS Code bloat.",
    summary: "Created by the original founders of Atom and Tree-sitter, Zed was engineered from scratch in Rust using GPUI. Every pixel is rendered directly through your GPU, resulting in the lowest keystroke latency among all modern editors.",
    pros: [
      "Near-instant startup times (<100ms) and a fraction of VS Code's RAM footprint",
      "Built-in multiplayer collaboration with imperceptible latency",
      "Seamless integrated Language Server Protocol (LSP) support",
      "Open source under GPL with an active public roadmap"
    ],
    cons: [
      "Extension ecosystem is still growing compared to VS Code Marketplace",
      "Visual debugging integration is still in active development"
    ],
    scores: {
      ux: 91,
      performance: 99,
      value: 96,
      extensibility: 82,
      overall: 94
    },
    specs: {
      platform: "macOS, Linux (Windows Preview)",
      license: "Open Source (GPL v3 / AGPL)",
      techStack: "Rust + GPUI Framework",
      author: "Zed Industries"
    }
  },
  {
    id: "raycast",
    name: "Raycast",
    tagline: "Supercharged productivity for your workspace.",
    category: "Productivity",
    rating: 4.9,
    date: "2026-11-01",
    version: "v1.85",
    verdict: "The fastest Spotlight replacement, turning daily desktop navigation and API triggers into a frictionless, keyboard-first flow.",
    summary: "Raycast goes beyond a simple launcher. It integrates clipboard history, window management, snippet expansion, and third-party API automation (GitHub, Jira, Linear) right at your fingertips without opening browser tabs.",
    pros: [
      "Extremely responsive with sub-16ms command execution times",
      "TypeScript/React-based extension development with a thriving Store",
      "Quicklinks and custom snippets shave hours off repetitive typing each week",
      "Refined, tactile keyboard-centric user interface"
    ],
    cons: [
      "Desktop macOS exclusive (Windows version rolling out gradually)",
      "Built-in AI command integration requires a monthly Pro subscription"
    ],
    scores: {
      ux: 98,
      performance: 97,
      value: 92,
      extensibility: 97,
      overall: 96
    },
    specs: {
      platform: "macOS (Apple Silicon & Intel)",
      license: "Freemium (Pro $8/mo)",
      techStack: "Native Swift + React Extensions",
      author: "Raycast Technologies"
    }
  },
  {
    id: "tableplus",
    name: "TablePlus",
    tagline: "Modern, native, and friendly GUI for relational databases.",
    category: "Database",
    rating: 4.6,
    date: "2026-09-19",
    version: "Build 592",
    verdict: "A lightweight, native database client that frees developers from sluggish Electron-based database managers.",
    summary: "TablePlus supports PostgreSQL, MySQL, SQLite, Redis, and CockroachDB. Native code for every platform ensures fast startup, minimal battery draw, and efficient handling of massive query result sets.",
    pros: [
      "Truly native client with zero Chromium or Electron overhead",
      "Inline spreadsheet-style editing with commit previews before execution",
      "Multi-tab workflows with color-coded environment tags (Prod/Staging)",
      "Robust built-in SSH tunneling and TLS encryption"
    ],
    cons: [
      "Free version restricts workspace to 2 concurrent tabs",
      "Visual query builder is basic compared to enterprise BI suites"
    ],
    scores: {
      ux: 89,
      performance: 96,
      value: 86,
      extensibility: 79,
      overall: 89
    },
    specs: {
      platform: "macOS, Windows, Linux, iOS",
      license: "Perpetual License ($89) / Free Tier",
      techStack: "Objective-C / Swift / C# WPF",
      author: "TablePlus Inc."
    }
  },
  {
    id: "linear",
    name: "Linear",
    tagline: "The issue tracker built for high-performance software teams.",
    category: "Project Management",
    rating: 4.9,
    date: "2026-10-10",
    version: "2026.10 Cloud",
    verdict: "Redefined issue tracking and sprint planning with the gold standard in speed and keyboard-first aesthetic interaction.",
    summary: "Linear solved the chronic slowness of traditional issue trackers with client-side SQLite synchronization and comprehensive keyboard shortcuts, keeping engineers focused on building instead of filling forms.",
    pros: [
      "Instant offline-first sync via client-side SQLite in the browser",
      "100% keyboard shortcut navigable",
      "Precise two-way synchronization with GitHub, GitLab, and Slack",
      "Minimalist, elegant design free from convoluted configuration menus"
    ],
    cons: [
      "Opinionated workflows (less suited for non-technical waterfall teams)",
      "No arbitrary custom field bloat like traditional enterprise suites"
    ],
    scores: {
      ux: 99,
      performance: 98,
      value: 91,
      extensibility: 89,
      overall: 97
    },
    specs: {
      platform: "Web, macOS, Windows, iOS, Android",
      license: "Freemium / $8 - $14 per user",
      techStack: "React + Client-side SQLite Sync",
      author: "Linear Orbit, Inc."
    }
  },
  {
    id: "warp-terminal",
    name: "Warp Terminal",
    tagline: "The terminal for the 21st century.",
    category: "Terminal",
    rating: 4.5,
    date: "2026-09-04",
    version: "v0.2026.09",
    verdict: "A modernized block-based terminal that reimagines command line interaction as an interactive text editor.",
    summary: "Warp groups each command and its output into distinct, isolated blocks. Users can easily select text, copy outputs with one click, and search historical commands effortlessly.",
    pros: [
      "Terminal input behaves like a full text editor with cursor selection",
      "Outputs grouped into clean, shareable blocks",
      "Intelligent history search with interactive autocompletion",
      "Fast Rust-based GPU rendering on high-refresh-rate displays"
    ],
    cons: [
      "Requires an account login for team collaboration features",
      "Adjustment period for traditional Vim and Tmux purists"
    ],
    scores: {
      ux: 92,
      performance: 89,
      value: 88,
      extensibility: 85,
      overall: 90
    },
    specs: {
      platform: "macOS, Linux (Windows Coming Soon)",
      license: "Freemium / Free tier for individuals",
      techStack: "Rust + Metal GPU Rendering",
      author: "Warp Technologies, Inc."
    }
  }
];

if (typeof window !== 'undefined') {
  window.REVIEWS_DATA = REVIEWS_DATA;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = REVIEWS_DATA;
}
