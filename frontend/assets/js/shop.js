// 文创商城页面功能
let cart = JSON.parse(localStorage.getItem('ronghua_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('ronghua_wishlist')) || [];

document.addEventListener('DOMContentLoaded', function () {
    // 检查登录状态
    updateUserInterface();

    // 初始化页面
    initializePage();

    // 更新购物车图标
    updateCartIcon();

    // 加载愿望清单状态
    loadWishlistState();
});

// 初始化页面
function initializePage() {
    // 设置默认排序
    sortProducts();

    // 绑定事件
    bindEvents();

    // 模拟加载商品数据
    loadProductData();
}

// 绑定事件
function bindEvents() {
    // 商品卡片悬停效果
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // 点击遮罩关闭购物车
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('cart-overlay')) {
            hideCart();
        }
    });
}

// 按分类筛选商品
function filterByCategory(category) {
    const products = document.querySelectorAll('.product-card');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // 更新按钮状态
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });

    // 筛选商品
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
            product.style.animation = 'fadeIn 0.5s ease';
        } else {
            product.style.display = 'none';
        }
    });

    // 更新URL（实际应用中使用）
    // window.history.pushState({}, '', `?category=${category}`);
}

// 搜索商品
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    const products = document.querySelectorAll('.product-card');

    if (searchTerm === '') {
        // 显示所有商品
        products.forEach(product => {
            product.style.display = 'block';
        });
        return;
    }

    products.forEach(product => {
        const title = product.querySelector('.product-title').textContent.toLowerCase();
        const desc = product.querySelector('.product-desc').textContent.toLowerCase();

        if (title.includes(searchTerm) || desc.includes(searchTerm)) {
            product.style.display = 'block';
            highlightSearchTerm(product, searchTerm);
        } else {
            product.style.display = 'none';
        }
    });

    showMessage(`搜索到 ${document.querySelectorAll('.product-card[style*="block"]').length} 件商品`, 'info');
}

// 高亮搜索关键词
function highlightSearchTerm(product, term) {
    const title = product.querySelector('.product-title');
    const desc = product.querySelector('.product-desc');

    [title, desc].forEach(element => {
        const text = element.textContent;
        const regex = new RegExp(`(${term})`, 'gi');
        element.innerHTML = text.replace(regex, '<mark>$1</mark>');
    });
}

// 排序商品
function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    const sortValue = sortSelect.value;
    const productsGrid = document.getElementById('productsGrid');
    const products = Array.from(productsGrid.children).filter(child =>
        child.classList.contains('product-card')
    );

    products.sort((a, b) => {
        switch (sortValue) {
            case 'price-low':
                return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
            case 'price-high':
                return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
            case 'popularity':
                return parseInt(b.dataset.popularity) - parseInt(a.dataset.popularity);
            case 'newest':
                // 按DOM顺序排序（模拟最新）
                return Array.from(productsGrid.children).indexOf(a) -
                    Array.from(productsGrid.children).indexOf(b);
            default:
                return 0;
        }
    });

    // 重新排列DOM
    const loadMoreBtn = productsGrid.querySelector('.load-more');
    products.forEach(product => productsGrid.insertBefore(product, loadMoreBtn));

    // 添加排序动画
    products.forEach((product, index) => {
        product.style.opacity = '0';
        product.style.transform = 'translateY(20px)';
        setTimeout(() => {
            product.style.transition = 'all 0.3s ease';
            product.style.opacity = '1';
            product.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// 添加到购物车
function addToCart(button, productId) {
    if (!isLoggedIn()) {
        showMessage('请先登录后再购买', 'warning');
        return;
    }

    const productCard = button.closest('.product-card');
    const product = getProductInfo(productCard);

    // 检查商品是否已在购物车中
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            ...product,
            quantity: 1
        });
    }

    // 保存到本地存储
    localStorage.setItem('ronghua_cart', JSON.stringify(cart));

    // 更新UI
    updateCartIcon();
    showMessage('商品已添加到购物车', 'success');

    // 添加按钮动画
    button.classList.add('adding');
    button.textContent = '已添加 ✓';
    setTimeout(() => {
        button.classList.remove('adding');
        button.textContent = '加入购物车';
    }, 1000);

    // 模拟飞入购物车动画
    animateAddToCart(productCard);
}

// 获取商品信息
function getProductInfo(productCard) {
    return {
        title: productCard.querySelector('.product-title').textContent.trim(),
        price: parseFloat(productCard.dataset.price),
        image: productCard.querySelector('.product-image img').src,
        desc: productCard.querySelector('.product-desc').textContent.trim()
    };
}

// 飞入购物车动画
function animateAddToCart(productCard) {
    const productImage = productCard.querySelector('.product-image img');
    const cartIcon = document.querySelector('.cart-icon');

    // 创建动画元素
    const flyImage = productImage.cloneNode();
    flyImage.style.cssText = `
        position: fixed;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        z-index: 1001;
        pointer-events: none;
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;

    // 设置起始位置
    const productRect = productImage.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    flyImage.style.left = productRect.left + 'px';
    flyImage.style.top = productRect.top + 'px';

    document.body.appendChild(flyImage);

    // 执行动画
    setTimeout(() => {
        flyImage.style.left = cartRect.left + 'px';
        flyImage.style.top = cartRect.top + 'px';
        flyImage.style.transform = 'scale(0.3)';
        flyImage.style.opacity = '0.8';
    }, 50);

    // 清理动画元素
    setTimeout(() => {
        if (flyImage.parentNode) {
            flyImage.parentNode.removeChild(flyImage);
        }
        // 购物车图标动画
        cartIcon.style.transform = 'translateY(-50%) scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'translateY(-50%) scale(1)';
        }, 200);
    }, 850);
}

// 更新购物车图标
function updateCartIcon() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (totalItems > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
}

// 显示购物车
function showCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = createCartOverlay();

    cartSidebar.classList.add('open');
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    updateCartContent();
}

// 隐藏购物车
function hideCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.querySelector('.cart-overlay');

    cartSidebar.classList.remove('open');
    if (overlay) {
        overlay.remove();
    }
    document.body.style.overflow = 'auto';
}

// 创建购物车遮罩
function createCartOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'cart-overlay show';
    overlay.onclick = hideCart;
    return overlay;
}

// 更新购物车内容
function updateCartContent() {
    const cartContent = document.getElementById('cartContent');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <p>购物车还是空的</p>
                <p>快去挑选心仪的商品吧！</p>
            </div>
        `;
        cartTotal.textContent = '0';
        return;
    }

    let total = 0;
    const cartHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">¥${item.price}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                               onchange="setQuantity('${item.id}', this.value)">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart('${item.id}')">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    cartContent.innerHTML = cartHTML;
    cartTotal.textContent = total.toFixed(2);
}

// 更新商品数量
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        localStorage.setItem('ronghua_cart', JSON.stringify(cart));
        updateCartIcon();
        updateCartContent();
    }
}

// 设置商品数量
function setQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const newQuantity = parseInt(quantity);
        if (newQuantity > 0) {
            item.quantity = newQuantity;
            localStorage.setItem('ronghua_cart', JSON.stringify(cart));
            updateCartIcon();
            updateCartContent();
        }
    }
}

// 从购物车移除商品
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('ronghua_cart', JSON.stringify(cart));
    updateCartIcon();
    updateCartContent();
    showMessage('商品已从购物车移除', 'info');
}

// 结算
function checkout() {
    if (cart.length === 0) {
        showMessage('购物车为空，无法结算', 'warning');
        return;
    }

    if (!isLoggedIn()) {
        showMessage('请先登录后再结算', 'warning');
        return;
    }

    // 显示支付说明
    showPaymentModal();
}

// 显示支付说明模态框
function showPaymentModal() {
    document.getElementById('paymentModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 关闭支付说明模态框
function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 快速预览
function quickView(button) {
    const productCard = button.closest('.product-card');
    const product = getProductInfo(productCard);
    const productId = getProductId(productCard);

    const quickViewContent = document.getElementById('quickViewContent');
    quickViewContent.innerHTML = `
        <div class="quick-view-image">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="quick-view-info">
            <h2>${product.title}</h2>
            <div class="quick-view-rating">
                <span class="stars">⭐⭐⭐⭐⭐</span>
                <span class="rating-count">(${Math.floor(Math.random() * 200) + 50})</span>
            </div>
            <div class="quick-view-price">
                <span class="current-price">¥${product.price}</span>
                ${Math.random() > 0.5 ? `<span class="original-price">¥${(product.price * 1.3).toFixed(0)}</span>` : ''}
            </div>
            <div class="quick-view-desc">
                ${product.desc}<br><br>
                这是一件精美的绒花艺术品，采用传统手工艺制作，每一个细节都体现了匠人的精湛技艺。
                适合用于家居装饰、节日庆典或作为珍贵的礼品赠送。
            </div>
            <div class="quick-view-actions">
                <button class="btn-add-cart" onclick="addToCart(this, '${productId}')">加入购物车</button>
                <button class="btn-buy-now" onclick="buyNow('${productId}')">立即购买</button>
            </div>
        </div>
    `;

    document.getElementById('quickViewModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 关闭快速预览
function closeQuickView() {
    document.getElementById('quickViewModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 立即购买
function buyNow(productId) {
    if (!isLoggedIn()) {
        showMessage('请先登录后再购买', 'warning');
        return;
    }

    // 添加到购物车
    const productCard = document.querySelector(`[data-product-id="${productId}"]`) ||
        document.querySelector('.product-card');
    const button = productCard.querySelector('.btn-add-cart');
    addToCart(button, productId);

    // 关闭快速预览
    closeQuickView();

    // 显示购物车
    setTimeout(() => {
        showCart();
    }, 500);
}

// 获取商品ID
function getProductId(productCard) {
    // 从按钮的onclick属性中提取ID，或者使用索引
    const button = productCard.querySelector('.btn-add-cart');
    const onclickAttr = button.getAttribute('onclick');
    const match = onclickAttr.match(/'([^']+)'/);
    return match ? match[1] : 'product' + Array.from(productCard.parentNode.children).indexOf(productCard);
}

// 切换愿望清单
function toggleWishlist(button) {
    if (!isLoggedIn()) {
        showMessage('请先登录后再收藏', 'warning');
        return;
    }

    const productCard = button.closest('.product-card');
    const productId = getProductId(productCard);
    const product = getProductInfo(productCard);

    if (button.classList.contains('active')) {
        // 从愿望清单移除
        wishlist = wishlist.filter(item => item.id !== productId);
        button.classList.remove('active');
        showMessage('已从收藏中移除', 'info');
    } else {
        // 添加到愿望清单
        wishlist.push({
            id: productId,
            ...product
        });
        button.classList.add('active');
        showMessage('已添加到收藏', 'success');
    }

    localStorage.setItem('ronghua_wishlist', JSON.stringify(wishlist));
}

// 加载愿望清单状态
function loadWishlistState() {
    document.querySelectorAll('.btn-wishlist').forEach(button => {
        const productCard = button.closest('.product-card');
        const productId = getProductId(productCard);

        if (wishlist.some(item => item.id === productId)) {
            button.classList.add('active');
        }
    });
}

// 加载更多商品
function loadMoreProducts() {
    showMessage('正在加载更多商品...', 'info');

    setTimeout(() => {
        const productsGrid = document.getElementById('productsGrid');
        const loadMoreBtn = productsGrid.querySelector('.load-more');
        const mockProducts = generateMockProducts(6);

        mockProducts.forEach((product, index) => {
            const productElement = createProductElement(product, `mock${Date.now()}_${index}`);
            productsGrid.insertBefore(productElement, loadMoreBtn);
        });

        showMessage('已加载更多商品', 'success');
    }, 1000);
}

// 生成模拟商品数据
function generateMockProducts(count) {
    const mockTitles = [
        '紫色蝴蝶兰绒花',
        '金色菊花绒花',
        '白色茉莉绒花',
        '蓝色牵牛花绒花',
        '橙色向日葵绒花',
        '粉色樱花绒花'
    ];

    const categories = ['finished', 'materials', 'tools', 'gifts'];

    return Array.from({ length: count }, (_, i) => ({
        title: mockTitles[i % mockTitles.length],
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.floor(Math.random() * 300) + 50,
        popularity: Math.floor(Math.random() * 100) + 50,
        desc: '精美手工制作，传统工艺与现代设计的完美结合',
        image: '../assets/images/product-mock.jpg'
    }));
}

// 创建商品元素
function createProductElement(product, productId) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.dataset.category = product.category;
    div.dataset.price = product.price;
    div.dataset.popularity = product.popularity;

    div.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}">
            <div class="product-actions">
                <button class="btn-quick-view" onclick="quickView(this)">👁️</button>
                <button class="btn-wishlist" onclick="toggleWishlist(this)">❤️</button>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-rating">
                <span class="stars">⭐⭐⭐⭐⭐</span>
                <span class="rating-count">(${Math.floor(Math.random() * 100) + 20})</span>
            </div>
            <div class="product-price">
                <span class="current-price">¥${product.price}</span>
                ${Math.random() > 0.6 ? `<span class="original-price">¥${Math.floor(product.price * 1.4)}</span>` : ''}
            </div>
            <div class="product-desc">${product.desc}</div>
            <button class="btn-add-cart" onclick="addToCart(this, '${productId}')">加入购物车</button>
        </div>
    `;

    return div;
}

// 加载商品数据
function loadProductData() {
    // 模拟加载延迟
    setTimeout(() => {
        // 添加产品卡片的进入动画
        const products = document.querySelectorAll('.product-card');
        products.forEach((product, index) => {
            product.style.opacity = '0';
            product.style.transform = 'translateY(30px)';
            setTimeout(() => {
                product.style.transition = 'all 0.5s ease';
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
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
