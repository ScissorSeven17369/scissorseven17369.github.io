/* ==========================================================================
   SEVENZONE EFFECTS (SCROLL REVEAL & TERMINAL TYPING)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initTerminalTyping();
});

/* ==========================================================================
   SCROLL REVEAL SYSTEM (LIGHTWEIGHT OBSERVER)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve once revealed to save CPU resources
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
    
    // Attach helper to window in case dynamic content is rendered later
    window.initScrollReveal = () => {
        const freshElements = document.querySelectorAll('.reveal:not(.visible)');
        freshElements.forEach(el => revealObserver.observe(el));
    };
}

/* ==========================================================================
   TERMINAL TYPING EFFECTS
   ========================================================================== */
function initTerminalTyping() {
    const terminal = document.querySelector('.terminal-body');
    if (!terminal) return;

    // Secret double-click Easter Egg (visit counter)
    const secretBtn = document.getElementById('secret-btn');
    const viewsOutput = document.getElementById('views-output');
    
    if (secretBtn && viewsOutput) {
        // Increment visits
        let visitCount = localStorage.getItem('sevenzone_visits') || 0;
        visitCount++;
        localStorage.setItem('sevenzone_visits', visitCount);
        
        const countSpan = document.getElementById('views-count');
        if (countSpan) countSpan.textContent = visitCount;

        secretBtn.addEventListener('dblclick', () => {
            viewsOutput.style.display = viewsOutput.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Dynamic cursor placement logic
    const cursor = terminal.querySelector('.cursor');
    const cliLine = terminal.querySelector('.cli-prompt-line');
    
    if (cursor && cliLine) {
        // Typing text sequence
        const textToType = " ssh guest@sevenzone.studio --secure";
        let charIndex = 0;
        
        setTimeout(() => {
            typeCharacter();
        }, 1000);

        function typeCharacter() {
            if (charIndex < textToType.length) {
                cliLine.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(typeCharacter, 45); // Constant clean speed
            } else {
                // Show completion prompt
                setTimeout(() => {
                    const outputLine = document.createElement('p');
                    outputLine.className = 'output';
                    outputLine.innerHTML = '► Connection established. <span class="highlight">GUEST_SESSION STARTED</span>';
                    
                    const systemCheck = document.createElement('p');
                    systemCheck.className = 'output';
                    systemCheck.innerHTML = '► Ecosistema: <span class="highlight">7 Nodos Activos</span> | Status: <span class="highlight">ONLINE</span>';
                    
                    terminal.insertBefore(outputLine, cursor.parentNode);
                    terminal.insertBefore(systemCheck, cursor.parentNode);
                }, 300);
            }
        }
    }
}
