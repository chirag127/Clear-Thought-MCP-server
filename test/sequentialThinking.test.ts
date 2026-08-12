import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SequentialThinkingServer } from '../src/tools/sequentialThinkingServer.js';

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });

describe('SequentialThinkingServer', () => {
  const server = new SequentialThinkingServer();

  it('valid input returns thought data', () => {
    const result = server.processThought({
      thought: 'Initial analysis of the problem',
      thoughtNumber: 1,
      totalThoughts: 3,
      nextThoughtNeeded: true,
    });
    expect(result.thought).toBe('Initial analysis of the problem');
    expect(result.thoughtNumber).toBe(1);
    expect(result.totalThoughts).toBe(3);
    expect(result.nextThoughtNeeded).toBe(true);
  });

  it('revision thought includes revision fields', () => {
    const result = server.processThought({
      thought: 'Revised analysis',
      thoughtNumber: 2,
      totalThoughts: 3,
      nextThoughtNeeded: false,
      isRevision: true,
      revisesThought: 1,
    });
    expect(result.isRevision).toBe(true);
    expect(result.revisesThought).toBe(1);
  });

  it('branch thought includes branch fields', () => {
    const result = server.processThought({
      thought: 'Branch thought',
      thoughtNumber: 2,
      totalThoughts: 3,
      nextThoughtNeeded: false,
      branchFromThought: 1,
      branchId: 'branch-a',
    });
    expect(result.branchId).toBe('branch-a');
    expect(result.branchFromThought).toBe(1);
  });

  it('missing thought throws', () => {
    expect(() =>
      server.processThought({ thoughtNumber: 1, totalThoughts: 3, nextThoughtNeeded: true })
    ).toThrow('Invalid thought');
  });

  it('missing thoughtNumber throws', () => {
    expect(() =>
      server.processThought({ thought: 'x', totalThoughts: 3, nextThoughtNeeded: true })
    ).toThrow('Invalid thoughtNumber');
  });

  it('missing nextThoughtNeeded throws', () => {
    expect(() =>
      server.processThought({ thought: 'x', thoughtNumber: 1, totalThoughts: 3 })
    ).toThrow('Invalid nextThoughtNeeded');
  });
});
