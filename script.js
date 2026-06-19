// ============================================================
// KONEK Landing Page Script
// ============================================================

const DASHBOARD_URL = 'https://konek-mdrrmo.azurewebsites.net';
const GITHUB_REPO = 'your-org/ProjectKONEK'; // Update with actual repo

// ============================================================
// Navbar scroll effect
// ============================================================
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 50);
  lastScroll = y;
}, { passive: true });

// ============================================================
// Mobile menu toggle
// ============================================================
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('navMobile');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-mobile-link, .nav-mobile-btn').forEach(el => {
  el.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
  });
});

// ============================================================
// Smooth scroll for anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============================================================
// Scroll animations (Intersection Observer)
// ============================================================
const animateElements = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || '0');
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

animateElements.forEach(el => observer.observe(el));

// ============================================================
// GitHub Release — fetch latest APK download URL
// ============================================================
async function fetchLatestRelease() {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
    if (!res.ok) return;
    const data = await res.json();

    const apk = data.assets?.find(a => a.name?.endsWith('.apk'));
    if (apk) {
      const btn = document.getElementById('downloadBtn');
      const btnText = document.getElementById('downloadBtnText');
      const version = document.getElementById('downloadVersion');

      if (btn) btn.href = apk.browser_download_url;
      if (btnText) btnText.textContent = `Download APK v${apk.name.replace('.apk', '').replace('v', '')}`;
      if (version) {
        const size = (apk.size / (1024 * 1024)).toFixed(1);
        version.textContent = `v${data.tag_name} • ${size} MB • Android 6.0+`;
      }
    }
  } catch (_) {
    // Silently fail — keep default download text
  }
}

fetchLatestRelease();

// ============================================================
// Dashboard link — set actual URL
// ============================================================
const dashboardLink = document.getElementById('dashboardLink');
if (dashboardLink) {
  dashboardLink.href = DASHBOARD_URL;
  dashboardLink.target = '_blank';
  dashboardLink.rel = 'noopener noreferrer';
}

// Also update nav dashboard button
document.querySelectorAll('.nav-btn-primary, .nav-mobile-btn.primary').forEach(el => {
  if (el.textContent.includes('Dashboard')) {
    el.href = DASHBOARD_URL;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  }
});

// ============================================================
// Hero stats — animate counters (simulated for landing)
// ============================================================
function animateCounter(el, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * eased);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Animate when hero stats come into view
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(document.getElementById('statSos'), 1247, 2000);
      animateCounter(document.getElementById('statNodes'), 42, 1500);
      animateCounter(document.getElementById('statMunicipalities'), 3, 1000);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObserver.observe(statsSection);

// ============================================================
// Phone SOS button interaction (cosmetic)
// ============================================================
const phoneSos = document.querySelector('.phone-sos-btn');
if (phoneSos) {
  phoneSos.addEventListener('click', () => {
    phoneSos.style.transform = 'scale(0.95)';
    setTimeout(() => { phoneSos.style.transform = ''; }, 150);
  });
}
