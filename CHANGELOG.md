# Changelog

All notable changes to the Clear Thought MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2025-05-15 03:40:23 (IST)

### Fixed

-   Fixed double-wrapping issue in mentalmodel tool handler by modifying the mentalModelServer.ts file to return a simpler response format

## [1.1.1] - 2025-05-15 03:31:44 (IST)

### Fixed

-   Fixed content type validation error in all tool handlers by changing response type from "application/json" to "text"

## [1.1.0] - 2025-05-15 03:20:24 (IST)

### Added

-   Metacognitive Monitoring tool for knowledge and reasoning quality assessment
-   Scientific Method tool for structured hypothesis testing and empirical investigation
-   Structured Argumentation tool for dialectical reasoning and argument analysis
-   Visual Reasoning tool for diagrammatic representation and visual problem-solving
-   Updated documentation with new tool descriptions and usage examples

## [1.0.0] - 2025-05-15 02:32:54 (IST)

### Added

-   Initial release of Clear Thought MCP Server
-   Mental Models tool with support for various thinking frameworks
-   Design Patterns tool for software architecture and implementation
-   Programming Paradigms tool for different coding approaches
-   Debugging Approaches tool for systematic issue resolution
-   Sequential Thinking tool for structured problem-solving
-   Collaborative Reasoning tool for multi-perspective analysis
-   Decision Framework tool for structured decision-making
-   Comprehensive documentation and usage examples
-   TypeScript implementation with full type safety
-   MCP SDK integration with stdio transport
