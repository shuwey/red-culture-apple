# Apple 风格红色文化传播网

> 红色文化传播网的 Apple 风格独立版本。

## 在线访问

https://shuwey.github.io/red-culture-apple/

## 技术栈

- 静态 HTML / CSS / JavaScript
- GitHub Pages 托管

## 本地预览

```bash
cd red-culture-apple
python3 -m http.server 9001
```

打开 http://localhost:9001 即可。

## 目录结构

```
├── index.html      首页
├── heroes.html     英雄人物
├── places.html     红色地点
├── events.html     历史事件
├── detail.html     通用详情页
├── quiz.html       知识考核
├── rank.html       排行榜
├── search.html     搜索页
├── about.html      关于本站
├── css/style.css   样式
├── js/main.js      公共脚本
├── js/ai.js        AI 助手小红
├── data/           人物、地点、事件、题库数据
└── assets/img/     图片资源
```

## 自动部署

推送 `main` 分支后，GitHub Pages 会自动构建并发布站点，无需额外配置。

## 与原项目的关系

本项目是 `red-culture-web` 的 Apple 风格重设计版本，数据和图片资源复用自原项目，但仓库、部署、代码均独立维护，不再与原仓库关联。
