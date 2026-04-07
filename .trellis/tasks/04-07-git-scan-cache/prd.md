# Git 扫描缓存

## Goal
为 core 包的 Git 项目扫描功能增加可选的缓存层，实现「先读缓存快速展示 → 后台静默更新」的 stale-while-revalidate 策略，大幅提升 VSCode 侧边栏加载速度。

## Requirements
- 缓存在 core 中实现，作为可选功能
- VSCode 调用时开启缓存，CLI 等场景无需缓存
- 保持原有 `scanForGitProjects` 不变（纯扫描，无副作用）
- 新增 `scanForGitProjectsCached` 函数，支持：
  - 有缓存时：立即返回缓存结果 + 后台触发真实扫描 + 扫描完回调通知
  - 无缓存时：执行真实扫描 → 写入缓存 → 返回结果
- 缓存格式使用 JSON with metadata（版本号 + 时间戳 + 配置指纹）

## Cache Format
```json
{
  "version": 1,
  "timestamp": 1712500000000,
  "configHash": "sha256-of-scan-config",
  "projects": [...]
}
```

选择 JSON 的理由：
- 与现有 CacheManager 的 readJSON/writeJSON 一致
- 100 个项目约 10-20KB，解析 < 5ms
- 真正瓶颈是目录递归扫描(500-2000ms)，而非序列化
- 可读性好，便于调试

## Acceptance Criteria
- [ ] `scanForGitProjects` 接口不变
- [ ] 新增 `scanForGitProjectsCached` 可选缓存函数
- [ ] VSCode treeDataProvider 使用缓存版本
- [ ] 首次打开（无缓存）正常扫描并写入缓存
- [ ] 后续打开先显示缓存结果，后台静默刷新
- [ ] 缓存更新后通过回调通知调用方刷新 UI
- [ ] Core 构建通过，VSCode lint/类型检查通过

## Technical Notes
- 缓存文件位置：复用 CacheManager，存储在 `~/.qcqx/qcqx-project-manage/git-projects-cache.json`
- 配置指纹（configHash）由 entries + options 计算，配置变更时自动废弃旧缓存
- 后台扫描使用 fire-and-forget 模式，不阻塞返回
