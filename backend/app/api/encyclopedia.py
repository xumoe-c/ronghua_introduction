from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.auth import success_response

router = APIRouter()

@router.get("/history")
async def get_history_content(db: Session = Depends(get_db)):
    """获取历史内容"""
    mock_data = [
        {
            "id": 1,
            "title": "绒花的起源与发展",
            "content": "绒花起源于唐代宫廷，是一种传统的装饰花卉...",
            "category": "history",
            "view_count": 1520,
            "created_at": "2024-01-15T10:00:00"
        },
        {
            "id": 2,
            "title": "明清时期的绒花工艺",
            "content": "明清时期，绒花工艺达到了前所未有的高度...",
            "category": "history",
            "view_count": 980,
            "created_at": "2024-01-10T14:30:00"
        }
    ]
    return success_response(data=mock_data)

@router.get("/crafts")
async def get_craft_info(db: Session = Depends(get_db)):
    """获取工艺信息"""
    mock_data = [
        {
            "id": 1,
            "title": "传统绒花制作工艺",
            "content": "绒花制作需要经过选材、染色、成型等多个步骤...",
            "category": "craft",
            "steps": [
                "选择优质丝绸材料",
                "调配天然染料",
                "精细的成型工艺",
                "最终的装饰处理"
            ]
        }
    ]
    return success_response(data=mock_data)

@router.get("/masters")
async def get_masters_info(db: Session = Depends(get_db)):
    """获取传承大师信息"""
    mock_data = [
        {
            "id": 1,
            "name": "赵树宪",
            "title": "绒花制作技艺传承人",
            "description": "国家级非物质文化遗产绒花制作技艺代表性传承人...",
            "avatar": "/static/images/master1.jpg",
            "achievements": [
                "国家级非遗传承人",
                "工艺美术大师",
                "从业50余年"
            ]
        }
    ]
    return success_response(data=mock_data)
