/* ==========================================================================
   SEVENZONE MAIN CORE APP (SHARED LOGIC)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initCanvasParticles();
    initModalCloseListeners();
});

/* ==========================================================================
   NAVBAR & MOBILE MENU
   ========================================================================== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toggle Mobile Hamburger Menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            // Toggle hamburger icon animation
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close menu on click of mobile nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });
}

/* ==========================================================================
   PIXEL ART CANVAS PARTICLES (OPTIMIZED)
   ========================================================================== */
function initCanvasParticles() {
    const canvas = document.getElementById('pixel-canvas');
    if (!canvas) return;

    // PERFORMANCE OPTIMIZATION: Do not run canvas loops on mobile devices
    if (window.innerWidth < 768) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    let particles = [];
    const PIXEL_SIZE = 3;

    // Color Ratio: 70% Electric Blue, 20% Tech Cyan, 10% Purple Accent
    const colors = [
        { code: '#00A8FF', weight: 0.70 },
        { code: '#00E5FF', weight: 0.20 },
        { code: '#8B5CF6', weight: 0.10 }
    ];

    function getRandomColor() {
        const rand = Math.random();
        let cumulativeWeight = 0;
        for (const color of colors) {
            cumulativeWeight += color.weight;
            if (rand <= cumulativeWeight) {
                return color.code;
            }
        }
        return colors[0].code;
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        // Performance: Reduced particle density (divided by 75000 instead of 15000)
        const count = Math.floor((canvas.width * canvas.height) / 75000);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: PIXEL_SIZE * (Math.random() < 0.2 ? 2 : 1),
                alpha: Math.random() * 0.35 + 0.05,
                speed: Math.random() * 0.15 + 0.03,
                dir: Math.random() > 0.5 ? 1 : -1,
                drift: (Math.random() - 0.5) * 0.2,
                color: getRandomColor(),
                blink: Math.random() * Math.PI * 2,
                blinkSpeed: Math.random() * 0.01 + 0.002
            });
        }
    }

    function draw() {
        // Stop animation if screen resized to mobile width to save CPU
        if (window.innerWidth < 768) {
            canvas.style.display = 'none';
            return;
        }
        canvas.style.display = 'block';

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) {
            p.blink += p.blinkSpeed;
            ctx.globalAlpha = p.alpha * (0.4 + 0.6 * Math.sin(p.blink));
            ctx.fillStyle = p.color;
            ctx.fillRect(
                Math.round(p.x / PIXEL_SIZE) * PIXEL_SIZE,
                Math.round(p.y / PIXEL_SIZE) * PIXEL_SIZE,
                p.size,
                p.size
            );
            
            p.y -= p.speed * p.dir;
            p.x += p.drift;
            
            if (p.y < -10) p.y = canvas.height + 10;
            if (p.y > canvas.height + 10) p.y = -10;
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && particles.length === 0) {
            resize();
            createParticles();
            requestAnimationFrame(draw);
        }
    });
    requestAnimationFrame(draw);
}

/* ==========================================================================
   MODAL DIALOG MANAGEMENT
   ========================================================================== */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        if (modalId === 'portfolio-modal') {
            const modalImg = document.getElementById('modal-img');
            if (modalImg) modalImg.classList.remove('zoomed');
        }
    }, 400);
    document.body.style.overflow = '';
}

function initModalCloseListeners() {
    document.querySelectorAll('.custom-modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal || e.target.classList.contains('modal-container')) {
                closeModal(modal.id);
            }
        });
    });

    window.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.custom-modal.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}
