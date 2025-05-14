import { VisualOperationData } from '../models/interfaces.js';
import chalk from 'chalk';

export class VisualReasoningServer {
  private validateInputData(input: unknown): VisualOperationData {
    const data = input as VisualOperationData;
    if (!data.operation || !data.diagramId || !data.diagramType) {
      throw new Error("Invalid input for VisualReasoning: Missing required fields.");
    }
    if (typeof data.iteration !== 'number' || data.iteration < 0) {
      throw new Error("Invalid iteration value for VisualOperationData.");
    }
    if (typeof data.nextOperationNeeded !== 'boolean') {
      throw new Error("Invalid nextOperationNeeded value for VisualOperationData.");
    }
    return data;
  }

  private formatOutput(data: VisualOperationData): string {
    const { operation, diagramId, diagramType, iteration, nextOperationNeeded } = data;
    
    let output = `\n${chalk.bold.blue('Visual Reasoning')}\n`;
    output += `${chalk.bold.green('Operation:')} ${operation}\n`;
    output += `${chalk.bold.yellow('Diagram ID:')} ${diagramId}\n`;
    output += `${chalk.bold.magenta('Diagram Type:')} ${diagramType}\n`;
    output += `${chalk.bold.cyan('Iteration:')} ${iteration}\n`;
    
    // Elements
    if (data.elements && data.elements.length > 0) {
      output += `\n${chalk.bold.green('Elements:')}\n`;
      data.elements.forEach((element, i) => {
        output += `${chalk.bold(`Element ${i+1}: ${element.id} (${element.type})`)}\n`;
        if (element.label) {
          output += `  ${chalk.bold('Label:')} ${element.label}\n`;
        }
        
        if (element.source) {
          output += `  ${chalk.bold('Source:')} ${element.source}\n`;
        }
        
        if (element.target) {
          output += `  ${chalk.bold('Target:')} ${element.target}\n`;
        }
        
        if (element.contains && element.contains.length > 0) {
          output += `  ${chalk.bold('Contains:')} ${element.contains.join(', ')}\n`;
        }
        
        const propKeys = Object.keys(element.properties);
        if (propKeys.length > 0) {
          output += `  ${chalk.bold('Properties:')}\n`;
          propKeys.forEach(key => {
            output += `    ${chalk.bold(`${key}:`)} ${JSON.stringify(element.properties[key])}\n`;
          });
        }
      });
    }
    
    // Transform Type
    if (data.transformationType) {
      output += `\n${chalk.bold('Transform Type:')} ${data.transformationType}\n`;
    }
    
    // Observation
    if (data.observation) {
      output += `\n${chalk.bold.yellow('Observation:')}\n${data.observation}\n`;
    }
    
    // Insight
    if (data.insight) {
      output += `\n${chalk.bold.magenta('Insight:')}\n${data.insight}\n`;
    }
    
    // Hypothesis
    if (data.hypothesis) {
      output += `\n${chalk.bold.cyan('Hypothesis:')}\n${data.hypothesis}\n`;
    }
    
    // Next Operation
    if (nextOperationNeeded) {
      output += `\n${chalk.green('Further visual operations needed.')}\n`;
    } else {
      output += `\n${chalk.cyan('Visual reasoning complete.')}\n`;
    }
    
    return output;
  }

  public processVisualReasoning(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
    try {
      const validatedData = this.validateInputData(input);
      const processedData: VisualOperationData = {
        ...validatedData,
        elements: validatedData.elements || []
      };
      
      const formattedOutput = this.formatOutput(processedData);
      console.error(formattedOutput);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            operation: processedData.operation,
            diagramId: processedData.diagramId,
            diagramType: processedData.diagramType,
            iteration: processedData.iteration,
            nextOperationNeeded: processedData.nextOperationNeeded,
            elementCount: processedData.elements ? processedData.elements.length : 0,
            status: 'success'
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
