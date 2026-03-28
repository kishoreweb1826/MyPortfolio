// ─── Smooth scroll ───────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ─── Mobile hamburger menu ───────────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');

function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') hamburger.click();
});

// Close mobile nav when a link is clicked
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// Close mobile nav when clicking outside
mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) closeMobileMenu();
});

// ─── Active Navigation Link on Scroll ────────────────────────────────────────
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--secondary)';
        } else {
            link.style.color = 'var(--text-secondary)';
        }
    });
});

// ─── Intersection Observer for scroll animations ──────────────────────────────
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

document.querySelectorAll('.project-card, .skill-group, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ─── Glitch + ripple styles ───────────────────────────────────────────────────
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
        background: rgba(255, 255, 255, 0.45);
        border-radius: 50%;
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes rippleEffect {
        from { opacity: 1; transform: scale(0); }
        to   { opacity: 0; transform: scale(1); }
    }

    .project-card {
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .stat-box {
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
`;
document.head.appendChild(style);

// ─── Glitch effect on hero title ──────────────────────────────────────────────
document.querySelectorAll('.name-word').forEach(word => {
    word.addEventListener('mouseenter', function() {
        this.style.animation = 'glitch 0.3s ease-out';
    });
    word.addEventListener('animationend', function() {
        this.style.animation = '';
    });
});

// ─── Ripple on buttons ────────────────────────────────────────────────────────
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;
    ripple.style.width  = ripple.style.height = size + 'px';
    ripple.style.left   = x + 'px';
    ripple.style.top    = y + 'px';
    ripple.classList.add('ripple');
    const old = btn.querySelector('.ripple');
    if (old) old.remove();
    btn.appendChild(ripple);
});

// ─── Parallax ─────────────────────────────────────────────────────────────────
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollY = window.pageYOffset;
            document.querySelectorAll('.blob').forEach((blob, index) => {
                blob.style.transform = `translate(${scrollY * (0.1 * index)}px, ${scrollY * (0.05 * index)}px)`;
            });
            const profileFrame = document.querySelector('.profile-frame');
            if (profileFrame) {
                profileFrame.style.transform = `translateY(${scrollY * 0.04}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// ─── Interactive skill badges ─────────────────────────────────────────────────
document.querySelectorAll('.badge').forEach(badge => {
    badge.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
    });
    badge.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// ─── Counter animation for stats ─────────────────────────────────────────────
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

document.querySelectorAll('.stat-number').forEach(stat => observeStats.observe(stat));

// ─── Typewriter on hero name ──────────────────────────────────────────────────
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    document.querySelectorAll('.name-word').forEach(word => {
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
    });
}

// ─── 3-D tilt on project cards ────────────────────────────────────────────────
function attach3DTilt(card) {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateY = (x - rect.width / 2) / 12;
        const rotateX = (rect.height / 2 - y) / 12;
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
}

document.querySelectorAll('.project-card').forEach(attach3DTilt);

// ─── Page fade-in ────────────────────────────────────────────────────────────
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.3s ease';
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ─────────────────────────────────────────────────────────────────────────────
// ADD PROJECT – Modal + localStorage CRUD
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY      = 'kk_portfolio_projects';
const addProjectModal  = document.getElementById('addProjectModal');
const openBtn          = document.getElementById('openAddProjectModal');
const closeBtn         = document.getElementById('closeModal');
const cancelBtn        = document.getElementById('cancelModal');
const addProjectForm   = document.getElementById('addProjectForm');
const projectsContainer = document.getElementById('projectsContainer');

// ── Helpers ──
function openModal() {
    addProjectModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('projTitle').focus();
}

function closeModal() {
    addProjectModal.classList.remove('open');
    document.body.style.overflow = '';
    addProjectForm.reset();
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
addProjectModal.addEventListener('click', (e) => {
    if (e.target === addProjectModal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && addProjectModal.classList.contains('open')) closeModal();
});

// ── Build a project card element ──
function buildProjectCard(proj) {
    const card = document.createElement('div');
    card.classList.add('project-card');
    card.dataset.id = proj.id;

    // Emoji / URL thumbnail
    const iconContent = proj.icon
        ? `<div class="project-icon">${proj.icon}</div>`
        : `<div class="project-icon">💡</div>`;

    // Tech tags
    const techTags = (proj.tech || [])
        .map(t => `<span class="tech-tag">${t}</span>`)
        .join('');

    // Links
    const liveLink   = proj.liveUrl
        ? `<a href="${proj.liveUrl}" class="project-link primary" target="_blank" rel="noopener">View Live</a>`
        : '';
    const sourceLink = proj.sourceUrl
        ? `<a href="${proj.sourceUrl}" class="project-link secondary" target="_blank" rel="noopener">Source Code</a>`
        : '';

    card.innerHTML = `
        <button class="project-delete-btn" title="Remove project" aria-label="Delete project">✕</button>
        <div class="project-image">
            ${iconContent}
            <div class="project-overlay"></div>
        </div>
        <div class="project-content">
            <h3>${proj.title}</h3>
            <p>${proj.description}</p>
            <div class="project-tech">${techTags}</div>
            <div class="project-links">${liveLink}${sourceLink}</div>
        </div>
    `;

    // Delete handler
    card.querySelector('.project-delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteProject(proj.id, card);
    });

    // Re-attach tilt and observer
    attach3DTilt(card);
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);

    return card;
}

// ── Load saved projects from localStorage ──
function loadProjects() {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    saved.forEach(proj => {
        projectsContainer.appendChild(buildProjectCard(proj));
    });
}

// ── Save a new project ──
function saveProject(proj) {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    saved.push(proj);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

// ── Delete a project ──
function deleteProject(id, card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(-20px) scale(0.92)';
    card.style.transition = 'all 0.35s ease';
    setTimeout(() => card.remove(), 350);

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved.filter(p => p.id !== id)));
}

// ── Form submit ──
addProjectForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title       = document.getElementById('projTitle').value.trim();
    const description = document.getElementById('projDesc').value.trim();
    if (!title || !description) {
        alert('Please fill in at least the title and description.');
        return;
    }

    const techRaw = document.getElementById('projTech').value.trim();
    const proj = {
        id:          Date.now().toString(),
        title,
        description,
        tech:        techRaw ? techRaw.split(',').map(t => t.trim()).filter(Boolean) : [],
        icon:        document.getElementById('projIcon').value.trim() || '💡',
        liveUrl:     document.getElementById('projLive').value.trim(),
        sourceUrl:   document.getElementById('projSource').value.trim(),
    };

    saveProject(proj);
    projectsContainer.appendChild(buildProjectCard(proj));
    closeModal();
});

// ── Init ──
loadProjects();
