#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { z } from "zod";

// Import server classes
import { MentalModelServer } from "./tools/mentalModelServer.js";
import { DesignPatternServer } from "./tools/designPatternServer.js";
import { ProgrammingParadigmServer } from "./tools/programmingParadigmServer.js";
import { DebuggingApproachServer } from "./tools/debuggingApproachServer.js";
import { SequentialThinkingServer } from "./tools/sequentialThinkingServer.js";
import { CollaborativeReasoningServer } from "./tools/collaborativeReasoningServer.js";
import { DecisionFrameworkServer } from "./tools/decisionFrameworkServer.js";
import { MetacognitiveMonitoringServer } from "./tools/metacognitiveMonitoringServer.js";
import { ScientificMethodServer } from "./tools/scientificMethodServer.js";
import { StructuredArgumentationServer } from "./tools/structuredArgumentationServer.js";
import { VisualReasoningServer } from "./tools/visualReasoningServer.js";
import { StochasticThinkingServer } from "./tools/stochasticThinkingServer.js";

// ---------------------------------------------------------------------------
// Tool descriptions (preserved verbatim from the original definitions)
// ---------------------------------------------------------------------------

const MENTAL_MODEL_DESCRIPTION = `A tool for applying structured mental models to problem-solving.
Supports various mental models including:
- First Principles Thinking
- Opportunity Cost Analysis
- Error Propagation Understanding
- Rubber Duck Debugging
- Pareto Principle
- Occam's Razor

Each model provides a systematic approach to breaking down and solving problems.`;

const DESIGN_PATTERN_DESCRIPTION = `A tool for applying design patterns to software architecture and implementation.
Supports various design patterns including:
- Modular Architecture
- API Integration Patterns
- State Management
- Asynchronous Processing
- Scalability Considerations
- Security Best Practices
- Agentic Design Patterns

Each pattern provides a structured approach to solving common design challenges.`;

const PROGRAMMING_PARADIGM_DESCRIPTION = `A tool for applying different programming paradigms to solve problems.
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

Each paradigm provides a different approach to structuring and executing code.`;

const DEBUGGING_APPROACH_DESCRIPTION = `A tool for applying systematic debugging approaches to solve technical issues.
Supports various debugging methods including:
- Binary Search
- Reverse Engineering
- Divide and Conquer
- Backtracking
- Cause Elimination
- Program Slicing

Each approach provides a structured method for identifying and resolving issues.`;

const SEQUENTIAL_THINKING_DESCRIPTION = `A detailed tool for dynamic and reflective problem-solving through thoughts.
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
11. Only set next_thought_needed to false when truly done and a satisfactory answer is reached`;

const COLLABORATIVE_REASONING_DESCRIPTION = `A detailed tool for simulating expert collaboration with diverse perspectives.
This tool helps models tackle complex problems by coordinating multiple viewpoints.
It provides a framework for structured collaborative reasoning and perspective integration.`;

const DECISION_FRAMEWORK_DESCRIPTION = `A detailed tool for structured decision analysis and rational choice.
This tool helps models systematically evaluate options, criteria, and outcomes.
It supports multiple decision frameworks, probability estimates, and value judgments.`;

const METACOGNITIVE_MONITORING_DESCRIPTION = `A detailed tool for systematic self-monitoring of knowledge and reasoning quality.
This tool helps models track knowledge boundaries, claim certainty, and reasoning biases.
It provides a framework for metacognitive assessment across various domains and reasoning tasks.`;

const SCIENTIFIC_METHOD_DESCRIPTION = `A detailed tool for applying formal scientific reasoning to questions and problems.
This tool guides models through the scientific method with structured hypothesis testing.
It enforces explicit variable identification, prediction making, and evidence evaluation.`;

const STRUCTURED_ARGUMENTATION_DESCRIPTION = `A detailed tool for systematic dialectical reasoning and argument analysis.
This tool helps analyze complex questions through formal argumentation structures.
It facilitates the creation, critique, and synthesis of competing arguments.`;

const VISUAL_REASONING_DESCRIPTION = `A tool for visual thinking, problem-solving, and communication.
This tool enables models to create, manipulate, and interpret diagrams, graphs, and other visual representations.
It supports various visual elements and operations to facilitate insight generation and hypothesis testing.`;

const STOCHASTIC_THINKING_DESCRIPTION = `A tool for probabilistic reasoning and stochastic analysis of uncertain problems.
Guides structured reasoning through probability estimation, scenario generation,
Bayesian updating, Monte Carlo thinking, and sensitivity analysis.

Stages:
- problem-framing: Define the uncertain problem space
- variable-identification: Identify stochastic variables and their distributions
- scenario-generation: Generate weighted probabilistic scenarios
- probability-estimation: Estimate and update probabilities (Bayesian)
- sensitivity-analysis: Rank variables by impact on outcome
- decision-recommendation: Recommend action under uncertainty

Use for: risk analysis, forecasting, decision-making under uncertainty,
expected-value reasoning, confidence interval estimation.`;

// ---------------------------------------------------------------------------
// Input schemas.
//
// The underlying tool servers perform their own permissive validation over a
// loose `Record<string, unknown>`, so these Zod schemas advertise the correct
// required/optional top-level fields to clients while passing every argument
// through untouched (nested structures kept permissive via `.passthrough()`
// and `z.any()`; unknown keys preserved via `.passthrough()`). This keeps the
// established per-tool behavior byte-for-byte identical to the previous
// JSON-Schema + internal-validation implementation.
// ---------------------------------------------------------------------------

const mentalModelSchema = z
    .object({
        modelName: z.enum([
            "first_principles",
            "opportunity_cost",
            "error_propagation",
            "rubber_duck",
            "pareto_principle",
            "occams_razor",
        ]),
        problem: z.string(),
        steps: z.array(z.string()).optional(),
        reasoning: z.string().optional(),
        conclusion: z.string().optional(),
    })
    .passthrough();

const designPatternSchema = z
    .object({
        patternName: z.enum([
            "modular_architecture",
            "api_integration",
            "state_management",
            "async_processing",
            "scalability",
            "security",
            "agentic_design",
        ]),
        context: z.string(),
        implementation: z.array(z.string()).optional(),
        benefits: z.array(z.string()).optional(),
        tradeoffs: z.array(z.string()).optional(),
        codeExample: z.string().optional(),
        languages: z.array(z.string()).optional(),
    })
    .passthrough();

const programmingParadigmSchema = z
    .object({
        paradigmName: z.enum([
            "imperative",
            "procedural",
            "object_oriented",
            "functional",
            "declarative",
            "logic",
            "event_driven",
            "aspect_oriented",
            "concurrent",
            "reactive",
        ]),
        problem: z.string(),
        approach: z.array(z.string()).optional(),
        benefits: z.array(z.string()).optional(),
        limitations: z.array(z.string()).optional(),
        codeExample: z.string().optional(),
        languages: z.array(z.string()).optional(),
    })
    .passthrough();

const debuggingApproachSchema = z
    .object({
        approachName: z.enum([
            "binary_search",
            "reverse_engineering",
            "divide_conquer",
            "backtracking",
            "cause_elimination",
            "program_slicing",
        ]),
        issue: z.string(),
        steps: z.array(z.string()).optional(),
        findings: z.string().optional(),
        resolution: z.string().optional(),
    })
    .passthrough();

const sequentialThinkingSchema = z
    .object({
        thought: z.string(),
        thoughtNumber: z.number().min(1),
        totalThoughts: z.number().min(1),
        nextThoughtNeeded: z.boolean(),
        isRevision: z.boolean().optional(),
        revisesThought: z.number().min(1).optional(),
        branchFromThought: z.number().min(1).optional(),
        branchId: z.string().optional(),
        needsMoreThoughts: z.boolean().optional(),
    })
    .passthrough();

const collaborativeReasoningSchema = z
    .object({
        topic: z.string(),
        personas: z.array(z.any()),
        contributions: z.array(z.any()),
        stage: z.enum([
            "problem-definition",
            "ideation",
            "critique",
            "integration",
            "decision",
            "reflection",
        ]),
        activePersonaId: z.string(),
        nextPersonaId: z.string().optional(),
        consensusPoints: z.array(z.string()).optional(),
        disagreements: z.array(z.any()).optional(),
        keyInsights: z.array(z.string()).optional(),
        openQuestions: z.array(z.string()).optional(),
        finalRecommendation: z.string().optional(),
        sessionId: z.string().describe("Unique identifier for this collaboration session"),
        iteration: z.number().min(0).describe("Current iteration of the collaboration"),
        suggestedContributionTypes: z.array(z.string()).optional(),
        nextContributionNeeded: z
            .boolean()
            .describe("Whether another contribution is needed"),
    })
    .passthrough();

const decisionFrameworkSchema = z
    .object({
        decisionStatement: z.string(),
        options: z.array(z.any()),
        criteria: z.array(z.any()).optional(),
        analysisType: z.enum([
            "pros-cons",
            "weighted-criteria",
            "decision-tree",
            "expected-value",
            "scenario-analysis",
        ]),
        stage: z.enum([
            "problem-definition",
            "options-generation",
            "criteria-definition",
            "evaluation",
            "sensitivity-analysis",
            "decision",
        ]),
        stakeholders: z.array(z.string()).optional(),
        constraints: z.array(z.string()).optional(),
        timeHorizon: z.string().optional(),
        riskTolerance: z
            .enum(["risk-averse", "risk-neutral", "risk-seeking"])
            .optional(),
        possibleOutcomes: z.array(z.any()).optional(),
        recommendation: z.string().optional(),
        rationale: z.string().optional(),
        decisionId: z.string().describe("Unique identifier for this decision analysis"),
        iteration: z.number().min(0).describe("Current iteration of the decision process"),
        nextStageNeeded: z
            .boolean()
            .describe("Whether another stage is needed in the process"),
    })
    .passthrough();

const metacognitiveMonitoringSchema = z
    .object({
        task: z.string(),
        stage: z.enum([
            "knowledge-assessment",
            "planning",
            "execution",
            "monitoring",
            "evaluation",
            "reflection",
        ]),
        knowledgeAssessment: z.any().optional(),
        claims: z.array(z.any()).optional(),
        reasoningSteps: z.array(z.any()).optional(),
        overallConfidence: z.number().min(0).max(1),
        uncertaintyAreas: z.array(z.string()),
        recommendedApproach: z.string(),
        monitoringId: z.string().describe("Unique identifier for this monitoring session"),
        iteration: z.number().min(0).describe("Current iteration of the monitoring process"),
        suggestedAssessments: z.array(z.string()).optional(),
        nextAssessmentNeeded: z
            .boolean()
            .describe("Whether further assessment is needed"),
    })
    .passthrough();

const scientificMethodSchema = z
    .object({
        stage: z.enum([
            "observation",
            "question",
            "hypothesis",
            "experiment",
            "analysis",
            "conclusion",
            "iteration",
        ]),
        observation: z.string().optional(),
        question: z.string().optional(),
        hypothesis: z.any().optional(),
        experiment: z.any().optional(),
        analysis: z.string().optional(),
        conclusion: z.string().optional(),
        inquiryId: z.string().describe("Unique identifier for this scientific inquiry"),
        iteration: z.number().min(0).describe("Current iteration of the scientific process"),
        nextStageNeeded: z
            .boolean()
            .describe("Whether another stage is needed in the process"),
    })
    .passthrough();

const structuredArgumentationSchema = z
    .object({
        claim: z.string(),
        premises: z.array(z.string()),
        conclusion: z.string(),
        argumentId: z
            .string()
            .describe("Optional unique identifier for this argument")
            .optional(),
        argumentType: z.enum([
            "thesis",
            "antithesis",
            "synthesis",
            "objection",
            "rebuttal",
        ]),
        confidence: z
            .number()
            .min(0)
            .max(1)
            .describe("Confidence level in this argument (0.0-1.0)"),
        respondsTo: z
            .string()
            .describe("ID of the argument this directly responds to")
            .optional(),
        supports: z
            .array(z.string())
            .describe("IDs of arguments this supports")
            .optional(),
        contradicts: z
            .array(z.string())
            .describe("IDs of arguments this contradicts")
            .optional(),
        strengths: z
            .array(z.string())
            .describe("Notable strong points of the argument")
            .optional(),
        weaknesses: z
            .array(z.string())
            .describe("Notable weak points of the argument")
            .optional(),
        nextArgumentNeeded: z
            .boolean()
            .describe("Whether another argument is needed in the dialectic"),
        suggestedNextTypes: z
            .array(z.string())
            .describe("Suggested types for the next argument")
            .optional(),
    })
    .passthrough();

const visualReasoningSchema = z
    .object({
        operation: z.enum(["create", "update", "delete", "transform", "observe"]),
        elements: z.array(z.any()).optional(),
        transformationType: z
            .enum(["rotate", "move", "resize", "recolor", "regroup"])
            .optional(),
        diagramId: z.string(),
        diagramType: z.enum([
            "graph",
            "flowchart",
            "stateDiagram",
            "conceptMap",
            "treeDiagram",
            "custom",
        ]),
        iteration: z.number().min(0),
        observation: z.string().optional(),
        insight: z.string().optional(),
        hypothesis: z.string().optional(),
        nextOperationNeeded: z.boolean(),
    })
    .passthrough();

const stochasticThinkingSchema = z
    .object({
        problem: z.string(),
        stage: z.enum([
            "problem-framing",
            "variable-identification",
            "scenario-generation",
            "probability-estimation",
            "sensitivity-analysis",
            "decision-recommendation",
        ]),
        variables: z.array(z.any()).optional(),
        scenarios: z.array(z.any()).optional(),
        priorBeliefs: z.string().optional(),
        evidence: z.array(z.string()).optional(),
        posteriorBeliefs: z.string().optional(),
        expectedValue: z.number().optional(),
        variance: z.number().optional(),
        confidenceInterval: z.any().optional(),
        monteCarloIterations: z.number().min(1).optional(),
        sensitivityRanking: z.array(z.any()).optional(),
        recommendation: z.string().optional(),
        thinkingId: z.string(),
        iteration: z.number().min(0),
        nextStageNeeded: z.boolean(),
    })
    .passthrough();

// ---------------------------------------------------------------------------
// Tool server instances
// ---------------------------------------------------------------------------

const modelServer = new MentalModelServer();
const designPatternServer = new DesignPatternServer();
const paradigmServer = new ProgrammingParadigmServer();
const debuggingServer = new DebuggingApproachServer();
const thinkingServer = new SequentialThinkingServer();
const collaborativeReasoningServer = new CollaborativeReasoningServer();
const decisionFrameworkServer = new DecisionFrameworkServer();
const metacognitiveMonitoringServer = new MetacognitiveMonitoringServer();
const scientificMethodServer = new ScientificMethodServer();
const structuredArgumentationServer = new StructuredArgumentationServer();
const visualReasoningServer = new VisualReasoningServer();
const stochasticThinkingServer = new StochasticThinkingServer();

// Wrap a plain data object into a CallToolResult (matches the original
// dispatch behavior for tools whose process* returns raw data).
function toResult(data: unknown) {
    return {
        content: [
            {
                type: "text" as const,
                text: JSON.stringify(data, null, 2),
            },
        ],
    };
}

// ---------------------------------------------------------------------------
// Server factory. A fresh McpServer is created per HTTP session; a single
// shared instance is exported for stdio and for the in-memory test harness.
// ---------------------------------------------------------------------------

export function createMcpServer(): McpServer {
    const server = new McpServer(
        {
            name: "clear-thought-mcp-server",
            version: "1.1.2",
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );

    // Tools whose process* returns raw data -> wrap in toResult.
    server.registerTool(
        "sequentialthinking",
        {
            title: "Sequential Thinking",
            description: SEQUENTIAL_THINKING_DESCRIPTION,
            inputSchema: sequentialThinkingSchema.shape,
        },
        async (args) => toResult(thinkingServer.processThought(args))
    );

    server.registerTool(
        "mentalmodel",
        {
            title: "Mental Model",
            description: MENTAL_MODEL_DESCRIPTION,
            inputSchema: mentalModelSchema.shape,
        },
        async (args) => toResult(modelServer.processModel(args))
    );

    server.registerTool(
        "collaborativereasoning",
        {
            title: "Collaborative Reasoning",
            description: COLLABORATIVE_REASONING_DESCRIPTION,
            inputSchema: collaborativeReasoningSchema.shape,
        },
        async (args) =>
            toResult(
                collaborativeReasoningServer.processCollaborativeReasoning(args)
            )
    );

    server.registerTool(
        "decisionframework",
        {
            title: "Decision Framework",
            description: DECISION_FRAMEWORK_DESCRIPTION,
            inputSchema: decisionFrameworkSchema.shape,
        },
        async (args) =>
            toResult(decisionFrameworkServer.processDecisionFramework(args))
    );

    // Tools whose process* already returns a CallToolResult -> pass through.
    server.registerTool(
        "designpattern",
        {
            title: "Design Pattern",
            description: DESIGN_PATTERN_DESCRIPTION,
            inputSchema: designPatternSchema.shape,
        },
        async (args) => designPatternServer.processPattern(args)
    );

    server.registerTool(
        "programmingparadigm",
        {
            title: "Programming Paradigm",
            description: PROGRAMMING_PARADIGM_DESCRIPTION,
            inputSchema: programmingParadigmSchema.shape,
        },
        async (args) => paradigmServer.processParadigm(args)
    );

    server.registerTool(
        "debuggingapproach",
        {
            title: "Debugging Approach",
            description: DEBUGGING_APPROACH_DESCRIPTION,
            inputSchema: debuggingApproachSchema.shape,
        },
        async (args) => debuggingServer.processApproach(args)
    );

    server.registerTool(
        "metacognitivemonitoring",
        {
            title: "Metacognitive Monitoring",
            description: METACOGNITIVE_MONITORING_DESCRIPTION,
            inputSchema: metacognitiveMonitoringSchema.shape,
        },
        async (args) =>
            metacognitiveMonitoringServer.processMetacognitiveMonitoring(args)
    );

    server.registerTool(
        "scientificmethod",
        {
            title: "Scientific Method",
            description: SCIENTIFIC_METHOD_DESCRIPTION,
            inputSchema: scientificMethodSchema.shape,
        },
        async (args) => scientificMethodServer.processScientificMethod(args)
    );

    server.registerTool(
        "structuredargumentation",
        {
            title: "Structured Argumentation",
            description: STRUCTURED_ARGUMENTATION_DESCRIPTION,
            inputSchema: structuredArgumentationSchema.shape,
        },
        async (args) =>
            structuredArgumentationServer.processStructuredArgumentation(args)
    );

    server.registerTool(
        "visualreasoning",
        {
            title: "Visual Reasoning",
            description: VISUAL_REASONING_DESCRIPTION,
            inputSchema: visualReasoningSchema.shape,
        },
        async (args) => visualReasoningServer.processVisualReasoning(args)
    );

    server.registerTool(
        "stochasticthinking",
        {
            title: "Stochastic Thinking",
            description: STOCHASTIC_THINKING_DESCRIPTION,
            inputSchema: stochasticThinkingSchema.shape,
        },
        async (args) => stochasticThinkingServer.processStochasticThinking(args)
    );

    return server;
}

// Shared instance for stdio transport and the in-memory integration test.
const server = createMcpServer();
export { server };

// ---------------------------------------------------------------------------
// Transports
// ---------------------------------------------------------------------------

async function runStdioServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Clear Thought MCP Server running on stdio");
}

async function runHttpServer() {
    const port = Number(process.env.HTTP_PORT) || 3779;

    // Session-keyed transports (MCP 2.0 Streamable HTTP, stateful sessions).
    const transports = new Map<string, StreamableHTTPServerTransport>();

    const setCors = (res: ServerResponse) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, DELETE, OPTIONS"
        );
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, mcp-session-id, mcp-protocol-version, last-event-id"
        );
        res.setHeader("Access-Control-Expose-Headers", "mcp-session-id");
    };

    const readBody = (req: IncomingMessage): Promise<unknown> =>
        new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            req.on("data", (c) => chunks.push(c as Buffer));
            req.on("end", () => {
                const raw = Buffer.concat(chunks).toString("utf8");
                if (!raw) {
                    resolve(undefined);
                    return;
                }
                try {
                    resolve(JSON.parse(raw));
                } catch (err) {
                    reject(err);
                }
            });
            req.on("error", reject);
        });

    const sendJsonError = (
        res: ServerResponse,
        status: number,
        code: number,
        message: string
    ) => {
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                jsonrpc: "2.0",
                error: { code, message },
                id: null,
            })
        );
    };

    const httpServer = createServer(async (req, res) => {
        setCors(res);

        if (req.method === "OPTIONS") {
            res.writeHead(204);
            res.end();
            return;
        }

        const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
        if (url.pathname !== "/mcp") {
            sendJsonError(res, 404, -32001, "Not found");
            return;
        }

        const sessionId = req.headers["mcp-session-id"] as string | undefined;

        try {
            // Existing session: route to its transport.
            if (sessionId && transports.has(sessionId)) {
                const transport = transports.get(sessionId)!;
                const body =
                    req.method === "POST" ? await readBody(req) : undefined;
                await transport.handleRequest(req, res, body);
                return;
            }

            // New session: only valid on an initialize POST.
            if (req.method === "POST") {
                const body = await readBody(req);
                if (!sessionId && isInitializeRequest(body)) {
                    const transport = new StreamableHTTPServerTransport({
                        sessionIdGenerator: () => randomUUID(),
                        onsessioninitialized: (id) => {
                            transports.set(id, transport);
                        },
                    });
                    transport.onclose = () => {
                        if (transport.sessionId) {
                            transports.delete(transport.sessionId);
                        }
                    };
                    // Each session gets its own McpServer instance.
                    await createMcpServer().connect(transport);
                    await transport.handleRequest(req, res, body);
                    return;
                }

                sendJsonError(
                    res,
                    400,
                    -32000,
                    "Bad Request: No valid session ID provided"
                );
                return;
            }

            // GET / DELETE without a known session.
            sendJsonError(res, 400, -32000, "Bad Request: No valid session ID provided");
        } catch (err) {
            console.error("HTTP request error:", err);
            if (!res.headersSent) {
                sendJsonError(res, 500, -32603, "Internal server error");
            }
        }
    });

    httpServer.listen(port, () => {
        console.error(
            `Clear Thought MCP Server running on Streamable HTTP at http://localhost:${port}/mcp`
        );
    });
}

// Start only when executed directly (not when imported by the test harness).
const isMain =
    process.argv[1] &&
    new URL(import.meta.url).pathname.endsWith(
        process.argv[1].replace(/\\/g, "/").split("/").pop()!
    );

if (isMain) {
    const start =
        process.env.HTTP_TRANSPORT === "1" ? runHttpServer : runStdioServer;
    start().catch((error) => {
        console.error("Fatal error running server:", error);
        process.exit(1);
    });
}
