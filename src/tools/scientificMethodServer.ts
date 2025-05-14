import { ScientificInquiryData, HypothesisData, ExperimentData } from '../models/interfaces.js';
import chalk from 'chalk';

export class ScientificMethodServer {
  private validateInputData(input: unknown): ScientificInquiryData {
    const data = input as ScientificInquiryData;
    if (!data.stage || !data.inquiryId) {
      throw new Error("Invalid input for ScientificMethod: Missing required fields.");
    }
    if (typeof data.iteration !== 'number' || data.iteration < 0) {
      throw new Error("Invalid iteration value for ScientificInquiryData.");
    }
    if (typeof data.nextStageNeeded !== 'boolean') {
      throw new Error("Invalid nextStageNeeded value for ScientificInquiryData.");
    }
    return data;
  }

  private formatOutput(data: ScientificInquiryData): string {
    const { stage, inquiryId, iteration, nextStageNeeded } = data;
    
    let output = `\n${chalk.bold.blue('Scientific Method Inquiry')}\n`;
    output += `${chalk.bold.green('Inquiry ID:')} ${inquiryId}\n`;
    output += `${chalk.bold.yellow('Stage:')} ${stage} (Iteration: ${iteration})\n`;
    
    // Observation
    if (data.observation) {
      output += `\n${chalk.bold.magenta('Observation:')}\n${data.observation}\n`;
    }
    
    // Question
    if (data.question) {
      output += `\n${chalk.bold.cyan('Research Question:')}\n${data.question}\n`;
    }
    
    // Hypothesis
    if (data.hypothesis) {
      const h = data.hypothesis;
      output += `\n${chalk.bold.green('Hypothesis:')}\n`;
      output += `${chalk.bold('Statement:')} ${h.statement}\n`;
      output += `${chalk.bold('Domain:')} ${h.domain}\n`;
      output += `${chalk.bold('Status:')} ${h.status}\n`;
      output += `${chalk.bold('Confidence:')} ${(h.confidence * 100).toFixed(1)}%\n`;
      
      if (h.variables.length > 0) {
        output += `\n${chalk.bold('Variables:')}\n`;
        h.variables.forEach((variable, i) => {
          output += `  ${chalk.bold(`${i+1}. ${variable.name} (${variable.type})`)}\n`;
          if (variable.operationalization) {
            output += `     Operationalization: ${variable.operationalization}\n`;
          }
        });
      }
      
      if (h.assumptions.length > 0) {
        output += `\n${chalk.bold('Assumptions:')}\n`;
        h.assumptions.forEach((assumption, i) => {
          output += `  ${chalk.bold(`${i+1}.`)} ${assumption}\n`;
        });
      }
      
      if (h.alternativeTo && h.alternativeTo.length > 0) {
        output += `\n${chalk.bold('Alternative To:')} ${h.alternativeTo.join(', ')}\n`;
      }
      
      if (h.refinementOf) {
        output += `${chalk.bold('Refinement Of:')} ${h.refinementOf}\n`;
      }
    }
    
    // Experiment
    if (data.experiment) {
      const e = data.experiment;
      output += `\n${chalk.bold.yellow('Experiment:')}\n`;
      output += `${chalk.bold('ID:')} ${e.experimentId}\n`;
      output += `${chalk.bold('Design:')} ${e.design}\n`;
      output += `${chalk.bold('Methodology:')} ${e.methodology}\n`;
      
      if (e.predictions.length > 0) {
        output += `\n${chalk.bold('Predictions:')}\n`;
        e.predictions.forEach((prediction, i) => {
          output += `  ${chalk.bold(`${i+1}.`)} If ${prediction.if}, then ${prediction.then}`;
          if (prediction.else) {
            output += `, else ${prediction.else}`;
          }
          output += `\n`;
        });
      }
      
      if (e.controlMeasures.length > 0) {
        output += `\n${chalk.bold('Control Measures:')}\n`;
        e.controlMeasures.forEach((measure, i) => {
          output += `  ${chalk.bold(`${i+1}.`)} ${measure}\n`;
        });
      }
      
      if (e.results) {
        output += `\n${chalk.bold('Results:')}\n${e.results}\n`;
        if (e.outcomeMatched !== undefined) {
          output += `${chalk.bold('Outcome Matched Predictions:')} ${e.outcomeMatched ? 'Yes' : 'No'}\n`;
        }
      }
      
      if (e.unexpectedObservations && e.unexpectedObservations.length > 0) {
        output += `\n${chalk.bold('Unexpected Observations:')}\n`;
        e.unexpectedObservations.forEach((observation, i) => {
          output += `  ${chalk.bold(`${i+1}.`)} ${observation}\n`;
        });
      }
      
      if (e.limitations && e.limitations.length > 0) {
        output += `\n${chalk.bold('Limitations:')}\n`;
        e.limitations.forEach((limitation, i) => {
          output += `  ${chalk.bold(`${i+1}.`)} ${limitation}\n`;
        });
      }
      
      if (e.nextSteps && e.nextSteps.length > 0) {
        output += `\n${chalk.bold('Next Steps:')}\n`;
        e.nextSteps.forEach((step, i) => {
          output += `  ${chalk.bold(`${i+1}.`)} ${step}\n`;
        });
      }
    }
    
    // Analysis
    if (data.analysis) {
      output += `\n${chalk.bold.magenta('Analysis:')}\n${data.analysis}\n`;
    }
    
    // Conclusion
    if (data.conclusion) {
      output += `\n${chalk.bold.cyan('Conclusion:')}\n${data.conclusion}\n`;
    }
    
    // Next Stage
    if (nextStageNeeded) {
      output += `\n${chalk.green('Further scientific inquiry needed.')}\n`;
    } else {
      output += `\n${chalk.cyan('Scientific inquiry complete.')}\n`;
    }
    
    return output;
  }

  private processHypothesis(hypothesis?: HypothesisData): HypothesisData | undefined {
    if (!hypothesis) return undefined;
    
    return {
      ...hypothesis,
      variables: hypothesis.variables || [],
      assumptions: hypothesis.assumptions || [],
      alternativeTo: hypothesis.alternativeTo || [],
      status: hypothesis.status || "proposed"
    };
  }

  private processExperiment(experiment?: ExperimentData): ExperimentData | undefined {
    if (!experiment) return undefined;
    
    return {
      ...experiment,
      predictions: experiment.predictions || [],
      controlMeasures: experiment.controlMeasures || [],
      unexpectedObservations: experiment.unexpectedObservations || [],
      limitations: experiment.limitations || [],
      nextSteps: experiment.nextSteps || []
    };
  }

  public processScientificMethod(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
    try {
      const validatedData = this.validateInputData(input);
      const processedData: ScientificInquiryData = {
        ...validatedData,
        hypothesis: this.processHypothesis(validatedData.hypothesis),
        experiment: this.processExperiment(validatedData.experiment)
      };
      
      const formattedOutput = this.formatOutput(processedData);
      console.error(formattedOutput);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            stage: processedData.stage,
            inquiryId: processedData.inquiryId,
            iteration: processedData.iteration,
            nextStageNeeded: processedData.nextStageNeeded,
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
