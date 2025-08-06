from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
import os

# 确保数据目录存在
os.makedirs("./data", exist_ok=True)

# 创建SQLite引擎
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False},  # SQLite特有配置
    echo=settings.DEBUG  # 开发环境显示SQL语句
)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基础模型类
Base = declarative_base()

# 数据库元数据
metadata = MetaData()

def get_db():
    """获取数据库会话"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """创建所有数据库表"""
    # 导入所有模型以确保表被创建
    from app.models import user, content, community, shop, game
    
    # 创建所有表
    Base.metadata.create_all(bind=engine)
    
def drop_tables():
    """删除所有数据库表（谨慎使用）"""
    Base.metadata.drop_all(bind=engine)

def reset_database():
    """重置数据库（删除并重新创建所有表）"""
    drop_tables()
    create_tables()
