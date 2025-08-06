/* 图片资源配置文件 */

// 项目所需图片资源列表
const IMAGE_ASSETS = {
    // 基础图标和Logo
    logo: {
        path: 'assets/images/logo.png',
        description: '绒花Logo',
        size: '100x100',
        format: 'PNG'
    },

    // 轮播横幅图片
    banners: [
        {
            path: 'assets/images/banner1.jpg',
            description: '绒花艺术展示',
            size: '1920x500',
            format: 'JPEG'
        },
        {
            path: 'assets/images/banner2.jpg',
            description: '手工制作场景',
            size: '1920x500',
            format: 'JPEG'
        },
        {
            path: 'assets/images/banner3.jpg',
            description: '社区交流场景',
            size: '1920x500',
            format: 'JPEG'
        }
    ],

    // 功能图标
    icons: [
        {
            path: 'assets/images/icon-encyclopedia.svg',
            description: '百科图标',
            format: 'SVG'
        },
        {
            path: 'assets/images/icon-tutorial.svg',
            description: '教程图标',
            format: 'SVG'
        },
        {
            path: 'assets/images/icon-community.svg',
            description: '社区图标',
            format: 'SVG'
        },
        {
            path: 'assets/images/icon-shop.svg',
            description: '商城图标',
            format: 'SVG'
        }
    ],

    // 新闻图片
    news: [
        {
            path: 'assets/images/news1.jpg',
            description: '新闻图片1',
            size: '400x250',
            format: 'JPEG'
        },
        {
            path: 'assets/images/news2.jpg',
            description: '新闻图片2',
            size: '400x250',
            format: 'JPEG'
        },
        {
            path: 'assets/images/news3.jpg',
            description: '新闻图片3',
            size: '400x250',
            format: 'JPEG'
        }
    ],

    // 历史文化图片
    history: [
        {
            path: 'assets/images/history1.jpg',
            description: '汉唐时期绒花',
            size: '600x400',
            format: 'JPEG'
        },
        {
            path: 'assets/images/history2.jpg',
            description: '宋明时期绒花',
            size: '600x400',
            format: 'JPEG'
        },
        {
            path: 'assets/images/history3.jpg',
            description: '清代绒花',
            size: '600x400',
            format: 'JPEG'
        },
        {
            path: 'assets/images/history4.jpg',
            description: '现代绒花',
            size: '600x400',
            format: 'JPEG'
        }
    ],

    // 工艺流程图片
    crafts: [
        {
            path: 'assets/images/craft1.jpg',
            description: '选料准备',
            size: '500x350',
            format: 'JPEG'
        },
        {
            path: 'assets/images/craft2.jpg',
            description: '打毛整理',
            size: '500x350',
            format: 'JPEG'
        },
        {
            path: 'assets/images/craft3.jpg',
            description: '扎花成型',
            size: '500x350',
            format: 'JPEG'
        },
        {
            path: 'assets/images/craft4.jpg',
            description: '修整定型',
            size: '500x350',
            format: 'JPEG'
        }
    ],

    // 材料工具图片
    materials: [
        {
            path: 'assets/images/material1.jpg',
            description: '蚕丝材料',
            size: '300x300',
            format: 'JPEG'
        },
        {
            path: 'assets/images/material2.jpg',
            description: '天然染料',
            size: '300x300',
            format: 'JPEG'
        },
        {
            path: 'assets/images/material3.jpg',
            description: '细铜丝',
            size: '300x300',
            format: 'JPEG'
        },
        {
            path: 'assets/images/material4.jpg',
            description: '专用胶水',
            size: '300x300',
            format: 'JPEG'
        }
    ],

    tools: [
        {
            path: 'assets/images/tool1.jpg',
            description: '打毛梳',
            size: '300x300',
            format: 'JPEG'
        },
        {
            path: 'assets/images/tool2.jpg',
            description: '扎制钳',
            size: '300x300',
            format: 'JPEG'
        },
        {
            path: 'assets/images/tool3.jpg',
            description: '修整剪',
            size: '300x300',
            format: 'JPEG'
        },
        {
            path: 'assets/images/tool4.jpg',
            description: '造型板',
            size: '300x300',
            format: 'JPEG'
        }
    ],

    // 传承大师图片
    masters: [
        {
            path: 'assets/images/master1.jpg',
            description: '赵树宪大师',
            size: '400x500',
            format: 'JPEG'
        },
        {
            path: 'assets/images/master2.jpg',
            description: '李月娥大师',
            size: '400x500',
            format: 'JPEG'
        },
        {
            path: 'assets/images/master3.jpg',
            description: '王志新大师',
            size: '400x500',
            format: 'JPEG'
        }
    ],

    // AI头像和用户头像
    avatars: {
        ai: {
            path: 'assets/images/ai-avatar.png',
            description: 'AI助手头像',
            size: '80x80',
            format: 'PNG'
        },
        default: {
            path: 'assets/images/default-avatar.png',
            description: '默认用户头像',
            size: '80x80',
            format: 'PNG'
        }
    }
};

// 图片懒加载配置
const LAZY_LOAD_CONFIG = {
    threshold: 0.1,
    rootMargin: '50px',
    defaultImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTllY2VmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWKoOi9veS4rS4uLjwvdGV4dD48L3N2Zz4='
};

// 图片优化建议
const OPTIMIZATION_TIPS = {
    webp: '建议使用WebP格式以获得更好的压缩率',
    responsive: '建议提供多种尺寸的响应式图片',
    lazy: '建议对非首屏图片使用懒加载',
    cdn: '建议使用CDN加速图片加载'
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        IMAGE_ASSETS,
        LAZY_LOAD_CONFIG,
        OPTIMIZATION_TIPS
    };
}
