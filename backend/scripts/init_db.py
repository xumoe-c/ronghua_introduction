#!/usr/bin/env python3
"""
数据库初始化脚本
创建所有数据表并插入初始数据
"""

import sys
import os
from pathlib import Path

# 添加项目根目录到Python路径
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from app.database import engine, Base, SessionLocal
from app.models.user import User, Admin
from app.models.content import Tutorial, EncyclopediaContent
from app.models.community import Post, Comment
from app.models.shop import Product, Order, OrderItem
from app.models.game import Challenge, Achievement
from app.core.config import settings
from passlib.context import CryptContext
from datetime import datetime, timedelta

# 密码加密
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_tables():
    """创建所有数据表"""
    print("创建数据表...")
    Base.metadata.create_all(bind=engine)
    print("数据表创建完成！")

def create_admin_user():
    """创建管理员用户"""
    print("创建管理员用户...")
    
    db = SessionLocal()
    try:
        # 检查管理员是否已存在
        existing_admin = db.query(Admin).filter(Admin.username == settings.ADMIN_USERNAME).first()
        if existing_admin:
            print("管理员用户已存在，跳过创建")
            return
        
        # 创建管理员
        hashed_password = pwd_context.hash(settings.ADMIN_PASSWORD)
        admin = Admin(
            username=settings.ADMIN_USERNAME,
            password_hash=hashed_password,
            name="系统管理员",
            role="super_admin",
            is_active=True,
            created_at=datetime.utcnow()
        )
        
        db.add(admin)
        db.commit()
        print(f"管理员用户创建成功: {settings.ADMIN_USERNAME}")
        
    except Exception as e:
        print(f"创建管理员用户失败: {e}")
        db.rollback()
    finally:
        db.close()

def create_sample_data():
    """创建示例数据"""
    print("创建示例数据...")
    
    db = SessionLocal()
    try:
        # 检查是否已有数据
        user_count = db.query(User).count()
        if user_count > 0:
            print("数据库已有数据，跳过示例数据创建")
            return
        
        # 创建示例用户
        users = []
        for i in range(5):
            user = User(
                username=f"user{i+1}",
                email=f"user{i+1}@example.com",
                password_hash=pwd_context.hash("password123"),
                nickname=f"用户{i+1}",
                phone=f"1380000000{i}",
                is_active=True,
                created_at=datetime.utcnow() - timedelta(days=i)
            )
            users.append(user)
        
        db.add_all(users)
        db.commit()
        
        # 刷新用户ID
        for user in users:
            db.refresh(user)
        
        # 创建示例百科内容
        encyclopedias = [
            EncyclopediaContent(
                title="绒花的历史起源",
                content="绒花是一种传统的中国手工艺品，历史悠久...",
                category="历史文化",
                author_id=users[0].id,
                status="published",
                created_at=datetime.utcnow() - timedelta(days=10)
            ),
            EncyclopediaContent(
                title="绒花制作工艺",
                content="绒花的制作需要经过多道工序...",
                category="制作工艺",
                author_id=users[1].id,
                status="published",
                created_at=datetime.utcnow() - timedelta(days=8)
            ),
            EncyclopediaContent(
                title="绒花的文化意义",
                content="绒花不仅是装饰品，更承载着深厚的文化内涵...",
                category="文化内涵",
                author_id=users[0].id,
                status="published",
                created_at=datetime.utcnow() - timedelta(days=5)
            )
        ]
        
        db.add_all(encyclopedias)
        
        # 创建示例教程
        tutorials = [
            Tutorial(
                title="绒花基础制作教程",
                description="本教程将带您学习绒花制作的基本技巧...",
                video_url="https://example.com/video1.mp4",
                category="基础教程",
                difficulty_level=1,
                duration=1800,
                instructor_id=users[1].id,
                status="published",
                created_at=datetime.utcnow() - timedelta(days=7)
            ),
            Tutorial(
                title="高级绒花技巧",
                description="进阶技巧让您的绒花作品更加精美...",
                video_url="https://example.com/video2.mp4",
                category="进阶教程",
                difficulty_level=4,
                duration=3600,
                instructor_id=users[2].id,
                status="published",
                created_at=datetime.utcnow() - timedelta(days=3)
            )
        ]
        
        db.add_all(tutorials)
        
        # 创建示例社区帖子
        posts = [
            Post(
                title="我的第一朵绒花作品",
                content="今天完成了人生中第一朵绒花，虽然不太完美但很有成就感！",
                category="作品展示",
                author_id=users[2].id,
                created_at=datetime.utcnow() - timedelta(days=2)
            ),
            Post(
                title="绒花制作经验分享",
                content="制作绒花三年了，分享一些心得体会...",
                category="经验分享",
                author_id=users[3].id,
                created_at=datetime.utcnow() - timedelta(days=1)
            )
        ]
        
        db.add_all(posts)
        
        # 创建示例商品
        shop_items = [
            Product(
                name="精美绒花发饰",
                description="手工制作的精美绒花发饰，适合各种场合佩戴",
                price=88.00,
                category="发饰",
                stock=50,
                status="available",
                created_at=datetime.utcnow() - timedelta(days=15)
            ),
            Product(
                name="绒花制作工具套装",
                description="专业的绒花制作工具，包含剪刀、镊子等必备工具",
                price=158.00,
                category="工具",
                stock=30,
                status="available",
                created_at=datetime.utcnow() - timedelta(days=12)
            ),
            Product(
                name="绒花材料包",
                description="优质绒花制作材料，多种颜色可选",
                price=36.00,
                category="材料",
                stock=100,
                status="available",
                created_at=datetime.utcnow() - timedelta(days=10)
            )
        ]
        
        db.add_all(shop_items)
        
        # 创建示例挑战和成就
        challenges = [
            Challenge(
                title="绒花记忆配对",
                description="通过配对游戏学习绒花知识",
                type="记忆游戏",
                category="学习挑战",
                points_reward=10,
                is_active=True,
                created_at=datetime.utcnow() - timedelta(days=20)
            ),
            Challenge(
                title="绒花知识问答",
                description="测试您对绒花文化的了解程度",
                type="问答游戏",
                category="学习挑战",
                points_reward=20,
                is_active=True,
                created_at=datetime.utcnow() - timedelta(days=18)
            )
        ]
        
        achievements = [
            Achievement(
                name="初次尝试",
                description="完成第一个挑战",
                icon="achievement_first.png",
                category="学习成就",
                points_reward=10,
                is_active=True,
                created_at=datetime.utcnow() - timedelta(days=20)
            ),
            Achievement(
                name="知识达人",
                description="累计获得100积分",
                icon="achievement_master.png",
                category="积分成就",
                points_reward=100,
                is_active=True,
                created_at=datetime.utcnow() - timedelta(days=18)
            )
        ]
        
        db.add_all(challenges)
        db.add_all(achievements)
        db.commit()
        
        print("示例数据创建成功！")
        print(f"- 创建用户: {len(users)} 个")
        print(f"- 创建百科: {len(encyclopedias)} 篇")
        print(f"- 创建教程: {len(tutorials)} 个")
        print(f"- 创建帖子: {len(posts)} 个")
        print(f"- 创建商品: {len(shop_items)} 个")
        print(f"- 创建挑战: {len(challenges)} 个")
        print(f"- 创建成就: {len(achievements)} 个")
        
    except Exception as e:
        print(f"创建示例数据失败: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """主函数"""
    print("=" * 50)
    print("绒花非遗传承平台 - 数据库初始化")
    print("=" * 50)
    
    try:
        # 创建数据表
        create_tables()
        
        # 创建管理员用户
        create_admin_user()
        
        # 创建示例数据
        create_sample_data()
        
        print("\n" + "=" * 50)
        print("数据库初始化完成！")
        print(f"数据库文件位置: {settings.DATABASE_URL}")
        print(f"管理员账号: {settings.ADMIN_USERNAME}")
        print(f"管理员密码: {settings.ADMIN_PASSWORD}")
        print("=" * 50)
        
    except Exception as e:
        print(f"数据库初始化失败: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
