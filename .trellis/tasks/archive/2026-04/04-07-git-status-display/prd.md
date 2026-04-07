# Git 状态信息展示

## Goal
在本地 Git 项目视图中展示每个项目的 Git 状态信息，让用户一眼看到分支名、是否有未提交更改等关键信息。

## Requirements
- 在 core 层新增 Git 状态读取能力（当前分支、是否 dirty）
- 在 VSCode 本地 Git 项目 TreeItem 上展示分支名（description 位置）
- 对有未提交更改的项目用图标/颜色区分（dirty 标记）
- 状态信息异步加载，不阻塞树渲染
- 刷新时同步更新状态

## Acceptance Criteria
- [ ] 每个 Git 项目节点显示当前分支名
- [ ] dirty 状态项目有视觉区分（modified icon 或文字标识）
- [ ] 不影响现有扫描性能（异步加载状态）
- [ ] 刷新操作更新 Git 状态
- [ ] lint 和 typecheck 通过

## Technical Notes
- 使用 `git rev-parse --abbrev-ref HEAD` 获取分支名
- 使用 `git status --porcelain` 判断 dirty 状态
- 状态信息在扫描完成后异步批量获取
- GitProjectInfo 类型需要扩展新字段
