const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration
const particleCount = 40; // Fewer particles for text clarity
const connectionDistance = 140;
const mouseDistance = 180;
const particleSpeed = 0.4;

// Sentiment Types
const sentiments = [
    { text: ':)', color: '#10b981' }, // Positive (Green)
    { text: ':(', color: '#ef4444' }, // Negative (Red)
    { text: ':|', color: '#3b82f6' }  // Neutral (Blue)
];

function resize() {
    // Ensure parent exists
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

        // Random sentiment
        const type = sentiments[Math.floor(Math.random() * sentiments.length)];
        this.text = type.text;
        this.color = type.color;
        this.size = 14 + Math.random() * 8; // Font size
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
            const directionX = (dx / distance) * force * 1.5; // Stronger push
            const directionY = (dy / distance) * force * 1.5;

            this.x -= directionX;
            this.y -= directionY;
        }
    }

    draw() {
        ctx.font = `bold ${this.size}px monospace`;
        ctx.fillStyle = this.color;

        // Save context to rotate text (optional, but keep simple for now)
        ctx.fillText(this.text, this.x, this.y);
    }
}

const mouse = { x: -9999, y: -9999 }; // Off-screen default

// Listen on window to catch mouse even if not directly over canvas (due to z-index)
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
                // Determine line color - gradient or solid?
                // Let's use a very faint purple/white
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - distance / connectionDistance)})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x + 10, particles[i].y - 5); // Approximate center of text
                ctx.lineTo(particles[j].x + 10, particles[j].y - 5);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

// Wait for DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
animate();
