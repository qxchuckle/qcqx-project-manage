# 给 Git 面板和最近文件夹添加搜索功能

## Goal
为「本地Git项目」和「最近打开的文件夹」两个面板添加搜索功能，复用现有项目列表搜索的 QuickPick 模式。

## Requirements
- 本地Git项目面板标题栏增加搜索按钮，点击弹出 QuickPick 搜索所有 Git 项目
- 最近打开的文件夹面板标题栏增加搜索按钮，点击弹出 QuickPick 搜索所有最近文件夹
- QuickPick 支持按名称和路径模糊匹配
- 选中后在当前窗口打开文件夹

## Acceptance Criteria
- [ ] 本地Git项目面板标题栏出现搜索图标
- [ ] 点击后弹出 QuickPick，显示所有 Git 项目（名称 + 路径）
- [ ] 最近打开的文件夹面板标题栏出现搜索图标
- [ ] 点击后弹出 QuickPick，显示所有最近文件夹（名称 + 路径）
- [ ] QuickPick 支持模糊搜索过滤
- [ ] 选中项后在当前窗口打开

## Technical Notes
- 复用 `projectManagePanel/projectList/commends/node/search.ts` 的 QuickPick 模式
- 需要在 `LocalGitProjectsTreeDataProvider` 上暴露 projects 数据的公开访问方法
- 需要在 `RecentFoldersTreeDataProvider` 上暴露获取列表的方法
- 命令前缀: `CMD_PREFIX_LOCAL_GIT` / `CMD_PREFIX_RECENT_FOLDERS`
- package.json 中注册 commands 和 view/title 菜单贡献点
