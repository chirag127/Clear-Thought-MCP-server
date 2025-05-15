# Clear Thought MCP Server

[![smithery badge](https://smithery.ai/badge/@chirag127/clear-thought-mcp-server)](https://smithery.ai/server/@chirag127/clear-thought-mcp-server)

A Model Context Protocol (MCP) server that provides systematic thinking, mental models, and debugging approaches for enhanced problem-solving capabilities.

## Features

### Mental Models

-   First Principles Thinking
-   Opportunity Cost Analysis
-   Error Propagation Understanding
-   Rubber Duck Debugging
-   Pareto Principle
-   Occam's Razor

### Design Patterns

-   Modular Architecture
-   API Integration Patterns
-   State Management
-   Asynchronous Processing
-   Scalability Considerations
-   Security Best Practices
-   Agentic Design Patterns

### Programming Paradigms

-   Imperative Programming
-   Procedural Programming
-   Object-Oriented Programming
-   Functional Programming
-   Declarative Programming
-   Logic Programming
-   Event-Driven Programming
-   Aspect-Oriented Programming
-   Concurrent Programming
-   Reactive Programming

### Debugging Approaches

-   Binary Search
-   Reverse Engineering
-   Divide and Conquer
-   Backtracking
-   Cause Elimination
-   Program Slicing

### Sequential Thinking

-   Structured thought process
-   Revision and branching support
-   Progress tracking
-   Context maintenance

### Collaborative Reasoning

-   Multi-persona problem-solving
-   Diverse expertise integration
-   Structured debate and consensus building
-   Perspective synthesis

### Decision Framework

-   Structured decision analysis
-   Multiple evaluation methodologies
-   Criteria weighting
-   Risk and uncertainty handling

### Metacognitive Monitoring

-   Knowledge boundary assessment
-   Claim certainty evaluation
-   Reasoning bias detection
-   Confidence calibration
-   Uncertainty identification

### Scientific Method

-   Structured hypothesis testing
-   Variable identification
-   Prediction formulation
-   Experimental design
-   Evidence evaluation

### Structured Argumentation

-   Formal dialectical reasoning
-   Thesis-antithesis-synthesis
-   Argument strength analysis
-   Premise evaluation
-   Logical structure mapping

### Visual Reasoning

-   Diagrammatic representation
-   Visual problem-solving
-   Spatial relationship analysis
-   Conceptual mapping
-   Visual insight generation

## Prerequisites

-   Node.js 18.x or higher
-   npm 9.x or higher

## Installation

### Installing via Smithery

To install clear-thought-mcp-server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@chirag127/clear-thought-mcp-server):

```bash
npx -y @smithery/cli install @chirag127/clear-thought-mcp-server --client claude
```

1. Clone the repository:

```bash
git clone https://github.com/chirag127/clear-thought-mcp-server.git
```

Then navigate to the project directory:

```bash
cd clear-thought-mcp-server
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

## Usage

### Running the Server

Start the server with:

```bash
npm start
```

This will start the MCP server using stdio transport, which can be connected to by MCP clients.

### Development Mode

For development with automatic reloading:

```bash
npm run dev
```

### Using with MCP Clients

The server can be used with any MCP-compatible client. Here are some examples:

#### Using with the MCP Inspector

1. Install the MCP Inspector:

```bash
npm install -g @modelcontextprotocol/inspector
```

2. Run the server:

```bash
npm start
```

3. In another terminal, connect the inspector:

```bash
mcp-inspector --stdio "node dist/index.js"
```

#### Using with LLM Applications

The server can be integrated with LLM applications that support the Model Context Protocol. Refer to the MCP documentation for specific integration details.

## Tool Selection Guide

Each tool in the Clear Thought MCP Server has specific strengths. Here are some scenarios where each tool might be particularly useful:

### Mental Models

Best suited for:

-   Initial problem understanding
-   Breaking down complex systems
-   Analyzing trade-offs
-   Finding root causes
-   Making strategic decisions

Example scenarios:

-   Analyzing system architecture choices
-   Evaluating competing solutions
-   Understanding error patterns

### Design Patterns

Best suited for:

-   Implementing proven solutions
-   Structuring new features
-   Ensuring maintainable code
-   Scaling applications
-   Managing technical debt

Example scenarios:

-   Building new system components
-   Refactoring existing code
-   Implementing cross-cutting concerns

### Programming Paradigms

Best suited for:

-   Selecting appropriate coding approaches
-   Understanding language strengths
-   Optimizing for specific problem types
-   Balancing trade-offs in implementation

Example scenarios:

-   Choosing between OOP and functional approaches
-   Implementing concurrent systems
-   Designing reactive applications

### Debugging Approaches

Best suited for:

-   Troubleshooting issues
-   Performance optimization
-   System analysis
-   Error resolution
-   Quality assurance

Example scenarios:

-   Fixing production issues
-   Optimizing slow processes
-   Resolving integration problems

### Sequential Thinking

Best suited for:

-   Complex problem-solving
-   Multi-step analysis
-   Decision refinement
-   Process improvement
-   Comprehensive planning

Example scenarios:

-   Planning major features
-   Analyzing system-wide changes
-   Making architectural decisions

### Collaborative Reasoning

Best suited for:

-   Complex, multi-faceted problems
-   Situations requiring diverse expertise
-   Controversial or high-stakes decisions
-   Innovation and ideation

Example scenarios:

-   Architectural design decisions
-   Product strategy development
-   Risk assessment and mitigation

### Decision Framework

Best suited for:

-   Structured choice between alternatives
-   Risk-aware decision making
-   Multi-criteria evaluation
-   Stakeholder-sensitive decisions

Example scenarios:

-   Technology selection
-   Resource allocation
-   Strategic planning

### Metacognitive Monitoring

Best suited for:

-   Assessing knowledge boundaries
-   Evaluating claim certainty
-   Detecting reasoning biases
-   Calibrating confidence
-   Identifying areas of uncertainty

Example scenarios:

-   Evaluating expertise in unfamiliar domains
-   Assessing confidence in predictions
-   Identifying potential biases in analysis
-   Determining when to seek additional information

### Scientific Method

Best suited for:

-   Systematic hypothesis testing
-   Empirical investigation
-   Causal analysis
-   Evidence-based reasoning
-   Iterative refinement of understanding

Example scenarios:

-   Investigating system behavior
-   Testing causal relationships
-   Evaluating competing explanations
-   Designing controlled experiments

### Structured Argumentation

Best suited for:

-   Formal dialectical reasoning
-   Analyzing complex debates
-   Evaluating competing positions
-   Synthesizing diverse viewpoints
-   Constructing logical arguments

Example scenarios:

-   Evaluating the strength of arguments
-   Identifying logical fallacies
-   Constructing persuasive cases
-   Resolving conflicting perspectives

### Visual Reasoning

Best suited for:

-   Spatial problem-solving
-   Conceptual mapping
-   Pattern recognition
-   Relationship visualization
-   Complex system modeling

Example scenarios:

-   Diagramming system architecture
-   Visualizing data relationships
-   Mapping conceptual spaces
-   Creating visual explanations

Note: These are suggestions rather than rules. Tools can be used in any order or combination that best serves your needs.

## Project Structure

```
clear-thought-mcp-server/
├── dist/               # Compiled JavaScript files
├── src/                # TypeScript source code
│   ├── models/         # Data interfaces
│   ├── tools/          # Tool implementations
│   └── index.ts        # Main server entry point
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Tech Stack

-   TypeScript
-   Node.js
-   Model Context Protocol SDK
-   Zod (for validation)

## Author

Chirag Singhal ([@chirag127](https://github.com/chirag127))

## License

MIT
