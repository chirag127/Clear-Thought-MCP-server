import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProgrammingParadigmServer } from '../src/tools/programmingParadigmServer.js';

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });

describe('ProgrammingParadigmServer', () => {
  const server = new ProgrammingParadigmServer();

  it('valid input returns success', () => {
    const result = server.processParadigm({
      paradigmName: 'functional',
      problem: 'Data transformation pipeline',
      approach: ['Use pure functions', 'Avoid side effects'],
      benefits: ['Testable', 'Composable'],
      limitations: ['Steep learning curve'],
    });
    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('success');
    expect(parsed.paradigmName).toBe('functional');
    expect(parsed.hasApproach).toBe(true);
  });

  it('missing paradigmName returns isError true', () => {
    const result = server.processParadigm({ problem: 'test problem' });
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('Invalid paradigmName');
  });

  it('missing problem returns isError true', () => {
    const result = server.processParadigm({ paradigmName: 'object_oriented' });
    expect(result.isError).toBe(true);
  });

  it('no approach gives hasApproach false', () => {
    const result = server.processParadigm({
      paradigmName: 'declarative',
      problem: 'UI rendering',
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.hasApproach).toBe(false);
  });
});
