// 首页专用JavaScript

// 当前横幅索引
let currentSlideIndex = 0;
let slideTimer = null;

// 页面加载完成后初始化
domReady(() => {
    initBanner();
    initNavigation();
    initMobileMenu();
    initUserAuth();
    initScrollEffects();
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
    const body = document.body;

    const isActive = navMenuWrapper.classList.contains('active');

    if (isActive) {
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

    // 聚焦到第一个菜单项
    const firstNavLink = navMenuWrapper.querySelector('.nav-link');
    if (firstNavLink) {
        setTimeout(() => {
            firstNavLink.focus();
        }, 300);
    }
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

// 初始化横幅轮播
function initBanner() {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dot');

    if (slides.length === 0) return;

    // 开始自动轮播
    startAutoSlide();

    // 鼠标悬停时暂停轮播
    const bannerContainer = document.querySelector('.hero-banner');
    if (bannerContainer) {
        bannerContainer.addEventListener('mouseenter', stopAutoSlide);
        bannerContainer.addEventListener('mouseleave', startAutoSlide);
    }
}

// 显示指定索引的幻灯片
function showSlide(index) {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dot');

    if (slides.length === 0) return;

    // 移除当前活动状态
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // 设置新的活动状态
    currentSlideIndex = index;
    if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.add('active');
    }
    if (dots[currentSlideIndex]) {
        dots[currentSlideIndex].classList.add('active');
    }
}

// 下一张幻灯片
function nextSlide() {
    const slides = document.querySelectorAll('.banner-slide');
    const nextIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(nextIndex);
}

// 开始自动轮播
function startAutoSlide() {
    stopAutoSlide(); // 先清除现有定时器
    slideTimer = setInterval(nextSlide, 5000); // 5秒切换一次
}

// 停止自动轮播
function stopAutoSlide() {
    if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
    }
}

// 初始化导航功能
function initNavigation() {
    // 导航链接点击事件
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);

                // 更新活动状态
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // 滚动时更新导航状态
    Scroll.onScroll(() => {
        updateActiveNavigation();
    });
}

// 滚动到指定区域
function scrollToSection(sectionId) {
    const headerHeight = document.querySelector('.header').offsetHeight;
    Scroll.toElement(sectionId, headerHeight + 20);
}

// 更新活动导航项
function updateActiveNavigation() {
    const sections = ['home', 'encyclopedia', 'tutorial', 'community', 'shop', 'game'];
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const scrollTop = window.pageYOffset;

    let activeSection = 'home';

    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                activeSection = sectionId;
            }
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSection}`) {
            link.classList.add('active');
        }
    });
}

// 初始化用户认证相关功能
function initUserAuth() {
    // 检查用户登录状态
    updateUserInterface();

    // 绑定登录表单事件
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // 绑定注册表单事件
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // 获取验证码按钮
    const codeButton = document.querySelector('.btn-code');
    if (codeButton) {
        codeButton.addEventListener('click', handleGetVerificationCode);
    }
}

// 显示登录模态框
function showLogin() {
    Modal.show('loginModal');
}

// 显示注册模态框
function showRegister() {
    Modal.show('registerModal');
}

// 关闭模态框
function closeModal(modalId) {
    Modal.hide(modalId);
}

// 切换到注册模态框
function switchToRegister() {
    closeModal('loginModal');
    showRegister();
}

// 切换到登录模态框
function switchToLogin() {
    closeModal('registerModal');
    showLogin();
}

// 处理登录
async function handleLogin(e) {
    e.preventDefault();

    const phone = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;

    // 验证输入
    if (!Utils.validatePhone(phone)) {
        Message.error('请输入正确的手机号');
        return;
    }

    if (!password) {
        Message.error('请输入密码');
        return;
    }

    const loading = Loading.show();

    try {
        const response = await Http.post('/auth/login', {
            phone,
            password
        });

        if (response.success) {
            // 保存用户信息和token
            Auth.setToken(response.data.token);
            Auth.setCurrentUser(response.data.user);

            Message.success('登录成功');
            closeModal('loginModal');
            updateUserInterface();
        } else {
            Message.error(response.message || '登录失败');
        }
    } catch (error) {
        console.error('Login error:', error);
        Message.error('登录失败，请稍后重试');
    } finally {
        Loading.hide(loading);
    }
}

// 处理注册
async function handleRegister(e) {
    e.preventDefault();

    const phone = document.getElementById('registerPhone').value;
    const code = document.getElementById('registerCode').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirm').value;

    // 验证输入
    if (!Utils.validatePhone(phone)) {
        Message.error('请输入正确的手机号');
        return;
    }

    if (!code) {
        Message.error('请输入验证码');
        return;
    }

    if (!Utils.validatePassword(password)) {
        Message.error('密码至少8位，需包含大小写字母和数字');
        return;
    }

    if (password !== confirmPassword) {
        Message.error('两次输入的密码不一致');
        return;
    }

    const loading = Loading.show();

    try {
        const response = await Http.post('/auth/register', {
            phone,
            code,
            password
        });

        if (response.success) {
            Message.success('注册成功，请登录');
            closeModal('registerModal');
            showLogin();
        } else {
            Message.error(response.message || '注册失败');
        }
    } catch (error) {
        console.error('Register error:', error);
        Message.error('注册失败，请稍后重试');
    } finally {
        Loading.hide(loading);
    }
}

// 获取验证码
async function handleGetVerificationCode() {
    const phone = document.getElementById('registerPhone').value;

    if (!Utils.validatePhone(phone)) {
        Message.error('请输入正确的手机号');
        return;
    }

    const button = document.querySelector('.btn-code');
    const originalText = button.textContent;

    try {
        button.disabled = true;
        button.textContent = '发送中...';

        const response = await Http.post('/auth/send-code', { phone });

        if (response.success) {
            Message.success('验证码已发送');

            // 开始倒计时
            let countdown = 60;
            const timer = setInterval(() => {
                button.textContent = `${countdown}秒后重试`;
                countdown--;

                if (countdown < 0) {
                    clearInterval(timer);
                    button.disabled = false;
                    button.textContent = originalText;
                }
            }, 1000);
        } else {
            Message.error(response.message || '发送失败');
            button.disabled = false;
            button.textContent = originalText;
        }
    } catch (error) {
        console.error('Send code error:', error);
        Message.error('发送失败，请稍后重试');
        button.disabled = false;
        button.textContent = originalText;
    }
}

// 更新用户界面
function updateUserInterface() {
    const user = Auth.getCurrentUser();
    const navUser = document.querySelector('.nav-user');

    if (user && navUser) {
        navUser.innerHTML = `
            <div class="user-info">
                <span class="user-name">欢迎，${user.nickname || user.phone}</span>
                <div class="user-menu">
                    <a href="pages/profile.html">个人中心</a>
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

// 初始化滚动效果
function initScrollEffects() {
    // 添加滚动时头部背景变化效果
    Scroll.onScroll(() => {
        const header = document.querySelector('.header');
        if (window.pageYOffset > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.1)';
        }

        // 更新活动导航项
        updateActiveNavigation();
    });

    // 添加元素进入视口时的动画效果
    observeElementsInView();

    // 添加导航栏智能隐藏功能
    let lastScrollTop = 0;
    const header = document.querySelector('.header');

    Scroll.onScroll(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动，隐藏导航栏
            header.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动，显示导航栏
            header.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });
}

// 观察元素进入视口
function observeElementsInView() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.feature-card, .news-item');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// 处理特色功能卡片点击
function handleFeatureCardClick(url) {
    // 检查是否需要登录
    if (!Auth.isLoggedIn() && (url.includes('community') || url.includes('shop'))) {
        Message.warning('请先登录后访问');
        showLogin();
        return;
    }

    window.location.href = url;
}

// 键盘事件处理
document.addEventListener('keydown', (e) => {
    // ESC键关闭模态框
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                Modal.hide(modal.id);
            }
        });
    }

    // 左右箭头键控制横幅
    if (e.key === 'ArrowLeft') {
        const slides = document.querySelectorAll('.banner-slide');
        const prevIndex = currentSlideIndex === 0 ? slides.length - 1 : currentSlideIndex - 1;
        showSlide(prevIndex);
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// 窗口大小改变时的处理
window.addEventListener('resize', Utils.debounce(() => {
    // 重新计算导航高度等
    updateActiveNavigation();
}, 250));

// 页面可见性变化处理
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoSlide();
    } else {
        startAutoSlide();
    }
});
