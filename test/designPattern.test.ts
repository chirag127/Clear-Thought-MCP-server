import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DesignPatternServer } from '../src/tools/designPatternServer.js';

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });

describe('DesignPatternServer', () => {
  const server = new DesignPatternServer();

  it('valid input returns success', () => {
    const result = server.processPattern({
      patternName: 'modular_architecture',
      context: 'Building a large API',
      implementation: ['Split by domain', 'Define interfaces'],
      benefits: ['Maintainability'],
      tradeoffs: ['Initial complexity'],
    });
    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('success');
    expect(parsed.patternName).toBe('modular_architecture');
    expect(parsed.hasImplementation).toBe(true);
  });

  it('with code example sets hasCodeExample true', () => {
    const result = server.processPattern({
      patternName: 'api_integration',
      context: 'REST API client',
      codeExample: 'const client = new ApiClient()',
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.hasCodeExample).toBe(true);
  });

  it('missing patternName returns isError true', () => {
    const result = server.processPattern({ context: 'some context' });
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('failed');
    expect(parsed.error).toContain('Invalid patternName');
  });

  it('missing context returns isError true', () => {
    const result = server.processPattern({ patternName: 'security' });
    expect(result.isError).toBe(true);
  });
});
