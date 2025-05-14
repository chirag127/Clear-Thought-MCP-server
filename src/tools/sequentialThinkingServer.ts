import { ThoughtData } from '../models/interfaces.js';
import chalk from 'chalk';

export class SequentialThinkingServer {
  private thoughtHistory: ThoughtData[] = [];
  private branches: Record<string, ThoughtData[]> = {};

  private validateThoughtData(input: unknown): ThoughtData {
    const data = input as Record<string, unknown>;

    if (!data.thought || typeof data.thought !== 'string') {
      throw new Error('Invalid thought: must be a string');
    }
    if (!data.thoughtNumber || typeof data.thoughtNumber !== 'number') {
      throw new Error('Invalid thoughtNumber: must be a number');
    }
    if (!data.totalThoughts || typeof data.totalThoughts !== 'number') {
      throw new Error('Invalid totalThoughts: must be a number');
    }
    if (typeof data.nextThoughtNeeded !== 'boolean') {
      throw new Error('Invalid nextThoughtNeeded: must be a boolean');
    }

    // Optional fields
    const isRevision = data.isRevision !== undefined ? !!data.isRevision : undefined;
    const revisesThought = data.revisesThought !== undefined && typeof data.revisesThought === 'number' 
      ? data.revisesThought as number 
      : undefined;
    const branchFromThought = data.branchFromThought !== undefined && typeof data.branchFromThought === 'number' 
      ? data.branchFromThought as number 
      : undefined;
    const branchId = data.branchId !== undefined && typeof data.branchId === 'string' 
      ? data.branchId as string 
      : undefined;
    const needsMoreThoughts = data.needsMoreThoughts !== undefined ? !!data.needsMoreThoughts : undefined;

    return {
      thought: data.thought as string,
      thoughtNumber: data.thoughtNumber as number,
      totalThoughts: data.totalThoughts as number,
      nextThoughtNeeded: data.nextThoughtNeeded as boolean,
      isRevision,
      revisesThought,
      branchFromThought,
      branchId,
      needsMoreThoughts
    };
  }

  private formatThoughtOutput(data: ThoughtData): string {
    const { 
      thought, 
      thoughtNumber, 
      totalThoughts, 
      nextThoughtNeeded,
      isRevision,
      revisesThought,
      branchFromThought,
      branchId,
      needsMoreThoughts
    } = data;
    
    let output = '';
    
    // Add header based on thought type
    if (isRevision && revisesThought) {
      output += `\n${chalk.bold.yellow(`Thought ${thoughtNumber}/${totalThoughts} (Revising Thought ${revisesThought}):`)} `;
    } else if (branchFromThought && branchId) {
      output += `\n${chalk.bold.magenta(`Thought ${thoughtNumber}/${totalThoughts} (Branch "${branchId}" from Thought ${branchFromThought}):`)} `;
    } else {
      output += `\n${chalk.bold.blue(`Thought ${thoughtNumber}/${totalThoughts}:`)} `;
    }
    
    // Add the thought content
    output += `${thought}\n`;
    
    // Add footer with status
    if (nextThoughtNeeded) {
      output += chalk.green(`\nContinuing to next thought...\n`);
      if (needsMoreThoughts) {
        output += chalk.yellow(`More thoughts needed than initially estimated.\n`);
      }
    } else {
      output += chalk.cyan(`\nThinking process complete.\n`);
    }
    
    return output;
  }

  private storeThought(thought: ThoughtData): void {
    // If this is a branch, store in the appropriate branch collection
    if (thought.branchId) {
      if (!this.branches[thought.branchId]) {
        this.branches[thought.branchId] = [];
      }
      this.branches[thought.branchId].push(thought);
    } else {
      // Otherwise store in main thought history
      this.thoughtHistory.push(thought);
    }
  }

  public processThought(input: unknown): ThoughtData {
    const validatedInput = this.validateThoughtData(input);
    
    // Store the thought for future reference
    this.storeThought(validatedInput);
    
    // Log formatted output to console
    const formattedOutput = this.formatThoughtOutput(validatedInput);
    console.error(formattedOutput);
    
    return validatedInput;
  }
}
