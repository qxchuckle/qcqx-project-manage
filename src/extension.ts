import * as vscode from 'vscode';
import { initProjectManagePanel } from './projectManagePanel';

export function activate(context: vscode.ExtensionContext) {
  initProjectManagePanel({ context });
}
export function deactivate() {}
