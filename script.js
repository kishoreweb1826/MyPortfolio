// Smooth scroll and active link
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Active Navigation Link on Scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--primary)';
        } else {
            link.style.color = 'var(--text-secondary)';
        }
    });
});

// Intersection Observer for animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.project-card, .skill-group, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;

        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        const button = this.querySelector('button');
        const originalText = button.textContent;
        button.textContent = '✓ Message Sent!';
        button.style.background = 'linear-gradient(135deg, #00d4ff, #00ff88)';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            this.reset();
        }, 2000);

        console.log('Form submitted:', { name, email, message });
    });
}

// Glitch effect on hover for title
const nameWords = document.querySelectorAll('.name-word');
nameWords.forEach(word => {
    word.addEventListener('mouseenter', function() {
        this.style.animation = 'glitch 0.3s ease-out';
    });
});

// Add glitch keyframe
const style = document.createElement('style');
style.textContent = `
    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }

    .btn {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        animation: rippleEffect 0.6s ease-out;
    }

    @keyframes rippleEffect {
        from {
            opacity: 1;
            transform: scale(0);
        }
        to {
            opacity: 0;
            transform: scale(1);
        }
    }

    .project-card {
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .stat-box {
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes neonGlow {
        0%, 100% {
            text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }
        50% {
            text-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
            box-shadow: 0 0 40px rgba(0, 212, 255, 0.6);
        }
    }
`;
document.head.appendChild(style);

// Ripple effect on buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        const existingRipple = this.querySelector('.ripple');
        if (existingRipple) existingRipple.remove();

        this.appendChild(ripple);
    });
});

// Parallax effect
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollY = window.pageYOffset;
            const blobs = document.querySelectorAll('.blob');
            const profileFrame = document.querySelector('.profile-frame');
            
            blobs.forEach((blob, index) => {
                blob.style.transform = `translate(${scrollY * (0.1 * index)}px, ${scrollY * (0.05 * index)}px)`;
            });

            if (profileFrame) {
                profileFrame.style.transform = `translateY(${scrollY * 0.05}px)`;
            }

            ticking = false;
        });
        ticking = true;
    }
});

// Interactive skill badges
document.querySelectorAll('.badge').forEach(badge => {
    badge.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
    });

    badge.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Counter animation for stats
const statNumbers = document.querySelectorAll('.stat-number');
const observeStats = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
            const finalValue = entry.target.textContent;
            const numericValue = parseInt(finalValue);
            let currentValue = 0;

            if (numericValue) {
                const increment = numericValue / 30;
                const interval = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        entry.target.textContent = finalValue;
                        clearInterval(interval);
                    } else {
                        entry.target.textContent = Math.floor(currentValue) + (finalValue.includes('+') ? '+' : '');
                    }
                }, 30);
            }

            entry.target.setAttribute('data-animated', 'true');
        }
    });
});

statNumbers.forEach(stat => observeStats.observe(stat));

// Typewriter effect for hero text
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const words = document.querySelectorAll('.name-word');
    let totalDelay = 0;

    words.forEach(word => {
        const text = word.textContent;
        word.textContent = '';
        
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex < text.length) {
                word.textContent += text[charIndex];
                charIndex++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);

        totalDelay += text.length * 100 + 200;
    });
}

// Enhance project cards with 3D effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const rotateY = (x - rect.width / 2) / 10;
        const rotateX = (rect.height / 2 - y) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.3s ease';
