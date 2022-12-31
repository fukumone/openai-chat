import { Configuration, OpenAIApi } from "openai";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { showCommitDiff } from "./showCommitDiff";
import postComment from "./comment";

export async function run(): Promise<void> {
  const apiKey = core.getInput("openai-api-key");
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);

  const diffs = await showCommitDiff();

  for (const diff of diffs) {
    const response = await openai.createCompletion({
      model: core.getInput("model"),
      prompt: diff,
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
  }
}

run();
