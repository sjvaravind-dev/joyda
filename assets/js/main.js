/* ============================================================
   Jyoda — UI interactions
   ============================================================ */

(function () {
    'use strict';

    // ----- Mobile nav toggle -----
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
        navLinks.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ----- Nav style on scroll -----
    const nav = document.getElementById('nav');
    if (nav) {
        const onScroll = () => {
            if (window.scrollY > 12) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // ----- Smooth scroll for in-page links -----
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (!id || id === '#') return;
            const el = document.querySelector(id);
            if (!el) return;
            e.preventDefault();
            const top = el.getBoundingClientRect().top + window.scrollY - 60;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // ----- Scroll-reveal -----
    const revealEls = document.querySelectorAll('.section-head, .feature-card, .showcase-copy, .showcase-visual, .stats-grid, .about-grid > *, .cta-card');
    revealEls.forEach(el => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    // ----- Animated counters -----
    const counters = document.querySelectorAll('.stat-num[data-count]');
    const animateCounter = (el) => {
        const target = parseFloat(el.getAttribute('data-count'));
        const duration = 1400;
        const start = performance.now();
        const isFloat = !Number.isInteger(target);

        const step = (now) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            const v = target * eased;
            el.textContent = isFloat ? v.toFixed(1) : Math.floor(v).toString();
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = isFloat ? target.toFixed(1) : target.toString();
        };
        requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window && counters.length) {
        const io2 = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    io2.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(el => io2.observe(el));
    }

    // ----- Footer year -----
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
