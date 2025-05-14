import { MentalModelData } from "../models/interfaces.js";
import chalk from "chalk";

export class MentalModelServer {
    private validateModelData(input: unknown): MentalModelData {
        const data = input as Record<string, unknown>;

        if (!data.modelName || typeof data.modelName !== "string") {
            throw new Error("Invalid modelName: must be a string");
        }
        if (!data.problem || typeof data.problem !== "string") {
            throw new Error("Invalid problem: must be a string");
        }

        return {
            modelName: data.modelName as string,
            problem: data.problem as string,
            steps: Array.isArray(data.steps) ? data.steps.map(String) : [],
            reasoning:
                typeof data.reasoning === "string"
                    ? (data.reasoning as string)
                    : "",
            conclusion:
                typeof data.conclusion === "string"
                    ? (data.conclusion as string)
                    : "",
        };
    }

    private formatModelOutput(data: MentalModelData): string {
        const { modelName, problem, steps, reasoning, conclusion } = data;

        let output = `\n${chalk.bold.blue("Mental Model:")} ${chalk.bold(
            modelName
        )}\n`;
        output += `${chalk.bold.green("Problem:")} ${problem}\n`;

        if (steps.length > 0) {
            output += `\n${chalk.bold.yellow("Steps:")}\n`;
            steps.forEach((step, index) => {
                output += `${chalk.bold(`${index + 1}.`)} ${step}\n`;
            });
        }

        if (reasoning) {
            output += `\n${chalk.bold.magenta("Reasoning:")}\n${reasoning}\n`;
        }

        if (conclusion) {
            output += `\n${chalk.bold.cyan("Conclusion:")}\n${conclusion}\n`;
        }

        return output;
    }

    public processModel(input: unknown): any {
        try {
            const validatedInput = this.validateModelData(input);
            const formattedOutput = this.formatModelOutput(validatedInput);
            console.error(formattedOutput);

            return {
                modelName: validatedInput.modelName,
                status: "success",
                hasSteps: validatedInput.steps.length > 0,
                hasConclusion: !!validatedInput.conclusion,
            };
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : String(error),
                status: "failed",
            };
        }
    }
}
