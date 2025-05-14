#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";
import chalk from 'chalk';

// Import server classes
import { MentalModelServer } from './tools/mentalModelServer.js';
import { DesignPatternServer } from './tools/designPatternServer.js';
import { ProgrammingParadigmServer } from './tools/programmingParadigmServer.js';
import { DebuggingApproachServer } from './tools/debuggingApproachServer.js';
import { SequentialThinkingServer } from './tools/sequentialThinkingServer.js';
import { CollaborativeReasoningServer } from './tools/collaborativeReasoningServer.js';
import { DecisionFrameworkServer } from './tools/decisionFrameworkServer.js';

// Tool Definitions
const MENTAL_MODEL_TOOL: Tool = {
  name: "mentalmodel",
  description: `A tool for applying structured mental models to problem-solving.
Supports various mental models including:
- First Principles Thinking
- Opportunity Cost Analysis
- Error Propagation Understanding
- Rubber Duck Debugging
- Pareto Principle
- Occam's Razor

Each model provides a systematic approach to breaking down and solving problems.`,
  inputSchema: {
    type: "object",
    properties: {
      modelName: {
        type: "string",
        enum: [
          "first_principles",
          "opportunity_cost",
          "error_propagation",
          "rubber_duck",
          "pareto_principle",
          "occams_razor"
        ]
      },
      problem: { type: "string" },
      steps: {
        type: "array",
        items: { type: "string" }
      },
      reasoning: { type: "string" },
      conclusion: { type: "string" }
    },
    required: ["modelName", "problem"]
  }
};

const DESIGN_PATTERN_TOOL: Tool = {
  name: "designpattern",
  description: `A tool for applying design patterns to software architecture and implementation.
Supports various design patterns including:
- Modular Architecture
- API Integration Patterns
- State Management
- Asynchronous Processing
- Scalability Considerations
- Security Best Practices
- Agentic Design Patterns

Each pattern provides a structured approach to solving common design challenges.`,
  inputSchema: {
    type: "object",
    properties: {
      patternName: {
        type: "string",
        enum: [
          "modular_architecture",
          "api_integration",
          "state_management",
          "async_processing",
          "scalability",
          "security",
          "agentic_design"
        ]
      },
      context: { type: "string" },
      implementation: {
        type: "array",
        items: { type: "string" }
      },
      benefits: {
        type: "array",
        items: { type: "string" }
      },
      tradeoffs: {
        type: "array",
        items: { type: "string" }
      },
      codeExample: { type: "string" },
      languages: {
        type: "array",
        items: { type: "string" }
      }
    },
    required: ["patternName", "context"]
  }
};

const PROGRAMMING_PARADIGM_TOOL: Tool = {
  name: "programmingparadigm",
  description: `A tool for applying different programming paradigms to solve problems.
Supports various programming paradigms including:
- Imperative Programming
- Procedural Programming
- Object-Oriented Programming
- Functional Programming
- Declarative Programming
- Logic Programming
- Event-Driven Programming
- Aspect-Oriented Programming
- Concurrent Programming
- Reactive Programming

Each paradigm provides a different approach to structuring and executing code.`,
  inputSchema: {
    type: "object",
    properties: {
      paradigmName: {
        type: "string",
        enum: [
          "imperative",
          "procedural",
          "object_oriented",
          "functional",
          "declarative",
          "logic",
          "event_driven",
          "aspect_oriented",
          "concurrent",
          "reactive"
        ]
      },
      problem: { type: "string" },
      approach: {
        type: "array",
        items: { type: "string" }
      },
      benefits: {
        type: "array",
        items: { type: "string" }
      },
      limitations: {
        type: "array",
        items: { type: "string" }
      },
      codeExample: { type: "string" },
      languages: {
        type: "array",
        items: { type: "string" }
      }
    },
    required: ["paradigmName", "problem"]
  }
};

const DEBUGGING_APPROACH_TOOL: Tool = {
  name: "debuggingapproach",
  description: `A tool for applying systematic debugging approaches to solve technical issues.
Supports various debugging methods including:
- Binary Search
- Reverse Engineering
- Divide and Conquer
- Backtracking
- Cause Elimination
- Program Slicing

Each approach provides a structured method for identifying and resolving issues.`,
  inputSchema: {
    type: "object",
    properties: {
      approachName: {
        type: "string",
        enum: [
          "binary_search",
          "reverse_engineering",
          "divide_conquer",
          "backtracking",
          "cause_elimination",
          "program_slicing"
        ]
      },
      issue: { type: "string" },
      steps: {
        type: "array",
        items: { type: "string" }
      },
      findings: { type: "string" },
      resolution: { type: "string" }
    },
    required: ["approachName", "issue"]
  }
};

const SEQUENTIAL_THINKING_TOOL: Tool = {
  name: "sequentialthinking",
  description: `A detailed tool for dynamic and reflective problem-solving through thoughts.
This tool helps analyze problems through a flexible thinking process that can adapt and evolve.
Each thought can build on, question, or revise previous insights as understanding deepens.

When to use this tool:
- Breaking down complex problems into steps
- Planning and design with room for revision
- Analysis that might need course correction
- Problems where the full scope might not be clear initially
- Problems that require a multi-step solution
- Tasks that need to maintain context over multiple steps
- Situations where irrelevant information needs to be filtered out

You should:
1. Start with an initial estimate of needed thoughts, but be ready to adjust
2. Feel free to question or revise previous thoughts
3. Don't hesitate to add more thoughts if needed, even at the "end"
4. Express uncertainty when present
5. Mark thoughts that revise previous thinking or branch into new paths
6. Ignore information that is irrelevant to the current step
7. Generate a solution hypothesis when appropriate
8. Verify the hypothesis based on the Chain of Thought steps
9. Repeat the process until satisfied with the solution
10. Provide a single, ideally correct answer as the final output
11. Only set next_thought_needed to false when truly done and a satisfactory answer is reached`,
  inputSchema: {
    type: "object",
    properties: {
      thought: { type: "string" },
      thoughtNumber: { type: "number", minimum: 1 },
      totalThoughts: { type: "number", minimum: 1 },
      nextThoughtNeeded: { type: "boolean" },
      isRevision: { type: "boolean" },
      revisesThought: { type: "number", minimum: 1 },
      branchFromThought: { type: "number", minimum: 1 },
      branchId: { type: "string" },
      needsMoreThoughts: { type: "boolean" }
    },
    required: ["thought", "thoughtNumber", "totalThoughts", "nextThoughtNeeded"]
  }
};

const COLLABORATIVE_REASONING_TOOL: Tool = {
  name: "collaborativereasoning",
  description: `A detailed tool for simulating expert collaboration with diverse perspectives.
This tool helps models tackle complex problems by coordinating multiple viewpoints.
It provides a framework for structured collaborative reasoning and perspective integration.`,
  inputSchema: {
    type: "object",
    properties: {
      topic: { type: "string" },
      personas: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            expertise: { type: "array", items: { type: "string" } },
            background: { type: "string" },
            perspective: { type: "string" },
            biases: { type: "array", items: { type: "string" } },
            communication: {
              type: "object",
              properties: {
                style: { type: "string" },
                tone: { type: "string" },
              },
              required: ["style", "tone"],
            },
          },
          required: ["id", "name", "expertise", "background", "perspective", "biases", "communication"],
        },
      },
      contributions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            personaId: { type: "string" },
            content: { type: "string" },
            type: { type: "string", enum: ["observation", "question", "insight", "concern", "suggestion", "challenge", "synthesis"] },
            confidence: { type: "number", minimum: 0, maximum: 1 },
            referenceIds: { type: "array", items: { type: "string" } },
          },
          required: ["personaId", "content", "type", "confidence"],
        },
      },
      stage: { type: "string", enum: ["problem-definition", "ideation", "critique", "integration", "decision", "reflection"] },
      activePersonaId: { type: "string" },
      nextPersonaId: { type: "string" },
      consensusPoints: { type: "array", items: { type: "string" } },
      disagreements: {
        type: "array",
        items: {
          type: "object",
          properties: {
            topic: { type: "string" },
            positions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  personaId: { type: "string" },
                  position: { type: "string" },
                  arguments: { type: "array", items: { type: "string" } },
                },
                required: ["personaId", "position", "arguments"],
              },
            },
          },
          required: ["topic", "positions"],
        },
      },
      keyInsights: { type: "array", items: { type: "string" } },
      openQuestions: { type: "array", items: { type: "string" } },
      finalRecommendation: { type: "string" },
      sessionId: { type: "string", description: "Unique identifier for this collaboration session" },
      iteration: { type: "number", minimum: 0, description: "Current iteration of the collaboration" },
      suggestedContributionTypes: {
        type: "array",
        items: { type: "string", enum: ["observation", "question", "insight", "concern", "suggestion", "challenge", "synthesis"] },
      },
      nextContributionNeeded: { type: "boolean", description: "Whether another contribution is needed" },
    },
    required: ["topic", "personas", "contributions", "stage", "activePersonaId", "sessionId", "iteration", "nextContributionNeeded"],
  },
};

const DECISION_FRAMEWORK_TOOL: Tool = {
  name: "decisionframework",
  description: `A detailed tool for structured decision analysis and rational choice.
This tool helps models systematically evaluate options, criteria, and outcomes.
It supports multiple decision frameworks, probability estimates, and value judgments.`,
  inputSchema: {
    type: "object",
    properties: {
      decisionStatement: { type: "string" },
      options: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
          },
          required: ["name", "description"],
        },
      },
      criteria: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            weight: { type: "number", minimum: 0, maximum: 1 },
          },
          required: ["name", "description", "weight"],
        },
      },
      analysisType: { type: "string", enum: ["pros-cons", "weighted-criteria", "decision-tree", "expected-value", "scenario-analysis"] },
      stage: { type: "string", enum: ["problem-definition", "options-generation", "criteria-definition", "evaluation", "sensitivity-analysis", "decision"] },
      stakeholders: { type: "array", items: { type: "string" } },
      constraints: { type: "array", items: { type: "string" } },
      timeHorizon: { type: "string" },
      riskTolerance: { type: "string", enum: ["risk-averse", "risk-neutral", "risk-seeking"] },
      possibleOutcomes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            description: { type: "string" },
            probability: { type: "number", minimum: 0, maximum: 1 },
            value: { type: "number" },
            optionId: { type: "string" },
            confidenceInEstimate: { type: "number", minimum: 0, maximum: 1 },
          },
          required: ["description", "probability", "optionId", "value", "confidenceInEstimate"],
        },
      },
      recommendation: { type: "string" },
      rationale: { type: "string" },
      decisionId: { type: "string", description: "Unique identifier for this decision analysis" },
      iteration: { type: "number", minimum: 0, description: "Current iteration of the decision process" },
      nextStageNeeded: { type: "boolean", description: "Whether another stage is needed in the process" },
    },
    required: ["decisionStatement", "options", "analysisType", "stage", "decisionId", "iteration", "nextStageNeeded"],
  },
};

// Server Instances
const modelServer = new MentalModelServer();
const designPatternServer = new DesignPatternServer();
const paradigmServer = new ProgrammingParadigmServer();
const debuggingServer = new DebuggingApproachServer();
const thinkingServer = new SequentialThinkingServer();
const collaborativeReasoningServer = new CollaborativeReasoningServer();
const decisionFrameworkServer = new DecisionFrameworkServer();

const server = new Server(
  {
    name: "clear-thought-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {
        sequentialthinking: SEQUENTIAL_THINKING_TOOL,
        mentalmodel: MENTAL_MODEL_TOOL,
        designpattern: DESIGN_PATTERN_TOOL,
        programmingparadigm: PROGRAMMING_PARADIGM_TOOL,
        debuggingapproach: DEBUGGING_APPROACH_TOOL,
        collaborativereasoning: COLLABORATIVE_REASONING_TOOL,
        decisionframework: DECISION_FRAMEWORK_TOOL,
      },
    },
  }
);

// Request Handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    SEQUENTIAL_THINKING_TOOL,
    MENTAL_MODEL_TOOL,
    DESIGN_PATTERN_TOOL,
    PROGRAMMING_PARADIGM_TOOL,
    DEBUGGING_APPROACH_TOOL,
    COLLABORATIVE_REASONING_TOOL,
    DECISION_FRAMEWORK_TOOL,
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "sequentialthinking": {
      const result = thinkingServer.processThought(request.params.arguments);
      return {
        content: [{ type: "application/json", text: JSON.stringify(result, null, 2) }]
      };
    }
    case "mentalmodel": {
      const result = modelServer.processModel(request.params.arguments);
      return {
        content: [{ type: "application/json", text: JSON.stringify(result, null, 2) }]
      };
    }
    case "designpattern": {
      const result = designPatternServer.processPattern(request.params.arguments);
      return {
        content: [{ type: "application/json", text: JSON.stringify(result, null, 2) }]
      };
    }
    case "programmingparadigm": {
      const result = paradigmServer.processParadigm(request.params.arguments);
      return {
        content: [{ type: "application/json", text: JSON.stringify(result, null, 2) }]
      };
    }
    case "debuggingapproach": {
      const result = debuggingServer.processApproach(request.params.arguments);
      return {
        content: [{ type: "application/json", text: JSON.stringify(result, null, 2) }]
      };
    }
    case "collaborativereasoning": {
      const result = collaborativeReasoningServer.processCollaborativeReasoning(request.params.arguments);
      return {
        content: [{ type: "application/json", text: JSON.stringify(result, null, 2) }]
      };
    }
    case "decisionframework": {
      const result = decisionFrameworkServer.processDecisionFramework(request.params.arguments);
      return {
        content: [{ type: "application/json", text: JSON.stringify(result, null, 2) }]
      };
    }
    default:
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Tool '${request.params.name}' not found.`
      );
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Clear Thought MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
