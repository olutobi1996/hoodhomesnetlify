// script.js
document.addEventListener("DOMContentLoaded", function() {
    // AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: false });
    }

    // GSAP ScrollTrigger (for galleries)
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        document.querySelectorAll('.gallery .row').forEach((row, index) => {
            gsap.to(row, {
                x: index % 2 === 0 ? '-30%' : '30%',
                scrollTrigger: {
                    trigger: row,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });
    }
});

// ================= Hero image slideshow =================
document.addEventListener("DOMContentLoaded", function() {
    const heroImg = document.getElementById('hero-img');
    const heroImagesEl = document.getElementById('hero-images-data');
    if (!heroImg || !heroImagesEl) return;

    const heroImages = JSON.parse(heroImagesEl.textContent);
    let current = 0;

    // Preload images
    const preloaded = heroImages.map(src => {
        const img = new Image();
        img.src = "/images/gallery/" + src;
        return img;
    });

    setInterval(() => {
        current = (current + 1) % heroImages.length;
        heroImg.src = preloaded[current].src;
    }, 5000);
});

// ================= Hamburger menu =================
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
});

// ================= Cookie Banner =================
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const LS_KEY = 'hh_cookies_accepted';
    const COOKIE_NAME = 'hh_cookies_accepted';

    if (!banner || !acceptBtn) return;

    function hasAccepted() {
        try { if (localStorage.getItem(LS_KEY) === '1') return true; } catch (e) {}
        return document.cookie.split('; ').some(c => c.startsWith(COOKIE_NAME + '=1'));
    }

    function accept() {
        try { localStorage.setItem(LS_KEY, '1'); } catch (e) {}
        document.cookie = COOKIE_NAME + '=1; max-age=31536000; path=/; SameSite=Lax';
        banner.classList.remove('show');
        banner.setAttribute('hidden', '');
    }

    if (!hasAccepted()) {
        banner.removeAttribute('hidden');
        requestAnimationFrame(() => banner.classList.add('show'));
    }

    acceptBtn.addEventListener('click', accept);
});

// ================= VanillaTilt =================
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth > 768 && typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".tilt"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.3
        });
    }
});

// ================= Carousel / Gallery =================
document.addEventListener("DOMContentLoaded", function() {
    const carousel = document.querySelector(".gallery-carousel");
    if (!carousel) return;

    const items = carousel.querySelectorAll(".gallery-item");
    const prevBtn = document.querySelector(".gallery-arrow.left");
    const nextBtn = document.querySelector(".gallery-arrow.right");

    const totalItems = items.length;
    const visibleItems = 3;
    let index = 0;

    function updateCarousel() {
        const offset = -(index * (100 / visibleItems));
        carousel.style.transform = `translateX(${offset}%)`;
    }

    nextBtn?.addEventListener("click", () => {
        index = (index + 1) % totalItems;
        updateCarousel();
    });

    prevBtn?.addEventListener("click", () => {
        index = (index - 1 + totalItems) % totalItems;
        updateCarousel();
    });

    setInterval(() => {
        index = (index + 1) % totalItems;
        updateCarousel();
    }, 4000);
});
