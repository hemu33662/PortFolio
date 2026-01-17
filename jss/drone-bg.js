const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration
const particleCount = 25; // Fewer particles, larger size
const connectionDistance = 180;
const mouseDistance = 200;
const particleSpeed = 0.5; // Faster for drones

// Component Definitions
const components = [
    // Drone (Quadcopter)
    {
        type: 'drone',
        color: '#22d3ee', // Cyan
        draw: (ctx, x, y, size) => {
            const s = size * 0.8;
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 2;

            // X Frame
            ctx.beginPath();
            ctx.moveTo(x - s, y - s);
            ctx.lineTo(x + s, y + s);
            ctx.moveTo(x + s, y - s);
            ctx.lineTo(x - s, y + s);
            ctx.stroke();

            // Rotors (Circles)
            ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
            const r = s * 0.4;
            [
                { dx: -s, dy: -s }, { dx: s, dy: -s },
                { dx: -s, dy: s }, { dx: s, dy: s }
            ].forEach(pos => {
                ctx.beginPath();
                ctx.arc(x + pos.dx, y + pos.dy, r, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });

            // Center Body
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x, y, s * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    // Package (Box)
    {
        type: 'package',
        color: '#fbbf24', // Amber
        draw: (ctx, x, y, size) => {
            const s = size * 0.6;
            ctx.strokeStyle = '#fbbf24';
            ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
            ctx.lineWidth = 2;

            // Box
            ctx.beginPath();
            ctx.rect(x - s, y - s, s * 2, s * 2);
            ctx.fill();
            ctx.stroke();

            // Tape lines (Cross)
            ctx.beginPath();
            ctx.moveTo(x, y - s);
            ctx.lineTo(x, y + s);
            ctx.moveTo(x - s, y);
            ctx.lineTo(x + s, y);
            ctx.stroke();
        }
    },
    // Location (Pin)
    {
        type: 'location',
        color: '#f472b6', // Pink
        draw: (ctx, x, y, size) => {
            const s = size * 0.8;
            ctx.strokeStyle = '#f472b6';
            ctx.fillStyle = 'rgba(244, 114, 182, 0.2)';
            ctx.lineWidth = 2;

            ctx.beginPath();
            // Drop shape
            ctx.arc(x, y - s / 2, s, Math.PI, 0);
            ctx.lineTo(x, y + s * 1.5); // Point
            ctx.lineTo(x - s, y - s / 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Center dot
            ctx.fillStyle = '#f472b6';
            ctx.beginPath();
            ctx.arc(x, y - s / 2, s * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    // Medical (Cross)
    {
        type: 'medical',
        color: '#ef4444', // Red
        draw: (ctx, x, y, size) => {
            const s = size * 0.7;
            ctx.fillStyle = '#ef4444';

            ctx.beginPath();
            // Horizontal bar
            ctx.rect(x - s, y - s / 3, s * 2, s * 2 / 3);
            // Vertical bar
            ctx.rect(x - s / 3, y - s, s * 2 / 3, s * 2);
            ctx.fill();
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
        this.size = 15 + Math.random() * 10;

        // Drones might drift more?
        if (this.component.type === 'drone') {
            this.vx *= 1.5;
            this.vy *= 1.5;
        }
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
            const directionX = (dx / distance) * force * 1.5;
            const directionY = (dy / distance) * force * 1.5;

            this.x -= directionX;
            this.y -= directionY;
        }
    }

    draw() {
        ctx.save();
        // Slight bobbing or rotating? Drones tilt?
        // Let's keep it simple for now to avoid complexity issues with alignment
        this.component.draw(ctx, this.x, this.y, this.size);
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

        // Connections (Flight paths?)
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                // If one is drone and other is package/location, draw connection?
                // Or just standard connections for "network" feel
                ctx.beginPath();
                ctx.strokeStyle = `rgba(50, 200, 250, ${0.1 * (1 - distance / connectionDistance)})`; // Sky blue traces
                ctx.setLineDash([5, 5]); // Dashed lines for flight paths
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.setLineDash([]); // Reset
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
