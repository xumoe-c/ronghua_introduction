# 绒花非遗传承平台

## 项目简介

绒花非遗传承平台是一个基于    └── images/              # 图片资源
        ├── logo.svg         # 网站Logo（SVG格式）
        ├── icon-*.svg       # 功能图标集合
        ├── banner*.jpg      # 轮播图片
        └── ...              # 其他图片5的前端项目，旨在通过数字化手段传承和发扬中华传统绒花艺术。项目采用响应式设计，适配PC端和移动端，支持以webview方式嵌入小程序。

## 项目特色

- 🌸 **非遗百科**：系统梳理绒花历史文化，集成AI智能答疑
- 🎥 **视频教程**：分步骤教学视频，支持直播工坊
- 💬 **社区论坛**：用户交流平台，支持视频分享
- 🛒 **文创商城**：数字藏品展示，定制服务预约
- 🎮 **游戏化设计**：闯关答题，积分奖励系统
- 🤖 **AIGC创作**：AI辅助纹样生成

## 技术架构

### 前端技术栈

- **基础**：HTML5 + CSS3 + 原生JavaScript
- **设计**：响应式布局，移动端优先
- **兼容性**：支持现代浏览器，移动端优化
- **性能优化**：SVG图标，模块化代码，防抖处理

### 项目结构

```
ronghua_introduction/
├── index.html                 # 首页
├── package.json              # 项目配置
├── README.md                 # 项目说明
├── assets/                   # 静态资源
│   ├── css/                 # 样式文件
│   │   ├── common.css       # 通用样式
│   │   ├── index.css        # 首页样式
│   │   └── encyclopedia.css # 百科页样式
│   ├── js/                  # JavaScript文件
│   │   ├── common.js        # 通用工具函数
│   │   ├── index.js         # 首页逻辑
│   │   └── encyclopedia.js  # 百科页逻辑
│   └── images/              # 图片资源
│       ├── logo.png         # 网站Logo
│       ├── banner*.jpg      # 轮播图片
│       └── ...              # 其他图片
└── pages/                   # 子页面
    ├── encyclopedia.html    # 非遗百科（已完成）
    ├── tutorial.html        # 视频教程（待开发）
    ├── community.html       # 社区论坛（待开发）
    ├── shop.html           # 文创商城（待开发）
    ├── game.html           # 趣味闯关（待开发）
    └── profile.html        # 个人中心（待开发）
```

## 开发优先级

### 第一阶段：核心展示功能（✅ 已完成）

1. **首页门户** - 平台介绍和导航
2. **非遗百科** - 绒花历史文化展示
3. **基础框架** - 通用组件和工具函数

### 第二阶段：互动功能（🚧 进行中）

1. **视频教程** - 分步骤教学内容
2. **智能答疑** - AI大模型集成
3. **用户系统** - 登录注册和权限管理

### 第三阶段：社区功能（📋 待开发）

1. **论坛系统** - 发帖回复功能
2. **视频分享** - 用户作品展示
3. **互动交流** - 评论点赞系统

### 第四阶段：商业化功能（📋 待开发）

1. **数字商城** - 藏品展示和购买
2. **定制服务** - 预约和咨询系统
3. **支付集成** - 订单和支付流程

### 第五阶段：创新功能（📋 待开发）

1. **游戏化系统** - 积分和闯关设计
2. **AIGC功能** - AI纹样生成
3. **3D展示** - 工艺流程演示

## 开发指南

### 环境准备

1. 安装Node.js (推荐 v16+)
2. 安装live-server: `npm install -g live-server`
3. 克隆项目到本地

### 开发启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或使用Python启动
npm run serve
```

### 代码规范

- 使用UTF-8编码
- HTML使用语义化标签
- CSS采用BEM命名规范
- JavaScript使用ES6+语法
- 注释使用中文说明

### 样式约定

- 主色调：金黄色 (#d4af37)
- 辅助色：棕色 (#8b4513)
- 背景色：米色系 (#f8f4e6)
- 字体：PingFang SC / Microsoft YaHei

### 响应式断点

- 移动端：< 768px
- 平板端：768px - 1024px
- 桌面端：> 1024px

## 功能特性

### 已实现功能

- ✅ 响应式首页设计
- ✅ 导航菜单和用户系统
- ✅ 轮播横幅展示
- ✅ 非遗百科完整模块
- ✅ 历史时间线展示
- ✅ 工艺流程介绍
- ✅ 传承大师展示
- ✅ AI智能答疑界面
- ✅ 模态框和消息提示
- ✅ 滚动动画效果

### 待实现功能

- 🔄 视频教程播放器
- 🔄 论坛发帖回复系统
- 🔄 商城购物车功能
- 🔄 游戏化积分系统
- 🔄 AI纹样生成工具
- 🔄 3D工艺展示
- 🔄 直播教学功能
- 🔄 移动端优化

## API接口设计

### 用户认证

- `POST /auth/login` - 用户登录
- `POST /auth/register` - 用户注册
- `POST /auth/send-code` - 发送验证码
- `GET /auth/profile` - 获取用户信息

### 百科内容

- `GET /encyclopedia/history` - 获取历史内容
- `GET /encyclopedia/crafts` - 获取工艺信息
- `GET /encyclopedia/masters` - 获取大师信息

### AI聊天

- `POST /ai/chat` - 发送聊天消息
- `GET /ai/questions` - 获取常见问题

### 视频教程

- `GET /tutorials/list` - 获取教程列表
- `GET /tutorials/:id` - 获取教程详情
- `POST /tutorials/:id/progress` - 更新学习进度

## 部署指南

### 静态部署

项目为纯前端项目，可部署到任意静态服务器：

- Nginx
- Apache
- GitHub Pages
- Vercel
- Netlify

### 小程序集成

项目支持以webview形式嵌入小程序：

1. 配置小程序webview组件
2. 设置业务域名白名单
3. 调整样式适配小程序环境

## 贡献指南

1. Fork 项目仓库
2. 创建功能分支：`git checkout -b feature/新功能`
3. 提交代码：`git commit -m '添加新功能'`
4. 推送分支：`git push origin feature/新功能`
5. 提交Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

**绒花非遗传承平台** - 致力于传承和发扬中华传统文化艺术
