from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.auth import success_response

router = APIRouter()

@router.get("/products")
async def get_products(db: Session = Depends(get_db)):
    """获取商品列表"""
    mock_data = [
        {
            "id": 1,
            "name": "手工绒花发簪",
            "description": "精美的传统绒花发簪，采用优质丝绸制作",
            "category": "handicraft",
            "price": 128.00,
            "original_price": 168.00,
            "stock": 20,
            "images": ["/static/images/product1.jpg"],
            "rating": 4.8,
            "sales_count": 156
        }
    ]
    return success_response(data=mock_data)

@router.get("/products/{product_id}")
async def get_product_detail(product_id: int, db: Session = Depends(get_db)):
    """获取商品详情"""
    mock_data = {
        "id": product_id,
        "name": "手工绒花发簪",
        "description": "这款发簪采用传统绒花工艺制作...",
        "specifications": {
            "材质": "优质丝绸",
            "尺寸": "长度12cm",
            "重量": "15g",
            "产地": "南京"
        },
        "images": [
            "/static/images/product1_1.jpg",
            "/static/images/product1_2.jpg"
        ]
    }
    return success_response(data=mock_data)

@router.get("/categories")
async def get_categories(db: Session = Depends(get_db)):
    """获取商品分类"""
    mock_data = [
        {"id": 1, "name": "手工制品", "code": "handicraft"},
        {"id": 2, "name": "教程书籍", "code": "book"},
        {"id": 3, "name": "数字内容", "code": "digital"}
    ]
    return success_response(data=mock_data)

@router.post("/cart")
async def add_to_cart(db: Session = Depends(get_db)):
    """添加到购物车"""
    return success_response(message="已添加到购物车")

@router.get("/cart")
async def get_cart(db: Session = Depends(get_db)):
    """获取购物车"""
    mock_data = [
        {
            "id": 1,
            "product": {
                "id": 1,
                "name": "手工绒花发簪",
                "price": 128.00,
                "image": "/static/images/product1.jpg"
            },
            "quantity": 2
        }
    ]
    return success_response(data=mock_data)

@router.post("/orders")
async def create_order(db: Session = Depends(get_db)):
    """创建订单"""
    return success_response(
        data={"order_no": "RH202401200001"},
        message="订单创建成功"
    )

@router.get("/orders")
async def get_orders(db: Session = Depends(get_db)):
    """获取订单列表"""
    mock_data = [
        {
            "id": 1,
            "order_no": "RH202401200001",
            "total_amount": 256.00,
            "status": "paid",
            "created_at": "2024-01-20T10:00:00",
            "items": [
                {
                    "product_name": "手工绒花发簪",
                    "quantity": 2,
                    "price": 128.00
                }
            ]
        }
    ]
    return success_response(data=mock_data)
