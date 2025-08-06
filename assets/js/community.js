// 社区论坛页面功能
document.addEventListener('DOMContentLoaded', function () {
    // 检查登录状态
    updateUserInterface();

    // 初始化页面
    initializePage();
});

// 初始化页面
function initializePage() {
    // 设置默认排序
    sortPosts();

    // 绑定事件
    bindEvents();

    // 模拟加载用户数据
    loadUserData();
}

// 绑定事件
function bindEvents() {
    // 帖子点击事件
    document.querySelectorAll('.post-title').forEach(title => {
        title.addEventListener('click', function () {
            viewPost(this);
        });
    });

    // 点赞事件
    document.querySelectorAll('.likes').forEach(like => {
        like.addEventListener('click', function () {
            toggleLike(this);
        });
    });

    // 评论事件
    document.querySelectorAll('.comments').forEach(comment => {
        comment.addEventListener('click', function () {
            showComments(this);
        });
    });

    // 分享事件
    document.querySelectorAll('.shares').forEach(share => {
        share.addEventListener('click', function () {
            sharePost(this);
        });
    });

    // 话题标签点击
    document.querySelectorAll('.topic-tag').forEach(tag => {
        tag.addEventListener('click', function (e) {
            e.preventDefault();
            filterByTopic(this.textContent);
        });
    });

    // 图片预览
    document.querySelectorAll('.post-images img').forEach(img => {
        img.addEventListener('click', function () {
            previewImage(this.src);
        });
    });
}

// 排序帖子
function sortPosts() {
    const sortSelect = document.getElementById('sortSelect');
    const sortValue = sortSelect.value;
    const postsList = document.getElementById('postsList');
    const posts = Array.from(postsList.children);

    posts.sort((a, b) => {
        switch (sortValue) {
            case 'latest':
                return parseInt(b.dataset.time) - parseInt(a.dataset.time);
            case 'hot':
                // 按热度排序（点赞数 + 评论数）
                const aHot = getPostHotness(a);
                const bHot = getPostHotness(b);
                return bHot - aHot;
            case 'recommended':
                // 精华帖优先
                if (a.classList.contains('featured') && !b.classList.contains('featured')) {
                    return -1;
                }
                if (!a.classList.contains('featured') && b.classList.contains('featured')) {
                    return 1;
                }
                return parseInt(b.dataset.time) - parseInt(a.dataset.time);
            default:
                return 0;
        }
    });

    // 重新排列DOM
    posts.forEach(post => postsList.appendChild(post));

    // 添加排序动画
    postsList.style.opacity = '0';
    setTimeout(() => {
        postsList.style.opacity = '1';
    }, 100);
}

// 获取帖子热度
function getPostHotness(post) {
    const likes = parseInt(post.querySelector('.likes').textContent.match(/\d+/)[0]);
    const comments = parseInt(post.querySelector('.comments').textContent.match(/\d+/)[0]);
    const views = parseInt(post.querySelector('.views').textContent.match(/[\d.]+/)[0]);
    return likes * 3 + comments * 2 + views * 0.1;
}

// 查看帖子详情
function viewPost(titleElement) {
    const postItem = titleElement.closest('.post-item');
    const title = titleElement.textContent.trim();

    // 增加浏览量
    updateViewCount(postItem);

    // 模拟跳转到帖子详情页
    console.log('查看帖子:', title);

    // 在实际应用中，这里会跳转到帖子详情页
    showMessage('正在打开帖子详情...', 'info');
}

// 更新浏览量
function updateViewCount(postItem) {
    const viewsElement = postItem.querySelector('.views');
    const currentViews = parseFloat(viewsElement.textContent.match(/[\d.]+/)[0]);
    const unit = viewsElement.textContent.includes('k') ? 'k' : '';

    let newViews;
    if (unit === 'k') {
        newViews = (currentViews + 0.1).toFixed(1) + 'k';
    } else {
        newViews = (currentViews + 1).toString();
    }

    viewsElement.innerHTML = `👀 ${newViews}`;
}

// 切换点赞状态
function toggleLike(likeElement) {
    if (!isLoggedIn()) {
        showMessage('请先登录后再点赞', 'warning');
        return;
    }

    const currentLikes = parseInt(likeElement.textContent.match(/\d+/)[0]);
    const isLiked = likeElement.classList.contains('liked');

    if (isLiked) {
        likeElement.innerHTML = `❤️ ${currentLikes - 1}`;
        likeElement.classList.remove('liked');
        showMessage('取消点赞', 'info');
    } else {
        likeElement.innerHTML = `❤️ ${currentLikes + 1}`;
        likeElement.classList.add('liked');
        showMessage('点赞成功', 'success');

        // 添加点赞动画
        likeElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            likeElement.style.transform = 'scale(1)';
        }, 200);
    }
}

// 显示评论
function showComments(commentElement) {
    const postItem = commentElement.closest('.post-item');
    const title = postItem.querySelector('.post-title').textContent.trim();

    console.log('查看评论:', title);
    showMessage('正在加载评论...', 'info');

    // 在实际应用中，这里会显示评论区域
}

// 分享帖子
function sharePost(shareElement) {
    const postItem = shareElement.closest('.post-item');
    const title = postItem.querySelector('.post-title').textContent.trim();

    // 模拟分享功能
    if (navigator.share) {
        navigator.share({
            title: title,
            text: '分享一个有趣的绒花帖子',
            url: window.location.href
        });
    } else {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(window.location.href).then(() => {
            showMessage('链接已复制到剪贴板', 'success');
        }).catch(() => {
            showMessage('分享功能暂不可用', 'error');
        });
    }

    // 增加分享数
    const currentShares = parseInt(shareElement.textContent.match(/\d+/)[0]);
    shareElement.innerHTML = `🔗 ${currentShares + 1}`;
}

// 按话题筛选
function filterByTopic(topic) {
    const posts = document.querySelectorAll('.post-item');

    posts.forEach(post => {
        const content = post.textContent.toLowerCase();
        const topicText = topic.toLowerCase().replace('#', '');

        if (content.includes(topicText)) {
            post.style.display = 'flex';
        } else {
            post.style.display = 'none';
        }
    });

    showMessage(`正在显示 ${topic} 相关帖子`, 'info');

    // 更新URL（实际应用中使用）
    // window.history.pushState({}, '', `?topic=${encodeURIComponent(topic)}`);
}

// 预览图片
function previewImage(src) {
    const modal = document.createElement('div');
    modal.className = 'image-preview-modal';
    modal.innerHTML = `
        <div class="image-preview-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${src}" alt="图片预览">
        </div>
    `;

    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        cursor: pointer;
    `;

    const content = modal.querySelector('.image-preview-content');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
    `;

    const img = modal.querySelector('img');
    img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        border-radius: 10px;
    `;

    const closeBtn = modal.querySelector('.close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -30px;
        right: -30px;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        background: rgba(0,0,0,0.5);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    document.body.appendChild(modal);

    // 点击背景关闭
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// 显示发帖模态框
function showNewPostModal() {
    if (!isLoggedIn()) {
        showMessage('请先登录后再发帖', 'warning');
        return;
    }

    document.getElementById('newPostModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 关闭发帖模态框
function closeNewPostModal() {
    document.getElementById('newPostModal').style.display = 'none';
    document.body.style.overflow = 'auto';

    // 清空表单
    document.getElementById('newPostForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
}

// 预览上传图片
function previewImages() {
    const input = document.getElementById('postImages');
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';

    Array.from(input.files).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const div = document.createElement('div');
                div.className = 'preview-item';
                div.innerHTML = `
                    <img src="${e.target.result}" alt="预览图">
                    <button type="button" class="remove-image" onclick="removePreviewImage(${index})">×</button>
                `;
                preview.appendChild(div);
            };
            reader.readAsDataURL(file);
        }
    });
}

// 删除预览图片
function removePreviewImage(index) {
    const input = document.getElementById('postImages');
    const dt = new DataTransfer();

    Array.from(input.files).forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });

    input.files = dt.files;
    previewImages();
}

// 提交新帖
function submitNewPost(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // 获取表单数据
    const postData = {
        title: formData.get('postTitle') || document.getElementById('postTitle').value,
        category: formData.get('postCategory') || document.getElementById('postCategory').value,
        content: formData.get('postContent') || document.getElementById('postContent').value,
        images: Array.from(document.getElementById('postImages').files)
    };

    // 验证表单
    if (!postData.title.trim()) {
        showMessage('请输入帖子标题', 'error');
        return;
    }

    if (!postData.category) {
        showMessage('请选择帖子分类', 'error');
        return;
    }

    if (!postData.content.trim()) {
        showMessage('请输入帖子内容', 'error');
        return;
    }

    // 模拟提交
    showMessage('正在发布帖子...', 'info');

    setTimeout(() => {
        // 模拟成功发布
        showMessage('帖子发布成功！', 'success');
        closeNewPostModal();

        // 在实际应用中，这里会刷新帖子列表或跳转到新帖子
        console.log('新帖数据:', postData);

        // 模拟添加新帖到列表顶部
        addNewPostToList(postData);
    }, 1000);
}

// 添加新帖到列表
function addNewPostToList(postData) {
    const postsList = document.getElementById('postsList');
    const currentUser = getCurrentUser();

    const newPost = document.createElement('div');
    newPost.className = 'post-item';
    newPost.dataset.type = 'normal';
    newPost.dataset.time = Math.floor(Date.now() / 1000);

    newPost.innerHTML = `
        <div class="post-avatar">
            <img src="${currentUser.avatar}" alt="${currentUser.name}">
        </div>
        <div class="post-content">
            <div class="post-header">
                <h3 class="post-title">${postData.title}</h3>
                <div class="post-meta">
                    <span class="author">${currentUser.name}</span>
                    <span class="time">刚刚</span>
                    <span class="category">${getCategoryName(postData.category)}</span>
                </div>
            </div>
            <div class="post-excerpt">${postData.content}</div>
            <div class="post-stats">
                <span class="likes">❤️ 0</span>
                <span class="comments">💬 0</span>
                <span class="views">👀 1</span>
                <span class="shares">🔗 0</span>
            </div>
        </div>
    `;

    // 添加到列表顶部
    postsList.insertBefore(newPost, postsList.firstChild);

    // 添加动画效果
    newPost.style.opacity = '0';
    newPost.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        newPost.style.transition = 'all 0.5s ease';
        newPost.style.opacity = '1';
        newPost.style.transform = 'translateY(0)';
    }, 100);

    // 绑定新帖子的事件
    bindPostEvents(newPost);
}

// 绑定帖子事件
function bindPostEvents(post) {
    const title = post.querySelector('.post-title');
    const like = post.querySelector('.likes');
    const comment = post.querySelector('.comments');
    const share = post.querySelector('.shares');

    if (title) title.addEventListener('click', () => viewPost(title));
    if (like) like.addEventListener('click', () => toggleLike(like));
    if (comment) comment.addEventListener('click', () => showComments(comment));
    if (share) share.addEventListener('click', () => sharePost(share));
}

// 获取分类名称
function getCategoryName(category) {
    const categories = {
        technique: '制作技巧',
        showcase: '作品展示',
        question: '求助问答',
        discussion: '文化讨论',
        activity: '活动相关'
    };
    return categories[category] || category;
}

// 加载更多帖子
function loadMorePosts() {
    showMessage('正在加载更多帖子...', 'info');

    // 模拟加载延迟
    setTimeout(() => {
        const postsList = document.getElementById('postsList');
        const mockPosts = generateMockPosts(5);

        mockPosts.forEach(post => {
            const postElement = createPostElement(post);
            postsList.appendChild(postElement);
            bindPostEvents(postElement);
        });

        showMessage('已加载更多帖子', 'success');
    }, 1000);
}

// 生成模拟帖子数据
function generateMockPosts(count) {
    const mockTitles = [
        '绒花色彩搭配心得分享',
        '初学者必看：基础工具介绍',
        '我的绒花学习历程',
        '传统vs现代：绒花发展思考',
        '手工绒花vs机器制作的区别'
    ];

    const mockAuthors = ['小明', '花花', '艺术爱好者', '传统工艺师', '新手小白'];
    const mockCategories = ['technique', 'question', 'discussion', 'showcase', 'activity'];

    return Array.from({ length: count }, (_, i) => ({
        title: mockTitles[i % mockTitles.length],
        author: mockAuthors[i % mockAuthors.length],
        category: mockCategories[i % mockCategories.length],
        content: '这是一个模拟的帖子内容，用于演示加载更多功能...',
        time: Math.floor(Date.now() / 1000) - Math.random() * 86400,
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 20),
        views: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 10)
    }));
}

// 创建帖子元素
function createPostElement(post) {
    const div = document.createElement('div');
    div.className = 'post-item';
    div.dataset.type = 'normal';
    div.dataset.time = post.time;

    div.innerHTML = `
        <div class="post-avatar">
            <img src="../assets/images/user-default.jpg" alt="${post.author}">
        </div>
        <div class="post-content">
            <div class="post-header">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-meta">
                    <span class="author">${post.author}</span>
                    <span class="time">${getTimeAgo(post.time)}</span>
                    <span class="category">${getCategoryName(post.category)}</span>
                </div>
            </div>
            <div class="post-excerpt">${post.content}</div>
            <div class="post-stats">
                <span class="likes">❤️ ${post.likes}</span>
                <span class="comments">💬 ${post.comments}</span>
                <span class="views">👀 ${post.views}</span>
                <span class="shares">🔗 ${post.shares}</span>
            </div>
        </div>
    `;

    return div;
}

// 获取时间距离现在的描述
function getTimeAgo(timestamp) {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;

    if (diff < 60) return '刚刚';
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
    return `${Math.floor(diff / 2592000)}个月前`;
}

// 加载用户数据
function loadUserData() {
    // 模拟加载社区统计数据
    animateStats();
}

// 动画显示统计数据
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/,/g, ''));
        let current = 0;
        const increment = target / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current).toLocaleString();
        }, 20);
    });
}

// 获取当前用户信息
function getCurrentUser() {
    // 模拟当前用户数据
    return {
        name: '当前用户',
        avatar: '../assets/images/user-current.jpg',
        level: '新手学员'
    };
}

// 工具函数：显示消息
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;

    // 设置样式
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    // 根据类型设置背景色
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };

    messageDiv.style.backgroundColor = colors[type] || colors.info;

    // 添加到页面
    document.body.appendChild(messageDiv);

    // 显示动画
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateX(0)';
    }, 100);

    // 自动隐藏
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}
