// ==============================
// GLOBAL INTERACTIVITY SCRIPT
// ==============================

// 1. DARK MODE TOGGLE (Persistent)
const toggleSwitch = document.querySelector('.toggle-btn input');
document.addEventListener('DOMContentLoaded', () => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (toggleSwitch) toggleSwitch.checked = true;
    }
});
if (toggleSwitch) {
    toggleSwitch.addEventListener('change', () => {
        if (toggleSwitch.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });
}

// 2. MOBILE MENU TOGGLE
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
}

// 3. LIGHTBOX (ONE IMAGE AT A TIME)
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
document.body.appendChild(lightbox);

let currentImages = [];
let currentIndex = 0;

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach((card) => {
    card.addEventListener('click', () => {
        const imgs = card.querySelectorAll('.project-images img');
        if (!imgs.length) return;

        currentImages = Array.from(imgs);
        currentIndex = 0;
        openLightbox();
    });
});

function openLightbox() {
    lightbox.innerHTML = '';
    lightbox.classList.add('active');

    // Main Image
    const imgEl = document.createElement('img');
    imgEl.src = currentImages[currentIndex].src;
    lightbox.appendChild(imgEl);

    // Left Arrow
    const leftArrow = document.createElement('div');
    leftArrow.className = 'lightbox-arrow left';
    leftArrow.textContent = '<';
    leftArrow.addEventListener('click', showPrevImage);
    lightbox.appendChild(leftArrow);

    // Right Arrow
    const rightArrow = document.createElement('div');
    rightArrow.className = 'lightbox-arrow right';
    rightArrow.textContent = '>';
    rightArrow.addEventListener('click', showNextImage);
    lightbox.appendChild(rightArrow);

    // Close Button
    const closeBtn = document.createElement('div');
    closeBtn.className = 'lightbox-close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.appendChild(closeBtn);
}

function showPrevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightboxImage();
}

function showNextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const imgEl = lightbox.querySelector('img');
    if (imgEl) imgEl.src = currentImages[currentIndex].src;
}

function closeLightbox() {
    lightbox.classList.remove('active');
}

// Close lightbox by clicking outside
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'Escape') closeLightbox();
});
