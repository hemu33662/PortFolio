const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration
const particleCount = 35;
const connectionDistance = 150;
const mouseDistance = 180;
const particleSpeed = 0.35;

// Component Definitions
const components = [
    // AND Gate (D shape)
    {
        type: 'and',
        color: '#3b82f6', // Blue
        draw: (ctx, x, y, size) => {
            const w = size * 1.2;
            const h = size;
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - w / 2, y - h / 2);
            ctx.lineTo(x - w / 2, y + h / 2);
            ctx.lineTo(x, y + h / 2);
            ctx.arc(x, y, h / 2, Math.PI / 2, -Math.PI / 2, true);
            ctx.lineTo(x - w / 2, y - h / 2);
            ctx.stroke();

            // Inputs/Output lines
            ctx.beginPath();
            ctx.moveTo(x - w / 2 - 5, y - h / 3); ctx.lineTo(x - w / 2, y - h / 3);
            ctx.moveTo(x - w / 2 - 5, y + h / 3); ctx.lineTo(x - w / 2, y + h / 3);
            ctx.moveTo(x + h / 2, y); ctx.lineTo(x + h / 2 + 5, y);
            ctx.stroke();
        }
    },
    // OR Gate (Curved)
    {
        type: 'or',
        color: '#10b981', // Emerald
        draw: (ctx, x, y, size) => {
            const w = size * 1.2;
            const h = size;
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - w, y - h / 2);
            ctx.quadraticCurveTo(x - w / 2, y, x - w, y + h / 2);
            ctx.quadraticCurveTo(x + w / 2, y + h / 2, x + w, y);
            ctx.quadraticCurveTo(x + w / 2, y - h / 2, x - w, y - h / 2);
            ctx.stroke();
        }
    },
    // XOR Gate (Double Curve)
    {
        type: 'xor',
        color: '#8b5cf6', // Violet
        draw: (ctx, x, y, size) => {
            const w = size * 1.2;
            const h = size;
            ctx.strokeStyle = '#8b5cf6';
            ctx.lineWidth = 2;

            // First curve (Input shield)
            ctx.beginPath();
            ctx.moveTo(x - w - 4, y - h / 2);
            ctx.quadraticCurveTo(x - w / 2 - 4, y, x - w - 4, y + h / 2);
            ctx.stroke();

            // Main body
            ctx.beginPath();
            ctx.moveTo(x - w, y - h / 2);
            ctx.quadraticCurveTo(x - w / 2, y, x - w, y + h / 2);
            ctx.quadraticCurveTo(x + w / 2, y + h / 2, x + w, y);
            ctx.quadraticCurveTo(x + w / 2, y - h / 2, x - w, y - h / 2);
            ctx.stroke();
        }
    },
    // NOT Gate (Triangle + Circle)
    {
        type: 'not',
        color: '#ef4444', // Red
        draw: (ctx, x, y, size) => {
            const s = size * 0.6;
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - s, y - s / 2);
            ctx.lineTo(x + s / 2, y);
            ctx.lineTo(x - s, y + s / 2);
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x + s / 2 + 2, y, 2, 0, Math.PI * 2);
            ctx.stroke();
        }
    },
    // Binary 1
    {
        type: 'one',
        color: 'rgba(255, 255, 255, 0.4)',
        draw: (ctx, x, y, size) => {
            ctx.font = `bold ${size}px monospace`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('1', x, y);
        }
    },
    // Binary 0
    {
        type: 'zero',
        color: 'rgba(255, 255, 255, 0.4)',
        draw: (ctx, x, y, size) => {
            ctx.font = `bold ${size}px monospace`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('0', x, y);
        }
    }
];

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

        // Random component
        this.component = components[Math.floor(Math.random() * components.length)];
        this.size = 14 + Math.random() * 8;

        // Random rotation (only for gates, not numbers)
        this.angle = 0;
        this.rotationSpeed = 0;
        if (this.component.type !== 'one' && this.component.type !== 'zero') {
            this.angle = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.rotationSpeed;

        // Bounce
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseDistance) {
            const force = (mouseDistance - distance) / mouseDistance;
            const directionX = (dx / distance) * force * 1.5;
            const directionY = (dy / distance) * force * 1.5;

            this.x -= directionX;
            this.y -= directionY;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        this.component.draw(ctx, 0, 0, this.size);

        ctx.restore();
    }
}

const mouse = { x: -9999, y: -9999 };

window.addEventListener('mousemove', (e) => {
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

        // Connections (Logic paths)
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / connectionDistance)})`; // Blue traces
                ctx.lineWidth = 1;
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
