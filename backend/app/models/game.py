from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class UserGameProfile(BaseModel):
    """用户游戏档案模型"""
    __tablename__ = "user_game_profiles"
    
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    total_points = Column(Integer, default=0, nullable=False)
    level = Column(Integer, default=1, nullable=False)
    experience = Column(Integer, default=0, nullable=False)
    achievements = Column(Text, nullable=True)  # JSON格式存储成就
    consecutive_days = Column(Integer, default=0, nullable=False)  # 连续签到天数
    last_checkin = Column(DateTime, nullable=True)
    
    # 关系定义
    user = relationship("User", backref="game_profile")

class Challenge(BaseModel):
    """挑战任务模型"""
    __tablename__ = "challenges"
    
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)  # daily, weekly, achievement
    category = Column(String(50), nullable=False)  # learning, social, shop
    points_reward = Column(Integer, nullable=False)
    requirements = Column(Text, nullable=True)  # JSON格式存储完成条件
    is_active = Column(Boolean, default=True, nullable=False)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)

class UserChallenge(BaseModel):
    """用户挑战记录模型"""
    __tablename__ = "user_challenges"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    progress = Column(Integer, default=0, nullable=False)  # 进度
    is_completed = Column(Boolean, default=False, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    points_earned = Column(Integer, default=0, nullable=False)
    
    # 关系定义
    user = relationship("User", backref="user_challenges")
    challenge = relationship("Challenge", backref="user_challenges")

class CheckinRecord(BaseModel):
    """签到记录模型"""
    __tablename__ = "checkin_records"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    checkin_date = Column(DateTime, nullable=False)
    points_earned = Column(Integer, default=10, nullable=False)
    consecutive_days = Column(Integer, default=1, nullable=False)
    
    # 关系定义
    user = relationship("User", backref="checkin_records")

class Achievement(BaseModel):
    """成就模型"""
    __tablename__ = "achievements"
    
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    icon = Column(String(200), nullable=True)
    category = Column(String(50), nullable=False)  # learning, social, points
    requirements = Column(Text, nullable=True)  # JSON格式存储获得条件
    points_reward = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

class UserAchievement(BaseModel):
    """用户成就记录模型"""
    __tablename__ = "user_achievements"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    earned_at = Column(DateTime, nullable=False)
    
    # 关系定义
    user = relationship("User", backref="user_achievements")
    achievement = relationship("Achievement", backref="user_achievements")
