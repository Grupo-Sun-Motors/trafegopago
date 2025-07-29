/**
 * Sun Motors - Shared Sidemenu Controller
 * Modular sidemenu functionality for all pages
 */

class SidemenuController {
    constructor() {
        this.sidemenu = null;
        this.mainContent = null;
        this.overlay = null;
        this.mobileMenuBtn = null;
        this.closeMobileMenu = null;
        this.collapseBtn = null;
        this.isCollapsed = false;
        this.isMobile = false;
        
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.cacheElements();
        this.bindEvents();
        this.handleResize();
        this.setActiveNavItem();
    }

    cacheElements() {
        this.sidemenu = document.getElementById('sidemenu');
        this.mainContent = document.querySelector('.main-content');
        this.overlay = document.getElementById('overlay');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.closeMobileMenu = document.getElementById('closeMobileMenu');
        this.collapseBtn = document.getElementById('collapseBtn');

        if (!this.sidemenu) {
            console.warn('Sidemenu element not found. Make sure to include the sidemenu HTML.');
            return;
        }
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => this.openMobileMenu());
        }

        // Close mobile menu
        if (this.closeMobileMenu) {
            this.closeMobileMenu.addEventListener('click', () => this.closeMobileMenu());
        }

        // Overlay click to close
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeMobileMenu());
        }

        // Desktop collapse toggle
        if (this.collapseBtn) {
            this.collapseBtn.addEventListener('click', () => this.toggleCollapse());
        }

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    openMobileMenu() {
        if (!this.sidemenu || !this.overlay) return;

        this.sidemenu.classList.remove('mobile-hidden');
        this.overlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Focus management for accessibility
        const firstNavItem = this.sidemenu.querySelector('.nav-item');
        if (firstNavItem) {
            firstNavItem.focus();
        }
    }

    closeMobileMenu() {
        if (!this.sidemenu || !this.overlay) return;

        this.sidemenu.classList.add('mobile-hidden');
        this.overlay.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Return focus to mobile menu button
        if (this.mobileMenuBtn && !this.mobileMenuBtn.style.display === 'none') {
            this.mobileMenuBtn.focus();
        }
    }

    toggleCollapse() {
        if (!this.sidemenu || !this.mainContent) return;

        this.isCollapsed = !this.isCollapsed;
        
        if (this.isCollapsed) {
            this.sidemenu.classList.add('collapsed');
            this.mainContent.classList.add('collapsed');
            localStorage.setItem('sidemenu-collapsed', 'true');
        } else {
            this.sidemenu.classList.remove('collapsed');
            this.mainContent.classList.remove('collapsed');
            localStorage.setItem('sidemenu-collapsed', 'false');
        }

        // Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('sidemenu-toggle', { 
            detail: { collapsed: this.isCollapsed } 
        }));
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 768;

        // Close mobile menu when switching to desktop
        if (wasMobile && !this.isMobile) {
            this.closeMobileMenu();
        }

        // Auto-close mobile menu if screen becomes too wide
        if (!this.isMobile && this.sidemenu && !this.sidemenu.classList.contains('mobile-hidden')) {
            this.sidemenu.classList.remove('mobile-hidden');
        }
    }

    handleKeydown(e) {
        // ESC key to close mobile menu
        if (e.key === 'Escape' && this.isMobile) {
            this.closeMobileMenu();
        }

        // Ctrl/Cmd + B to toggle collapse (desktop only)
        if ((e.ctrlKey || e.metaKey) && e.key === 'b' && !this.isMobile) {
            e.preventDefault();
            this.toggleCollapse();
        }
    }

    setActiveNavItem() {
        const currentPath = window.location.pathname;
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.classList.remove('active');
            
            const href = item.getAttribute('href');
            if (href) {
                // Handle different path patterns
                if (currentPath.endsWith(href) || 
                    (href.includes('index.html') && currentPath.endsWith('/')) ||
                    currentPath.includes(href.replace('.html', '').replace('./index', ''))) {
                    item.classList.add('active');
                }
            }
        });
    }

    restoreState() {
        // Restore collapse state from localStorage
        const savedState = localStorage.getItem('sidemenu-collapsed');
        if (savedState === 'true' && !this.isMobile) {
            this.isCollapsed = true;
            if (this.sidemenu && this.mainContent) {
                this.sidemenu.classList.add('collapsed');
                this.mainContent.classList.add('collapsed');
            }
        }
    }

    // Public API methods
    collapse() {
        if (!this.isCollapsed) {
            this.toggleCollapse();
        }
    }

    expand() {
        if (this.isCollapsed) {
            this.toggleCollapse();
        }
    }

    isMenuCollapsed() {
        return this.isCollapsed;
    }

    isMobileView() {
        return this.isMobile;
    }
}

// Initialize sidemenu when script loads
let sidemenuController;

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    sidemenuController = new SidemenuController();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SidemenuController;
}

// Global access
window.SidemenuController = SidemenuController; 