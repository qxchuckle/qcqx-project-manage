import * as vscode from 'vscode';
import { initProjectList } from './projectList';

export const initProjectManagePanel = (props: {
  context: vscode.ExtensionContext;
}) => {
  const { context } = props;

  initProjectList({ context });
};
