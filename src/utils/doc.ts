import * as vscode from 'vscode';

/**
 * 在vscode.TextDocument中找到指定内容所在位置（行，列）
 */
export const findLineInDoc = (
  doc: vscode.TextDocument,
  searchText: string,
): { line: number; column: number } | null => {
  const lines = doc.getText().split('\n');
  for (let i = 0; i < lines.length; i++) {
    const lineContent = lines[i];
    const column = lineContent.indexOf(searchText);
    if (column !== -1) {
      return { line: i, column };
    }
  }
  return null;
};
