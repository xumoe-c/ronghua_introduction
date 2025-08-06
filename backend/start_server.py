import os
import sys
import subprocess

# 设置当前目录为backend目录
backend_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(backend_dir)

# 将backend目录添加到Python路径
sys.path.insert(0, backend_dir)

# 设置环境变量
os.environ['PYTHONPATH'] = backend_dir

if __name__ == "__main__":
    # 启动uvicorn服务器
    subprocess.run([
        sys.executable, "-m", "uvicorn", 
        "app.main:app", 
        "--reload", 
        "--host", "127.0.0.1", 
        "--port", "8000"
    ])
