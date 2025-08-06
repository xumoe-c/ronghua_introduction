from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class EncyclopediaContent(BaseModel):
    """非遗百科内容模型"""
    __tablename__ = "encyclopedia_content"
    
    title = Column(String(200), nullable=False, index=True)
    content = Column(Text, nullable=False)
    category = Column(String(50), nullable=False, index=True)  # history, craft, master
    author_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    images = Column(Text, nullable=True)  # JSON格式存储图片URL
    tags = Column(Text, nullable=True)    # JSON格式存储标签
    view_count = Column(Integer, default=0, nullable=False)
    like_count = Column(Integer, default=0, nullable=False)
    status = Column(String(20), default="published", nullable=False)  # draft, published, archived
    
    # 关系定义
    author = relationship("User", backref="encyclopedia_contents")

class Tutorial(BaseModel):
    """视频教程模型"""
    __tablename__ = "tutorials"
    
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    video_url = Column(Text, nullable=False)
    thumbnail_url = Column(Text, nullable=True)
    category = Column(String(50), nullable=False, index=True)
    duration = Column(Integer, nullable=True)  # 视频时长（秒）
    difficulty_level = Column(Integer, default=1, nullable=False)  # 1-5难度等级
    instructor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    view_count = Column(Integer, default=0, nullable=False)
    like_count = Column(Integer, default=0, nullable=False)
    status = Column(String(20), default="published", nullable=False)
    
    # 关系定义
    instructor = relationship("User", backref="tutorials")
    learning_progress = relationship("LearningProgress", back_populates="tutorial", cascade="all, delete-orphan")

class LearningProgress(BaseModel):
    """学习进度模型"""
    __tablename__ = "learning_progress"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tutorial_id = Column(Integer, ForeignKey("tutorials.id"), nullable=False)
    progress_percent = Column(Integer, default=0, nullable=False)  # 0-100
    last_position = Column(Integer, default=0, nullable=False)  # 上次观看位置（秒）
    is_completed = Column(Boolean, default=False, nullable=False)
    
    # 关系定义
    user = relationship("User", back_populates="learning_progress")
    tutorial = relationship("Tutorial", back_populates="learning_progress")

class AIQuestion(BaseModel):
    """AI问答记录模型"""
    __tablename__ = "ai_questions"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String(50), nullable=True)
    is_helpful = Column(Boolean, nullable=True)  # 用户反馈
    
    # 关系定义
    user = relationship("User", backref="ai_questions")
