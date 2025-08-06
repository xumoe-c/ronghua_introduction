from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.auth import success_response

router = APIRouter()

@router.get("/list")
async def get_tutorial_list(db: Session = Depends(get_db)):
    """获取教程列表"""
    mock_data = [
        {
            "id": 1,
            "title": "绒花制作入门教程",
            "description": "从零开始学习绒花制作的基础技法",
            "video_url": "/static/videos/tutorial1.mp4",
            "thumbnail_url": "/static/images/tutorial1.jpg",
            "duration": 1800,
            "difficulty_level": 1,
            "view_count": 2340,
            "like_count": 189
        }
    ]
    return success_response(data=mock_data)

@router.get("/{tutorial_id}")
async def get_tutorial_detail(tutorial_id: int, db: Session = Depends(get_db)):
    """获取教程详情"""
    mock_data = {
        "id": tutorial_id,
        "title": "绒花制作入门教程",
        "description": "详细介绍绒花制作的每一个步骤...",
        "video_url": "/static/videos/tutorial1.mp4",
        "chapters": [
            {"title": "材料准备", "start_time": 0},
            {"title": "基础技法", "start_time": 300},
            {"title": "成型技巧", "start_time": 900}
        ]
    }
    return success_response(data=mock_data)

@router.post("/{tutorial_id}/progress")
async def update_progress(tutorial_id: int, db: Session = Depends(get_db)):
    """更新学习进度"""
    return success_response(message="学习进度已更新")
