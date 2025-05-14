import { ProgrammingParadigmData } from '../models/interfaces.js';
import chalk from 'chalk';

export class ProgrammingParadigmServer {
  private validateParadigmData(input: unknown): ProgrammingParadigmData {
    const data = input as Record<string, unknown>;

    if (!data.paradigmName || typeof data.paradigmName !== 'string') {
      throw new Error('Invalid paradigmName: must be a string');
    }
    if (!data.problem || typeof data.problem !== 'string') {
      throw new Error('Invalid problem: must be a string');
    }

    return {
      paradigmName: data.paradigmName as string,
      problem: data.problem as string,
      approach: Array.isArray(data.approach) ? data.approach.map(String) : [],
      benefits: Array.isArray(data.benefits) ? data.benefits.map(String) : [],
      limitations: Array.isArray(data.limitations) ? data.limitations.map(String) : [],
      codeExample: typeof data.codeExample === 'string' ? data.codeExample as string : undefined,
      languages: Array.isArray(data.languages) ? data.languages.map(String) : undefined
    };
  }

  private formatParadigmOutput(data: ProgrammingParadigmData): string {
    const { paradigmName, problem, approach, benefits, limitations, codeExample, languages } = data;
    
    let output = `\n${chalk.bold.blue('Programming Paradigm:')} ${chalk.bold(paradigmName)}\n`;
    output += `${chalk.bold.green('Problem:')} ${problem}\n`;
    
    if (approach.length > 0) {
      output += `\n${chalk.bold.yellow('Approach:')}\n`;
      approach.forEach((step, index) => {
        output += `${chalk.bold(`${index + 1}.`)} ${step}\n`;
      });
    }
    
    if (benefits.length > 0) {
      output += `\n${chalk.bold.magenta('Benefits:')}\n`;
      benefits.forEach((benefit) => {
        output += `${chalk.bold(`•`)} ${benefit}\n`;
      });
    }
    
    if (limitations.length > 0) {
      output += `\n${chalk.bold.red('Limitations:')}\n`;
      limitations.forEach((limitation) => {
        output += `${chalk.bold(`•`)} ${limitation}\n`;
      });
    }
    
    if (languages && languages.length > 0) {
      output += `\n${chalk.bold.cyan('Applicable Languages:')} ${languages.join(', ')}\n`;
    }
    
    if (codeExample) {
      output += `\n${chalk.bold.green('Code Example:')}\n${codeExample}\n`;
    }
    
    return output;
  }

  public processParadigm(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
    try {
      const validatedInput = this.validateParadigmData(input);
      const formattedOutput = this.formatParadigmOutput(validatedInput);
      console.error(formattedOutput);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            paradigmName: validatedInput.paradigmName,
            status: 'success',
            hasApproach: validatedInput.approach.length > 0,
            hasCodeExample: !!validatedInput.codeExample
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
