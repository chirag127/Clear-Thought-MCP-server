import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CollaborativeReasoningServer } from '../src/tools/collaborativeReasoningServer.js';

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });

const validInput = {
  topic: 'Architecture decision',
  personas: [
    {
      id: 'p1',
      name: 'Alice',
      expertise: ['backend'],
      background: '10 years backend dev',
      perspective: 'Performance first',
      biases: ['over-engineering'],
      communication: { style: 'direct', tone: 'technical' },
    },
  ],
  contributions: [
    {
      personaId: 'p1',
      content: 'Use microservices for scalability',
      type: 'suggestion' as const,
      confidence: 0.8,
    },
  ],
  stage: 'ideation' as const,
  activePersonaId: 'p1',
  sessionId: 'sess-001',
  iteration: 0,
  nextContributionNeeded: true,
};

describe('CollaborativeReasoningServer', () => {
  const server = new CollaborativeReasoningServer();

  it('valid input returns the data back', () => {
    const result = server.processCollaborativeReasoning(validInput);
    expect(result.topic).toBe('Architecture decision');
    expect(result.sessionId).toBe('sess-001');
    expect(result.stage).toBe('ideation');
  });

  it('missing topic throws', () => {
    const bad = { ...validInput, topic: '' };
    expect(() => server.processCollaborativeReasoning(bad)).toThrow('Missing required fields');
  });

  it('missing sessionId throws', () => {
    const bad = { ...validInput, sessionId: '' };
    expect(() => server.processCollaborativeReasoning(bad)).toThrow('Missing required fields');
  });

  it('invalid iteration throws', () => {
    const bad = { ...validInput, iteration: -1 };
    expect(() => server.processCollaborativeReasoning(bad)).toThrow('Invalid iteration');
  });

  it('invalid nextContributionNeeded throws', () => {
    const bad = { ...validInput, nextContributionNeeded: 'yes' as unknown as boolean };
    expect(() => server.processCollaborativeReasoning(bad)).toThrow('Invalid nextContributionNeeded');
  });
});
