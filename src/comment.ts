import { Octokit } from "@octokit/rest";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { encryptSha256 } from "./utils";

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

const findComment = async ({
  token,
  owner,
  repo,
  issueNumber,
}: GeneralOptions): Promise<{ commentId: number | undefined }> => {
  const firstLine = encryptSha256(String(issueNumber));
  const { data: existingComments } = await issues(token).listComments({
    owner,
    repo,
    issue_number: issueNumber,
  });
  const comment = existingComments.find((c) => c.body?.match(firstLine));

  return { commentId: comment ? comment.id : undefined };
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
  const { commentId } = await findComment({ token, owner, repo, issueNumber });
  if (commentId) {
    await issues(token).updateComment({
      owner,
      repo,
      comment_id: commentId,
      body,
    });
    return;
  }
  return createComment({ token, owner, repo, issueNumber, body });
}
