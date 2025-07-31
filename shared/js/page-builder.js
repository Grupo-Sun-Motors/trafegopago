/**
 * Sun Motors - Page Builder Utility
 * Builds pages dynamically using shared components
 */

class PageBuilder {
    constructor() {
        this.baseTemplate = null;
        this.sidemenuComponent = null;
    }

    async loadComponents() {
        try {
            // Load sidemenu component
            const sidemenuResponse = await fetch('./shared/components/sidemenu.html');
            this.sidemenuComponent = await sidemenuResponse.text();
        } catch (error) {
            console.error('Error loading components:', error);
            this.sidemenuComponent = this.getFallbackSidemenu();
        }
    }

    getFallbackSidemenu() {
        return `
        <!-- Mobile Overlay -->
        <div class="overlay" id="overlay"></div>
        
        <!-- Sidemenu -->
        <div class="sidemenu mobile-hidden" id="sidemenu">
            <!-- Header -->
            <div class="sidemenu-header">
                <div class="sidemenu-logo">
                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                    <span class="sidemenu-text">Sun Motors</span>
                </div>
                
                <div class="sidemenu-controls">
                    <button class="sidemenu-btn desktop-collapse-btn" id="collapseBtn" title="Recolher menu (Ctrl+B)">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
                        </svg>
                    </button>
                    
                    <button class="sidemenu-btn mobile-close-btn" id="closeMobileMenu" title="Fechar menu">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <!-- Navigation -->
            <nav class="sidemenu-nav">
                <a href="./" class="nav-item" data-page="dashboard">
                    <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                    </svg>
                    <span class="sidemenu-text">Dashboard</span>
                </a>
                
                <a href="./pages/orcamento" class="nav-item" data-page="orcamento">
                    <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    <span class="sidemenu-text">Orçamento</span>
                </a>
                
                <a href="./pages/publico-alvo" class="nav-item" data-page="publico-alvo">
                    <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <span class="sidemenu-text">Público-Alvo</span>
                </a>
                
                <a href="./pages/otimizacoes" class="nav-item" data-page="otimizacoes">
                    <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    <span class="sidemenu-text">Otimizações</span>
                </a>
                
                <a href="./pages/relatorios" class="nav-item" data-page="relatorios">
                    <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <span class="sidemenu-text">Relatórios</span>
                </a>
            </nav>
        </div>`;
    }

    buildPage(config) {
        const {
            title = 'Dashboard',
            header = 'Dashboard',
            content = '',
            pageStyles = '',
            pageScripts = '',
            cssPath = './shared',
            jsPath = './shared'
        } = config;

        // Determine navigation paths based on current location
        const currentPath = window.location.pathname;
        let navPaths = {
            dashboard: './',
            orcamento: './pages/orcamento',
            publicoAlvo: './pages/publico-alvo',
            otimizacoes: './pages/otimizacoes',
            relatorios: './pages/relatorios'
        };

        // Adjust paths for subdirectories
        if (currentPath.includes('/pages/')) {
            navPaths = {
                dashboard: '../../',
                orcamento: '../orcamento',
                publicoAlvo: '../publico-alvo',
                otimizacoes: '../otimizacoes',
                relatorios: '../relatorios'
            };
        }

        // Update navigation links in sidemenu
        let sidemenuHtml = this.sidemenuComponent;
        sidemenuHtml = sidemenuHtml.replace('href="../../"', `href="${navPaths.dashboard}"`);
        sidemenuHtml = sidemenuHtml.replace('href="../../pages/orcamento"', `href="${navPaths.orcamento}"`);
        sidemenuHtml = sidemenuHtml.replace('href="../../pages/publico-alvo"', `href="${navPaths.publicoAlvo}"`);
        sidemenuHtml = sidemenuHtml.replace('href="../../pages/otimizacoes"', `href="${navPaths.otimizacoes}"`);
        sidemenuHtml = sidemenuHtml.replace('href="../../pages/relatorios"', `href="${navPaths.relatorios}"`);

        const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Sun Motors</title>
    
    <!-- External Dependencies -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Shared Styles -->
    <link rel="stylesheet" href="${cssPath}/css/layout.css">
    
    <!-- Page Specific Styles -->
    ${pageStyles}
    
    <!-- Tailwind Configuration -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        'inter': ['Inter', 'sans-serif'],
                    }
                }
            }
        }
    </script>
</head>
<body class="text-gray-800">
    <!-- Include Sidemenu Component -->
    ${sidemenuHtml}
    
    <!-- Main Content -->
    <div class="main-content" id="mainContent">
        <!-- Top Header -->
        <header class="top-header">
            <button class="mobile-menu-btn" id="mobileMenuBtn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
                <span class="sr-only">Abrir menu</span>
            </button>
            
            <h1>${header}</h1>
            
            <!-- Spacer for mobile alignment -->
            <div class="w-8"></div>
        </header>

        <!-- Page Content -->
        <div class="main-content-inner">
            <div class="content-container">
                ${content}
            </div>
        </div>
    </div>

    <!-- Shared JavaScript -->
    <script src="${jsPath}/js/sidemenu.js"></script>
    
    <!-- Page Specific JavaScript -->
    ${pageScripts}
</body>
</html>`;

        return html;
    }

    async renderPage(config) {
        await this.loadComponents();
        return this.buildPage(config);
    }

    static createPageContent(sections) {
        return sections.map(section => {
            if (typeof section === 'string') {
                return section;
            }
            
            const { tag = 'div', className = '', content = '', attributes = {} } = section;
            const attrs = Object.entries(attributes)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');
            
            return `<${tag} class="${className}" ${attrs}>${content}</${tag}>`;
        }).join('\n');
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageBuilder;
}

// Global access
window.PageBuilder = PageBuilder; 