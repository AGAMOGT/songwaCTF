// Matrix Rain Effect
function createMatrixRain() {
    const matrixBg = document.getElementById('matrix-bg');
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    
    for (let i = 0; i < 50; i++) {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.textContent = chars[Math.floor(Math.random() * chars.length)];
        char.style.left = Math.random() * 100 + 'vw';
        char.style.animationDelay = Math.random() * 5 + 's';
        char.style.animationDuration = (3 + Math.random() * 5) + 's';
        matrixBg.appendChild(char);
    }
}

// Check authentication status
function checkAuth() {
    const user = localStorage.getItem('ctf_user');
    if (user && window.location.pathname === '/index.html') {
        window.location.href = 'dashboard.html';
    }
    return user ? JSON.parse(user) : null;
}

// Navigasi smooth scroll
document.addEventListener('DOMContentLoaded', function() {
    createMatrixRain();
    checkAuth();
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
