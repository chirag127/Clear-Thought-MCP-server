import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MetacognitiveMonitoringServer } from '../src/tools/metacognitiveMonitoringServer.js';

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });

const validInput = {
  task: 'Analyze performance bottleneck',
  stage: 'knowledge-assessment' as const,
  overallConfidence: 0.75,
  uncertaintyAreas: ['network latency', 'cache hit rate'],
  recommendedApproach: 'Profile first, then optimize hot paths',
  monitoringId: 'mon-001',
  iteration: 0,
  nextAssessmentNeeded: false,
};

describe('MetacognitiveMonitoringServer', () => {
  const server = new MetacognitiveMonitoringServer();

  it('valid input returns success', () => {
    const result = server.processMetacognitiveMonitoring(validInput);
    expect(result.isError).toBeFalsy();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('success');
    expect(parsed.task).toBe('Analyze performance bottleneck');
    expect(parsed.monitoringId).toBe('mon-001');
    expect(parsed.overallConfidence).toBe(0.75);
  });

  it('missing task returns isError true', () => {
    const result = server.processMetacognitiveMonitoring({ ...validInput, task: '' });
    expect(result.isError).toBe(true);
  });

  it('missing monitoringId returns isError true', () => {
    const result = server.processMetacognitiveMonitoring({ ...validInput, monitoringId: '' });
    expect(result.isError).toBe(true);
  });

  it('invalid overallConfidence (>1) returns isError true', () => {
    const result = server.processMetacognitiveMonitoring({ ...validInput, overallConfidence: 1.5 });
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toContain('overallConfidence');
  });

  it('invalid iteration returns isError true', () => {
    const result = server.processMetacognitiveMonitoring({ ...validInput, iteration: -1 });
    expect(result.isError).toBe(true);
  });
});
