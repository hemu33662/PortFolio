const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration
const particleCount = 60; // Dense enough for a network
const connectionDistance = 120;
const mouseDistance = 150;
const particleSpeed = 0.5;

function resize() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
}

window.addEventListener('resize', resize);

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * particleSpeed;
        this.vy = (Math.random() - 0.5) * particleSpeed;
        this.size = Math.random() * 2 + 1;
        // Random neon colors for home page
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#ffffff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseDistance) {
            const force = (mouseDistance - distance) / mouseDistance;
            const directionX = (dx / distance) * force * 2; // Strong repulsion
            const directionY = (dy / distance) * force * 2;

            this.x -= directionX;
            this.y -= directionY;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

const mouse = { x: -9999, y: -9999 };

window.addEventListener('mousemove', (e) => {
    // For full page background, checking offset is tricky if canvas is fixed
    // Assuming canvas covers hero or full bg
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

function init() {
    resize();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connections
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(148, 163, 184, ${0.1 * (1 - distance / connectionDistance)})`; // Subtle slate lines
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
animate();

// --- Sidebar Toggle Feature ---
document.addEventListener('DOMContentLoaded', () => {
    // Create the toggle button dynamically
    const toggleBtn = document.createElement('i');
    toggleBtn.className = 'bi bi-chevron-left sidebar-toggle d-none d-xl-flex';
    document.body.appendChild(toggleBtn);

    // Add click event
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-minimized');
    });
});
