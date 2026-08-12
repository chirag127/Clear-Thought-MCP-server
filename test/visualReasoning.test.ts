import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VisualReasoningServer } from '../src/tools/visualReasoningServer.js';

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });

const validInput = {
  operation: 'create' as const,
  diagramId: 'diag-001',
  diagramType: 'flowchart' as const,
  iteration: 0,
  nextOperationNeeded: true,
};

describe('VisualReasoningServer', () => {
  const server = new VisualReasoningServer();

  it('valid input returns success', () => {
    const result = server.processVisualReasoning(validInput);
    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('success');
    expect(parsed.operation).toBe('create');
    expect(parsed.diagramId).toBe('diag-001');
    expect(parsed.elementCount).toBe(0);
  });

  it('with elements sets correct count', () => {
    const result = server.processVisualReasoning({
      ...validInput,
      elements: [
        { id: 'e1', type: 'node', properties: { color: 'blue' }, label: 'Start' },
        { id: 'e2', type: 'edge', properties: {}, source: 'e1', target: 'e3' },
      ],
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.elementCount).toBe(2);
  });

  it('missing operation returns isError true', () => {
    const result = server.processVisualReasoning({ ...validInput, operation: '' as any });
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('Missing required fields');
  });

  it('missing diagramId returns isError true', () => {
    const result = server.processVisualReasoning({ ...validInput, diagramId: '' });
    expect(result.isError).toBe(true);
  });

  it('invalid iteration returns isError true', () => {
    const result = server.processVisualReasoning({ ...validInput, iteration: -1 });
    expect(result.isError).toBe(true);
  });
});
