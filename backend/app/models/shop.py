from sqlalchemy import Column, Integer, String, Text, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class Product(BaseModel):
    """商品模型"""
    __tablename__ = "products"
    
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False, index=True)  # handicraft, book, digital
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)  # 原价（用于显示折扣）
    stock = Column(Integer, default=0, nullable=False)
    images = Column(Text, nullable=True)  # JSON格式存储图片URL
    tags = Column(Text, nullable=True)    # JSON格式存储标签
    specifications = Column(Text, nullable=True)  # JSON格式存储规格参数
    view_count = Column(Integer, default=0, nullable=False)
    sales_count = Column(Integer, default=0, nullable=False)
    rating = Column(Float, default=0.0, nullable=False)  # 评分 0-5
    is_featured = Column(Boolean, default=False, nullable=False)  # 是否精选
    status = Column(String(20), default="active", nullable=False)  # active, inactive, out_of_stock
    
    # 关系定义
    order_items = relationship("OrderItem", back_populates="product")

class Cart(BaseModel):
    """购物车模型"""
    __tablename__ = "carts"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    
    # 关系定义
    user = relationship("User", backref="cart_items")
    product = relationship("Product", backref="cart_items")

class Order(BaseModel):
    """订单模型"""
    __tablename__ = "orders"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_no = Column(String(50), unique=True, nullable=False, index=True)
    total_amount = Column(Float, nullable=False)
    status = Column(String(20), default="pending", nullable=False)  # pending, paid, shipped, completed, cancelled
    payment_method = Column(String(20), nullable=True)  # wechat, alipay, card
    payment_status = Column(String(20), default="unpaid", nullable=False)  # unpaid, paid, refunded
    shipping_address = Column(Text, nullable=True)  # JSON格式存储收货地址
    shipping_fee = Column(Float, default=0.0, nullable=False)
    notes = Column(Text, nullable=True)
    
    # 关系定义
    user = relationship("User", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(BaseModel):
    """订单项模型"""
    __tablename__ = "order_items"
    
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)  # 下单时的价格
    
    # 关系定义
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")
