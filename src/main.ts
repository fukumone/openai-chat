import { Configuration, OpenAIApi } from "openai";
import * as core from "@actions/core";
import * as github from "@actions/github";
import postComment from "./github";
import { parseComment } from "./commits";

export async function run(): Promise<void> {
  try {
    const apiKey = core.getInput("openai-api-key");
    const configuration = new Configuration({
      apiKey,
    });
    const openai = new OpenAIApi(configuration);

    core.debug(`github-comment: ${core.getInput("github-comment")}`);

    const response = await openai.createCompletion({
      model: core.getInput("model"),
      prompt: parseComment(core.getInput("github-comment")),
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const body = response.data.choices[0].text ?? "";
    await postComment({
      token: core.getInput("github-token", { required: true }),
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issueNumber: github.context.issue.number,
      body,
    });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
