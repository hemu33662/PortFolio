const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration
const particleCount = 40;
const connectionDistance = 150;
const mouseDistance = 180;
const particleSpeed = 0.3;

// Component Definitions
const components = [
    // Resistor (Zigzag)
    {
        type: 'resistor',
        color: '#fbbf24', // Amber
        draw: (ctx, x, y, size) => {
            ctx.beginPath();
            ctx.lineWidth = 2;
            const w = size;
            const h = size / 2;
            ctx.moveTo(x - w / 2, y);
            ctx.lineTo(x - w / 3, y - h);
            ctx.lineTo(x - w / 6, y + h);
            ctx.lineTo(x + w / 6, y - h);
            ctx.lineTo(x + w / 3, y + h);
            ctx.lineTo(x + w / 2, y);
            ctx.stroke();
        }
    },
    // Capacitor (Parallel Plates)
    {
        type: 'capacitor',
        color: '#22d3ee', // Cyan
        draw: (ctx, x, y, size) => {
            ctx.beginPath();
            ctx.lineWidth = 2;
            const gap = 4;
            const h = size * 0.8;
            // Plate 1
            ctx.moveTo(x - gap, y - h / 2);
            ctx.lineTo(x - gap, y + h / 2);
            // Plate 2
            ctx.moveTo(x + gap, y - h / 2);
            ctx.lineTo(x + gap, y + h / 2);
            ctx.stroke();
        }
    },
    // Diode (Triangle + Bar)
    {
        type: 'diode',
        color: '#f472b6', // Pink
        draw: (ctx, x, y, size) => {
            ctx.beginPath();
            ctx.lineWidth = 2;
            const s = size * 0.6;
            // Triangle
            ctx.moveTo(x - s, y - s);
            ctx.lineTo(x - s, y + s);
            ctx.lineTo(x + s, y);
            ctx.closePath();
            ctx.stroke(); // Outline or fill? Let's fill for visibility
            ctx.fill();

            // Bar
            ctx.beginPath();
            ctx.moveTo(x + s, y - s);
            ctx.lineTo(x + s, y + s);
            ctx.stroke();
        }
    },
    // Logic: AND Gate (D shape)
    {
        type: 'and',
        color: '#818cf8', // Indigo
        draw: (ctx, x, y, size) => {
            ctx.beginPath();
            ctx.lineWidth = 2;
            const w = size * 0.8;
            const h = size * 0.8;
            ctx.moveTo(x - w / 2, y - h / 2);
            ctx.lineTo(x - w / 2, y + h / 2); // Back line
            ctx.lineTo(x, y + h / 2); // Bottom
            ctx.arc(x, y, h / 2, Math.PI / 2, -Math.PI / 2, true); // Curve
            ctx.lineTo(x - w / 2, y - h / 2); // Top closure
            ctx.stroke();
        }
    },
    // Logic: NOT Gate (Triangle + Circle)
    {
        type: 'not',
        color: '#ef4444', // Red (Logic Low/High contrast)
        draw: (ctx, x, y, size) => {
            ctx.beginPath();
            ctx.lineWidth = 2;
            const s = size * 0.5;
            // Triangle
            ctx.moveTo(x - s, y - s);
            ctx.lineTo(x + s, y);
            ctx.lineTo(x - s, y + s);
            ctx.closePath();
            ctx.stroke();
            // Circle
            ctx.beginPath();
            ctx.arc(x + s + 3, y, 3, 0, Math.PI * 2);
            ctx.stroke();
        }
    },
    // Logic: OR Gate (Curved back)
    {
        type: 'or',
        color: '#34d399', // Emerald
        draw: (ctx, x, y, size) => {
            ctx.beginPath();
            ctx.lineWidth = 2;
            const w = size * 0.8;
            const h = size * 0.6;

            // Curved Back
            ctx.moveTo(x - w, y - h);
            ctx.quadraticCurveTo(x - w / 2, y, x - w, y + h);

            // Top Curve
            ctx.quadraticCurveTo(x + w / 2, y + h, x + w, y);

            // Bottom Curve
            ctx.moveTo(x - w, y - h);
            ctx.quadraticCurveTo(x + w / 2, y - h, x + w, y);

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
        this.size = 20 + Math.random() * 10; // Slightly larger for detail

        // Random rotation for some variety
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

        ctx.strokeStyle = this.component.color;
        ctx.fillStyle = this.component.color;

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
                ctx.strokeStyle = `rgba(148, 163, 184, ${0.15 * (1 - distance / connectionDistance)})`; // Slate-ish wire color
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
