from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import os
import sys

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.core.exceptions import setup_exception_handlers
from app.database import engine, create_tables
from app.api import auth, encyclopedia, tutorial, community, shop, game
from app.admin import routes as admin_routes

# 创建FastAPI应用
app = FastAPI(
    title="绒花非遗传承平台API",
    description="基于FastAPI的轻量级后端服务，支持用户端和中台管理",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS中间件配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 静态文件服务
app.mount("/static", StaticFiles(directory="static"), name="static")

# 模板配置
templates = Jinja2Templates(directory="templates")

# 异常处理
setup_exception_handlers(app)

# API路由注册
app.include_router(auth.router, prefix="/api/auth", tags=["认证"])
app.include_router(encyclopedia.router, prefix="/api/encyclopedia", tags=["非遗百科"])
app.include_router(tutorial.router, prefix="/api/tutorial", tags=["视频教程"])
app.include_router(community.router, prefix="/api/community", tags=["社区论坛"])
app.include_router(shop.router, prefix="/api/shop", tags=["文创商城"])
app.include_router(game.router, prefix="/api/game", tags=["游戏化"])

# 中台管理路由
app.include_router(admin_routes.router, prefix="/admin", tags=["中台管理"])

@app.on_event("startup")
async def startup_event():
    """应用启动时的初始化"""
    # 创建数据库表
    create_tables()
    print("✅ 数据库表创建完成")
    print(f"🚀 应用启动成功，访问地址：")
    print(f"   - API文档: http://localhost:8000/docs")
    print(f"   - 中台管理: http://localhost:8000/admin")

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    """根路径重定向到API文档"""
    return templates.TemplateResponse(
        "index.html", 
        {"request": request, "title": "绒花非遗传承平台API"}
    )

@app.get("/health")
async def health_check():
    """健康检查接口"""
    return {
        "status": "healthy",
        "message": "绒花非遗传承平台API运行正常",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
