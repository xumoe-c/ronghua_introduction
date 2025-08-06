from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.auth import success_response

router = APIRouter()

@router.get("/posts")
async def get_posts(db: Session = Depends(get_db)):
    """获取帖子列表"""
    mock_data = [
        {
            "id": 1,
            "title": "我的第一个绒花作品",
            "content": "经过一个月的学习，终于完成了我的第一个绒花作品...",
            "category": "showcase",
            "author": {
                "id": 1,
                "username": "手工爱好者",
                "avatar": "/static/images/avatar1.jpg"
            },
            "view_count": 245,
            "like_count": 32,
            "comment_count": 8,
            "created_at": "2024-01-20T16:30:00"
        }
    ]
    return success_response(data=mock_data)

@router.post("/posts")
async def create_post(db: Session = Depends(get_db)):
    """发布帖子"""
    return success_response(message="帖子发布成功")

@router.get("/posts/{post_id}")
async def get_post_detail(post_id: int, db: Session = Depends(get_db)):
    """获取帖子详情"""
    mock_data = {
        "id": post_id,
        "title": "我的第一个绒花作品",
        "content": "详细的制作过程和心得体会...",
        "images": ["/static/images/work1.jpg", "/static/images/work2.jpg"],
        "author": {
            "id": 1,
            "username": "手工爱好者",
            "level": 3
        }
    }
    return success_response(data=mock_data)

@router.get("/posts/{post_id}/comments")
async def get_comments(post_id: int, db: Session = Depends(get_db)):
    """获取评论列表"""
    mock_data = [
        {
            "id": 1,
            "content": "做得真漂亮！能分享一下制作技巧吗？",
            "author": {
                "id": 2,
                "username": "学习者",
                "avatar": "/static/images/avatar2.jpg"
            },
            "like_count": 5,
            "created_at": "2024-01-20T18:00:00"
        }
    ]
    return success_response(data=mock_data)

@router.post("/posts/{post_id}/comments")
async def create_comment(post_id: int, db: Session = Depends(get_db)):
    """发表评论"""
    return success_response(message="评论发表成功")
