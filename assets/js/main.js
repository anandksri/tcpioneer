// Safe main site script
// Guarded AOS init and DOM interactions so pages that don't include certain elements won't throw.

function safeAOSInit() {
  if (typeof AOS !== 'undefined' && AOS && typeof AOS.init === 'function') {
    try {
      AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    } catch (e) {
      console.warn('AOS init failed:', e);
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  safeAOSInit();

  // Counter Animation (if needed)
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    counters.forEach(counter => {
      const raw = counter.getAttribute('data-target');
      const target = raw ? parseInt(raw, 10) : 0;
      if (!target) return;
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.round(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(counter);
    });
  }

  // Hero typing effect (guarded)
  (function initHeroTyping() {
    const l1 = document.getElementById('line1');
    const l2 = document.getElementById('line2');
    if (!l1 || !l2) return;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    const text1 = "Securing the Future";
    const text2 = "Through Education";

    function hackerTypeEffect(element, finalText, opts = {}) {
      let iteration = 0;
      const speed = opts.speed || 30;
      const stepIncrement = opts.stepIncrement || 0.5;
      const interval = setInterval(() => {
        element.textContent = finalText
          .split("")
          .map((char, i) => {
            if (i < iteration) return finalText[i];
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");

        if (iteration >= finalText.length) {
          clearInterval(interval);
          if (typeof opts.callback === 'function') opts.callback();
        }
        iteration += stepIncrement;
      }, speed);
    }

    function startAnimation() {
      l1.textContent = '';
      l2.textContent = '';

      hackerTypeEffect(l1, text1, { speed: 35, stepIncrement: 0.6, callback: () => {
        setTimeout(() => {
          hackerTypeEffect(l2, text2, { speed: 35, stepIncrement: 0.6, callback: () => {
            setTimeout(startAnimation, 3000);
          }});
        }, 300);
      }});
    }

    // Respect prefers-reduced-motion
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!media || !media.matches) {
      // delay slightly to allow layout to settle
      setTimeout(startAnimation, 200);
    }
  })();

  // FAQ toggle helper (delegated usage safe)
  window.toggleFAQ = function (element) {
    if (!element) return;
    const content = element.nextElementSibling;
    const arrow = element.querySelector('svg');
    if (content) content.classList.toggle('hidden');
    if (arrow) arrow.classList.toggle('rotate-180');
  };

  // Mobile menu: try multiple known IDs and guard
  (function initMobileMenu() {
    const possibleMenuBtns = ['mobile-menu-button', 'mobileMenuBtn', 'mobile-menu-toggle', 'mobileMenuBtn'];
    let btn = null;
    for (const id of possibleMenuBtns) {
      const el = document.getElementById(id);
      if (el) { btn = el; break; }
    }
    const mobileMenu = document.getElementById('mobileMenu') || document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon') || btn?.querySelector('i');

    if (!btn || !mobileMenu) return;

    btn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('translate-y-[-100%]');
      mobileMenu.classList.toggle('fade-in');

      if (hamburgerIcon) {
        if (mobileMenu.classList.contains('hidden')) {
          hamburgerIcon.classList.remove('fa-times');
          hamburgerIcon.classList.add('fa-bars');
          hamburgerIcon.style.transform = 'rotate(0deg)';
        } else {
          hamburgerIcon.classList.remove('fa-bars');
          hamburgerIcon.classList.add('fa-times');
          hamburgerIcon.style.transform = 'rotate(180deg)';
        }
      }
    });
  })();
});



