# Journal - qcqx (Part 1)

> AI development session journal
> Started: 2026-03-10

---



## Session 1: 最近打开的文件夹增加保存到项目列表按钮

**Date**: 2026-03-10
**Task**: 最近打开的文件夹增加保存到项目列表按钮

### Summary

为每项增加保存到项目列表入口，新增 add-uri-to-root 与 save-to-project-list 命令及 package 注册。

### Main Changes




### Git Commits

(No commits - planning session)

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 2: 最近打开的文件夹增加「保存到项目列表」按钮

**Date**: 2026-03-10
**Task**: 最近打开的文件夹增加「保存到项目列表」按钮

### Summary

在最近打开的文件夹视图中，为每项增加「保存到项目列表」入口：新增 project-list.add-uri-to-root 命令；在 recent-folders 中注册 save-to-project-list 并调用；在 package.json 的 view/item/context 与 commands 中注册，行内按钮使用 inline@3 与  图标。

### Main Changes



### Git Commits

(No commits - planning session)

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 3: 最近打开的文件夹增加保存到项目列表按钮

**Date**: 2026-03-10
**Task**: 最近打开的文件夹增加保存到项目列表按钮

### Summary

为最近打开的文件夹每项增加保存到项目列表入口：新增 add-uri-to-root 命令、recent-folders.save-to-project-list 命令，并在 package.json 注册行内按钮。

### Main Changes



### Git Commits

(No commits - planning session)

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 4: 最近打开的文件夹增加保存到项目列表按钮

**Date**: 2026-03-10
**Task**: 最近打开的文件夹增加保存到项目列表按钮

### Summary

为每项增加保存到项目列表入口，新增命令与 package 注册。

### Main Changes



### Git Commits

(No commits - planning session)

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete


## Session 5: 项目管理面板功能增强与 v1.1.4 发布

**Date**: 2026-04-02
**Task**: 项目管理面板功能增强与 v1.1.4 发布

### Summary

(Add summary)

### Main Changes

### Summary

多项功能增强与代码重构，发布 v1.1.4 版本。

### Main Changes

| 提交 | 类型 | 描述 |
|------|------|------|
| `7fa3deb` | feat | 支持文件夹项目继续展开子目录/文件 |
| `8e9b567` | feat | 右键菜单增加复制路径功能 |
| `677921d` | feat | 最近打开的文件夹视图容器默认收起 |
| `83b07a4` | chore | 版本号升级到 1.1.4 |
| `1f7a775` | refactor | 改进排序逻辑并增强树视图组件的空值检查 |

**修改文件 (13 files, +234/-26)**:
- `package.json` — 新增命令注册、版本升级
- `treeView/tree.ts` — 新增文件夹展开逻辑
- `treeView/treeItems/folder.ts` — 新增文件夹树项
- `treeView/treeItems/fsFile.ts` — 新增文件系统文件树项
- `treeView/treeDragAndDropController.ts` — 拖拽控制器增强
- `treeView/treeItems/base.ts` — 基础树项空值检查
- `commends/node/openProject.ts` — 打开项目命令增强
- `utils/index.ts` — 工具函数新增


### Git Commits

| Hash | Message |
|------|---------|
| `7fa3deb` | (see git log) |
| `8e9b567` | (see git log) |
| `677921d` | (see git log) |
| `83b07a4` | (see git log) |
| `1f7a775` | (see git log) |

### Testing

- [OK] (Add test results)

### Status

[OK] **Completed**

### Next Steps

- None - task complete
