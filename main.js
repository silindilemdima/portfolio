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
    
    // ✅ CLOSE MENU WHEN LINK IS CLICKED
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    });
    
    // ✅ CLOSE MENU WHEN CLICKING OUTSIDE
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('show');
        }
    });
}

// 3. LIGHTBOX (IMAGES + VIDEOS)
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
document.body.appendChild(lightbox);

let currentItems = [];
let currentIndex = 0;

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach((card) => {
    card.addEventListener('click', () => {
        const imgs = card.querySelectorAll('.project-images img, .project-images video');
        if (!imgs.length) return;

        currentItems = Array.from(imgs);
        currentIndex = 0;
        openLightbox();
    });
});

function openLightbox() {
    updateLightboxContent();
}

function updateLightboxContent() {
    const item = currentItems[currentIndex];
    
    // Create main container structure
    let mainContainer = lightbox.querySelector('.lightbox-main');
    if (!mainContainer) {
        lightbox.innerHTML = '';
        mainContainer = document.createElement('div');
        mainContainer.className = 'lightbox-main';
        lightbox.appendChild(mainContainer);
    } else {
        mainContainer.innerHTML = '';
    }

    // Media container
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'lightbox-media';

    let el;
    if (item.tagName.toLowerCase() === 'img') {
        el = document.createElement('img');
        el.src = item.src;
        el.alt = item.alt || `Image ${currentIndex + 1}`;
    } else if (item.tagName.toLowerCase() === 'video') {
        el = document.createElement('video');
        el.src = item.src;
        el.controls = true;
        el.autoplay = true;
        el.playsInline = true;
    }

    mediaContainer.appendChild(el);
    mainContainer.appendChild(mediaContainer);

    // LEFT ARROW - Behance Style
    const leftArrow = document.createElement('button');
    leftArrow.className = 'lightbox-arrow left';
    leftArrow.setAttribute('aria-label', 'Previous image');
    leftArrow.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>';
    leftArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevItem();
    });
    mainContainer.appendChild(leftArrow);

    // RIGHT ARROW - Behance Style
    const rightArrow = document.createElement('button');
    rightArrow.className = 'lightbox-arrow right';
    rightArrow.setAttribute('aria-label', 'Next image');
    rightArrow.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
    rightArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextItem();
    });
    mainContainer.appendChild(rightArrow);

    // CLOSE BUTTON - Behance Style
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close lightbox');
    closeBtn.innerHTML = '×';
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });
    mainContainer.appendChild(closeBtn);

    // IMAGE COUNTER - Behance Style
    const counter = document.createElement('div');
    counter.className = 'lightbox-counter';
    counter.textContent = `${currentIndex + 1} / ${currentItems.length}`;
    mainContainer.appendChild(counter);

    // VOLUME BUTTON (if video)
    if (item.tagName.toLowerCase() === 'video') {
        addVolumeControl(mainContainer, el);
    }
    
    // Generate thumbnails
    generateThumbnails();
    
    // Trigger animation
    requestAnimationFrame(() => {
        lightbox.classList.add('active');
    });
}

function showPrevItem() {
    currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    updateLightboxContent();
}

function showNextItem() {
    currentIndex = (currentIndex + 1) % currentItems.length;
    updateLightboxContent();
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
    if (e.key === 'ArrowRight') showNextItem();
    if (e.key === 'ArrowLeft') showPrevItem();
    if (e.key === 'Escape') closeLightbox();
});

// ✅ LIGHTBOX THUMBNAILS - Behance Style
function generateThumbnails() {
    let thumbContainer = lightbox.querySelector('#lightbox-thumbs');
    
    if (!thumbContainer) {
        thumbContainer = document.createElement('div');
        thumbContainer.id = 'lightbox-thumbs';
        lightbox.appendChild(thumbContainer);
    }
    
    thumbContainer.innerHTML = '';
    
    currentItems.forEach((item, index) => {
        const thumb = document.createElement('img');
        thumb.src = item.tagName.toLowerCase() === 'img' ? item.src : item.poster || item.src;
        thumb.alt = `Thumbnail ${index + 1}`;
        thumb.setAttribute('role', 'button');
        thumb.setAttribute('tabindex', '0');
        thumb.setAttribute('aria-label', `Go to image ${index + 1}`);
        
        if (index === currentIndex) {
            thumb.classList.add('active');
        }
        
        const handleClick = (e) => {
            e.stopPropagation();
            currentIndex = index;
            updateLightboxContent();
        };
        
        thumb.addEventListener('click', handleClick);
        thumb.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick(e);
            }
        });
        
        thumbContainer.appendChild(thumb);
    });
    
    // Scroll active thumbnail into view
    const activeThumb = thumbContainer.querySelector('.active');
    if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

// ==============================
// VOLUME CONTROL FOR VIDEOS
// ==============================
function addVolumeControl(container, video) {
    if (!video || video.tagName.toLowerCase() !== 'video') return;
    if (container.querySelector('.lightbox-volume')) return; // avoid duplicates

    const volBtn = document.createElement('button');
    volBtn.className = 'lightbox-volume';
    volBtn.setAttribute('aria-label', 'Toggle mute');
    volBtn.style.cssText = `
        position: absolute;
        bottom: 160px;
        left: 50%;
        transform: translateX(-50%);
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 50%;
        color: white;
        font-size: 20px;
        cursor: pointer;
        user-select: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        z-index: 10;
    `;
    volBtn.innerHTML = video.muted ? '🔇' : '🔊';

    volBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        volBtn.innerHTML = video.muted ? '🔇' : '🔊';
    });

    volBtn.addEventListener('mouseenter', () => {
        volBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        volBtn.style.transform = 'translateX(-50%) scale(1.1)';
    });

    volBtn.addEventListener('mouseleave', () => {
        volBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        volBtn.style.transform = 'translateX(-50%) scale(1)';
    });

    container.appendChild(volBtn);
}

// ==============================
// TESTIMONIALS ANIMATION
// ==============================
const testimonials = document.querySelectorAll('.testimonial');

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

testimonials.forEach(t => observer.observe(t));

// ✅ FADE-SLIDE SCROLL ANIMATIONS
const fadeSlideElements = document.querySelectorAll('.fade-slide');
const fadeSlideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            fadeSlideObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

fadeSlideElements.forEach(el => fadeSlideObserver.observe(el));

// ✅ SMOOTH SCROLL BEHAVIOR
document.documentElement.style.scrollBehavior = 'smooth';

// ==============================
// METRIC COUNTERS
// ==============================
const metricValues = document.querySelectorAll('.metric-value[data-count]');
if (metricValues.length) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.6 });

    metricValues.forEach(value => counterObserver.observe(value));
}

function animateCounter(el) {
    const target = Number(el.dataset.count) || 0;
    const duration = 1400;
    const startTime = performance.now();

    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.floor(progress * target);
        el.textContent = current;
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// ==============================
// TOOLBOX DETAIL SWITCHER
// ==============================
const toolChips = document.querySelectorAll('.tool-chip');
const toolDetailCard = document.querySelector('#tool-detail');

if (toolChips.length && toolDetailCard) {
    const updateChipState = (chip) => {
        toolChips.forEach(c => {
            c.classList.toggle('active', c === chip);
            c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
        });
        toolDetailCard.textContent = chip.dataset.description || chip.textContent;
    };

    toolChips.forEach(chip => {
        chip.addEventListener('click', () => updateChipState(chip));
    });

    updateChipState(toolChips[0]);
}

// ==============================
// TILT EFFECT FOR CARDS
// ==============================
const allowTilt = window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (allowTilt) {
    const tiltCards = document.querySelectorAll('[data-tilt-card]');

    const handleTilt = (event) => {
        const card = event.currentTarget;
        const rect = card.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        const rotateX = ((offsetY - rect.height / 2) / rect.height) * -12;
        const rotateY = ((offsetX - rect.width / 2) / rect.width) * 12;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    };

    const resetTilt = (event) => {
        event.currentTarget.style.transform = '';
    };

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });
}

// ==============================
// OPTIONAL DARK MODE TOGGLE
// ==============================
// (Only needed if your site doesn't already handle this)
const toggle = document.querySelector('#darkModeToggle'); // Add a button with this ID if you want

if (toggle) {
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
}


// ==============================
// FOOTER INTERACTIVITY
// ==============================

// Add subtle hover effects or future click events for social icons
const footerIcons = document.querySelectorAll('footer .social a img');

footerIcons.forEach(icon => {
    // Optional: log which icon is clicked (or perform other actions)
    icon.addEventListener('click', (e) => {
        console.log(`Clicked icon: ${icon.alt}`);
    });

    // Optional: hover effect via JS (you already have in CSS, this is extra)
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.2)';
    });
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1)';
    });
});
