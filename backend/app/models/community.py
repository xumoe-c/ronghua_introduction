from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class Post(BaseModel):
    """社区帖子模型"""
    __tablename__ = "posts"
    
    title = Column(String(200), nullable=False, index=True)
    content = Column(Text, nullable=False)
    category = Column(String(50), nullable=False, index=True)  # discussion, showcase, question
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    images = Column(Text, nullable=True)  # JSON格式存储图片URL
    tags = Column(Text, nullable=True)    # JSON格式存储标签
    view_count = Column(Integer, default=0, nullable=False)
    like_count = Column(Integer, default=0, nullable=False)
    comment_count = Column(Integer, default=0, nullable=False)
    is_pinned = Column(Boolean, default=False, nullable=False)  # 是否置顶
    status = Column(String(20), default="published", nullable=False)  # draft, published, hidden
    
    # 关系定义
    author = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")

class Comment(BaseModel):
    """评论模型"""
    __tablename__ = "comments"
    
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True)  # 回复的评论ID
    content = Column(Text, nullable=False)
    like_count = Column(Integer, default=0, nullable=False)
    status = Column(String(20), default="published", nullable=False)  # published, hidden
    
    # 关系定义
    post = relationship("Post", back_populates="comments")
    author = relationship("User", back_populates="comments")
    parent = relationship("Comment", remote_side="Comment.id", backref="replies")

class Like(BaseModel):
    """点赞记录模型"""
    __tablename__ = "likes"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_type = Column(String(20), nullable=False)  # post, comment, tutorial
    target_id = Column(Integer, nullable=False)
    
    # 关系定义
    user = relationship("User", backref="likes")
