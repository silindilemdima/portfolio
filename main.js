// ==============================
// GLOBAL INTERACTIVITY SCRIPT
// ==============================

// ==============================
// GLOBAL INTERACTIVITY SCRIPT
// ==============================

// 1. Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
}

// 2. Smooth Scroll for all internal links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// 3. Scroll-triggered animations for existing animate-on-scroll
const animatedElements = document.querySelectorAll('.animate-on-scroll');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target); // Animate only once
        }
    });
}, { threshold: 0.1 });

animatedElements.forEach(el => observer.observe(el));

// 4. Fade-Slide Animation for new elements
const faders = document.querySelectorAll('.fade-slide');
const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target); // Animate only once
        }
    });
}, { threshold: 0.2 });

// Optional: add staggered delay
faders.forEach((fader, index) => {
    fader.style.transitionDelay = `${index * 0.15}s`;
    fadeObserver.observe(fader);
});

// 5. Lightbox for project cards (with arrows & mobile scroll)
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const images = Array.from(card.querySelectorAll('.project-images img'));
        openLightbox(images);
    });
});

function openLightbox(images) {
    if (!images.length) return;

    let currentIndex = 0;
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close">&times;</span>
            <span class="lightbox-arrow left">&#10094;</span>
            <img src="${images[currentIndex].src}" alt="Project Image">
            <span class="lightbox-arrow right">&#10095;</span>
        </div>
    `;
    document.body.appendChild(lightbox);

    const imgElement = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.close');
    const prevBtn = lightbox.querySelector('.lightbox-arrow.left');
    const nextBtn = lightbox.querySelector('.lightbox-arrow.right');

    function updateImage(index) {
        imgElement.src = images[index].src;
    }

    prevBtn.addEventListener('click', e => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage(currentIndex);
    });

    nextBtn.addEventListener('click', e => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        updateImage(currentIndex);
    });

    closeBtn.addEventListener('click', () => lightbox.remove());
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) lightbox.remove();
    });

    // Mobile side scroll support
    if (window.innerWidth <= 768) {
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        lightboxContent.innerHTML = images.map(img => `<img src="${img.src}" alt="Project Image">`).join('');
    }
}

// ==============================
// DARK MODE TOGGLE
// ==============================
const darkToggle = document.getElementById('dark-mode-toggle');

// Load saved preference
if (localStorage.getItem('dark-mode') === 'enabled') {
    document.body.classList.add('dark-mode');
    if (darkToggle) darkToggle.textContent = "☀️";
}

if (darkToggle) {
    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('dark-mode', 'enabled');
            darkToggle.textContent = "☀️";
        } else {
            localStorage.setItem('dark-mode', 'disabled');
            darkToggle.textContent = "🌙";
        }
    });
}
h