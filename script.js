document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- mobile nav ---------------- */
  const burger = document.getElementById('burger');
  const tabs = document.getElementById('tabs');

  if (burger && tabs) {
    burger.addEventListener('click', () => {
      const isOpen = tabs.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    tabs.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        tabs.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- active tab on scroll ---------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.tab[data-tab]');

  const setActiveTab = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveTab(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => navObserver.observe(section));
  }

  /* ---------------- reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in-view'), (i % 4) * 90);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------------- hero typewriter ---------------- */
  const typewriterEl = document.getElementById('typewriter');
  const codeLines = [
    'const developer = {',
    '  name: "Abhishek Kanaujiya",',
    '  role: "Full-Stack Developer",',
    '  stack: ["React", "Node.js", "Express", "MongoDB"],',
    '  currentlyBuilding: "production-grade web apps",',
    '  cgpi: 9.14,',
    '  opentowork: true,',
    '};'
  ];
  const fullText = codeLines.join('\n');

  const highlight = (text) => {
    return text
      .replace(/(const|true|false)/g, '<span class="tok-blue">$1</span>')
      .replace(/(".*?")/g, '<span class="tok-green">$1</span>')
      .replace(/(\b\d+\.?\d*\b)/g, '<span class="tok-orange">$1</span>');
  };

  if (typewriterEl) {
    if (reduceMotion) {
      typewriterEl.innerHTML = highlight(fullText);
    } else {
      let i = 0;
      const speed = 18;
      const type = () => {
        if (i <= fullText.length) {
          typewriterEl.innerHTML = highlight(fullText.slice(0, i));
          i++;
          setTimeout(type, speed);
        }
      };
      setTimeout(type, 500);
    }
  }

  /* ---------------- theme switcher ---------------- */
  const themeBtn = document.getElementById('themeBtn');
  const themeMenu = document.getElementById('themeMenu');
  const themeSwitch = document.getElementById('themeSwitch');
  const themeOptions = document.querySelectorAll('.theme-menu button[data-theme]');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';

  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    themeOptions.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    localStorage.setItem('portfolio-theme', theme);
  };

  applyTheme(savedTheme);

  if (themeBtn && themeMenu && themeSwitch) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = themeMenu.classList.toggle('open');
      themeBtn.setAttribute('aria-expanded', String(isOpen));
    });

    themeOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        applyTheme(btn.dataset.theme);
        themeMenu.classList.remove('open');
        themeBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!themeSwitch.contains(e.target)) {
        themeMenu.classList.remove('open');
        themeBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        themeMenu.classList.remove('open');
        themeBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------- image lightbox ---------------- */
  const heroPhotoBtn = document.getElementById('heroPhotoBtn');
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');

  const openLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (heroPhotoBtn) heroPhotoBtn.addEventListener('click', openLightbox);
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) closeLightbox();
  });

  /* ---------------- contact form (Web3Forms) ---------------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      submitBtn.disabled = true;
      if (formNote) {
        formNote.style.color = '';
        formNote.textContent = 'Sending…';
      }

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        const data = await response.json();

        if (response.ok && data.success) {
          if (formNote) formNote.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
          contactForm.reset();
        } else {
          if (formNote) {
            formNote.style.color = 'var(--orange)';
            formNote.textContent = data.message || 'Something went wrong. Please try again.';
          }
        }
      } catch (error) {
        if (formNote) {
          formNote.style.color = 'var(--orange)';
          formNote.textContent = 'Network error — please try again or email me directly.';
        }
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
});
