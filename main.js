// ==============================
// GLOBAL INTERACTIVITY SCRIPT (React-Compatible)
// ==============================

import { useEffect } from "react";

export default function useSiteInteractions() {
    useEffect(() => {
        // ==============================
        // 1. DARK MODE TOGGLE (Persistent)
        // ==============================
        const toggleSwitch = document.querySelector('.toggle-btn input');
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        const logo = document.querySelector('.logo');
        const navLinks = document.querySelectorAll('nav a');
        const socialIcons = document.querySelectorAll('footer .social a img');

        const applyTheme = (theme) => {
            document.body.classList.toggle('dark-mode', theme === 'dark');
            localStorage.setItem('theme', theme);

            // Adjust colors automatically
            const isDark = theme === 'dark';
            if (logo) logo.style.color = isDark ? '#ffffff' : '#000000';
            navLinks.forEach(link => link.style.color = isDark ? '#ffffff' : '#000000');
            socialIcons.forEach(icon => icon.style.filter = isDark ? 'invert(1)' : 'invert(0)');
            if (header) header.style.backgroundColor = isDark ? '#121212' : '#ffffff';
            if (footer) footer.style.backgroundColor = isDark ? '#181818' : '#f5f5f5';
        };

        const currentTheme = localStorage.getItem('theme') || 'light';
        applyTheme(currentTheme);
        if (toggleSwitch) toggleSwitch.checked = currentTheme === 'dark';

        if (toggleSwitch) {
            toggleSwitch.addEventListener('change', () => {
                applyTheme(toggleSwitch.checked ? 'dark' : 'light');
            });
        }

        // ==============================
        // 2. MOBILE MENU TOGGLE
        // ==============================
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('nav ul');
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('show');
            });
        }

        // ==============================
        // 3. LIGHTBOX (IMAGES + VIDEOS)
        // ==============================
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
            lightbox.innerHTML = '';
            lightbox.classList.add('active');

            let el;
            if (item.tagName.toLowerCase() === 'img') {
                el = document.createElement('img');
                el.src = item.src;
                el.className = 'lb-img';
            } else if (item.tagName.toLowerCase() === 'video') {
                el = document.createElement('video');
                el.src = item.src;
                el.className = 'lb-img';
                el.autoplay = true;
                el.controls = true;
            }

            lightbox.appendChild(el);

            // LEFT ARROW
            const leftArrow = document.createElement('div');
            leftArrow.className = 'lightbox-arrow left';
            leftArrow.textContent = '<';
            leftArrow.addEventListener('click', showPrevItem);
            lightbox.appendChild(leftArrow);

            // RIGHT ARROW
            const rightArrow = document.createElement('div');
            rightArrow.className = 'lightbox-arrow right';
            rightArrow.textContent = '>';
            rightArrow.addEventListener('click', showNextItem);
            lightbox.appendChild(rightArrow);

            // CLOSE BUTTON
            const closeBtn = document.createElement('div');
            closeBtn.className = 'lightbox-close';
            closeBtn.textContent = '×';
            closeBtn.addEventListener('click', closeLightbox);
            lightbox.appendChild(closeBtn);

            // VOLUME BUTTON (if video)
            if (item.tagName.toLowerCase() === 'video') addVolumeControl();
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

        // ==============================
        // VOLUME CONTROL FOR VIDEOS
        // ==============================
        function addVolumeControl() {
            const video = lightbox.querySelector('video');
            if (!video) return;

            if (lightbox.querySelector('.lightbox-volume')) return; // avoid duplicates

            const volBtn = document.createElement('div');
            volBtn.className = 'lightbox-volume';
            volBtn.textContent = '🔊'; // speaker icon
            volBtn.style.position = 'absolute';
            volBtn.style.bottom = '20px';
            volBtn.style.left = '50%';
            volBtn.style.transform = 'translateX(-50%)';
            volBtn.style.fontSize = '2rem';
            volBtn.style.color = 'white';
            volBtn.style.cursor = 'pointer';
            volBtn.style.userSelect = 'none';
            volBtn.style.transition = '0.3s';

            volBtn.addEventListener('click', () => {
                video.muted = !video.muted;
                volBtn.textContent = video.muted ? '🔇' : '🔊';
            });

            lightbox.appendChild(volBtn);
        }

        // ==============================
        // FOOTER INTERACTIVITY
        // ==============================
        const footerIcons = document.querySelectorAll('footer .social a img');

        footerIcons.forEach(icon => {
            icon.addEventListener('click', () => {
                console.log(`Clicked icon: ${icon.alt}`);
            });

            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.2)';
            });
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1)';
            });
        });

    }, []);
}

