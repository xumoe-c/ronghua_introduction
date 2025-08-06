// 管理后台通用JavaScript函数

// 显示消息提示
function showMessage(message, type = 'info') {
    // 创建消息元素
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    // 3秒后自动消失
    setTimeout(() => {
        if (alertDiv && alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}

// 通用API请求函数
async function apiRequest(url, options = {}) {
    try {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const response = await fetch(url, { ...defaultOptions, ...options });

        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '/admin/login';
                return null;
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return await response.text();
    } catch (error) {
        console.error('API请求失败:', error);
        showMessage(`请求失败: ${error.message}`, 'danger');
        return null;
    }
}

// 用户管理相关函数
async function toggleUserStatus(userId, currentStatus) {
    const result = await apiRequest(`/admin/users/${userId}/status`, {
        method: 'POST'
    });

    if (result && result.success) {
        showMessage(result.message, 'success');
        // 更新按钮状态
        const button = document.querySelector(`button[onclick*="${userId}"]`);
        if (button) {
            const newStatus = !currentStatus;
            button.className = `btn btn-sm ${newStatus ? 'btn-outline-warning' : 'btn-outline-success'}`;
            button.innerHTML = `<i class="bi ${newStatus ? 'bi-pause' : 'bi-play'}"></i>`;
            button.setAttribute('onclick', `toggleUserStatus(${userId}, ${newStatus})`);
        }
    }
}

async function deleteUser(userId) {
    if (!confirm('确定要删除这个用户吗？此操作不可恢复！')) {
        return;
    }

    const result = await apiRequest(`/admin/users/${userId}`, {
        method: 'DELETE'
    });

    if (result && result.success) {
        showMessage(result.message, 'success');
        // 移除表格行
        const row = document.querySelector(`tr[data-user-id="${userId}"]`);
        if (row) {
            row.remove();
        }
    }
}

async function saveUser() {
    const form = document.getElementById('userForm');
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());

    const result = await apiRequest('/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData)
    });

    if (result && result.success) {
        showMessage(result.message, 'success');
        bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
        // 刷新页面或更新表格
        setTimeout(() => window.location.reload(), 1000);
    }
}

// 内容管理相关函数
async function saveEncyclopedia() {
    const form = document.getElementById('encyclopediaForm');
    const formData = new FormData(form);
    const contentData = Object.fromEntries(formData.entries());

    const result = await apiRequest('/admin/api/encyclopedia', {
        method: 'POST',
        body: JSON.stringify(contentData)
    });

    if (result && result.success) {
        showMessage(result.message, 'success');
        bootstrap.Modal.getInstance(document.getElementById('encyclopediaModal')).hide();
        setTimeout(() => window.location.reload(), 1000);
    }
}

async function saveTutorial() {
    const form = document.getElementById('tutorialForm');
    const formData = new FormData(form);
    const tutorialData = Object.fromEntries(formData.entries());

    const result = await apiRequest('/admin/api/tutorials', {
        method: 'POST',
        body: JSON.stringify(tutorialData)
    });

    if (result && result.success) {
        showMessage(result.message, 'success');
        bootstrap.Modal.getInstance(document.getElementById('tutorialModal')).hide();
        setTimeout(() => window.location.reload(), 1000);
    }
}

async function deleteContent(contentId, type) {
    if (!confirm('确定要删除这个内容吗？')) {
        return;
    }

    const endpoint = type === 'encyclopedia' ? 'encyclopedia' : 'tutorials';
    const result = await apiRequest(`/admin/api/${endpoint}/${contentId}`, {
        method: 'DELETE'
    });

    if (result && result.success) {
        showMessage(result.message, 'success');
        const row = document.querySelector(`tr[data-${type}-id="${contentId}"]`);
        if (row) {
            row.remove();
        }
    }
}

// 社区管理相关函数
async function loadPosts(page = 1, filters = {}) {
    const params = new URLSearchParams({
        page: page,
        per_page: 20,
        ...filters
    });

    const result = await apiRequest(`/admin/api/posts?${params}`);

    if (result && result.success) {
        updatePostsTable(result.data.posts);
        updatePagination(result.data.page, Math.ceil(result.data.total / result.data.per_page));
    }
}

function updatePostsTable(posts) {
    const tbody = document.getElementById('postsTable');
    if (!tbody) return;

    tbody.innerHTML = posts.map(post => `
        <tr data-post-id="${post.id}">
            <td><input type="checkbox" class="form-check-input post-checkbox" value="${post.id}"></td>
            <td>${post.id}</td>
            <td>
                <div>
                    <div class="fw-bold">${post.title}</div>
                    <small class="text-muted">作者: ${post.author}</small>
                </div>
            </td>
            <td><span class="badge bg-primary">${post.category}</span></td>
            <td>${post.view_count}</td>
            <td>${post.comment_count}</td>
            <td><span class="badge bg-${getStatusColor(post.status)}">${getStatusText(post.status)}</span></td>
            <td>${post.created_at}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" onclick="editPost(${post.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="approvePost(${post.id})">
                        <i class="bi bi-check"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePost(${post.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getStatusColor(status) {
    const colors = {
        'published': 'success',
        'pending': 'warning',
        'rejected': 'danger',
        'draft': 'secondary'
    };
    return colors[status] || 'secondary';
}

function getStatusText(status) {
    const texts = {
        'published': '已发布',
        'pending': '待审核',
        'rejected': '已拒绝',
        'draft': '草稿'
    };
    return texts[status] || status;
}

async function approvePost(postId) {
    const result = await apiRequest(`/admin/api/posts/${postId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'published' })
    });

    if (result && result.success) {
        showMessage(result.message, 'success');
        loadPosts(); // 重新加载帖子列表
    }
}

// 商品管理相关函数
async function loadProducts(page = 1, filters = {}) {
    const params = new URLSearchParams({
        page: page,
        per_page: 20,
        ...filters
    });

    const result = await apiRequest(`/admin/api/products?${params}`);

    if (result && result.success) {
        updateProductsTable(result.data.products);
        updatePagination(result.data.page, Math.ceil(result.data.total / result.data.per_page));
    }
}

async function saveProduct() {
    const form = document.getElementById('productForm');
    const formData = new FormData(form);
    const productData = Object.fromEntries(formData.entries());

    const result = await apiRequest('/admin/api/products', {
        method: 'POST',
        body: JSON.stringify(productData)
    });

    if (result && result.success) {
        showMessage(result.message, 'success');
        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
        loadProducts(); // 重新加载商品列表
    }
}

// 订单管理相关函数
async function loadOrders(page = 1, filters = {}) {
    const params = new URLSearchParams({
        page: page,
        per_page: 20,
        ...filters
    });

    const result = await apiRequest(`/admin/api/orders?${params}`);

    if (result && result.success) {
        updateOrdersTable(result.data.orders);
        updatePagination(result.data.page, Math.ceil(result.data.total / result.data.per_page));
    }
}

async function updateOrderStatus(orderId, status) {
    const result = await apiRequest(`/admin/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: status })
    });

    if (result && result.success) {
        showMessage(result.message, 'success');
        loadOrders(); // 重新加载订单列表
    }
}

// 统计数据相关函数
async function loadStats() {
    const result = await apiRequest('/admin/api/stats');

    if (result && result.success) {
        updateStatsCards(result.data);
        updateCharts(result.data);
    }
}

function updateStatsCards(data) {
    // 更新统计卡片
    const statsElements = {
        'total-users': data.users.total,
        'active-users': data.users.active,
        'total-posts': data.community.posts,
        'total-products': data.shop.products,
        'total-orders': data.shop.orders,
        'pending-orders': data.shop.pending_orders
    };

    Object.entries(statsElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

function updateCharts(data) {
    // 更新图表
    if (data.trends && data.trends.week_users) {
        updateUserTrendChart(data.trends.week_users);
    }
}

function updateUserTrendChart(weekData) {
    const ctx = document.getElementById('userTrendChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            datasets: [{
                label: '新用户注册',
                data: weekData,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '本周用户注册趋势'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 分页相关函数
function updatePagination(currentPage, totalPages) {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;

    let paginationHTML = '';

    // 上一页
    paginationHTML += `
        <li class="page-item ${currentPage <= 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadCurrentData(${currentPage - 1})">上一页</a>
        </li>
    `;

    // 页码
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage || Math.abs(i - currentPage) <= 2 || i === 1 || i === totalPages) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="loadCurrentData(${i})">${i}</a>
                </li>
            `;
        } else if (Math.abs(i - currentPage) === 3) {
            paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }

    // 下一页
    paginationHTML += `
        <li class="page-item ${currentPage >= totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadCurrentData(${currentPage + 1})">下一页</a>
        </li>
    `;

    pagination.innerHTML = paginationHTML;
}

// 根据当前页面加载对应数据
function loadCurrentData(page = 1) {
    const currentPath = window.location.pathname;

    if (currentPath.includes('/community')) {
        loadPosts(page);
    } else if (currentPath.includes('/shop')) {
        if (document.getElementById('productsTable')) {
            loadProducts(page);
        } else if (document.getElementById('ordersTable')) {
            loadOrders(page);
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    // 加载统计数据（如果在仪表板页面）
    if (window.location.pathname.includes('/dashboard')) {
        loadStats();
    }

    // 初始化当前页面数据
    loadCurrentData();

    // 绑定搜索框事件
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const filters = { search: this.value };
                loadCurrentData(1, filters);
            }, 500);
        });
    }

    // 绑定筛选器事件
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function () {
            loadCurrentData(1);
        });
    });
});

// 导出函数（用于其他脚本调用）
window.AdminAPI = {
    showMessage,
    apiRequest,
    toggleUserStatus,
    deleteUser,
    saveUser,
    saveEncyclopedia,
    saveTutorial,
    deleteContent,
    loadPosts,
    approvePost,
    loadProducts,
    saveProduct,
    loadOrders,
    updateOrderStatus,
    loadStats
};
