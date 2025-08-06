# 绒花非遗传承平台 - 后端服务

基于FastAPI + SQLite的轻量级后端解决方案，包含用户API和中台管理系统。

## 🚀 快速开始

### 环境要求

- Python 3.9+
- SQLite 3.x

### 安装依赖

```bash
pip install -r requirements.txt
```

### 初始化数据库

```bash
python scripts/init_db.py
```

### 启动开发服务器

```bash
# API服务
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 访问地址
# API文档: http://localhost:8000/docs
# 中台管理: http://localhost:8000/admin
```

## 📦 项目结构

```
backend/
├── app/                    # 主应用
│   ├── api/               # API路由
│   ├── admin/             # 中台管理
│   ├── models/            # 数据模型
│   ├── services/          # 业务逻辑
│   └── core/              # 核心配置
├── data/                  # 数据文件
├── templates/             # 模板文件
├── static/                # 静态资源
└── tests/                 # 测试文件
```

## 🔧 技术栈

- **Framework**: FastAPI
- **Database**: SQLite + SQLAlchemy
- **Authentication**: JWT
- **Templates**: Jinja2
- **UI**: Bootstrap 5
- **Cache**: 内存缓存

## 📊 功能模块

### 用户端API

- 用户认证（注册/登录）
- 非遗百科内容
- 视频教程管理
- 社区论坛功能
- 文创商城系统
- 游戏化积分系统

### 中台管理系统

- 用户管理
- 内容管理
- 订单处理
- 数据统计
- 系统配置

## 🛠️ 开发指南

### API接口规范

- 统一返回格式
- 错误码标准化
- 参数验证
- 接口文档自动生成

### 数据库设计

- SQLite轻量级存储
- SQLAlchemy ORM
- 数据迁移支持
- 自动备份机制

## 📈 部署说明

### 开发环境


```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 生产环境

```bash
docker-compose up -d
```

## 🔒 安全特性

- JWT认证
- 密码加密
- SQL注入防护
- XSS防护
- CORS配置

## 📞 联系方式

如有问题，请联系开发团队。
