// ==============================
// GLOBAL INTERACTIVITY SCRIPT
// ==============================

// ---------- Hamburger Toggle ----------
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
  });
  // allow keyboard activation
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      navMenu.classList.toggle('show');
    }
  });
}

// ---------- Smooth scroll for anchors ----------
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ---------- Fade-slide animations ----------
const faders = document.querySelectorAll('.fade-slide');
const fadeObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

faders.forEach((fader, index) => {
  fader.style.transitionDelay = `${index * 0.12}s`;
  fadeObserver.observe(fader);
});

// ---------- Dark mode toggle ----------
const darkToggle = document.getElementById('dark-mode-toggle');
if (localStorage.getItem('dark-mode') === 'enabled') {
  document.body.classList.add('dark-mode');
  if (darkToggle) darkToggle.checked = true;
}
if (darkToggle) {
  darkToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
  });
}

// ========== PROJECT FILTER ==========
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = Array.from(document.querySelectorAll('.project-card'));

function applyFilter(filter) {
  projectCards.forEach(card => {
    const cat = card.getAttribute('data-category') || 'other';
    if (filter === 'all' || cat === filter) {
      card.style.display = '';
      card.classList.remove('is-hidden');
      card.setAttribute('aria-hidden','false');
    } else {
      card.style.display = 'none';
      card.classList.add('is-hidden');
      card.setAttribute('aria-hidden','true');
    }
  });
}

// filter button click
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed','true');
    applyFilter(btn.dataset.filter);
  });
});

// init visible
applyFilter('all');

// ========== LIGHTBOX ==========
let lightboxEl = null;
let lbImages = [];
let lbIndex = 0;

// helper: create lightbox markup
function createLightbox(images, startIndex = 0) {
  lbImages = images;
  lbIndex = startIndex;

  // container
  lightboxEl = document.createElement('div');
  lightboxEl.className = 'lightbox';

  // content
  const content = document.createElement('div');
  content.className = 'lightbox-content';

  // close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', closeLightbox);

  // left arrow
  const left = document.createElement('div');
  left.className = 'lightbox-arrow left';
  left.innerHTML = '&#10094;';
  left.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

  // right arrow
  const right = document.createElement('div');
  right.className = 'lightbox-arrow right';
  right.innerHTML = '&#10095;';
  right.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });

  // image element (will update src)
  const imgEl = document.createElement('img');
  imgEl.className = 'lb-img';
  imgEl.src = lbImages[lbIndex];
  imgEl.alt = '';

  // thumbs container
  const thumbs = document.createElement('div');
  thumbs.className = 'lightbox-thumbs';
  lbImages.forEach((src, i) => {
    const t = document.createElement('img');
    t.src = src;
    t.dataset.index = i;
    t.addEventListener('click', (e) => {
      lbIndex = Number(e.currentTarget.dataset.index);
      updateLightboxImage();
    });
    thumbs.appendChild(t);
  });

  content.appendChild(closeBtn);
  content.appendChild(left);
  content.appendChild(imgEl);
  content.appendChild(right);

  lightboxEl.appendChild(content);
  lightboxEl.appendChild(thumbs);

  // close when clicking backdrop
  lightboxEl.addEventListener('click', (e) => {
    if (e.target === lightboxEl) closeLightbox();
  });

  document.body.appendChild(lightboxEl);
  updateLightboxImage();

  // keyboard navigation
  document.addEventListener('keydown', keyHandler);

  // touch swipe support for mobile
  addSwipeSupport(imgEl);
}

function updateLightboxImage() {
  if (!lightboxEl) return;
  const imgEl = lightboxEl.querySelector('.lb-img');
  imgEl.src = lbImages[lbIndex];
  // highlight thumb
  const thumbs = Array.from(lightboxEl.querySelectorAll('.lightbox-thumbs img'));
  thumbs.forEach(t => t.classList.remove('active'));
  if (thumbs[lbIndex]) thumbs[lbIndex].classList.add('active');
}

function prevImage() {
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  updateLightboxImage();
}
function nextImage() {
  lbIndex = (lbIndex + 1) % lbImages.length;
  updateLightboxImage();
}

function closeLightbox() {
  if (!lightboxEl) return;
  document.removeEventListener('keydown', keyHandler);
  lightboxEl.remove();
  lightboxEl = null;
  lbImages = [];
  lbIndex = 0;
}

function keyHandler(e) {
  if (!lightboxEl) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevImage();
  if (e.key === 'ArrowRight') nextImage();
}

// add touch swipe detection
function addSwipeSupport(imgEl) {
  let startX = 0;
  let endX = 0;
  imgEl.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, {passive:true});
  imgEl.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
  }, {passive:true});
  imgEl.addEventListener('touchend', () => {
    const dx = endX - startX;
    if (Math.abs(dx) < 30) return;
    if (dx > 0) prevImage();
    else nextImage();
    startX = 0; endX = 0;
  }, {passive:true});
}

// bind open lightbox to project cards
projectCards.forEach(card => {
  card.addEventListener('click', () => {
    // gather images from .project-images inside the card; fallback to thumb
    const imgs = Array.from(card.querySelectorAll('.project-images img')).map(i => i.src);
    if (!imgs.length) {
      const thumb = card.querySelector('.project-thumb img');
      if (thumb) imgs.push(thumb.src);
    }
    createLightbox(imgs, 0);
  });
  // allow keyboard open
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

// ensure images fit nicely in lightbox (no extra code needed — CSS uses object-fit:contain)

// accessibility: ensure focus trapping not required for this simple lightbox
// but we at least focus the close button after opening
// (we set focus after append)
document.addEventListener('click', (e)=>{
  // if lightbox opened just now, focus close btn:
  if (lightboxEl) {
    const close = lightboxEl.querySelector('.lightbox-close');
    if (close) close.focus();
  }
});
