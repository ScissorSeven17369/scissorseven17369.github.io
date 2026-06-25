/* ==========================================================================
   SEVENZONE PORTFOLIO MODULE (DYNAMIC RENDERING & INTERACTIONS)
   ========================================================================== */

let portfolioProjects = [];
let activeSystemKey = null;
let activeImageIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Detect prefix path based on folder depth
    const prefix = window.location.pathname.includes('/pages/') ? '../' : '';
    loadPortfolioData(prefix);
});

/* ==========================================================================
   LOAD & RENDER DATA
   ========================================================================== */
function loadPortfolioData(prefix) {
    const dataUrl = `${prefix}data/projects.json`;
    
    fetch(dataUrl)
        .then(response => {
            if (!response.ok) throw new Error('Network response error loading projects JSON');
            return response.json();
        })
        .then(data => {
            portfolioProjects = data;
            renderFeaturedPortfolio();
            renderFullPortfolio();
            renderFeaturedProducts();
            initFilterTabs();
            initPortfolioModalActions();
        })
        .catch(err => {
            console.error('Error loading portfolio data:', err);
            // Fallback content in case JSON fails to load (CORS local browser testing)
            loadFallbackPortfolio();
        });
}

// 1. Render main systems on Homepage (only Aura, Nexus, Nailcoute)
function renderFeaturedPortfolio() {
    const container = document.getElementById('featured-portfolio-grid');
    if (!container) return;

    container.innerHTML = '';
    const featured = portfolioProjects.filter(p => p.isFeatured);
    
    featured.forEach((project, idx) => {
        const card = createPortfolioCardHTML(project, idx + 1);
        container.appendChild(card);
    });

    // Reinitialize scroll reveal for new elements
    if (window.initScrollReveal) window.initScrollReveal();
}

// 2. Render all systems on full portfolio page
function renderFullPortfolio(filter = 'all') {
    const container = document.getElementById('full-portfolio-grid');
    if (!container) return;

    container.innerHTML = '';
    
    let filtered = portfolioProjects;
    if (filter !== 'all') {
        filtered = portfolioProjects.filter(p => {
            const categoryEs = p.category.toLowerCase();
            if (filter === 'web') return categoryEs.includes('web') || categoryEs.includes('empresarial');
            if (filter === 'mobile') return categoryEs.includes('móvil') || categoryEs.includes('aplicación');
            if (filter === 'games') return categoryEs.includes('videojuegos') || categoryEs.includes('game');
            return true;
        });
    }

    filtered.forEach((project, idx) => {
        const card = createPortfolioCardHTML(project, idx % 3 + 1);
        container.appendChild(card);
    });

    // Reinitialize scroll reveal for new elements
    if (window.initScrollReveal) window.initScrollReveal();
}

// 3. Render side products (Spacevoid, Musiczone, GameApp, etc) on Homepage/Services
function renderFeaturedProducts() {
    const container = document.getElementById('featured-products-grid');
    if (!container) return;

    container.innerHTML = '';
    const products = portfolioProjects.filter(p => !p.isFeatured);

    products.forEach((prod, idx) => {
        const card = document.createElement('div');
        card.className = `card product-card reveal delay-${(idx % 4) + 1}`;

        // Map status badges
        let statusBadge = 'Próximamente';
        if (prod.id === 'spacevoid') statusBadge = 'Disponible';
        if (prod.id === 'musiczone' || prod.id === 'gameapp') statusBadge = 'En Desarrollo';

        const statusClass = statusBadge.replace(/\s+/g, '-').toLowerCase();

        // Render Play Store download button if link is present
        let playStoreBtnHTML = '';
        if (prod.playStoreUrl) {
            playStoreBtnHTML = `
                <a href="${prod.playStoreUrl}" target="_blank" class="btn btn-secondary interactive" 
                   style="padding: 8px 16px; font-size: 0.72rem; margin-top: 15px; width: 100%; border-color: var(--cyan-tech); color: var(--cyan-tech); box-shadow: var(--glow-cyan); text-align: center; display: inline-block; text-decoration: none;">
                   Descargar en Play Store
                </a>`;
        }

        card.innerHTML = `
            <div class="scan-line"></div>
            <div class="product-icon-wrap">
                <img src="${window.location.pathname.includes('/pages/') ? '../' : ''}${prod.images[0]}" alt="${prod.name}" loading="lazy">
            </div>
            <span class="product-status status-${statusClass}">${statusBadge}</span>
            <h4>${prod.name}</h4>
            <div class="product-desc-lang">${prod.descEs}</div>
            ${playStoreBtnHTML}
            <div class="tag-container" style="justify-content: center; margin-top: 15px;">
                ${prod.tech.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
        `;
        container.appendChild(card);
    });

    // Reinitialize scroll reveal
    if (window.initScrollReveal) window.initScrollReveal();
}

/* ==========================================================================
   CARD BUILDER HELPER (REMOVED RATING STARS SYSTEM)
   ========================================================================== */
function createPortfolioCardHTML(project, delayIdx) {
    const card = document.createElement('div');
    card.className = `portfolio-card reveal delay-${delayIdx}`;
    card.setAttribute('data-system', project.id);

    const prefix = window.location.pathname.includes('/pages/') ? '../' : '';
    const mainImg = project.images[0];

    card.innerHTML = `
        <div class="scan-line"></div>
        <div class="portfolio-img-wrap">
            <img src="${prefix}${mainImg}" alt="${project.name}" loading="lazy">
            <div class="portfolio-hover-overlay">
                <span class="view-project-btn">VER CAPTURAS</span>
            </div>
        </div>
        <div class="portfolio-body">
            <span class="portfolio-category">${project.categoryEn}</span>
            <h3>${project.name}</h3>
            <p>${project.descEs}</p>
            
            <ul class="portfolio-features">
                ${project.features.map(f => `<li>${f}</li>`).join('')}
            </ul>

            <div class="tag-container">
                ${project.tech.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
        </div>
    `;

    // ── Open Modal listener ──
    card.addEventListener('click', () => {
        openPortfolioModal(project.id);
    });

    return card;
}

/* ==========================================================================
   FILTER TABS LOGIC
   ========================================================================== */
function initFilterTabs() {
    const tabs = document.querySelectorAll('.filter-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filterValue = tab.getAttribute('data-filter');
            renderFullPortfolio(filterValue);
        });
    });
}

/* ==========================================================================
   MODAL CAROUSEL LOGIC
   ========================================================================== */
function openPortfolioModal(projectId) {
    activeSystemKey = projectId;
    activeImageIndex = 0;

    const project = portfolioProjects.find(p => p.id === projectId);
    if (!project) return;

    document.getElementById('modal-title').textContent = project.name;
    document.getElementById('modal-desc').innerHTML = `
        <div class="modal-desc-split">${project.descEs}</div>
        <div class="modal-desc-split modal-desc-en">${project.descEn}</div>
    `;
    document.getElementById('modal-category').textContent = project.category;
    document.getElementById('modal-tech').textContent = project.tech.join(' | ');

    // Render Indicator dots
    const indicator = document.getElementById('modal-indicator');
    indicator.innerHTML = '';
    
    project.images.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `indicator-dot ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
            activeImageIndex = idx;
            updateModalImage();
        });
        indicator.appendChild(dot);
    });

    updateModalImage();
    
    // Open using the global function from app.js
    if (window.openModal) {
        window.openModal('portfolio-modal');
    } else {
        const modal = document.getElementById('portfolio-modal');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    }
}

function updateModalImage() {
    const project = portfolioProjects.find(p => p.id === activeSystemKey);
    if (!project) return;

    const modalImg = document.getElementById('modal-img');
    const prefix = window.location.pathname.includes('/pages/') ? '../' : '';
    
    modalImg.src = prefix + project.images[activeImageIndex];
    modalImg.classList.remove('zoomed');

    // Update active dot
    const dots = document.querySelectorAll('#modal-indicator .indicator-dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeImageIndex);
    });
}

function initPortfolioModalActions() {
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    const modalImg = document.getElementById('modal-img');

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const project = portfolioProjects.find(p => p.id === activeSystemKey);
            if (!project) return;
            
            activeImageIndex = (activeImageIndex - 1 + project.images.length) % project.images.length;
            updateModalImage();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const project = portfolioProjects.find(p => p.id === activeSystemKey);
            if (!project) return;
            
            activeImageIndex = (activeImageIndex + 1) % project.images.length;
            updateModalImage();
        });
    }

    if (modalImg) {
        modalImg.addEventListener('click', (e) => {
            e.stopPropagation();
            modalImg.classList.toggle('zoomed');
        });
    }

    // Keyboard carousel navigation
    window.addEventListener('keydown', e => {
        const pModal = document.getElementById('portfolio-modal');
        if (pModal && pModal.classList.contains('active')) {
            if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
            if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
        }
    });
}

/* ==========================================================================
   FALLBACK DATA (IN CASE OF LOCAL CORS BLOCKING ON FILE:/// ACCESS)
   ========================================================================== */
function loadFallbackPortfolio() {
    console.warn('Using local fallback data due to CORS policy blocks.');
    portfolioProjects = [
      {
        "id": "aura",
        "name": "AURA",
        "category": "Sistema Web",
        "categoryEn": "Restaurant Reservation Platform",
        "tech": ["React", "Node.js", "PostgreSQL", "Tailwind"],
        "descEs": "Plataforma de reservas y gestión de mesas para restaurantes. Asignación automática de mesas y panel administrativo moderno.",
        "descEn": "Restaurant reservation and table management platform. Automated table assignment logic and modern administrative dashboard.",
        "features": [
          "Gestión de mesas en tiempo real",
          "Reservas online instantáneas",
          "Panel administrativo de analíticas",
          "Reportes de rendimiento mensuales"
        ],
        "images": [
          "img/Aura/WhatsApp Image 2026-05-29 at 16.42.14.jpeg",
          "img/Aura/WhatsApp Image 2026-05-29 at 16.42.14 (1).jpeg",
          "img/Aura/WhatsApp Image 2026-05-29 at 16.42.14 (2).jpeg",
          "img/Aura/WhatsApp Image 2026-05-29 at 16.42.14 (3).jpeg",
          "img/Aura/WhatsApp Image 2026-05-29 at 16.42.14 (4).jpeg",
          "img/Aura/WhatsApp Image 2026-05-29 at 16.42.14 (5).jpeg"
        ],
        "isFeatured": true
      },
      {
        "id": "nexus",
        "name": "NEXUS",
        "category": "Sistema Web",
        "categoryEn": "Technology Store Platform",
        "tech": ["Next.js", "TypeScript", "MongoDB", "Stripe"],
        "descEs": "Plataforma de comercio electrónico para hardware tecnológico de gama alta con catálogos dinámicos e integración de pasarela de pago.",
        "descEn": "E-commerce platform for high-end tech hardware, featuring dynamic catalogs and payment gateway integration.",
        "features": [
          "Catálogo de hardware dinámico",
          "Filtros de búsqueda avanzada",
          "Pasarela de pago Stripe 100% segura",
          "Control de inventario automatizado"
        ],
        "images": [
          "img/Nexus/WhatsApp Image 2026-05-29 at 16.37.23.jpeg",
          "img/Nexus/WhatsApp Image 2026-05-29 at 16.37.23 (1).jpeg",
          "img/Nexus/WhatsApp Image 2026-05-29 at 16.37.23 (2).jpeg",
          "img/Nexus/WhatsApp Image 2026-05-29 at 16.37.23 (3).jpeg",
          "img/Nexus/WhatsApp Image 2026-05-29 at 16.37.23 (4).jpeg"
        ],
        "isFeatured": true
      },
      {
        "id": "nailcoute",
        "name": "NAILCOUTE",
        "category": "Sistema Web / Móvil",
        "categoryEn": "Nail Salon Appointment System",
        "tech": ["React", "Firebase", "Bootstrap", "Express"],
        "descEs": "Sistema interactivo de programación de citas y catálogo de servicios diseñado para salones de estética modernos.",
        "descEn": "Interactive appointment scheduling and service catalog system optimized for modern aesthetic salons.",
        "features": [
          "Agenda de citas interactiva",
          "Catálogo de servicios y estilistas",
          "Notificaciones y recordatorios sms/email",
          "Control de historial de clientes"
        ],
        "images": [
          "img/Nail Coute/WhatsApp Image 2026-05-29 at 16.47.58.jpeg",
          "img/Nail Coute/WhatsApp Image 2026-05-29 at 16.47.58 (1).jpeg",
          "img/Nail Coute/WhatsApp Image 2026-05-29 at 16.47.58 (2).jpeg",
          "img/Nail Coute/WhatsApp Image 2026-05-29 at 16.47.58 (3).jpeg",
          "img/Nail Coute/WhatsApp Image 2026-05-29 at 16.47.58 (4).jpeg",
          "img/Nail Coute/WhatsApp Image 2026-05-29 at 16.47.58 (5).jpeg",
          "img/Nail Coute/WhatsApp Image 2026-05-29 at 16.47.58 (6).jpeg"
        ],
        "isFeatured": true
      },
      {
        "id": "spacevoid",
        "name": "SpaceVoid",
        "category": "Videojuegos",
        "categoryEn": "Retro Game Dev",
        "tech": ["GameMaker", "Pixel Art", "2D Physics"],
        "descEs": "Videojuego Endless Runner retro en 2D desarrollado en Pixel Art por SevenZone.",
        "descEn": "Retro 2D Endless Runner game developed in Pixel Art by SevenZone.",
        "features": [
          "Estética 100% retro Pixel Art",
          "Controles táctiles responsivos",
          "Sistema de records globales (Highscores)",
          "Optimización de frames a 60fps"
        ],
        "images": ["img/IconApp/Spacevoid/icon.png"],
        "playStoreUrl": "https://play.google.com/store/apps/details?id=com.spacevoid.sevenzone",
        "isFeatured": false
      },
      {
        "id": "musiczone",
        "name": "MusicZone",
        "category": "Aplicación Móvil",
        "categoryEn": "Mobile App",
        "tech": ["Kotlin", "Android Studio", "Media API"],
        "descEs": "Reproductor de música local minimalista inspirado en interfaces multimedia premium.",
        "descEn": "Minimalist local music player inspired by premium multimedia interfaces.",
        "features": [
          "Interfaz ultra-limpia y fluida",
          "Ecualizador de audio avanzado",
          "Gestión local de listas de reproducción",
          "Soporte para múltiples formatos (MP3, FLAC, M4A)"
        ],
        "images": ["img/IconApp/MusicZone/icon.png"],
        "isFeatured": false
      },
      {
        "id": "gameapp",
        "name": "GameApp",
        "category": "Sistemas Web",
        "categoryEn": "Web Platform",
        "tech": ["React", "Node.js", "Firebase", "WebSockets"],
        "descEs": "Ecosistema unificado de gestión y plataforma de videojuegos.",
        "descEn": "Unified ecosystem for game management and distribution.",
        "features": [
          "Catálogo centralizado de juegos",
          "Perfiles de jugadores personalizables",
          "Chat interactivo en tiempo real",
          "Lanzador de juegos integrado"
        ],
        "images": ["img/IconApp/GameApp/icon.png"],
        "isFeatured": false
      },
      {
        "id": "thelastknight",
        "name": "The Last Knight",
        "category": "Videojuegos",
        "categoryEn": "Retro RPG Game",
        "tech": ["Unity", "C#", "Pixel Art"],
        "descEs": "RPG de aventuras Pixel Art actualmente en desarrollo conceptual.",
        "descEn": "Pixel Art adventure RPG currently in conceptual development.",
        "features": [
          "Sistema de combate por turnos",
          "Historia inmersiva con ramificaciones",
          "Arte Pixel Art detailed a mano",
          "Banda sonora interactiva chiptune"
        ],
        "images": ["img/IconApp/The Last Knight/icon.png"],
        "isFeatured": false
      }
    ];
    renderFeaturedPortfolio();
    renderFullPortfolio();
    renderFeaturedProducts();
    initFilterTabs();
    initPortfolioModalActions();
}
