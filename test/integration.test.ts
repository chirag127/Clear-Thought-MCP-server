import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { server } from '../src/index.js';

vi.spyOn(console, 'error').mockImplementation(() => {});

const EXPECTED_TOOL_NAMES = [
  'sequentialthinking',
  'mentalmodel',
  'designpattern',
  'programmingparadigm',
  'debuggingapproach',
  'collaborativereasoning',
  'decisionframework',
  'metacognitivemonitoring',
  'scientificmethod',
  'structuredargumentation',
  'visualreasoning',
  'stochasticthinking',
];

let client: Client;

beforeAll(async () => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  client = new Client({ name: 'test-client', version: '1.0.0' });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
});

afterAll(async () => {
  await client.close();
});

describe('MCP server integration', () => {
  it('ListTools returns exactly 12 tools with correct names', async () => {
    const { tools } = await client.listTools();
    expect(tools).toHaveLength(12);
    const names = tools.map((t) => t.name);
    for (const expected of EXPECTED_TOOL_NAMES) {
      expect(names).toContain(expected);
    }
  });

  it('CallTool dispatches sequentialthinking', async () => {
    const result = await client.callTool({
      name: 'sequentialthinking',
      arguments: {
        thought: 'Test thought',
        thoughtNumber: 1,
        totalThoughts: 1,
        nextThoughtNeeded: false,
      },
    });
    const content = result.content as Array<{ type: string; text: string }>;
    expect(content[0].type).toBe('text');
    const parsed = JSON.parse(content[0].text);
    expect(parsed.thought).toBe('Test thought');
  });

  it('CallTool dispatches mentalmodel', async () => {
    const result = await client.callTool({
      name: 'mentalmodel',
      arguments: { modelName: 'occams_razor', problem: 'Why is X slow?' },
    });
    const content = result.content as Array<{ type: string; text: string }>;
    const parsed = JSON.parse(content[0].text);
    expect(parsed.status).toBe('success');
  });

  it('CallTool dispatches debuggingapproach', async () => {
    const result = await client.callTool({
      name: 'debuggingapproach',
      arguments: { approachName: 'binary_search', issue: 'Crash on startup' },
    });
    const content = result.content as Array<{ type: string; text: string }>;
    const parsed = JSON.parse(content[0].text);
    expect(parsed.status).toBe('success');
  });

  it('CallTool dispatches all 12 tools without crashing', async () => {
    const calls = [
      client.callTool({ name: 'designpattern', arguments: { patternName: 'security', context: 'API security' } }),
      client.callTool({ name: 'programmingparadigm', arguments: { paradigmName: 'functional', problem: 'data transform' } }),
      client.callTool({ name: 'collaborativereasoning', arguments: {
        topic: 'Test', stage: 'ideation', sessionId: 's1', iteration: 0,
        nextContributionNeeded: false, activePersonaId: 'p1',
        personas: [{ id: 'p1', name: 'Bob', expertise: ['x'], background: 'bg', perspective: 'p', biases: [], communication: { style: 's', tone: 't' } }],
        contributions: [],
      }}),
      client.callTool({ name: 'decisionframework', arguments: {
        decisionStatement: 'Choose DB', options: [{ id: 'o1', name: 'Postgres', description: 'SQL' }],
        analysisType: 'pros-cons', stage: 'evaluation', decisionId: 'd1', iteration: 0, nextStageNeeded: false,
      }}),
      client.callTool({ name: 'metacognitivemonitoring', arguments: {
        task: 'analyze', stage: 'planning', overallConfidence: 0.7,
        uncertaintyAreas: [], recommendedApproach: 'TDD',
        monitoringId: 'm1', iteration: 0, nextAssessmentNeeded: false,
      }}),
      client.callTool({ name: 'scientificmethod', arguments: {
        stage: 'observation', inquiryId: 'i1', iteration: 0, nextStageNeeded: false,
      }}),
      client.callTool({ name: 'structuredargumentation', arguments: {
        claim: 'X is good', premises: ['reason 1'], conclusion: 'use X',
        argumentType: 'thesis', confidence: 0.9, nextArgumentNeeded: false,
      }}),
      client.callTool({ name: 'visualreasoning', arguments: {
        operation: 'create', diagramId: 'diag1', diagramType: 'graph',
        iteration: 0, nextOperationNeeded: false,
      }}),
      client.callTool({ name: 'stochasticthinking', arguments: {
        problem: 'Should we expand?', stage: 'problem-framing',
        thinkingId: 'st-int-1', iteration: 0, nextStageNeeded: true,
      }}),
    ];
    const results = await Promise.all(calls);
    for (const result of results) {
      expect(result.content).toBeDefined();
    }
  });

  it('CallTool unknown tool name returns an error result', async () => {
    // The mainstream @modelcontextprotocol/sdk surfaces an unknown tool as a
    // CallToolResult with isError: true (rather than rejecting the promise as
    // the experimental v2 SDK did).
    const result = await client.callTool({ name: 'nonexistent', arguments: {} });
    expect(result.isError).toBe(true);
    const content = result.content as Array<{ type: string; text: string }>;
    expect(content[0].text).toContain('nonexistent');
  });
});
