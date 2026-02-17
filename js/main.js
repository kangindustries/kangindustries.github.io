(() => {
  'use strict';

  /* ═══════════════════════════════════════════════
     BOOT SCREEN
     Shows a cinematic terminal boot sequence, then
     fades out to reveal the page
  ═══════════════════════════════════════════════ */
  const bootLines = [
    '> KANG_INDUSTRIES OS v3.0.0',
    '> Initializing security modules...',
    '> Loading cryptographic keys... [OK]',
    '> Mounting forensics toolkit... [OK]',
    '> Connecting to threat intel feed... [OK]',
    '> Calibrating SIEM detection rules... [OK]',
    '> All systems operational.',
    '> WELCOME.',
  ];

  function runBoot() {
    const boot = document.getElementById('boot-screen');
    if (!boot) return;

    // Already seen this session — skip
    if (sessionStorage.getItem('booted')) {
      boot.style.display = 'none';
      return;
    }

    const linesEl = boot.querySelector('.boot-lines');
    const barEl   = boot.querySelector('.boot-bar');

    bootLines.forEach((text, i) => {
      const div = document.createElement('div');
      div.className = 'boot-line';
      div.style.animationDelay = `${i * 0.2}s`;
      if (i === bootLines.length - 1) {
        div.innerHTML = text + '<span class="boot-cursor"></span>';
      } else {
        div.textContent = text;
      }
      linesEl.appendChild(div);
    });

    // After animation, mark done and hide
    setTimeout(() => {
      boot.addEventListener('animationend', () => {
        boot.style.display = 'none';
        sessionStorage.setItem('booted', '1');
      }, { once: true });
    }, 2000);
  }

  /* ═══════════════════════════════════════════════
     CUSTOM CURSOR
     Dot follows mouse instantly.
     Ring follows with elastic lag.
     Morphs on hover & click.
  ═══════════════════════════════════════════════ */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let raf;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    // Ring lerps toward cursor
    function tickRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      raf = requestAnimationFrame(tickRing);
    }
    tickRing();

    // Expand ring on hover
    const hoverEls = 'a, button, .card, .stackbtn, .tag, .btn, .nav__link';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverEls)) ring.classList.add('hovering');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverEls)) ring.classList.remove('hovering');
    });

    // Shrink on click
    document.addEventListener('mousedown', () => ring.classList.add('clicking'));
    document.addEventListener('mouseup',   () => ring.classList.remove('clicking'));

    // Hide when leaving window
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
  }

  /* ═══════════════════════════════════════════════
     PAGE TRANSITION WIPE
     Green curtain slides in on link click,
     then wipes out after navigation.
  ═══════════════════════════════════════════════ */
  const wipe = document.getElementById('page-wipe');

  function doWipeIn(cb) {
    if (!wipe) { cb(); return; }
    wipe.style.visibility = 'visible';
    wipe.className = 'wipe-in';
    wipe.addEventListener('animationend', cb, { once: true });
  }
  function doWipeOut() {
    if (!wipe) return;
    wipe.className = 'wipe-out';
    wipe.addEventListener('animationend', () => {
      wipe.className = '';
      wipe.style.visibility = 'hidden';
    }, { once: true });
  }

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      doWipeIn(() => { window.location.href = href; });
    });
  });

  // On page load, wipe is hidden by default
  if (wipe) {
    wipe.style.transform = 'scaleX(0)';
  }

  /* ═══════════════════════════════════════════════
     NAVBAR
     Scroll-triggered background + active link
  ═══════════════════════════════════════════════ */
  const topbar = document.querySelector('.topbar');
  if (topbar) {
    window.addEventListener('scroll', () => {
      topbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const p = link.getAttribute('href');
    if (p === currentPage || (currentPage === '' && p === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ═══════════════════════════════════════════════
     SMOOTH SCROLL for anchor links
  ═══════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      e.preventDefault();
      const el = document.querySelector(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ═══════════════════════════════════════════════
     HERO TEXT — CHAR-BY-CHAR REVEAL
     Splits .title text into individual <span class="char">
     and staggers their animation-delay.
  ═══════════════════════════════════════════════ */
  function splitTitle() {
    const title = document.querySelector('.title');
    if (!title) return;

    // Walk child nodes, split text nodes and preserve HTML elements
    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        [...node.textContent].forEach(ch => {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = ch === ' ' ? '\u00a0' : ch;
          frag.appendChild(span);
        });
        return frag;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false);
        node.childNodes.forEach(child => {
          const processed = processNode(child);
          clone.appendChild(processed);
        });
        return clone;
      }
      return node.cloneNode(true);
    }

    const newContent = document.createDocumentFragment();
    title.childNodes.forEach(child => {
      newContent.appendChild(processNode(child));
    });
    title.innerHTML = '';
    title.appendChild(newContent);

    // Remove formatting whitespace introduced by HTML indentation
    const trimEdgeSpaces = () => {
      const chars = title.querySelectorAll('.char');
      if (!chars.length) return;

      const isWhitespaceChar = (value) => {
        if (value == null) return false;
        const normalized = value.replace(/\u00a0/g, ' ');
        return normalized.trim() === '';
      };

      let first = chars[0];
      while (first && isWhitespaceChar(first.textContent)) {
        const parent = first.parentNode;
        first.remove();
        first = parent?.querySelector('.char') || null;
      }

      let currentChars = title.querySelectorAll('.char');
      let last = currentChars[currentChars.length - 1];
      while (last && isWhitespaceChar(last.textContent)) {
        const parent = last.parentNode;
        last.remove();
        currentChars = title.querySelectorAll('.char');
        last = currentChars[currentChars.length - 1];
      }
    };
    trimEdgeSpaces();

    // Assign staggered delays
    title.querySelectorAll('.char').forEach((span, i) => {
      span.style.animationDelay = `${0.5 + i * 0.04}s`;
    });
  }

  /* ═══════════════════════════════════════════════
     DECIPHER NAME  (scramble → resolve)
  ═══════════════════════════════════════════════ */
  function decipherName() {
    const el = document.getElementById('decipher-name');
    if (!el) return;
    const target  = el.dataset.value;
    const chars   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?';
    let iteration = 0;

    el.textContent = '';
    const iv = setInterval(() => {
      el.textContent = target.split('').map((ch, idx) => {
        if (idx < iteration) return target[idx];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');

      if (iteration >= target.length) clearInterval(iv);
      iteration += 1 / 4;
    }, 40);
  }

  /* ═══════════════════════════════════════════════
     HERO MOUSE GLOW
  ═══════════════════════════════════════════════ */
  const poster = document.querySelector('.poster');
  const glowEl = document.querySelector('.poster__glow');
  if (poster && glowEl) {
    poster.addEventListener('mousemove', e => {
      const r = poster.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      poster.style.setProperty('--mx', x + 'px');
      poster.style.setProperty('--my', y + 'px');
    });
  }

  /* ═══════════════════════════════════════════════
     RADAR BLIPS + STATUS DECODE
  ═══════════════════════════════════════════════ */
  const radarContainer = document.getElementById('radar-container');
  const statusEl       = document.getElementById('status-display');

  if (radarContainer && statusEl) {
    const phrases = [
      'INCIDENT_RESPONSE', 'NETWORK_SECURITY', 'IT_AUDITING',
      'DIGITAL_FORENSICS', 'MALWARE_ANALYSIS', 'ETHICAL_HACKING',
      'SERVER_ADMINISTRATION',   'INTRUSION_PREVENTION',  'SECURE_WEB_APPLICATIONS'
    ];

    function decode(text) {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
      let i = 0;
      const iv = setInterval(() => {
        statusEl.textContent = text.split('').map((ch, idx) =>
          idx < i ? text[idx] : alphabet[Math.floor(Math.random() * alphabet.length)]
        ).join('');
        if (i >= text.length) clearInterval(iv);
        i += 1/3;
      }, 28);
    }

    function spawnBlip() {
      const b = document.createElement('div');
      b.className = 'radar-blip';
      b.style.left = (Math.random() * 32 + 58) + '%';
      b.style.top  = (Math.random() * 76 + 10) + '%';
      radarContainer.appendChild(b);
      setTimeout(() => b.remove(), 3500);
      decode(phrases[Math.floor(Math.random() * phrases.length)]);
    }

    // Start after boot
    setTimeout(() => setInterval(spawnBlip, 4000), 3200);
  }

  /* ═══════════════════════════════════════════════
     PARTICLE CANVAS
     Diagonal data-stream particles — Matrix-lite
  ═══════════════════════════════════════════════ */
  function initParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const COUNT = 55;
    const CHARS = '01アイウエオカキクケコサシスセソ';

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.3 + Math.random() * 0.7,
      char:  CHARS[Math.floor(Math.random() * CHARS.length)],
      opacity: 0.05 + Math.random() * 0.18,
      size: 10 + Math.random() * 6,
      changeTimer: 0,
    }));

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.speed;
        p.changeTimer++;
        if (p.changeTimer > 40) {
          p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
          p.changeTimer = 0;
        }
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle   = '#34d399';
        ctx.font        = `${p.size}px 'DM Mono', monospace`;
        ctx.fillText(p.char, p.x, p.y);
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ═══════════════════════════════════════════════
     CARD 3D MAGNETIC TILT
     Cards tilt toward the mouse while hovered
  ═══════════════════════════════════════════════ */
  function initCardTilt() {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;
        const dx = (e.clientX - cx) / (r.width  / 2);  // -1 … +1
        const dy = (e.clientY - cy) / (r.height / 2);  // -1 … +1

        // Update the radial highlight position
        card.style.setProperty('--cx', ((e.clientX - r.left) / r.width  * 100) + '%');
        card.style.setProperty('--cy', ((e.clientY - r.top)  / r.height * 100) + '%');

        // 3D tilt — max 6 degrees
        card.style.transform =
          `perspective(600px) rotateY(${dx * 5}deg) rotateX(${-dy * 4}deg) scale(1.01)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ═══════════════════════════════════════════════
     SCROLL OBSERVER
     Handles: cards, panels, stackbtns, and section
     heading glitch effects
  ═══════════════════════════════════════════════ */
  function initScrollObserver() {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        if (el.classList.contains('section-heading')) {
          // Glitch reveal for h2 headings
          el.classList.add('glitch');
        } else {
          el.classList.add('visible');
        }
        obs.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    document.querySelectorAll('.card, .panel, .stackbtn').forEach(el => io.observe(el));

    // Section headings glitch
    document.querySelectorAll('.section__head h2').forEach(h => {
      h.classList.add('section-heading');
      io.observe(h);
    });
  }

  /* ═══════════════════════════════════════════════
     YEAR
  ═══════════════════════════════════════════════ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ═══════════════════════════════════════════════
     INIT — sequence matters
  ═══════════════════════════════════════════════ */
  runBoot();
  splitTitle();

  window.addEventListener('load', () => {
    decipherName();
    initParticles();
    initCardTilt();
    initScrollObserver();
  });

})();