// 通用JavaScript工具函数和全局配置

// 全局配置
const CONFIG = {
    API_BASE_URL: 'https://api.ronghua-heritage.com',
    IMG_BASE_URL: 'https://cdn.ronghua-heritage.com',
    VERSION: '1.0.0'
};

// 工具函数
const Utils = {
    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function () {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function () {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    },

    // 格式化日期
    formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },

    // 验证手机号
    validatePhone(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
    },

    // 验证邮箱
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // 验证密码强度
    validatePassword(password) {
        // 至少8位，包含大小写字母和数字
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    },

    // 生成随机字符串
    generateRandomString(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    // 本地存储操作
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Storage set error:', error);
                return false;
            }
        },

        get(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error('Storage get error:', error);
                return null;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Storage remove error:', error);
                return false;
            }
        },

        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Storage clear error:', error);
                return false;
            }
        }
    }
};

// HTTP请求封装
const Http = {
    // GET请求
    async get(url, params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const fullUrl = queryString ? `${CONFIG.API_BASE_URL}${url}?${queryString}` : `${CONFIG.API_BASE_URL}${url}`;

            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthHeader()
                }
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('GET request error:', error);
            throw error;
        }
    },

    // POST请求
    async post(url, data = {}) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthHeader()
                },
                body: JSON.stringify(data)
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('POST request error:', error);
            throw error;
        }
    },

    // PUT请求
    async put(url, data = {}) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${url}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthHeader()
                },
                body: JSON.stringify(data)
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('PUT request error:', error);
            throw error;
        }
    },

    // DELETE请求
    async delete(url) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${url}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthHeader()
                }
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('DELETE request error:', error);
            throw error;
        }
    },

    // 文件上传
    async upload(url, file, onProgress = null) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();

            return new Promise((resolve, reject) => {
                xhr.upload.addEventListener('progress', (e) => {
                    if (onProgress && e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(percentComplete);
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new Error('Upload failed'));
                });

                xhr.open('POST', `${CONFIG.API_BASE_URL}${url}`);
                xhr.setRequestHeader('Authorization', this.getAuthHeader());
                xhr.send(formData);
            });
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    },

    // 获取认证头
    getAuthHeader() {
        const token = Utils.storage.get('auth_token');
        return token ? `Bearer ${token}` : '';
    },

    // 处理响应
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
};

// 消息提示系统
const Message = {
    show(text, type = 'info', duration = 3000) {
        const messageContainer = this.getContainer();
        const messageElement = document.createElement('div');

        messageElement.className = `message ${type}`;
        messageElement.textContent = text;

        messageContainer.appendChild(messageElement);

        // 自动移除
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, duration);

        // 点击移除
        messageElement.addEventListener('click', () => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        });
    },

    success(text, duration) {
        this.show(text, 'success', duration);
    },

    error(text, duration) {
        this.show(text, 'error', duration);
    },

    warning(text, duration) {
        this.show(text, 'warning', duration);
    },

    getContainer() {
        let container = document.getElementById('message-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'message-container';
            container.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 9999;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        return container;
    }
};

// 加载状态管理
const Loading = {
    show(target = document.body) {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading-overlay';
        loadingElement.innerHTML = `
            <div class="loading-spinner">
                <div class="loading"></div>
                <p>加载中...</p>
            </div>
        `;
        loadingElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;

        if (target === document.body) {
            document.body.appendChild(loadingElement);
        } else {
            target.style.position = 'relative';
            loadingElement.style.position = 'absolute';
            target.appendChild(loadingElement);
        }

        return loadingElement;
    },

    hide(loadingElement) {
        if (loadingElement && loadingElement.parentNode) {
            loadingElement.parentNode.removeChild(loadingElement);
        }
    }
};

// 模态框管理
const Modal = {
    show(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // 点击背景关闭
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hide(modalId);
                }
            });
        }
    },

    hide(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
};

// 用户认证管理
const Auth = {
    // 获取当前用户信息
    getCurrentUser() {
        return Utils.storage.get('current_user');
    },

    // 设置当前用户信息
    setCurrentUser(user) {
        Utils.storage.set('current_user', user);
    },

    // 获取认证token
    getToken() {
        return Utils.storage.get('auth_token');
    },

    // 设置认证token
    setToken(token) {
        Utils.storage.set('auth_token', token);
    },

    // 检查是否已登录
    isLoggedIn() {
        return !!this.getToken();
    },

    // 登出
    logout() {
        Utils.storage.remove('current_user');
        Utils.storage.remove('auth_token');
        window.location.reload();
    }
};

// 页面滚动工具
const Scroll = {
    // 平滑滚动到指定元素
    toElement(elementId, offset = 0) {
        const element = document.getElementById(elementId);
        if (element) {
            const targetPosition = element.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },

    // 平滑滚动到顶部
    toTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },

    // 监听滚动事件
    onScroll(callback) {
        const throttledCallback = Utils.throttle(callback, 100);
        window.addEventListener('scroll', throttledCallback);
        return () => window.removeEventListener('scroll', throttledCallback);
    }
};

// DOM ready
function domReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

// 导出全局对象（如果需要的话）
window.RonghuaApp = {
    CONFIG,
    Utils,
    Http,
    Message,
    Loading,
    Modal,
    Auth,
    Scroll,
    domReady
};

// 全局错误处理
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    Message.error('系统异常，请稍后重试');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    Message.error('网络请求失败，请检查网络连接');
});

// 导航相关功能
const Navigation = {
    // 切换移动端菜单
    toggleMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
        const navOverlay = document.querySelector('.nav-overlay');
        const body = document.body;

        if (navMenuWrapper.classList.contains('active')) {
            this.closeMobileMenu();
        } else {
            navMenuWrapper.classList.add('active');
            navOverlay.classList.add('active');
            navToggle.classList.add('active');
            body.classList.add('nav-open');
            navToggle.setAttribute('aria-expanded', 'true');
        }
    },

    // 关闭移动端菜单
    closeMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
        const navOverlay = document.querySelector('.nav-overlay');
        const body = document.body;

        navMenuWrapper.classList.remove('active');
        navOverlay.classList.remove('active');
        navToggle.classList.remove('active');
        body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
    },

    // 初始化导航
    init() {
        // 处理导航链接点击
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                // 如果是移动端，点击链接后关闭菜单
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        this.closeMobileMenu();
                    }, 100);
                }
            });
        });

        // 处理窗口大小变化
        window.addEventListener('resize', Utils.throttle(() => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        }, 250));

        // ESC键关闭菜单
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }
};

// 用户认证相关功能
const UserAuth = {
    // 显示登录模态框
    showLogin() {
        // 检查是否已有登录模态框
        let loginModal = document.getElementById('loginModal');
        if (!loginModal) {
            loginModal = this.createLoginModal();
            document.body.appendChild(loginModal);
        }
        loginModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    },

    // 显示注册模态框
    showRegister() {
        // 检查是否已有注册模态框
        let registerModal = document.getElementById('registerModal');
        if (!registerModal) {
            registerModal = this.createRegisterModal();
            document.body.appendChild(registerModal);
        }
        registerModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    },

    // 创建登录模态框
    createLoginModal() {
        const modal = document.createElement('div');
        modal.id = 'loginModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeModal('loginModal')">&times;</span>
                <h2 style="text-align: center; color: #d4af37; margin-bottom: 2rem;">用户登录</h2>
                <form onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label for="loginEmail">邮箱/手机号：</label>
                        <input type="text" id="loginEmail" required placeholder="请输入邮箱或手机号">
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">密码：</label>
                        <input type="password" id="loginPassword" required placeholder="请输入密码">
                    </div>
                    <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
                        <label style="display: flex; align-items: center; margin-bottom: 0;">
                            <input type="checkbox" style="margin-right: 0.5rem; width: auto;">
                            记住我
                        </label>
                        <a href="#" style="color: #d4af37; text-decoration: none;">忘记密码？</a>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%; margin: 1rem 0;">登录</button>
                </form>
                <p style="text-align: center; margin-top: 1rem;">
                    还没有账号？ 
                    <a href="#" onclick="switchToRegister()" style="color: #d4af37; text-decoration: none;">立即注册</a>
                </p>
            </div>
        `;
        return modal;
    },

    // 创建注册模态框
    createRegisterModal() {
        const modal = document.createElement('div');
        modal.id = 'registerModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeModal('registerModal')">&times;</span>
                <h2 style="text-align: center; color: #d4af37; margin-bottom: 2rem;">用户注册</h2>
                <form onsubmit="handleRegister(event)">
                    <div class="form-group">
                        <label for="registerUsername">用户名：</label>
                        <input type="text" id="registerUsername" required placeholder="请输入用户名">
                    </div>
                    <div class="form-group">
                        <label for="registerEmail">邮箱：</label>
                        <input type="email" id="registerEmail" required placeholder="请输入邮箱地址">
                    </div>
                    <div class="form-group">
                        <label for="registerPhone">手机号：</label>
                        <input type="tel" id="registerPhone" required placeholder="请输入手机号">
                    </div>
                    <div class="form-group">
                        <label for="registerPassword">密码：</label>
                        <input type="password" id="registerPassword" required placeholder="请输入密码（至少6位）" minlength="6">
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">确认密码：</label>
                        <input type="password" id="confirmPassword" required placeholder="请再次输入密码">
                    </div>
                    <div class="form-group">
                        <label style="display: flex; align-items: center; margin-bottom: 0;">
                            <input type="checkbox" required style="margin-right: 0.5rem; width: auto;">
                            我已阅读并同意 <a href="privacy.html" target="_blank" style="color: #d4af37; text-decoration: none;">隐私政策</a>
                        </label>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%; margin: 1rem 0;">注册</button>
                </form>
                <p style="text-align: center; margin-top: 1rem;">
                    已有账号？ 
                    <a href="#" onclick="switchToLogin()" style="color: #d4af37; text-decoration: none;">立即登录</a>
                </p>
            </div>
        `;
        return modal;
    },

    // 检查登录状态
    isLoggedIn() {
        return localStorage.getItem('ronghua_user_token') !== null;
    },

    // 获取当前用户信息
    getCurrentUser() {
        const userStr = localStorage.getItem('ronghua_user_info');
        return userStr ? JSON.parse(userStr) : null;
    },

    // 更新用户界面
    updateUserInterface() {
        const loginBtn = document.querySelector('.btn-login');
        const registerBtn = document.querySelector('.btn-register');

        if (this.isLoggedIn()) {
            const user = this.getCurrentUser();
            if (loginBtn && registerBtn) {
                loginBtn.textContent = user?.username || '用户';
                loginBtn.onclick = () => this.showUserMenu();
                registerBtn.textContent = '退出';
                registerBtn.onclick = () => this.logout();
            }
        }
    },

    // 显示用户菜单
    showUserMenu() {
        // 这里可以实现用户下拉菜单
        console.log('显示用户菜单');
    },

    // 登出
    logout() {
        localStorage.removeItem('ronghua_user_token');
        localStorage.removeItem('ronghua_user_info');
        location.reload();
    }
};

// 全局函数（供HTML中直接调用）
function toggleMobileMenu() {
    Navigation.toggleMobileMenu();
}

function closeMobileMenu() {
    Navigation.closeMobileMenu();
}

function showLogin() {
    UserAuth.showLogin();
}

function showRegister() {
    UserAuth.showRegister();
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function switchToRegister() {
    closeModal('loginModal');
    setTimeout(() => showRegister(), 100);
}

function switchToLogin() {
    closeModal('registerModal');
    setTimeout(() => showLogin(), 100);
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // 模拟登录
    Message.loading('登录中...');

    setTimeout(() => {
        // 模拟登录成功
        const userData = {
            username: email.split('@')[0] || email.substring(0, 8),
            email: email,
            token: 'mock_token_' + Date.now()
        };

        localStorage.setItem('ronghua_user_token', userData.token);
        localStorage.setItem('ronghua_user_info', JSON.stringify(userData));

        Message.success('登录成功！');
        closeModal('loginModal');
        UserAuth.updateUserInterface();
    }, 1500);
}

function handleRegister(event) {
    event.preventDefault();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        Message.error('两次输入的密码不一致');
        return;
    }

    const formData = {
        username: document.getElementById('registerUsername').value,
        email: document.getElementById('registerEmail').value,
        phone: document.getElementById('registerPhone').value,
        password: password
    };

    // 模拟注册
    Message.loading('注册中...');

    setTimeout(() => {
        // 模拟注册成功
        Message.success('注册成功！请登录');
        closeModal('registerModal');
        setTimeout(() => showLogin(), 500);
    }, 1500);
}

function isLoggedIn() {
    return UserAuth.isLoggedIn();
}

function updateUserInterface() {
    UserAuth.updateUserInterface();
}

// 更新全局对象
if (typeof window.RonghuaApp !== 'undefined') {
    window.RonghuaApp.Navigation = Navigation;
    window.RonghuaApp.UserAuth = UserAuth;
} else {
    window.RonghuaApp = {
        CONFIG,
        Utils,
        Http,
        Message,
        Loading,
        Modal,
        Auth,
        Scroll,
        Navigation,
        UserAuth,
        domReady
    };
}

// 页面加载完成后初始化导航
domReady(() => {
    Navigation.init();
    UserAuth.updateUserInterface();
});
