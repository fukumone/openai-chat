import { Octokit } from "@octokit/rest";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

type GeneralOptions = {
  token: string;
  owner: string;
  repo: string;
  issueNumber: number;
};

type PostCommentOptions = GeneralOptions & {
  body: string;
};

type CreateCommentResponse = Promise<
  RestEndpointMethodTypes["issues"]["createComment"]["response"]["data"]
>;

type CreateCommentOptions = GeneralOptions & {
  body: string;
};

const issues = (auth: string): Octokit["issues"] => {
  return new Octokit({ auth }).issues;
};

const createComment = async ({
  token,
  owner,
  repo,
  issueNumber,
  body,
}: Readonly<CreateCommentOptions>): Promise<CreateCommentResponse> => {
  const response = await issues(token).createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body,
  });
  return response.data;
};

export default async function postComment({
  token,
  owner,
  repo,
  issueNumber,
  body,
}: Readonly<PostCommentOptions>): Promise<void | CreateCommentResponse> {
  return createComment({ token, owner, repo, issueNumber, body });
}
