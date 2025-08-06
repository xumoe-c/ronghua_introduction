# 绒花非遗传承平台 - Docker部署方案

FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 复制后端代码
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# 安装Python依赖
RUN pip install --no-cache-dir -r backend/requirements.txt

# 创建必要目录
RUN mkdir -p backend/data && \
    mkdir -p backend/static/uploads/avatars && \
    mkdir -p backend/static/uploads/content && \
    mkdir -p backend/static/uploads/products

# 复制启动脚本
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 暴露端口
EXPOSE 8000 8080

# 设置环境变量
ENV PYTHONPATH=/app/backend
ENV DATABASE_URL=sqlite:///./data/database.db
ENV ADMIN_USERNAME=admin
ENV ADMIN_PASSWORD=admin123

# 启动服务
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["all"]
