import * as vscode from 'vscode';
import { initProjectList } from './projectList';
import { initRecentFolders } from '@/recentFolders';

export const initProjectManagePanel = (props: {
  context: vscode.ExtensionContext;
}) => {
  const { context } = props;

  initProjectList({ context });
  initRecentFolders(context);
};
