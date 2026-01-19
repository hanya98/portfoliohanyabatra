const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: null, y: null };

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY; 
    
    for(let i=0; i<16; i++) {
        particles.push(new Particle(true));
    }
});

class Particle {
    constructor(isMouseSparkle) {
        this.isMouseSparkle = isMouseSparkle;
        this.x = isMouseSparkle ? mouse.x : Math.random() * canvas.width;
        this.y = isMouseSparkle ? mouse.y : Math.random() * canvas.height;
        
        this.size = Math.random() * (isMouseSparkle ? 2.5 : 1.5) + 0.1;
        
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        
        const colors = ['#ffffff', '#00d2ff', '#ba68c8', '#fff9c4'];
        this.color = isMouseSparkle ? colors[Math.floor(Math.random() * colors.length)] : '#ffffff';
        
        this.opacity = Math.random();
        this.fade = isMouseSparkle ? 0.015 : 0; 
        
        this.blinkSpeed = 0.005 + Math.random() * 0.015;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.isMouseSparkle) {
            this.opacity -= this.fade;
        } else {
            this.opacity += this.blinkSpeed;
            if (this.opacity > 1 || this.opacity < 0) {
                this.blinkSpeed = -this.blinkSpeed;
            }
        }
    }

    draw() {
        ctx.save();
        ctx.shadowBlur = this.isMouseSparkle ? 10 : 5;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class ShootingStar {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.len = Math.random() * 80 + 50;
        this.speed = Math.random() * 10 + 5;
        this.opacity = 1;
    }
    update() {
        this.x += this.speed;
        this.y += this.speed;
        this.opacity -= 0.01;
        if (this.opacity <= 0) this.reset();
    }
    draw() {
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.len, this.y - this.len);
        ctx.stroke();
        ctx.restore();
    }
}

const shootingStar = new ShootingStar();

for (let i = 0; i < 400; i++) {
    particles.push(new Particle(false));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    shootingStar.update();
    shootingStar.draw();

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].isMouseSparkle && particles[i].opacity <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}

const textEl = document.getElementById('typewriter');
const words = ["Web Developer", "Tech Enthusiast", "Creative Problem Solver"];
let wordIdx = 0, charIdx = 0, isDeleting = false;

function type() {
    const word = words[wordIdx];
    textEl.innerText = isDeleting ? word.substring(0, charIdx--) : word.substring(0, charIdx++);
    let speed = isDeleting ? 100 : 200;
    if (!isDeleting && charIdx === word.length) { isDeleting = true; speed = 2000; }
    else if (isDeleting && charIdx === 0) { isDeleting = false; wordIdx = (wordIdx + 1) % words.length; speed = 500; }
    setTimeout(type, speed);
}

const track = document.getElementById('skillsTrack') || document.getElementById('carouselTrack');
if (track) {
    const cards = Array.from(track.children);
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });
}
const skillsTrack = document.getElementById('skillsTrack');
if (skillsTrack) {
    const originalContent = skillsTrack.innerHTML;
    skillsTrack.innerHTML = originalContent + originalContent;
}
const projectImage = document.getElementById('project-hover-image');
const projectItems = document.querySelectorAll('.project-item');

window.addEventListener('mousemove', (e) => {
    const x = e.clientX + 20;
    const y = e.clientY + 20;
    
    projectImage.style.left = `${x}px`;
    projectImage.style.top = `${y}px`;
});

projectItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const imgPath = item.getAttribute('data-img');
        projectImage.style.backgroundImage = `url(${imgPath})`;
        projectImage.style.opacity = '1';
        projectImage.style.transform = 'scale(1)';
    });
    
    item.addEventListener('mouseleave', () => {
        projectImage.style.opacity = '0';
        projectImage.style.transform = 'scale(0.8)';
    });
});
animate();
type();

const projectCards = document.querySelectorAll(".project-card");

const projectObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        projectCards.forEach(card => card.classList.remove("active"));
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.6 }
);

projectCards.forEach(card => projectObserver.observe(card));
