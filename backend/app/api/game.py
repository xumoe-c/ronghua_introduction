from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.auth import success_response

router = APIRouter()

@router.get("/user/profile")
async def get_user_game_profile(db: Session = Depends(get_db)):
    """获取用户游戏信息"""
    mock_data = {
        "user_id": 1,
        "total_points": 1250,
        "level": 5,
        "experience": 750,
        "next_level_exp": 1000,
        "consecutive_days": 7,
        "achievements": [
            {
                "id": 1,
                "name": "初学者",
                "description": "完成第一个教程",
                "icon": "/static/images/achievement1.png"
            }
        ]
    }
    return success_response(data=mock_data)

@router.post("/checkin")
async def daily_checkin(db: Session = Depends(get_db)):
    """每日签到"""
    mock_data = {
        "points_earned": 10,
        "consecutive_days": 8,
        "bonus_points": 5  # 连续签到奖励
    }
    return success_response(data=mock_data, message="签到成功")

@router.get("/challenges")
async def get_challenges(db: Session = Depends(get_db)):
    """获取挑战任务列表"""
    mock_data = [
        {
            "id": 1,
            "title": "学习达人",
            "description": "完成3个视频教程",
            "type": "weekly",
            "category": "learning",
            "points_reward": 50,
            "progress": 2,
            "target": 3,
            "is_completed": False
        },
        {
            "id": 2,
            "title": "社交新星",
            "description": "发布5个帖子",
            "type": "weekly",
            "category": "social",
            "points_reward": 30,
            "progress": 1,
            "target": 5,
            "is_completed": False
        }
    ]
    return success_response(data=mock_data)

@router.post("/challenges/{challenge_id}/complete")
async def complete_challenge(challenge_id: int, db: Session = Depends(get_db)):
    """完成挑战"""
    mock_data = {
        "challenge_id": challenge_id,
        "points_earned": 50,
        "new_achievement": None
    }
    return success_response(data=mock_data, message="挑战完成")

@router.get("/leaderboard")
async def get_leaderboard(db: Session = Depends(get_db)):
    """获取排行榜"""
    mock_data = [
        {
            "rank": 1,
            "user": {
                "id": 2,
                "username": "绒花大师",
                "avatar": "/static/images/avatar2.jpg"
            },
            "points": 5680,
            "level": 12
        },
        {
            "rank": 2,
            "user": {
                "id": 1,
                "username": "手工爱好者",
                "avatar": "/static/images/avatar1.jpg"
            },
            "points": 1250,
            "level": 5
        }
    ]
    return success_response(data=mock_data)

@router.post("/ai/chat")
async def ai_chat(db: Session = Depends(get_db)):
    """AI智能问答"""
    # 这里应该集成到encyclopedia模块，临时放在game模块
    mock_responses = [
        "绒花起源于唐代，是一种传统的装饰花卉，多用于女性头饰。",
        "制作绒花需要选择优质的丝绸材料，经过染色、成型等工序。",
        "学习绒花制作建议从基础教程开始，循序渐进地掌握各种技法。"
    ]
    import random
    response = random.choice(mock_responses)
    
    mock_data = {
        "answer": response,
        "confidence": 0.95,
        "related_content": [
            {"title": "绒花历史", "type": "encyclopedia"},
            {"title": "制作工艺", "type": "tutorial"}
        ]
    }
    return success_response(data=mock_data)
