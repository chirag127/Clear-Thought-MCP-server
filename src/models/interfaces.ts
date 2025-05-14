// Data Interfaces for Clear Thought MCP Server

// Sequential Thinking
export interface ThoughtData {
  thought: string;
  thoughtNumber: number;
  totalThoughts: number;
  isRevision?: boolean;
  revisesThought?: number;
  branchFromThought?: number;
  branchId?: string;
  needsMoreThoughts?: boolean;
  nextThoughtNeeded: boolean;
}

// Mental Models
export interface MentalModelData {
  modelName: string;
  problem: string;
  steps: string[];
  reasoning: string;
  conclusion: string;
}

// Design Patterns
export interface DesignPatternData {
  patternName: string;
  context: string;
  implementation: string[];
  benefits: string[];
  tradeoffs: string[];
  codeExample?: string;
  languages?: string[];
}

// Programming Paradigms
export interface ProgrammingParadigmData {
  paradigmName: string;
  problem: string;
  approach: string[];
  benefits: string[];
  limitations: string[];
  codeExample?: string;
  languages?: string[];
}

// Debugging Approaches
export interface DebuggingApproachData {
  approachName: string;
  issue: string;
  steps: string[];
  findings: string;
  resolution: string;
}

// Collaborative Reasoning
export interface PersonaData {
  id: string;
  name: string;
  expertise: string[];
  background: string;
  perspective: string;
  biases: string[];
  communication: {
    style: string;
    tone: string;
  };
}

export interface ContributionData {
  personaId: string;
  content: string;
  type: "observation" | "question" | "insight" | "concern" | "suggestion" | "challenge" | "synthesis";
  confidence: number;
  referenceIds?: string[];
}

export interface DisagreementData {
  topic: string;
  positions: {
    personaId: string;
    position: string;
    arguments: string[];
  }[];
}

export interface CollaborativeReasoningData {
  topic: string;
  personas: PersonaData[];
  contributions: ContributionData[];
  stage: "problem-definition" | "ideation" | "critique" | "integration" | "decision" | "reflection";
  activePersonaId: string;
  nextPersonaId?: string;
  consensusPoints?: string[];
  disagreements?: DisagreementData[];
  keyInsights?: string[];
  openQuestions?: string[];
  finalRecommendation?: string;
  sessionId: string;
  iteration: number;
  suggestedContributionTypes?: ("observation" | "question" | "insight" | "concern" | "suggestion" | "challenge" | "synthesis")[];
  nextContributionNeeded: boolean;
}

// Decision Framework
export interface OptionData {
  id: string;
  name: string;
  description: string;
}

export interface CriterionData {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export interface OutcomeData {
  id: string;
  description: string;
  probability: number;
  value: number;
  optionId: string;
  confidenceInEstimate: number;
}

export interface DecisionFrameworkData {
  decisionStatement: string;
  options: OptionData[];
  criteria?: CriterionData[];
  analysisType: "pros-cons" | "weighted-criteria" | "decision-tree" | "expected-value" | "scenario-analysis";
  stage: "problem-definition" | "options-generation" | "criteria-definition" | "evaluation" | "sensitivity-analysis" | "decision";
  stakeholders?: string[];
  constraints?: string[];
  timeHorizon?: string;
  riskTolerance?: "risk-averse" | "risk-neutral" | "risk-seeking";
  possibleOutcomes?: OutcomeData[];
  recommendation?: string;
  rationale?: string;
  decisionId: string;
  iteration: number;
  nextStageNeeded: boolean;
}
