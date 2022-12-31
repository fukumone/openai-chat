import * as childProcess from "child_process";

export async function showCommitDiff() {
  // git log -p コマンドを実行する
  const result = await childProcess.execSync(`git log -p`);

  // 結果を文字列として取得する
  const output = result.toString();

  // ファイルごとに分割する
  const fileDiffs = output.split("diff --git");

  // 先頭の要素は不要なので削除する
  fileDiffs.shift();

  // ファイルごとの差分を保存する配列
  const diffs: string[] = [];

  // ファイルごとに処理する
  for (const fileDiff of fileDiffs) {
    diffs.push(fileDiff);
  }

  // 配列を返す
  return diffs;
}
