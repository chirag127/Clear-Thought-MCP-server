import { CollaborativeReasoningData } from '../models/interfaces.js';
import chalk from 'chalk';

export class CollaborativeReasoningServer {
  private validateInputData(input: unknown): CollaborativeReasoningData {
    const data = input as CollaborativeReasoningData;
    if (!data.topic || !data.personas || !data.contributions || !data.stage || !data.activePersonaId || !data.sessionId) {
      throw new Error("Invalid input for CollaborativeReasoning: Missing required fields.");
    }
    if (typeof data.iteration !== 'number' || data.iteration < 0) {
        throw new Error("Invalid iteration value for CollaborativeReasoningData.");
    }
    if (typeof data.nextContributionNeeded !== 'boolean') {
        throw new Error("Invalid nextContributionNeeded value for CollaborativeReasoningData.");
    }
    return data;
  }

  private formatOutput(data: CollaborativeReasoningData): string {
    const { topic, personas, contributions, stage, activePersonaId, iteration } = data;
    
    let output = `\n${chalk.bold.blue('Collaborative Reasoning Session')}\n`;
    output += `${chalk.bold.green('Topic:')} ${topic}\n`;
    output += `${chalk.bold.yellow('Stage:')} ${stage} (Iteration: ${iteration})\n`;
    
    // Active persona
    const activePersona = personas.find(p => p.id === activePersonaId);
    if (activePersona) {
      output += `\n${chalk.bold.magenta('Active Persona:')} ${activePersona.name}\n`;
      output += `${chalk.bold.cyan('Expertise:')} ${activePersona.expertise.join(', ')}\n`;
      output += `${chalk.bold.cyan('Perspective:')} ${activePersona.perspective}\n`;
    }
    
    // Contributions
    if (contributions.length > 0) {
      output += `\n${chalk.bold.green('Contributions:')}\n`;
      
      for (const contribution of contributions) {
        const persona = personas.find(p => p.id === contribution.personaId);
        const personaName = persona ? persona.name : contribution.personaId;
        
        output += `${chalk.bold(`${personaName} (${contribution.type}, confidence: ${contribution.confidence.toFixed(2)}):`)} `;
        output += `${contribution.content}\n\n`;
      }
    }
    
    // Consensus points
    if (data.consensusPoints && data.consensusPoints.length > 0) {
      output += `\n${chalk.bold.green('Consensus Points:')}\n`;
      data.consensusPoints.forEach((point, i) => {
        output += `${chalk.bold(`${i+1}.`)} ${point}\n`;
      });
    }
    
    // Key insights
    if (data.keyInsights && data.keyInsights.length > 0) {
      output += `\n${chalk.bold.yellow('Key Insights:')}\n`;
      data.keyInsights.forEach((insight, i) => {
        output += `${chalk.bold(`${i+1}.`)} ${insight}\n`;
      });
    }
    
    // Final recommendation
    if (data.finalRecommendation) {
      output += `\n${chalk.bold.cyan('Final Recommendation:')}\n${data.finalRecommendation}\n`;
    }
    
    return output;
  }

  public processCollaborativeReasoning(input: unknown): CollaborativeReasoningData {
    const validatedData = this.validateInputData(input);
    
    // Log formatted output to console
    const formattedOutput = this.formatOutput(validatedData);
    console.error(formattedOutput);
    
    return validatedData;
  }
}
