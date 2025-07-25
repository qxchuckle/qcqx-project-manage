# VSCode插件-项目管理
一个VSCode插件，用于管理项目

> 之前在用 [Project Manager](https://github.com/alefragnani/vscode-project-manager) 管理项目，但只能用标签进行分类，也不能拖拽移动，司内项目很多，分各种业务域、层级，树形结构才符合需求  
> 在插件市场并没有找到合适的，那就自己写个吧，聚焦实际开发痛点，解决项目管理难题  

[市场](https://marketplace.visualstudio.com/items?itemName=qcqx.qcqx-project-manage) [open vsx](https://open-vsx.org/extension/qcqx/qcqx-project-manage)

功能：
1. 树结构管理项目，支持拖拽移动  
2. 支持单个或批量保存文件夹、工作区、文件，并快速打开  
3. 支持打开 project-list.json 配置文件快速编辑  
4. 多窗口、类VSCode应用同步状态，配置文件改动后自动更新面板  
5. 项目可以关联链接，以快速打开，如发布页、git仓库、项目测试环境页面等等  

未来的功能：
1. 可切换平铺、树状
2. 支持保存项目组，点击后快速打开多个窗口（可选择的）。开发往往得打开多个工程，这些工程项目是有关联的，但我并不想用工作区，只在一个窗口打开多个项目并不方便。  
3. 和 Project Manager 一样支持自动扫描文件夹识别Git项目  
4. 还有更多  

![image](https://raw.githubusercontent.com/qxchuckle/qcqx-project-manage/refs/heads/master/img/1.png)

![image](https://raw.githubusercontent.com/qxchuckle/qcqx-project-manage/refs/heads/master/img/2.png)


# QA
1、为什么支持文件保存？

有很多配置类的文件分散在各处，比如ssh、claude的配置，保存起来，快速打开。










