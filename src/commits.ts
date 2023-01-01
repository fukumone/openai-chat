export function parseComment(comment: string) {
  return comment.trim().replace(/\/openai/g, "");
}
