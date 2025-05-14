import { DesignPatternData } from '../models/interfaces.js';
import chalk from 'chalk';

export class DesignPatternServer {
  private validatePatternData(input: unknown): DesignPatternData {
    const data = input as Record<string, unknown>;

    if (!data.patternName || typeof data.patternName !== 'string') {
      throw new Error('Invalid patternName: must be a string');
    }
    if (!data.context || typeof data.context !== 'string') {
      throw new Error('Invalid context: must be a string');
    }

    return {
      patternName: data.patternName as string,
      context: data.context as string,
      implementation: Array.isArray(data.implementation) ? data.implementation.map(String) : [],
      benefits: Array.isArray(data.benefits) ? data.benefits.map(String) : [],
      tradeoffs: Array.isArray(data.tradeoffs) ? data.tradeoffs.map(String) : [],
      codeExample: typeof data.codeExample === 'string' ? data.codeExample as string : undefined,
      languages: Array.isArray(data.languages) ? data.languages.map(String) : undefined
    };
  }

  private formatPatternOutput(data: DesignPatternData): string {
    const { patternName, context, implementation, benefits, tradeoffs, codeExample, languages } = data;
    
    let output = `\n${chalk.bold.blue('Design Pattern:')} ${chalk.bold(patternName)}\n`;
    output += `${chalk.bold.green('Context:')} ${context}\n`;
    
    if (implementation.length > 0) {
      output += `\n${chalk.bold.yellow('Implementation Steps:')}\n`;
      implementation.forEach((step, index) => {
        output += `${chalk.bold(`${index + 1}.`)} ${step}\n`;
      });
    }
    
    if (benefits.length > 0) {
      output += `\n${chalk.bold.magenta('Benefits:')}\n`;
      benefits.forEach((benefit, index) => {
        output += `${chalk.bold(`•`)} ${benefit}\n`;
      });
    }
    
    if (tradeoffs.length > 0) {
      output += `\n${chalk.bold.red('Trade-offs:')}\n`;
      tradeoffs.forEach((tradeoff, index) => {
        output += `${chalk.bold(`•`)} ${tradeoff}\n`;
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

  public processPattern(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
    try {
      const validatedInput = this.validatePatternData(input);
      const formattedOutput = this.formatPatternOutput(validatedInput);
      console.error(formattedOutput);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            patternName: validatedInput.patternName,
            status: 'success',
            hasImplementation: validatedInput.implementation.length > 0,
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
