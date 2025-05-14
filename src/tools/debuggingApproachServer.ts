import { DebuggingApproachData } from '../models/interfaces.js';
import chalk from 'chalk';

export class DebuggingApproachServer {
  private validateApproachData(input: unknown): DebuggingApproachData {
    const data = input as Record<string, unknown>;

    if (!data.approachName || typeof data.approachName !== 'string') {
      throw new Error('Invalid approachName: must be a string');
    }
    if (!data.issue || typeof data.issue !== 'string') {
      throw new Error('Invalid issue: must be a string');
    }

    return {
      approachName: data.approachName as string,
      issue: data.issue as string,
      steps: Array.isArray(data.steps) ? data.steps.map(String) : [],
      findings: typeof data.findings === 'string' ? data.findings as string : '',
      resolution: typeof data.resolution === 'string' ? data.resolution as string : ''
    };
  }

  private formatApproachOutput(data: DebuggingApproachData): string {
    const { approachName, issue, steps, findings, resolution } = data;
    
    let output = `\n${chalk.bold.blue('Debugging Approach:')} ${chalk.bold(approachName)}\n`;
    output += `${chalk.bold.green('Issue:')} ${issue}\n`;
    
    if (steps.length > 0) {
      output += `\n${chalk.bold.yellow('Steps:')}\n`;
      steps.forEach((step, index) => {
        output += `${chalk.bold(`${index + 1}.`)} ${step}\n`;
      });
    }
    
    if (findings) {
      output += `\n${chalk.bold.magenta('Findings:')}\n${findings}\n`;
    }
    
    if (resolution) {
      output += `\n${chalk.bold.cyan('Resolution:')}\n${resolution}\n`;
    }
    
    return output;
  }

  public processApproach(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
    try {
      const validatedInput = this.validateApproachData(input);
      const formattedOutput = this.formatApproachOutput(validatedInput);
      console.error(formattedOutput);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            approachName: validatedInput.approachName,
            status: 'success',
            hasSteps: validatedInput.steps.length > 0,
            hasResolution: !!validatedInput.resolution
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
            status: 'failed'
          }, null, 2)
        }],
        isError: true
      };
    }
  }
}
