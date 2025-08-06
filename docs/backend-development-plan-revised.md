# 绒花非遗传承平台 - 后端开发规划（修订版）

## 🎯 项目概述

基于SQLite数据库的轻量级部署方案，包含用户端API服务和中台管理系统。

## 📊 技术栈选择

### 核心框架
- **后端API**: FastAPI + SQLAlchemy + SQLite
- **中台管理**: FastAPI + Jinja2模板 + Bootstrap
- **缓存**: 内存缓存 + 文件缓存
- **认证**: JWT Token + Session
- **文件存储**: 本地文件系统

### 项目结构
```
ronghua_backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI应用入口
│   ├── config.py                  # 配置管理
│   ├── database.py                # SQLite数据库连接
│   │
│   ├── models/                    # 数据模型
│   │   ├── __init__.py
│   │   ├── base.py               # 基础模型
│   │   ├── user.py               # 用户模型
│   │   ├── content.py            # 内容模型
│   │   ├── community.py          # 社区模型
│   │   └── shop.py               # 商城模型
│   │
│   ├── schemas/                   # Pydantic模式
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── content.py
│   │   └── response.py
│   │
│   ├── api/                       # API路由
│   │   ├── __init__.py
│   │   ├── auth.py               # 用户认证
│   │   ├── encyclopedia.py       # 非遗百科
│   │   ├── tutorial.py           # 视频教程
│   │   ├── community.py          # 社区论坛
│   │   ├── shop.py               # 文创商城
│   │   └── game.py               # 游戏化
│   │
│   ├── admin/                     # 中台管理系统
│   │   ├── __init__.py
│   │   ├── routes.py             # 管理路由
│   │   ├── auth.py               # 管理员认证
│   │   └── views.py              # 管理视图
│   │
│   ├── services/                  # 业务逻辑
│   │   ├── __init__.py
│   │   ├── user_service.py
│   │   ├── content_service.py
│   │   ├── ai_service.py
│   │   └── cache_service.py
│   │
│   ├── core/                      # 核心配置
│   │   ├── __init__.py
│   │   ├── security.py           # 安全相关
│   │   ├── deps.py               # 依赖注入
│   │   └── exceptions.py         # 异常处理
│   │
│   └── utils/                     # 工具函数
│       ├── __init__.py
│       ├── helpers.py
│       └── validators.py
│
├── templates/                     # 中台模板
│   ├── base.html
│   ├── admin/
│   │   ├── dashboard.html
│   │   ├── users.html
│   │   ├── content.html
│   │   └── settings.html
│   └── auth/
│       └── login.html
│
├── static/                        # 静态文件
│   ├── css/
│   ├── js/
│   └── images/
│
├── data/                          # 数据文件
│   ├── database.db               # SQLite数据库
│   ├── uploads/                  # 上传文件
│   └── cache/                    # 缓存文件
│
├── tests/                         # 测试文件
├── migrations/                    # 数据库迁移
├── scripts/                       # 脚本文件
├── requirements.txt
├── docker-compose.yml
└── README.md
```

## 📋 开发阶段规划

### 🚀 第一阶段：基础框架 + 中台搭建（2-3周）

#### 1.1 项目初始化
- [x] 创建项目结构
- [x] 配置SQLite数据库
- [x] 设置FastAPI应用
- [x] 基础模型定义

#### 1.2 中台管理系统框架
- [x] 管理员认证系统
- [x] 基础后台模板
- [x] 导航和权限控制
- [x] 数据库管理界面

#### 1.3 用户认证API
- [x] JWT认证机制
- [x] 用户注册/登录
- [x] 验证码发送
- [x] 用户信息管理

### 🎨 第二阶段：核心业务模块（3-4周）

#### 2.1 非遗百科模块
**API接口:**
```python
GET  /api/encyclopedia/history      # 历史内容列表
GET  /api/encyclopedia/crafts       # 工艺流程信息
GET  /api/encyclopedia/masters      # 传承大师介绍
POST /api/ai/chat                   # AI智能问答
GET  /api/ai/questions              # 常见问题列表
```

**中台管理:**
- 内容管理：增删改查历史、工艺、大师信息
- AI配置：问答库管理、回复模板设置
- 数据统计：访问量、热门内容分析

#### 2.2 视频教程模块
**API接口:**
```python
GET  /api/tutorials/list            # 教程列表
GET  /api/tutorials/:id             # 教程详情
POST /api/tutorials/:id/progress    # 学习进度更新
GET  /api/tutorials/categories      # 教程分类
```

**中台管理:**
- 教程管理：视频上传、分类管理
- 进度监控：用户学习数据分析
- 内容审核：教程质量把控

#### 2.3 数据模型设计
```sql
-- 用户表
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(50),
    avatar TEXT,
    is_active BOOLEAN DEFAULT 1,
    is_verified BOOLEAN DEFAULT 0,
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 非遗内容表
CREATE TABLE encyclopedia_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- history, craft, master
    author_id INTEGER,
    images TEXT, -- JSON格式存储图片URL
    tags TEXT,   -- JSON格式存储标签
    view_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published', -- draft, published, archived
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users (id)
);

-- 视频教程表
CREATE TABLE tutorials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category_id INTEGER,
    duration INTEGER, -- 视频时长（秒）
    difficulty_level INTEGER DEFAULT 1, -- 1-5难度等级
    instructor_id INTEGER,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users (id)
);

-- 学习进度表
CREATE TABLE learning_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tutorial_id INTEGER NOT NULL,
    progress_percent REAL DEFAULT 0, -- 0-100
    last_position INTEGER DEFAULT 0, -- 上次观看位置（秒）
    is_completed BOOLEAN DEFAULT 0,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (tutorial_id) REFERENCES tutorials (id),
    UNIQUE(user_id, tutorial_id)
);
```

### 🌟 第三阶段：社区和商城模块（3-4周）

#### 3.1 社区论坛模块
**API接口:**
```python
GET  /api/community/posts           # 帖子列表
POST /api/community/posts           # 发布帖子
GET  /api/community/posts/:id       # 帖子详情
PUT  /api/community/posts/:id       # 编辑帖子
DELETE /api/community/posts/:id     # 删除帖子

GET  /api/community/posts/:id/comments    # 评论列表
POST /api/community/posts/:id/comments    # 发表评论
POST /api/community/posts/:id/like        # 点赞帖子
```

**中台管理:**
- 内容审核：帖子和评论审核
- 用户管理：社区用户等级和权限
- 数据分析：社区活跃度统计

#### 3.2 文创商城模块
**API接口:**
```python
GET  /api/shop/products             # 商品列表
GET  /api/shop/products/:id         # 商品详情
GET  /api/shop/categories           # 商品分类
POST /api/shop/cart                 # 购物车操作
GET  /api/shop/cart                 # 获取购物车
POST /api/shop/orders               # 创建订单
GET  /api/shop/orders               # 订单列表
```

**中台管理:**
- 商品管理：商品增删改查、库存管理
- 订单管理：订单处理、发货跟踪
- 营销工具：优惠券、促销活动

### 🎮 第四阶段：游戏化和高级功能（2-3周）

#### 4.1 游戏化系统
**API接口:**
```python
GET  /api/game/user/profile         # 用户游戏信息
POST /api/game/checkin              # 每日签到
GET  /api/game/challenges           # 挑战任务列表
POST /api/game/challenges/:id/complete # 完成挑战
GET  /api/game/leaderboard          # 排行榜
```

**功能特性:**
- 积分系统：学习、分享、互动获得积分
- 等级制度：根据积分提升用户等级
- 成就徽章：完成特定任务获得徽章
- 排行榜：用户积分和活跃度排名

#### 4.2 AI智能功能增强
```python
# AI服务集成
class AIService:
    def __init__(self):
        self.cache = {}  # 本地缓存常见问答
        
    async def chat_response(self, message: str, context: str = None):
        """AI聊天回复"""
        # 1. 先检查本地知识库
        if cached_response := self.check_cache(message):
            return cached_response
            
        # 2. 调用AI API（可选集成）
        # response = await self.call_ai_api(message, context)
        
        # 3. 返回默认回复模板
        return self.get_template_response(message)
        
    def check_cache(self, message: str):
        """检查缓存的问答"""
        # 实现关键词匹配和相似度计算
        pass
        
    def get_template_response(self, message: str):
        """获取模板回复"""
        templates = {
            "历史": "绒花起源于唐代，是中华传统手工艺的瑰宝...",
            "工艺": "绒花制作需要经过选材、染色、成型等步骤...",
            "学习": "建议您从基础教程开始，循序渐进地学习..."
        }
        # 实现关键词匹配
        pass
```

### 🛠️ 中台管理系统详细设计

#### 管理员功能模块
```python
# 中台路由结构
admin/
├── dashboard/              # 数据看板
│   ├── 用户统计
│   ├── 内容统计
│   ├── 访问分析
│   └── 收益报告
│
├── users/                  # 用户管理
│   ├── 用户列表
│   ├── 用户详情
│   ├── 权限分配
│   └── 积分管理
│
├── content/                # 内容管理
│   ├── 百科内容
│   ├── 视频教程
│   ├── 社区帖子
│   └── 内容审核
│
├── shop/                   # 商城管理
│   ├── 商品管理
│   ├── 订单处理
│   ├── 库存管理
│   └── 营销活动
│
├── system/                 # 系统设置
│   ├── 基础配置
│   ├── AI配置
│   ├── 缓存管理
│   └── 数据备份
│
└── analytics/              # 数据分析
    ├── 用户行为
    ├── 内容热度
    ├── 转化统计
    └── 自定义报表
```

#### 权限控制系统
```python
# 管理员角色权限
ADMIN_ROLES = {
    'super_admin': ['*'],  # 超级管理员：所有权限
    'content_admin': [     # 内容管理员
        'content.view', 'content.create', 'content.edit', 'content.delete',
        'tutorial.view', 'tutorial.create', 'tutorial.edit'
    ],
    'user_admin': [        # 用户管理员
        'user.view', 'user.edit', 'user.ban',
        'community.moderate'
    ],
    'shop_admin': [        # 商城管理员
        'product.view', 'product.create', 'product.edit',
        'order.view', 'order.process'
    ]
}
```

## 🚀 部署方案

### 开发环境
```bash
# 1. 克隆项目
git clone <repository>
cd ronghua_backend

# 2. 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. 安装依赖
pip install -r requirements.txt

# 4. 初始化数据库
python scripts/init_db.py

# 5. 启动开发服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 生产环境（Docker）
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./data:/app/data
      - ./static:/app/static
    environment:
      - DATABASE_URL=sqlite:///./data/database.db
      - SECRET_KEY=your-secret-key
```

## 📊 开发时间估算

| 阶段     | 模块                   | 预估时间 | 人力需求 |
| -------- | ---------------------- | -------- | -------- |
| 第一阶段 | 基础框架 + 中台搭建    | 2-3周    | 1-2人    |
| 第二阶段 | 百科 + 教程 + 中台功能 | 3-4周    | 1-2人    |
| 第三阶段 | 社区 + 商城 + 管理功能 | 3-4周    | 1-2人    |
| 第四阶段 | 游戏化 + AI + 优化     | 2-3周    | 1人      |

**总计：10-14周完整交付**

## 🎯 优势特点

### SQLite方案优势
1. **零配置部署**：无需安装配置数据库服务
2. **开发便利**：本地开发调试简单
3. **性能优秀**：中小型应用性能表现良好
4. **备份简单**：单文件备份和迁移
5. **成本低廉**：无需额外服务器资源

### 中台管理系统优势
1. **统一管理**：一站式内容和用户管理
2. **数据可视**：丰富的图表和统计分析
3. **权限细分**：灵活的角色权限控制
4. **操作便捷**：直观的管理界面
5. **扩展性强**：模块化设计便于功能扩展

## 📈 后续扩展规划

### 数据库迁移方案
当数据量增长时，可轻松迁移到PostgreSQL：
```python
# 数据迁移脚本
def migrate_to_postgresql():
    # 1. 导出SQLite数据
    # 2. 创建PostgreSQL表结构
    # 3. 导入数据
    # 4. 更新配置文件
    pass
```

### 性能优化方案
1. **缓存策略**：Redis缓存热点数据
2. **CDN加速**：静态资源CDN分发
3. **数据库优化**：索引优化和查询优化
4. **负载均衡**：多实例部署

这个修订方案既保持了技术的先进性，又确保了部署的简便性，特别适合中小型项目的快速启动和迭代开发。
