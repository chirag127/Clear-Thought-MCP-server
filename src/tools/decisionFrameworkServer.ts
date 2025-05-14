import { DecisionFrameworkData } from '../models/interfaces.js';
import chalk from 'chalk';

export class DecisionFrameworkServer {
  private validateInputData(input: unknown): DecisionFrameworkData {
    const data = input as DecisionFrameworkData;
    if (!data.decisionStatement || !data.options || !data.analysisType || !data.stage || !data.decisionId) {
      throw new Error("Invalid input for DecisionFramework: Missing required fields.");
    }
    if (typeof data.iteration !== 'number' || data.iteration < 0) {
        throw new Error("Invalid iteration value for DecisionFrameworkData.");
    }
    if (typeof data.nextStageNeeded !== 'boolean') {
        throw new Error("Invalid nextStageNeeded value for DecisionFrameworkData.");
    }
    return data;
  }

  private formatOutput(data: DecisionFrameworkData): string {
    const { decisionStatement, options, analysisType, stage, iteration } = data;
    
    let output = `\n${chalk.bold.blue('Decision Framework Analysis')}\n`;
    output += `${chalk.bold.green('Decision Statement:')} ${decisionStatement}\n`;
    output += `${chalk.bold.yellow('Analysis Type:')} ${analysisType}\n`;
    output += `${chalk.bold.magenta('Stage:')} ${stage} (Iteration: ${iteration})\n`;
    
    // Options
    if (options.length > 0) {
      output += `\n${chalk.bold.cyan('Options:')}\n`;
      options.forEach((option, i) => {
        output += `${chalk.bold(`Option ${i+1}: ${option.name}`)}\n`;
        output += `${option.description}\n\n`;
      });
    }
    
    // Criteria
    if (data.criteria && data.criteria.length > 0) {
      output += `\n${chalk.bold.green('Criteria:')}\n`;
      data.criteria.forEach((criterion, i) => {
        output += `${chalk.bold(`${criterion.name} (weight: ${criterion.weight.toFixed(2)}):`)} `;
        output += `${criterion.description}\n`;
      });
    }
    
    // Stakeholders
    if (data.stakeholders && data.stakeholders.length > 0) {
      output += `\n${chalk.bold.yellow('Stakeholders:')} ${data.stakeholders.join(', ')}\n`;
    }
    
    // Constraints
    if (data.constraints && data.constraints.length > 0) {
      output += `\n${chalk.bold.red('Constraints:')}\n`;
      data.constraints.forEach((constraint, i) => {
        output += `${chalk.bold(`${i+1}.`)} ${constraint}\n`;
      });
    }
    
    // Recommendation
    if (data.recommendation) {
      output += `\n${chalk.bold.green('Recommendation:')}\n${data.recommendation}\n`;
      
      if (data.rationale) {
        output += `\n${chalk.bold.cyan('Rationale:')}\n${data.rationale}\n`;
      }
    }
    
    return output;
  }

  public processDecisionFramework(input: unknown): DecisionFrameworkData {
    const validatedData = this.validateInputData(input);
    
    // Log formatted output to console
    const formattedOutput = this.formatOutput(validatedData);
    console.error(formattedOutput);
    
    return validatedData;
  }
}
