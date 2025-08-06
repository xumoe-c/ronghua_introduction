from fastapi import APIRouter, Request, Depends, HTTPException, Form
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.database import get_db
from app.core.config import settings
from app.models.user import User, Admin
from app.models.content import EncyclopediaContent, Tutorial
from app.models.community import Post, Comment
from app.models.shop import Product, Order
from app.models.game import Challenge, Achievement
import json
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter()
templates = Jinja2Templates(directory="templates")

# 模拟管理员会话（生产环境应使用Redis或数据库）
admin_sessions = {}

def check_admin_auth(request: Request):
    """检查管理员认证"""
    session_id = request.cookies.get("admin_session")
    if not session_id or session_id not in admin_sessions:
        raise HTTPException(status_code=401, detail="需要管理员登录")
    return admin_sessions[session_id]

@router.get("/", response_class=HTMLResponse)
async def admin_root(request: Request):
    """管理后台首页重定向"""
    return RedirectResponse(url="/admin/login")

@router.get("/login", response_class=HTMLResponse)
async def admin_login_page(request: Request):
    """管理员登录页面"""
    return templates.TemplateResponse(
        "admin/login.html",
        {"request": request, "title": "管理员登录"}
    )

@router.post("/login")
async def admin_login(
    request: Request,
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    """处理管理员登录"""
    # 简单的用户名密码验证
    if username == settings.ADMIN_USERNAME and password == settings.ADMIN_PASSWORD:
        # 创建会话
        session_id = f"admin_{datetime.now().timestamp()}"
        admin_sessions[session_id] = {
            "username": username,
            "login_time": datetime.now(),
            "role": "super_admin"
        }
        
        # 重定向到仪表板
        response = RedirectResponse(url="/admin/dashboard", status_code=302)
        response.set_cookie("admin_session", session_id, httponly=True)
        return response
    else:
        return templates.TemplateResponse(
            "admin/login.html",
            {
                "request": request,
                "title": "管理员登录",
                "error": "用户名或密码错误"
            }
        )

@router.get("/logout")
async def admin_logout(request: Request):
    """管理员登出"""
    session_id = request.cookies.get("admin_session")
    if session_id and session_id in admin_sessions:
        del admin_sessions[session_id]
    
    response = RedirectResponse(url="/admin/login")
    response.delete_cookie("admin_session")
    return response

@router.get("/dashboard", response_class=HTMLResponse)
async def admin_dashboard(
    request: Request,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """管理仪表板"""
    try:
        # 获取实际统计数据
        stats = {
            "users": db.query(User).count(),
            "content": db.query(EncyclopediaContent).count(),
            "tutorials": db.query(Tutorial).count(),
            "community": db.query(Post).count(),
            "products": db.query(Product).count(),
            "orders": db.query(Order).count()
        }
        
        # 获取最近用户
        recent_users = db.query(User).order_by(desc(User.created_at)).limit(5).all()
        
        # 获取最近帖子
        recent_posts = db.query(Post).order_by(desc(Post.created_at)).limit(5).all()
        
        # 图表数据（简化示例）
        chart_data = {
            "user_labels": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            "user_data": [12, 19, 3, 5, 2, 3, 8],
            "content_labels": ["历史文化", "制作工艺", "文化内涵", "名师介绍"],
            "content_data": [30, 25, 20, 25]
        }
        
        return templates.TemplateResponse(
            "admin/dashboard.html",
            {
                "request": request,
                "title": "管理仪表板",
                "admin_user": admin_user,
                "stats": stats,
                "recent_users": recent_users,
                "recent_posts": recent_posts,
                "chart_data": chart_data
            }
        )
    except Exception as e:
        print(f"Dashboard error: {e}")
        # 返回默认数据以防数据库错误
        stats = {"users": 0, "content": 0, "community": 0, "orders": 0}
        return templates.TemplateResponse(
            "admin/dashboard.html",
            {
                "request": request,
                "title": "管理仪表板",
                "admin_user": admin_user,
                "stats": stats,
                "recent_users": [],
                "recent_posts": [],
                "chart_data": {}
            }
        )

@router.get("/users", response_class=HTMLResponse)
async def admin_users(
    request: Request,
    page: int = 1,
    per_page: int = 20,
    search: Optional[str] = None,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """用户管理页面"""
    try:
        # 构建查询
        query = db.query(User)
        
        # 搜索过滤
        if search:
            query = query.filter(
                (User.username.contains(search)) |
                (User.email.contains(search)) |
                (User.nickname.contains(search))
            )
        
        # 分页
        total = query.count()
        users = query.order_by(desc(User.created_at)).offset((page-1)*per_page).limit(per_page).all()
        
        # 计算分页信息
        total_pages = (total + per_page - 1) // per_page
        
        return templates.TemplateResponse(
            "admin/users.html",
            {
                "request": request,
                "title": "用户管理",
                "admin_user": admin_user,
                "users": users,
                "current_page": page,
                "total_pages": total_pages,
                "total_users": total,
                "search": search or ""
            }
        )
    except Exception as e:
        print(f"Users page error: {e}")
        return templates.TemplateResponse(
            "admin/users.html",
            {
                "request": request,
                "title": "用户管理",
                "admin_user": admin_user,
                "users": [],
                "current_page": 1,
                "total_pages": 1,
                "total_users": 0,
                "search": ""
            }
        )

# 用户管理API接口
@router.post("/users/{user_id}/status")
async def toggle_user_status(
    user_id: int,
    request: Request,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """切换用户状态"""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return JSONResponse({"success": False, "message": "用户不存在"})
        
        user.is_active = not user.is_active
        db.commit()
        
        return JSONResponse({
            "success": True, 
            "message": f"用户已{'激活' if user.is_active else '禁用'}"
        })
    except Exception as e:
        db.rollback()
        return JSONResponse({"success": False, "message": f"操作失败: {str(e)}"})

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """删除用户"""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return JSONResponse({"success": False, "message": "用户不存在"})
        
        db.delete(user)
        db.commit()
        
        return JSONResponse({"success": True, "message": "用户删除成功"})
    except Exception as e:
        db.rollback()
        return JSONResponse({"success": False, "message": f"删除失败: {str(e)}"})

@router.post("/users")
async def create_user(
    request: Request,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """创建新用户"""
    try:
        form_data = await request.json()
        
        # 检查用户名和邮箱是否已存在
        if db.query(User).filter(User.username == form_data["username"]).first():
            return JSONResponse({"success": False, "message": "用户名已存在"})
        
        if form_data.get("email") and db.query(User).filter(User.email == form_data["email"]).first():
            return JSONResponse({"success": False, "message": "邮箱已存在"})
        
        # 创建新用户
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        new_user = User(
            username=form_data["username"],
            email=form_data.get("email"),
            phone=form_data.get("phone"),
            password_hash=pwd_context.hash(form_data["password"]),
            nickname=form_data.get("full_name", form_data["username"]),
            is_active=form_data.get("is_active", "true") == "true",
            created_at=datetime.now()
        )
        
        db.add(new_user)
        db.commit()
        
        return JSONResponse({"success": True, "message": "用户创建成功"})
    except Exception as e:
        db.rollback()
        return JSONResponse({"success": False, "message": f"创建失败: {str(e)}"})

# 内容管理API接口
@router.post("/api/encyclopedia")
async def create_encyclopedia(
    request: Request,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """创建百科内容"""
    try:
        form_data = await request.json()
        
        new_content = EncyclopediaContent(
            title=form_data["title"],
            content=form_data["content"],
            category=form_data["category"],
            tags=form_data.get("tags", ""),
            status="published",
            created_at=datetime.now()
        )
        
        db.add(new_content)
        db.commit()
        
        return JSONResponse({"success": True, "message": "百科内容创建成功"})
    except Exception as e:
        db.rollback()
        return JSONResponse({"success": False, "message": f"创建失败: {str(e)}"})

@router.put("/api/encyclopedia/{content_id}")
async def update_encyclopedia(
    content_id: int,
    request: Request,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """更新百科内容"""
    try:
        form_data = await request.json()
        content = db.query(EncyclopediaContent).filter(EncyclopediaContent.id == content_id).first()
        
        if not content:
            return JSONResponse({"success": False, "message": "内容不存在"})
        
        content.title = form_data["title"]
        content.content = form_data["content"]
        content.category = form_data["category"]
        content.tags = form_data.get("tags", "")
        content.updated_at = datetime.now()
        
        db.commit()
        
        return JSONResponse({"success": True, "message": "百科内容更新成功"})
    except Exception as e:
        db.rollback()
        return JSONResponse({"success": False, "message": f"更新失败: {str(e)}"})

@router.delete("/api/encyclopedia/{content_id}")
async def delete_encyclopedia(
    content_id: int,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """删除百科内容"""
    try:
        content = db.query(EncyclopediaContent).filter(EncyclopediaContent.id == content_id).first()
        if not content:
            return JSONResponse({"success": False, "message": "内容不存在"})
        
        db.delete(content)
        db.commit()
        
        return JSONResponse({"success": True, "message": "百科内容删除成功"})
    except Exception as e:
        db.rollback()
        return JSONResponse({"success": False, "message": f"删除失败: {str(e)}"})

@router.post("/api/tutorials")
async def create_tutorial(
    request: Request,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """创建教程"""
    try:
        form_data = await request.json()
        
        new_tutorial = Tutorial(
            title=form_data["title"],
            description=form_data.get("description", ""),
            video_url=form_data["video_url"],
            category=form_data["category"],
            difficulty_level=int(form_data["difficulty_level"]),
            status="published",
            created_at=datetime.now()
        )
        
        db.add(new_tutorial)
        db.commit()
        
        return JSONResponse({"success": True, "message": "教程创建成功"})
    except Exception as e:
        db.rollback()
        return JSONResponse({"success": False, "message": f"创建失败: {str(e)}"})

# 社区管理API接口
@router.get("/api/posts")
async def get_posts(
    page: int = 1,
    per_page: int = 20,
    status: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """获取帖子列表"""
    try:
        query = db.query(Post)
        
        if status:
            query = query.filter(Post.status == status)
        if category:
            query = query.filter(Post.category == category)
        if search:
            query = query.filter(Post.title.contains(search))
        
        total = query.count()
        posts = query.order_by(desc(Post.created_at)).offset((page-1)*per_page).limit(per_page).all()
        
        posts_data = []
        for post in posts:
            posts_data.append({
                "id": post.id,
                "title": post.title,
                "category": post.category,
                "author": post.author.username if post.author else "匿名",
                "view_count": post.view_count,
                "like_count": post.like_count,
                "comment_count": post.comment_count,
                "status": post.status,
                "created_at": post.created_at.strftime("%Y-%m-%d %H:%M")
            })
        
        return JSONResponse({
            "success": True,
            "data": {
                "posts": posts_data,
                "total": total,
                "page": page,
                "per_page": per_page
            }
        })
    except Exception as e:
        return JSONResponse({"success": False, "message": f"获取失败: {str(e)}"})

@router.put("/api/posts/{post_id}/status")
async def update_post_status(
    post_id: int,
    request: Request,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """更新帖子状态"""
    try:
        form_data = await request.json()
        post = db.query(Post).filter(Post.id == post_id).first()
        
        if not post:
            return JSONResponse({"success": False, "message": "帖子不存在"})
        
        post.status = form_data["status"]
        post.updated_at = datetime.now()
        db.commit()
        
        return JSONResponse({"success": True, "message": "帖子状态更新成功"})
    except Exception as e:
        db.rollback()
        return JSONResponse({"success": False, "message": f"更新失败: {str(e)}"})

# 商品管理API接口
@router.get("/api/products")
async def get_products(
    page: int = 1,
    per_page: int = 20,
    status: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """获取商品列表"""
    try:
        query = db.query(Product)
        
        if status:
            query = query.filter(Product.status == status)
        if category:
            query = query.filter(Product.category == category)
        if search:
            query = query.filter(Product.name.contains(search))
        
        total = query.count()
        products = query.order_by(desc(Product.created_at)).offset((page-1)*per_page).limit(per_page).all()
        
        products_data = []
        for product in products:
            products_data.append({
                "id": product.id,
                "name": product.name,
                "category": product.category,
                "price": product.price,
                "stock": product.stock,
                "sales_count": product.sales_count,
                "status": product.status,
                "created_at": product.created_at.strftime("%Y-%m-%d %H:%M")
            })
        
        return JSONResponse({
            "success": True,
            "data": {
                "products": products_data,
                "total": total,
                "page": page,
                "per_page": per_page
            }
        })
    except Exception as e:
        return JSONResponse({"success": False, "message": f"获取失败: {str(e)}"})

@router.post("/api/products")
async def create_product(
    request: Request,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """创建商品"""
    try:
        form_data = await request.json()
        
        new_product = Product(
            name=form_data["name"],
            description=form_data.get("description", ""),
            category=form_data["category"],
            price=float(form_data["price"]),
            original_price=float(form_data.get("original_price", form_data["price"])),
            stock=int(form_data["stock"]),
            status="available",
            created_at=datetime.now()
        )
        
        db.add(new_product)
        db.commit()
        
        return JSONResponse({"success": True, "message": "商品创建成功"})
    except Exception as e:
        db.rollback()
        return JSONResponse({"success": False, "message": f"创建失败: {str(e)}"})

# 订单管理API接口
@router.get("/api/orders")
async def get_orders(
    page: int = 1,
    per_page: int = 20,
    status: Optional[str] = None,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """获取订单列表"""
    try:
        query = db.query(Order)
        
        if status:
            query = query.filter(Order.status == status)
        
        total = query.count()
        orders = query.order_by(desc(Order.created_at)).offset((page-1)*per_page).limit(per_page).all()
        
        orders_data = []
        for order in orders:
            orders_data.append({
                "id": order.id,
                "order_no": order.order_no,
                "user": order.user.username if order.user else "未知用户",
                "total_amount": order.total_amount,
                "status": order.status,
                "payment_status": order.payment_status,
                "created_at": order.created_at.strftime("%Y-%m-%d %H:%M")
            })
        
        return JSONResponse({
            "success": True,
            "data": {
                "orders": orders_data,
                "total": total,
                "page": page,
                "per_page": per_page
            }
        })
    except Exception as e:
        return JSONResponse({"success": False, "message": f"获取失败: {str(e)}"})

@router.put("/api/orders/{order_id}/status")
async def update_order_status(
    order_id: int,
    request: Request,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """更新订单状态"""
    try:
        form_data = await request.json()
        order = db.query(Order).filter(Order.id == order_id).first()
        
        if not order:
            return JSONResponse({"success": False, "message": "订单不存在"})
        
        order.status = form_data["status"]
        order.updated_at = datetime.now()
        db.commit()
        
        return JSONResponse({"success": True, "message": "订单状态更新成功"})
    except Exception as e:
        db.rollback()
        return JSONResponse({"success": False, "message": f"更新失败: {str(e)}"})

# 统计数据API
@router.get("/api/stats")
async def get_stats(
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """获取统计数据"""
    try:
        # 用户统计
        total_users = db.query(User).count()
        active_users = db.query(User).filter(User.is_active == True).count()
        today_users = db.query(User).filter(
            func.date(User.created_at) == datetime.now().date()
        ).count()
        
        # 内容统计
        total_encyclopedia = db.query(EncyclopediaContent).count()
        total_tutorials = db.query(Tutorial).count()
        
        # 社区统计
        total_posts = db.query(Post).count()
        total_comments = db.query(Comment).count()
        pending_posts = db.query(Post).filter(Post.status == "pending").count()
        
        # 商城统计
        total_products = db.query(Product).count()
        total_orders = db.query(Order).count()
        pending_orders = db.query(Order).filter(Order.status == "pending").count()
        
        # 本周用户注册趋势
        week_data = []
        for i in range(7):
            day = datetime.now().date() - timedelta(days=6-i)
            count = db.query(User).filter(func.date(User.created_at) == day).count()
            week_data.append(count)
        
        return JSONResponse({
            "success": True,
            "data": {
                "users": {
                    "total": total_users,
                    "active": active_users,
                    "today": today_users
                },
                "content": {
                    "encyclopedia": total_encyclopedia,
                    "tutorials": total_tutorials
                },
                "community": {
                    "posts": total_posts,
                    "comments": total_comments,
                    "pending_posts": pending_posts
                },
                "shop": {
                    "products": total_products,
                    "orders": total_orders,
                    "pending_orders": pending_orders
                },
                "trends": {
                    "week_users": week_data
                }
            }
        })
    except Exception as e:
        return JSONResponse({"success": False, "message": f"获取统计失败: {str(e)}"})

@router.get("/content", response_class=HTMLResponse)
async def admin_content(
    request: Request,
    page: int = 1,
    per_page: int = 20,
    content_type: str = "all",
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """内容管理页面"""
    try:
        # 获取百科内容
        encyclopedia_query = db.query(EncyclopediaContent)
        encyclopedia_total = encyclopedia_query.count()
        encyclopedia_contents = encyclopedia_query.order_by(desc(EncyclopediaContent.created_at)).limit(10).all()
        
        # 获取教程内容
        tutorial_query = db.query(Tutorial)
        tutorial_total = tutorial_query.count()
        tutorials = tutorial_query.order_by(desc(Tutorial.created_at)).limit(10).all()
        
        return templates.TemplateResponse(
            "admin/content.html",
            {
                "request": request,
                "title": "内容管理",
                "admin_user": admin_user,
                "encyclopedia_contents": encyclopedia_contents,
                "tutorials": tutorials,
                "encyclopedia_total": encyclopedia_total,
                "tutorial_total": tutorial_total
            }
        )
    except Exception as e:
        print(f"Content page error: {e}")
        return templates.TemplateResponse(
            "admin/content.html",
            {
                "request": request,
                "title": "内容管理",
                "admin_user": admin_user,
                "encyclopedia_contents": [],
                "tutorials": [],
                "encyclopedia_total": 0,
                "tutorial_total": 0
            }
        )

@router.get("/shop", response_class=HTMLResponse)
async def admin_shop(
    request: Request,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """商城管理页面"""
    try:
        # 获取商品数据
        products = db.query(Product).order_by(desc(Product.created_at)).limit(20).all()
        
        # 获取订单数据
        orders = db.query(Order).order_by(desc(Order.created_at)).limit(20).all()
        
        # 统计数据
        product_stats = {
            "total_products": db.query(Product).count(),
            "active_products": db.query(Product).filter(Product.status == "available").count(),
            "total_orders": db.query(Order).count(),
            "pending_orders": db.query(Order).filter(Order.status == "pending").count()
        }
        
        return templates.TemplateResponse(
            "admin/shop.html",
            {
                "request": request,
                "title": "商城管理",
                "admin_user": admin_user,
                "products": products,
                "orders": orders,
                "stats": product_stats
            }
        )
    except Exception as e:
        print(f"Shop page error: {e}")
        return templates.TemplateResponse(
            "admin/shop.html",
            {
                "request": request,
                "title": "商城管理",
                "admin_user": admin_user,
                "products": [],
                "orders": [],
                "stats": {"total_products": 0, "active_products": 0, "total_orders": 0, "pending_orders": 0}
            }
        )

@router.get("/settings", response_class=HTMLResponse)
async def admin_settings(
    request: Request,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """系统设置页面"""
    # 模拟系统配置
    system_config = {
        "site_name": "绒花非遗传承平台",
        "site_description": "传承中华非遗文化",
        "upload_max_size": "5MB",
        "ai_enabled": False,
        "email_enabled": False
    }
    
    return templates.TemplateResponse(
        "admin/settings.html",
        {
            "request": request,
            "title": "系统设置",
            "admin_user": admin_user,
            "config": system_config
        }
    )


@router.get("/community", response_class=HTMLResponse)
async def admin_community(
    request: Request,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """社区管理页面"""
    community_stats = {
        'total_posts': 1256,
        'total_comments': 4892,
        'today_posts': 15,
        'pending_posts': 8
    }
    
    return templates.TemplateResponse(
        "admin/community.html",
        {
            "request": request,
            "title": "社区管理",
            "admin_user": admin_user,
            "community_stats": community_stats
        }
    )


@router.get("/games", response_class=HTMLResponse)
async def admin_games(
    request: Request,
    admin_user=Depends(check_admin_auth),
    db: Session = Depends(get_db)
):
    """游戏管理页面"""
    game_stats = {
        'total_games': 15,
        'active_games': 12,
        'game_records': 3268,
        'active_players': 486
    }
    
    return templates.TemplateResponse(
        "admin/games.html",
        {
            "request": request,
            "title": "游戏管理",
            "admin_user": admin_user,
            "game_stats": game_stats
        }
    )
