from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import http_exception_handler
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CustomHTTPException(HTTPException):
    """自定义HTTP异常"""
    def __init__(self, status_code: int, detail: str, error_code: str = None):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code

async def custom_http_exception_handler(request: Request, exc: HTTPException):
    """自定义HTTP异常处理"""
    logger.error(f"HTTP异常: {exc.status_code} - {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error_code": getattr(exc, 'error_code', f"HTTP_{exc.status_code}"),
            "message": exc.detail,
            "data": None
        }
    )

async def validation_exception_handler(request: Request, exc):
    """参数验证异常处理"""
    logger.error(f"参数验证失败: {exc}")
    
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error_code": "VALIDATION_ERROR",
            "message": "参数验证失败",
            "details": exc.errors() if hasattr(exc, 'errors') else str(exc),
            "data": None
        }
    )

async def general_exception_handler(request: Request, exc: Exception):
    """通用异常处理"""
    logger.error(f"未处理的异常: {type(exc).__name__} - {str(exc)}")
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error_code": "INTERNAL_ERROR",
            "message": "服务器内部错误",
            "data": None
        }
    )

def setup_exception_handlers(app):
    """设置异常处理器"""
    from fastapi.exceptions import RequestValidationError
    from starlette.exceptions import HTTPException as StarletteHTTPException
    
    app.add_exception_handler(HTTPException, custom_http_exception_handler)
    app.add_exception_handler(StarletteHTTPException, custom_http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
