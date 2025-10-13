// =======================
// Dark Mode Toggle
// =======================
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// =======================
// Hamburger Menu Toggle
// =======================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// Close menu when clicking a link (mobile)
document.querySelectorAll('#nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('show');
    });
});

// =======================
// Scroll fade-in animations
// =======================
const faders = document.querySelectorAll('.fade-slide');
const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
    entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        entry.target.classList.add('show');
        appearOnScroll.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));

// =======================
// Lightbox
// =======================
let currentImages = [];
let currentIndex = 0;

const lightbox = document.createElement('div');
lightbox.classList.add('lightbox');
lightbox.style.display = 'none';
lightbox.innerHTML = `
    <span class="lightbox-close">&times;</span>
    <span class="lightbox-arrow left">&#10094;</span>
    <div class="lightbox-content"></div>
    <span class="lightbox-arrow right">&#10095;</span>
    <div class="lightbox-thumbs"></div>
`;
document.body.appendChild(lightbox);

const lightboxContent = lightbox.querySelector('.lightbox-content');
const lightboxThumbs = lightbox.querySelector('.lightbox-thumbs');
const leftArrow = lightbox.querySelector('.lightbox-arrow.left');
const rightArrow = lightbox.querySelector('.lightbox-arrow.right');
const closeBtn = lightbox.querySelector('.lightbox-close');

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('click', e => {
        if(e.target.tagName === 'A' || e.target.closest('nav')) return;

        currentImages = Array.from(card.querySelectorAll('.project-images img'));
        currentIndex = 0;

        if(window.innerWidth >= 769){
            showImage(currentIndex); // desktop: one image
        } else {
            showAllImages(); // mobile: horizontal scroll
        }

        buildThumbnails();
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

function showImage(index){
    lightboxContent.innerHTML = '';
    const img = currentImages[index].cloneNode();
    img.classList.add('lb-img');
    lightboxContent.appendChild(img);
    updateActiveThumbnail();
}

function showAllImages(){
    lightboxContent.innerHTML = '';
    currentImages.forEach(img => {
        const clone = img.cloneNode();
        clone.classList.add('lb-img');
        lightboxContent.appendChild(clone);
    });
    updateActiveThumbnail();
}

// =======================
// Thumbnails
// =======================
function buildThumbnails() {
    lightboxThumbs.innerHTML = '';
    currentImages.forEach((img, idx) => {
        const thumb = img.cloneNode();
        thumb.addEventListener('click', () => {
            currentIndex = idx;
            if(window.innerWidth >= 769){
                showImage(currentIndex);
            } else {
                lightboxContent.scrollLeft = thumb.offsetLeft - 10;
            }
        });
        lightboxThumbs.appendChild(thumb);
    });
}

function updateActiveThumbnail() {
    lightboxThumbs.querySelectorAll('img').forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === currentIndex);
    });
}

// =======================
// Desktop Arrows
// =======================
leftArrow.addEventListener('click', () => {
    if(window.innerWidth < 769) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    showImage(currentIndex);
});
rightArrow.addEventListener('click', () => {
    if(window.innerWidth < 769) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    showImage(currentIndex);
});

// =======================
// Close Lightbox
// =======================
closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
});

lightbox.addEventListener('click', e => {
    if(e.target === lightbox){
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// =======================
// Mobile Swipe
// =======================
let startX = 0;
lightboxContent.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
});
lightboxContent.addEventListener('touchend', e => {
    if(window.innerWidth >= 769) return; // only mobile
    let endX = e.changedTouches[0].clientX;
    let diff = startX - endX;
    if(Math.abs(diff) > 50) {
        lightboxContent.scrollBy({left: diff, behavior: 'smooth'});
    }
});


