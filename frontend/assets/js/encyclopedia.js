// 非遗百科页面JavaScript

// 页面加载完成后初始化
domReady(() => {
    initTabs();
    initMobileTabSelector();
    initChat();
    initMobileMenu();
    initScrollAnimation();
    updateUserInterface();
});

// 初始化移动端标签选择器
function initMobileTabSelector() {
    const tabSelector = document.querySelector('.mobile-tab-selector');
    if (!tabSelector) return;

    const trigger = tabSelector.querySelector('.mobile-tab-trigger');
    const dropdown = tabSelector.querySelector('.mobile-tab-dropdown');
    const mobileTabLinks = tabSelector.querySelectorAll('.mobile-tab-link');
    const currentTabText = trigger.querySelector('.current-tab-text');

    // 点击其他区域关闭下拉菜单
    document.addEventListener('click', (e) => {
        if (!tabSelector.contains(e.target)) {
            closeTabDropdown();
        }
    });

    // 移动端标签点击事件
    mobileTabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // 更新移动端当前标签
            mobileTabLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentTabText.textContent = link.textContent;

            // 同步更新桌面端标签状态
            const tabId = link.getAttribute('data-tab');
            const desktopTabLink = document.querySelector(`.nav-tabs .tab-link[data-tab="${tabId}"]`);
            if (desktopTabLink) {
                document.querySelectorAll('.nav-tabs .tab-link').forEach(l => l.classList.remove('active'));
                desktopTabLink.classList.add('active');
            }

            // 切换内容
            switchTab(tabId);
            closeTabDropdown();
        });
    });
}

// 切换标签下拉菜单
function toggleTabDropdown() {
    const trigger = document.querySelector('.mobile-tab-trigger');
    const dropdown = document.querySelector('.mobile-tab-dropdown');

    if (!trigger || !dropdown) return;

    const isActive = trigger.classList.contains('active');

    if (isActive) {
        closeTabDropdown();
    } else {
        trigger.classList.add('active');
        dropdown.classList.add('active');
    }
}

// 关闭标签下拉菜单
function closeTabDropdown() {
    const trigger = document.querySelector('.mobile-tab-trigger');
    const dropdown = document.querySelector('.mobile-tab-dropdown');

    if (trigger) trigger.classList.remove('active');
    if (dropdown) dropdown.classList.remove('active');
}

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

    navToggle.setAttribute('aria-expanded', 'true');

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

    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
}

// 初始化标签页功能
function initTabs() {
    const tabLinks = document.querySelectorAll('.nav-tabs .tab-link');
    const contentSections = document.querySelectorAll('.content-section');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetTab = link.getAttribute('data-tab');

            // 移除所有活动状态
            tabLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));

            // 激活当前标签和内容
            link.classList.add('active');

            // 同步更新移动端选择器
            updateMobileTabSelector(targetTab, link.textContent);

            // 切换内容
            switchTab(targetTab);
        });
    });

    // 根据URL哈希激活相应标签
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetLink = document.querySelector(`[data-tab="${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
}

// 切换标签内容
function switchTab(targetTab) {
    const contentSections = document.querySelectorAll('.content-section');

    // 移除所有内容区域的活动状态
    contentSections.forEach(s => s.classList.remove('active'));

    // 激活目标内容区域
    const targetSection = document.getElementById(targetTab);
    if (targetSection) {
        targetSection.classList.add('active');

        // 平滑滚动到内容区域
        const headerHeight = document.querySelector('.header').offsetHeight;
        const navHeight = document.querySelector('.content-nav').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// 更新移动端标签选择器状态
function updateMobileTabSelector(tabId, tabText) {
    const mobileTabLinks = document.querySelectorAll('.mobile-tab-link');
    const currentTabText = document.querySelector('.current-tab-text');

    if (currentTabText) {
        currentTabText.textContent = tabText;
    }

    mobileTabLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tab') === tabId) {
            link.classList.add('active');
        }
    });
}

// 初始化聊天功能
function initChat() {
    const questionInput = document.getElementById('questionInput');
    if (questionInput) {
        // 回车发送消息
        questionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendQuestion();
            }
        });

        // 自动调整输入框高度
        questionInput.addEventListener('input', autoResizeInput);
    }
}

// 发送问题
async function sendQuestion() {
    const questionInput = document.getElementById('questionInput');
    const question = questionInput.value.trim();

    if (!question) {
        Message.warning('请输入您的问题');
        return;
    }

    // 添加用户消息到聊天界面
    addMessage(question, 'user');

    // 清空输入框
    questionInput.value = '';

    // 显示AI思考状态
    const thinkingMessageId = addMessage('正在思考中...', 'bot', true);

    try {
        // 调用AI API
        const response = await Http.post('/ai/chat', {
            question: question,
            context: 'ronghua_encyclopedia'
        });

        // 移除思考消息
        removeMessage(thinkingMessageId);

        if (response.success) {
            // 添加AI回复
            addMessage(response.data.answer, 'bot');
        } else {
            addMessage('抱歉，我暂时无法回答这个问题，请稍后重试。', 'bot');
        }
    } catch (error) {
        console.error('Chat error:', error);
        removeMessage(thinkingMessageId);
        addMessage('网络连接异常，请检查网络后重试。', 'bot');
    }
}

// 快速提问
function askQuickQuestion(question) {
    const questionInput = document.getElementById('questionInput');
    questionInput.value = question;
    sendQuestion();
}

// 添加消息到聊天界面
function addMessage(content, type, isTemporary = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}-message`;
    messageElement.id = messageId;

    const avatarSrc = type === 'user'
        ? (Auth.getCurrentUser()?.avatar || '../assets/images/default-avatar.png')
        : '../assets/images/ai-avatar.png';

    messageElement.innerHTML = `
        <div class="message-avatar">
            <img src="${avatarSrc}" alt="${type === 'user' ? '用户' : 'AI助手'}">
        </div>
        <div class="message-content">
            <p>${content}</p>
        </div>
    `;

    chatMessages.appendChild(messageElement);

    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 添加动画效果
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateY(20px)';

    setTimeout(() => {
        messageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    }, 100);

    return isTemporary ? messageId : null;
}

// 移除消息
function removeMessage(messageId) {
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
        messageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }
}

// 自动调整输入框高度
function autoResizeInput() {
    const input = document.getElementById('questionInput');
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
}

// 初始化滚动动画
function initScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // 为时间线项目添加延迟动画
                if (entry.target.classList.contains('timeline-item')) {
                    const items = document.querySelectorAll('.timeline-item');
                    const index = Array.from(items).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.2}s`;
                }
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll(`
        .timeline-item,
        .feature-item,
        .process-step,
        .technique-item,
        .item,
        .master-card
    `);

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 显示登录模态框
function showLogin() {
    // 这里应该调用通用的登录模态框
    // 或者跳转到登录页面
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
                    <a href="../pages/profile.html">个人中心</a>
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

// 工具函数：格式化AI回复
function formatAIResponse(text) {
    // 处理换行
    text = text.replace(/\n/g, '<br>');

    // 处理粗体文本
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 处理列表
    text = text.replace(/^\s*[-•]\s+(.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // 处理链接
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    return text;
}

// 保存聊天历史
function saveChatHistory() {
    const messages = document.querySelectorAll('.message');
    const chatHistory = [];

    messages.forEach(message => {
        const isUser = message.classList.contains('user-message');
        const content = message.querySelector('.message-content p').textContent;

        chatHistory.push({
            type: isUser ? 'user' : 'bot',
            content: content,
            timestamp: Date.now()
        });
    });

    Utils.storage.set('ronghua_chat_history', chatHistory);
}

// 加载聊天历史
function loadChatHistory() {
    const chatHistory = Utils.storage.get('ronghua_chat_history');

    if (chatHistory && chatHistory.length > 0) {
        chatHistory.forEach(message => {
            addMessage(message.content, message.type);
        });
    }
}

// 清空聊天记录
function clearChatHistory() {
    if (confirm('确定要清空聊天记录吗？')) {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <img src="../assets/images/ai-avatar.png" alt="AI助手">
                </div>
                <div class="message-content">
                    <p>您好！我是绒花非遗智能助手，很高兴为您服务。您可以询问任何关于绒花历史、工艺、制作技法的问题，我会为您详细解答。</p>
                </div>
            </div>
        `;

        Utils.storage.remove('ronghua_chat_history');
        Message.success('聊天记录已清空');
    }
}

// 导出聊天记录
function exportChatHistory() {
    const messages = document.querySelectorAll('.message');
    let exportText = '绒花非遗百科 - 聊天记录\n';
    exportText += '生成时间：' + new Date().toLocaleString() + '\n\n';

    messages.forEach(message => {
        const isUser = message.classList.contains('user-message');
        const content = message.querySelector('.message-content p').textContent;
        const speaker = isUser ? '用户' : 'AI助手';

        exportText += `${speaker}：${content}\n\n`;
    });

    // 创建下载链接
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `绒花百科聊天记录_${Utils.formatDate(new Date(), 'YYYY-MM-DD_HH-mm-ss')}.txt`;
    a.click();

    URL.revokeObjectURL(url);
    Message.success('聊天记录已导出');
}

// 搜索功能
function searchEncyclopedia() {
    const searchTerm = prompt('请输入要搜索的内容：');
    if (!searchTerm) return;

    const contentSections = document.querySelectorAll('.content-section');
    let found = false;

    contentSections.forEach(section => {
        const textContent = section.textContent.toLowerCase();
        if (textContent.includes(searchTerm.toLowerCase())) {
            // 高亮搜索结果
            highlightSearchTerm(section, searchTerm);

            // 切换到对应标签
            const sectionId = section.id;
            const tabLink = document.querySelector(`[data-tab="${sectionId}"]`);
            if (tabLink) {
                tabLink.click();
                found = true;
            }
        }
    });

    if (!found) {
        Message.warning('未找到相关内容');
    } else {
        Message.success(`找到了"${searchTerm}"的相关内容`);
    }
}

// 高亮搜索词
function highlightSearchTerm(container, term) {
    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    const textNodes = [];
    let node;

    while (node = walker.nextNode()) {
        textNodes.push(node);
    }

    textNodes.forEach(textNode => {
        const content = textNode.textContent;
        const regex = new RegExp(`(${term})`, 'gi');

        if (regex.test(content)) {
            const highlightedContent = content.replace(regex, '<mark>$1</mark>');
            const span = document.createElement('span');
            span.innerHTML = highlightedContent;
            textNode.parentNode.replaceChild(span, textNode);
        }
    });
}

// 监听页面可见性变化
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面隐藏时保存聊天历史
        saveChatHistory();
    }
});

// 页面卸载前保存聊天历史
window.addEventListener('beforeunload', () => {
    saveChatHistory();
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl+F 搜索
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchEncyclopedia();
    }

    // Ctrl+Enter 发送消息
    if (e.ctrlKey && e.key === 'Enter') {
        const questionInput = document.getElementById('questionInput');
        if (document.activeElement === questionInput) {
            sendQuestion();
        }
    }

    // 数字键1-5快速切换标签
    if (e.key >= '1' && e.key <= '5') {
        const tabIndex = parseInt(e.key) - 1;
        const tabLinks = document.querySelectorAll('.tab-link');
        if (tabLinks[tabIndex]) {
            tabLinks[tabIndex].click();
        }
    }
});
