const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration
const particleCount = 35; 
const connectionDistance = 150;
const mouseDistance = 180;
const particleSpeed = 0.5;

// Mail Colors (Enterprise/Secure Palette)
const mailColors = [
    '#3b82f6', // Secure Blue
    '#10b981', // Verified Green
    '#8b5cf6', // Encrypted Purple
    '#06b6d4'  // Communication Cyan
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
        
        this.color = mailColors[Math.floor(Math.random() * mailColors.length)];
        this.w = 18 + Math.random() * 10;
        this.h = this.w * 0.65;
        this.opacity = 0.3 + Math.random() * 0.4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseDistance) {
            const force = (mouseDistance - distance) / mouseDistance;
            this.x -= (dx / distance) * force * 2;
            this.y -= (dy / distance) * force * 2;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        
        // Draw Envelope Body
        ctx.strokeRect(-this.w/2, -this.h/2, this.w, this.h);
        
        // Draw Envelope Top Fold (The 'V')
        ctx.beginPath();
        ctx.moveTo(-this.w/2, -this.h/2);
        ctx.lineTo(0, 0);
        ctx.lineTo(this.w/2, -this.h/2);
        ctx.stroke();
        
        // Glow Effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
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

        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / connectionDistance)})`;
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
