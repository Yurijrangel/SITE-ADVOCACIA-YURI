// YURI RANGEL ADVOCACIA — Site Scripts
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    // 1. Footer year
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2. Header scroll effect
    var header = document.getElementById('site-header');
    if (header) {
      var onScroll = function () {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // 3. Mobile nav toggle
    var navToggle = document.getElementById('nav-toggle');
    var mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
      navToggle.addEventListener('click', function () {
        var isOpen = mainNav.classList.toggle('is-open');
        navToggle.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close nav on link click
      mainNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          mainNav.classList.remove('is-open');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      // Close nav on Escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
          mainNav.classList.remove('is-open');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          navToggle.focus();
        }
      });
    }

    // 4. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var headerHeight = header ? header.offsetHeight : 0;
          var targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      });
    });

    // 5. Scroll reveal animations using IntersectionObserver
    var revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window && revealEls.length) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      revealEls.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show all elements immediately
      revealEls.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }

    // 6. Active nav link highlight on scroll
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

    if (sections.length && navLinks.length) {
      var sectionObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var id = entry.target.getAttribute('id');
              navLinks.forEach(function (link) {
                link.removeAttribute('aria-current');
                if (link.getAttribute('href') === '#' + id) {
                  link.setAttribute('aria-current', 'page');
                }
              });
            }
          });
        },
        { rootMargin: '-40% 0px -55% 0px' }
      );

      sections.forEach(function (sec) { sectionObserver.observe(sec); });
    }

  });
}());
