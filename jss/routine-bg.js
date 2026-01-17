const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration
const particleCount = 20; // Fewer particles, focused
const connectionDistance = 160;
const mouseDistance = 200;
const particleSpeed = 0.3;

// Component Definitions
const components = [
    // Clock (Time)
    {
        type: 'clock',
        color: '#fbbf24', // Amber
        draw: (ctx, x, y, size) => {
            const r = size * 0.8;
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.stroke();

            // Hands
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y - r * 0.6); // Hour hand
            ctx.moveTo(x, y);
            ctx.lineTo(x + r * 0.4, y + r * 0.4); // Minute hand
            ctx.stroke();
        }
    },
    // Calendar/Schedule
    {
        type: 'calendar',
        color: '#f472b6', // Pink
        draw: (ctx, x, y, size) => {
            const w = size * 1.2;
            const h = size * 1;
            ctx.strokeStyle = '#f472b6';
            ctx.lineWidth = 2;

            // Box
            ctx.strokeRect(x - w / 2, y - h / 2, w, h);

            // Top rim
            ctx.beginPath();
            ctx.moveTo(x - w / 2, y - h / 2 + 4);
            ctx.lineTo(x + w / 2, y - h / 2 + 4);
            ctx.stroke();

            // Checkmark inside?
            ctx.beginPath();
            ctx.moveTo(x - 5, y);
            ctx.lineTo(x - 2, y + 4);
            ctx.lineTo(x + 5, y - 4);
            ctx.stroke();
        }
    },
    // Video Call (Camera)
    {
        type: 'video',
        color: '#22d3ee', // Cyan
        draw: (ctx, x, y, size) => {
            const w = size;
            const h = size * 0.7;
            ctx.strokeStyle = '#22d3ee';
            ctx.fillStyle = 'rgba(34, 211, 238, 0.2)';
            ctx.lineWidth = 2;

            // Main body
            ctx.fillRect(x - w / 2, y - h / 2, w, h);
            ctx.strokeRect(x - w / 2, y - h / 2, w, h);

            // Lens triangle
            ctx.beginPath();
            ctx.moveTo(x + w / 2, y);
            ctx.lineTo(x + w / 2 + 6, y - 5);
            ctx.lineTo(x + w / 2 + 6, y + 5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    },
    // Link/Chain
    {
        type: 'link',
        color: '#34d399', // Emerald
        draw: (ctx, x, y, size) => {
            const s = size * 0.5;
            ctx.strokeStyle = '#34d399';
            ctx.lineWidth = 2;

            ctx.save();
            ctx.rotate(-Math.PI / 4);
            // Oval 1
            ctx.beginPath();
            ctx.ellipse(x - s / 2, y, s, s / 2, 0, 0, Math.PI * 2);
            ctx.stroke();
            // Oval 2
            ctx.beginPath();
            ctx.ellipse(x + s / 2, y, s, s / 2, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    },
    // Gmail/Mail Envelope
    {
        type: 'mail',
        color: '#ef4444', // Red
        draw: (ctx, x, y, size) => {
            const w = size * 1.4;
            const h = size * 0.9;
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;

            ctx.strokeRect(x - w / 2, y - h / 2, w, h);
            ctx.beginPath();
            ctx.moveTo(x - w / 2, y - h / 2);
            ctx.lineTo(x, y + 2);
            ctx.lineTo(x + w / 2, y - h / 2);
            ctx.stroke();
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

        // Random rotation
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
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

        // Connections
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(200, 200, 255, ${0.1 * (1 - distance / connectionDistance)})`;
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
