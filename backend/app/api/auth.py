from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.config import settings
import json

router = APIRouter()
security = HTTPBearer()

# 标准响应格式
def success_response(data=None, message="操作成功"):
    """成功响应格式"""
    return {
        "success": True,
        "message": message,
        "data": data
    }

def error_response(message="操作失败", error_code="ERROR"):
    """错误响应格式"""
    return {
        "success": False,
        "error_code": error_code,
        "message": message,
        "data": None
    }

@router.post("/login")
async def login(db: Session = Depends(get_db)):
    """用户登录"""
    # 模拟登录逻辑
    return success_response(
        data={
            "token": "mock_jwt_token",
            "user": {
                "id": 1,
                "username": "demo_user",
                "email": "demo@example.com",
                "nickname": "演示用户"
            }
        },
        message="登录成功"
    )

@router.post("/register")
async def register(db: Session = Depends(get_db)):
    """用户注册"""
    # 模拟注册逻辑
    return success_response(
        data={
            "user_id": 1
        },
        message="注册成功"
    )

@router.post("/send-code")
async def send_verification_code():
    """发送验证码"""
    # 模拟发送验证码
    return success_response(message="验证码已发送")

@router.get("/profile")
async def get_profile(db: Session = Depends(get_db)):
    """获取用户信息"""
    # 模拟获取用户信息
    return success_response(
        data={
            "id": 1,
            "username": "demo_user",
            "email": "demo@example.com",
            "nickname": "演示用户",
            "avatar": None,
            "points": 100,
            "level": 2
        }
    )

@router.put("/profile")
async def update_profile(db: Session = Depends(get_db)):
    """更新用户信息"""
    # 模拟更新用户信息
    return success_response(message="用户信息更新成功")
