import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DebuggingApproachServer } from '../src/tools/debuggingApproachServer.js';

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });

describe('DebuggingApproachServer', () => {
  const server = new DebuggingApproachServer();

  it('valid input returns success', () => {
    const result = server.processApproach({
      approachName: 'binary_search',
      issue: 'Memory leak in server',
      steps: ['Isolate half the code', 'Check memory'],
      findings: 'Leak in middleware',
      resolution: 'Remove closure reference',
    });
    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('success');
    expect(parsed.approachName).toBe('binary_search');
    expect(parsed.hasSteps).toBe(true);
    expect(parsed.hasResolution).toBe(true);
  });

  it('no steps or resolution gives false flags', () => {
    const result = server.processApproach({
      approachName: 'backtracking',
      issue: 'UI glitch',
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.hasSteps).toBe(false);
    expect(parsed.hasResolution).toBe(false);
  });

  it('missing approachName returns isError true', () => {
    const result = server.processApproach({ issue: 'crash' });
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('Invalid approachName');
  });

  it('missing issue returns isError true', () => {
    const result = server.processApproach({ approachName: 'cause_elimination' });
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('Invalid issue');
  });
});
