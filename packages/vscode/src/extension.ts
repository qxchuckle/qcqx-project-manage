import * as vscode from 'vscode';
import { initProjectList } from './projectManagePanel/projectList';
import { initRecentFolders } from './recentFolders';
import { initLocalGitProjects } from './localGitProjects';

/** VS Code 扩展激活入口 */
export function activate(context: vscode.ExtensionContext) {
  initProjectList({ context });
  initRecentFolders(context);
  initLocalGitProjects(context).catch((err) => {
    console.error('Failed to initialize local git projects:', err);
  });
}
/** VS Code 扩展停用回调 */
export function deactivate() {}
