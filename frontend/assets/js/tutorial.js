// 视频教程页面JavaScript

// 页面加载完成后初始化
domReady(() => {
    initMobileMenu();
    initFilters();
    initTutorialCards();
    updateUserInterface();
});

// 初始化移动端菜单
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    // 阻止菜单内部点击时关闭菜单
    if (navMenuWrapper) {
        navMenuWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // 点击导航链接时关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // 监听窗口大小变化
    window.addEventListener('resize', Utils.debounce(() => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    }, 250));

    // 监听ESC键关闭菜单
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

// 切换移动端菜单
function toggleMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
    const navOverlay = document.querySelector('.nav-overlay');

    if (navMenuWrapper.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

// 打开移动端菜单
function openMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;

    navToggle.classList.add('active');
    navMenuWrapper.classList.add('active');
    navOverlay.classList.add('active');
    body.classList.add('nav-open');

    // 设置aria属性
    navToggle.setAttribute('aria-expanded', 'true');
}

// 关闭移动端菜单
function closeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;

    if (navToggle) navToggle.classList.remove('active');
    if (navMenuWrapper) navMenuWrapper.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    if (body) body.classList.remove('nav-open');

    // 设置aria属性
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
}

// 初始化筛选器
function initFilters() {
    const difficultyFilter = document.getElementById('difficultyFilter');
    const typeFilter = document.getElementById('typeFilter');
    const searchInput = document.getElementById('searchInput');

    // 绑定搜索输入事件
    if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce(searchVideos, 300));
    }
}

// 筛选视频
function filterVideos() {
    const difficultyFilter = document.getElementById('difficultyFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();

    const tutorialCards = document.querySelectorAll('.tutorial-card');

    tutorialCards.forEach(card => {
        const difficulty = card.getAttribute('data-difficulty');
        const type = card.getAttribute('data-type');
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.description').textContent.toLowerCase();

        let shouldShow = true;

        // 难度筛选
        if (difficultyFilter && difficulty !== difficultyFilter) {
            shouldShow = false;
        }

        // 类型筛选
        if (typeFilter && type !== typeFilter) {
            shouldShow = false;
        }

        // 搜索筛选
        if (searchQuery && !title.includes(searchQuery) && !description.includes(searchQuery)) {
            shouldShow = false;
        }

        // 显示或隐藏卡片
        if (shouldShow) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });

    // 检查每个分类是否有可见的视频
    checkCategoryVisibility();
}

// 搜索视频
function searchVideos() {
    filterVideos();
}

// 检查分类可见性
function checkCategoryVisibility() {
    const categories = document.querySelectorAll('.tutorial-category');

    categories.forEach(category => {
        const visibleCards = category.querySelectorAll('.tutorial-card[style*="display: block"], .tutorial-card:not([style*="display: none"])');

        if (visibleCards.length === 0) {
            category.style.display = 'none';
        } else {
            category.style.display = 'block';
        }
    });
}

// 初始化教程卡片
function initTutorialCards() {
    const tutorialCards = document.querySelectorAll('.tutorial-card');

    tutorialCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            playVideo(title);
        });
    });
}

// 播放视频（模拟功能）
function playVideo(title) {
    // 检查用户是否登录
    if (!Auth.isLoggedIn()) {
        Message.warning('请先登录后观看视频');
        showLogin();
        return;
    }

    // 模拟视频播放
    Message.info(`即将播放：${title}`);

    // 这里可以集成实际的视频播放器
    // 例如：
    // - 使用HTML5 video标签
    // - 集成第三方播放器（如Video.js、Plyr等）
    // - 调用视频服务API

    setTimeout(() => {
        // 模拟跳转到视频播放页面
        const videoId = generateVideoId(title);
        const videoUrl = `video-player.html?id=${videoId}&title=${encodeURIComponent(title)}`;

        // 在小程序环境中可能需要特殊处理
        if (isInMiniProgram()) {
            // 通知小程序打开视频页面
            wx.miniProgram.postMessage({
                data: {
                    action: 'openVideo',
                    videoId: videoId,
                    title: title
                }
            });
        } else {
            // 普通浏览器环境
            window.open(videoUrl, '_blank');
        }
    }, 1000);
}

// 生成视频ID（模拟）
function generateVideoId(title) {
    return btoa(title).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
}

// 检查是否在小程序环境
function isInMiniProgram() {
    return typeof wx !== 'undefined' && wx.miniProgram;
}

// 预约直播
function subscribeLive() {
    if (!Auth.isLoggedIn()) {
        Message.warning('请先登录后预约直播');
        showLogin();
        return;
    }

    const loading = Loading.show();

    // 模拟API调用
    setTimeout(() => {
        Loading.hide(loading);
        Message.success('直播预约成功！我们会在直播开始前通知您');

        // 更新按钮状态
        const subscribeBtn = document.querySelector('.live-card .btn-primary');
        if (subscribeBtn) {
            subscribeBtn.textContent = '已预约';
            subscribeBtn.disabled = true;
            subscribeBtn.style.background = '#ccc';
        }
    }, 1500);
}

// 显示登录模态框
function showLogin() {
    // 跳转到首页登录
    window.location.href = '../index.html#login';
}

// 显示注册模态框
function showRegister() {
    window.location.href = '../index.html#register';
}

// 更新用户界面
function updateUserInterface() {
    const user = Auth.getCurrentUser();
    const navUser = document.querySelector('.nav-user');

    if (user && navUser) {
        navUser.innerHTML = `
            <div class="user-info">
                <img src="${user.avatar || '../assets/images/default-avatar.png'}" alt="用户头像" class="user-avatar">
                <span class="user-name">${user.nickname || user.phone}</span>
                <div class="user-dropdown">
                    <a href="profile.html">个人中心</a>
                    <a href="#" onclick="handleLogout()">退出登录</a>
                </div>
            </div>
        `;
    }
}

// 处理登出
function handleLogout() {
    if (confirm('确定要退出登录吗？')) {
        Auth.logout();
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        position: relative;
        cursor: pointer;
    }
    
    .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
    }
    
    .user-name {
        color: #333;
        font-weight: 500;
    }
    
    .user-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        min-width: 120px;
        display: none;
    }
    
    .user-info:hover .user-dropdown {
        display: block;
    }
    
    .user-dropdown a {
        display: block;
        padding: 10px 15px;
        color: #333;
        text-decoration: none;
        border-bottom: 1px solid #eee;
        transition: background 0.3s ease;
    }
    
    .user-dropdown a:last-child {
        border-bottom: none;
    }
    
    .user-dropdown a:hover {
        background: #f8f9fa;
        color: #d4af37;
    }
`;
document.head.appendChild(style);
