from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """应用配置"""
    
    # 基础配置
    APP_NAME: str = "绒花非遗传承平台API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # 数据库配置
    DATABASE_URL: str = "sqlite:///./data/database.db"
    
    # 安全配置
    SECRET_KEY: str = "ronghua-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7天
    
    # CORS配置
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8080", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080",
        "http://localhost:5500",  # Live Server
        "*"  # 开发环境允许所有域名
    ]
    
    # 文件上传配置
    UPLOAD_DIR: str = "./static/uploads"
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".gif", ".mp4", ".mov"]
    
    # 中台管理配置
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"
    
    # 缓存配置
    CACHE_EXPIRE_TIME: int = 300  # 5分钟
    
    # AI配置（可选）
    OPENAI_API_KEY: str = ""
    AI_ENABLED: bool = False
    
    # 邮件配置（可选）
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# 创建全局设置实例
settings = Settings()

# 确保必要的目录存在
def ensure_directories():
    """确保必要的目录存在"""
    directories = [
        "./data",
        "./static",
        "./static/uploads",
        "./static/uploads/avatars",
        "./static/uploads/content",
        "./static/uploads/products",
        "./templates"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)

# 初始化时创建目录
ensure_directories()
