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
    type:
        | "observation"
        | "question"
        | "insight"
        | "concern"
        | "suggestion"
        | "challenge"
        | "synthesis";
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
    stage:
        | "problem-definition"
        | "ideation"
        | "critique"
        | "integration"
        | "decision"
        | "reflection";
    activePersonaId: string;
    nextPersonaId?: string;
    consensusPoints?: string[];
    disagreements?: DisagreementData[];
    keyInsights?: string[];
    openQuestions?: string[];
    finalRecommendation?: string;
    sessionId: string;
    iteration: number;
    suggestedContributionTypes?: (
        | "observation"
        | "question"
        | "insight"
        | "concern"
        | "suggestion"
        | "challenge"
        | "synthesis"
    )[];
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
    analysisType:
        | "pros-cons"
        | "weighted-criteria"
        | "decision-tree"
        | "expected-value"
        | "scenario-analysis";
    stage:
        | "problem-definition"
        | "options-generation"
        | "criteria-definition"
        | "evaluation"
        | "sensitivity-analysis"
        | "decision";
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

// Metacognitive Monitoring
export interface KnowledgeAssessment {
    domain: string;
    knowledgeLevel:
        | "expert"
        | "proficient"
        | "familiar"
        | "basic"
        | "minimal"
        | "none";
    confidenceScore: number;
    supportingEvidence: string;
    knownLimitations: string[];
    relevantTrainingCutoff?: string;
}

export interface ClaimAssessment {
    claim: string;
    status: "fact" | "inference" | "speculation" | "uncertain";
    confidenceScore: number;
    evidenceBasis: string;
    falsifiabilityCriteria?: string;
    alternativeInterpretations?: string[];
}

export interface ReasoningAssessment {
    step: string;
    potentialBiases: string[];
    assumptions: string[];
    logicalValidity: number;
    inferenceStrength: number;
}

export interface MetacognitiveMonitoringData {
    task: string;
    stage:
        | "knowledge-assessment"
        | "planning"
        | "execution"
        | "monitoring"
        | "evaluation"
        | "reflection";
    knowledgeAssessment?: KnowledgeAssessment;
    claims?: ClaimAssessment[];
    reasoningSteps?: ReasoningAssessment[];
    overallConfidence: number;
    uncertaintyAreas: string[];
    recommendedApproach: string;
    monitoringId: string;
    iteration: number;
    suggestedAssessments?: ("knowledge" | "claim" | "reasoning" | "overall")[];
    nextAssessmentNeeded: boolean;
}

// Scientific Method
export interface Variable {
    name: string;
    type: "independent" | "dependent" | "controlled" | "confounding";
    operationalization?: string;
}

export interface HypothesisData {
    statement: string;
    variables: Variable[];
    assumptions: string[];
    hypothesisId: string;
    confidence: number;
    domain: string;
    iteration: number;
    alternativeTo?: string[];
    refinementOf?: string;
    status: "proposed" | "testing" | "supported" | "refuted" | "refined";
}

export interface Prediction {
    if: string;
    then: string;
    else?: string;
}

export interface ExperimentData {
    design: string;
    methodology: string;
    predictions: Prediction[];
    experimentId: string;
    hypothesisId: string;
    controlMeasures: string[];
    results?: string;
    outcomeMatched?: boolean;
    unexpectedObservations?: string[];
    limitations?: string[];
    nextSteps?: string[];
}

export interface ScientificInquiryData {
    stage:
        | "observation"
        | "question"
        | "hypothesis"
        | "experiment"
        | "analysis"
        | "conclusion"
        | "iteration";
    observation?: string;
    question?: string;
    hypothesis?: HypothesisData;
    experiment?: ExperimentData;
    analysis?: string;
    conclusion?: string;
    inquiryId: string;
    iteration: number;
    nextStageNeeded: boolean;
}

// Structured Argumentation
export interface ArgumentData {
    claim: string;
    premises: string[];
    conclusion: string;
    argumentId?: string;
    argumentType:
        | "thesis"
        | "antithesis"
        | "synthesis"
        | "objection"
        | "rebuttal";
    confidence: number;
    respondsTo?: string;
    supports?: string[];
    contradicts?: string[];
    strengths?: string[];
    weaknesses?: string[];
    nextArgumentNeeded: boolean;
    suggestedNextTypes?: (
        | "thesis"
        | "antithesis"
        | "synthesis"
        | "objection"
        | "rebuttal"
    )[];
}

// Visual Reasoning
export interface VisualElement {
    id: string;
    type: "node" | "edge" | "container" | "annotation";
    label?: string;
    properties: Record<string, any>;
    source?: string;
    target?: string;
    contains?: string[];
}

export interface VisualOperationData {
    operation: "create" | "update" | "delete" | "transform" | "observe";
    elements?: VisualElement[];
    transformationType?: "rotate" | "move" | "resize" | "recolor" | "regroup";
    diagramId: string;
    diagramType:
        | "graph"
        | "flowchart"
        | "stateDiagram"
        | "conceptMap"
        | "treeDiagram"
        | "custom";
    iteration: number;
    observation?: string;
    insight?: string;
    hypothesis?: string;
    nextOperationNeeded: boolean;
}
