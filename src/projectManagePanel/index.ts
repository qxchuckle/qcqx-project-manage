import * as vscode from 'vscode';
import { initProjectList } from './projectList';
import { initRecentFolders } from '@/recentFolders';
import { initLocalGitProjects } from '@/localGitProjects';

export const initProjectManagePanel = (props: {
  context: vscode.ExtensionContext;
}) => {
  const { context } = props;

  initProjectList({ context });
  initRecentFolders(context);
  initLocalGitProjects(context).catch((err) => {
    console.error('Failed to initialize local git projects:', err);
  });
};
