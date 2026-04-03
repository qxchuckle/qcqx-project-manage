import * as vscode from 'vscode';
import { initProjectList } from './projectManagePanel/projectList';
import { initRecentFolders } from './recentFolders';
import { initLocalGitProjects } from './localGitProjects';

export function activate(context: vscode.ExtensionContext) {
  initProjectList({ context });
  initRecentFolders(context);
  initLocalGitProjects(context).catch((err) => {
    console.error('Failed to initialize local git projects:', err);
  });
}
export function deactivate() {}
