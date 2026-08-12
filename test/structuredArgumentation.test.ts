import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StructuredArgumentationServer } from '../src/tools/structuredArgumentationServer.js';

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });

const validInput = {
  claim: 'Microservices improve scalability',
  premises: ['Independent scaling per service', 'Isolation of failures'],
  conclusion: 'Adopt microservices for high-traffic systems',
  argumentType: 'thesis' as const,
  confidence: 0.85,
  nextArgumentNeeded: true,
};

describe('StructuredArgumentationServer', () => {
  const server = new StructuredArgumentationServer();

  it('valid input returns success', () => {
    const result = server.processStructuredArgumentation(validInput);
    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('success');
    expect(parsed.argumentType).toBe('thesis');
    expect(parsed.confidence).toBe(0.85);
    expect(parsed.nextArgumentNeeded).toBe(true);
    expect(parsed.argumentId).toBeDefined();
  });

  it('with argumentId uses provided id', () => {
    const result = server.processStructuredArgumentation({ ...validInput, argumentId: 'arg-42' });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.argumentId).toBe('arg-42');
  });

  it('missing claim returns isError true', () => {
    const result = server.processStructuredArgumentation({ ...validInput, claim: '' });
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('Missing required fields');
  });

  it('missing conclusion returns isError true', () => {
    const result = server.processStructuredArgumentation({ ...validInput, conclusion: '' });
    expect(result.isError).toBe(true);
  });

  it('invalid confidence (>1) returns isError true', () => {
    const result = server.processStructuredArgumentation({ ...validInput, confidence: 2 });
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('confidence');
  });

  it('invalid nextArgumentNeeded returns isError true', () => {
    const result = server.processStructuredArgumentation({
      ...validInput,
      nextArgumentNeeded: 'yes' as unknown as boolean,
    });
    expect(result.isError).toBe(true);
  });
});
