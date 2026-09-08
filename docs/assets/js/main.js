/* ── Mobile drawer ── */
function toggleDrawer() {
  document.getElementById('burger').classList.toggle('open');
  document.getElementById('mobileDrawer').classList.toggle('open');
}
function closeDrawer() {
  document.getElementById('burger').classList.remove('open');
  document.getElementById('mobileDrawer').classList.remove('open');
}

/* ── Active nav link (desktop + mobile) ── */
(function markActive() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.getAttribute('data-nav') === path) a.classList.add('active');
  });
})();

/* ── Reveal on scroll ── */
(function reveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: .12 });
  items.forEach(el => obs.observe(el));
})();

/* ── FAQ accordion ── */
function toggleFaq(btn) {
  const item = btn.parentElement;
  const open = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
  if (!open) item.classList.add('open');
}

/* ── Gallery filter ── */
function filterGallery(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
  });
}

/* ── Lightbox (image zoom viewer) ── */
let lbImages = [];
let lbIndex = 0;

function buildLbImages() {
  lbImages = Array.from(document.querySelectorAll('.gallery-item img')).map(img => ({
    src: img.getAttribute('src'),
    alt: img.getAttribute('alt') || ''
  }));
}

function openLightbox(index) {
  if (!lbImages.length) buildLbImages();
  if (!lbImages.length) return;
  lbIndex = index;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function lbNav(dir) {
  lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
  updateLightbox();
}

function updateLightbox() {
  const item = lbImages[lbIndex];
  const imgEl = document.getElementById('lbImage');
  const capEl = document.getElementById('lbCaption');
  const countEl = document.getElementById('lbCounter');
  if (!item || !imgEl) return;
  imgEl.src = item.src;
  imgEl.alt = item.alt;
  capEl.textContent = item.alt;
  countEl.textContent = `${lbIndex + 1} / ${lbImages.length}`;
}

(function initLightbox() {
  document.addEventListener('DOMContentLoaded', () => {
    buildLbImages();
    document.querySelectorAll('.gallery-item').forEach((tile, idx) => {
      if (!tile.querySelector('img')) return;
      tile.addEventListener('click', () => {
        const allTiles = Array.from(document.querySelectorAll('.gallery-item')).filter(t => t.querySelector('img'));
        const clickedIndex = allTiles.indexOf(tile);
        openLightbox(clickedIndex);
      });
    });
    const lightboxEl = document.getElementById('lightbox');
    if (lightboxEl) {
      lightboxEl.addEventListener('click', (e) => {
        if (e.target === lightboxEl) closeLightbox();
      });
    }
    document.addEventListener('keydown', (e) => {
      const lb = document.getElementById('lightbox');
      if (!lb || !lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') lbNav(1);
      if (e.key === 'ArrowLeft') lbNav(-1);
    });
    // Touch swipe support
    let touchStartX = 0;
    const stage = document.querySelector('.lb-stage');
    if (stage) {
      stage.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
      stage.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(dx) > 40) lbNav(dx < 0 ? 1 : -1);
      }, { passive: true });
    }
  });
})();

/* ── Contact form -> WhatsApp ── */
function handleFormSubmit(e) {
  e.preventDefault();
  const f = e.target;
  const first = f.querySelector('[name=first]').value;
  const last = f.querySelector('[name=last]').value;
  const phone = f.querySelector('[name=phone]').value;
  const service = f.querySelector('[name=service]').value;
  const details = f.querySelector('[name=details]').value;
  const msg = encodeURIComponent(`Hi, I'd like a free quote!\n\nName: ${first} ${last}\nPhone: ${phone}\nService: ${service}\nDetails: ${details}`);
  document.getElementById('formSuccess').style.display = 'block';
  setTimeout(() => window.open(`https://wa.me/27636377014?text=${msg}`, '_blank'), 700);
}

/* ── Partnership application form -> WhatsApp ── */
function handlePartnerFormSubmit(e) {
  e.preventDefault();
  const f = e.target;
  const business = f.querySelector('[name=business]').value;
  const contact = f.querySelector('[name=contact]').value;
  const phone = f.querySelector('[name=phone]').value;
  const email = f.querySelector('[name=email]').value;
  const location = f.querySelector('[name=location]').value;
  const industry = f.querySelector('[name=industry]').value;
  const offer = f.querySelector('[name=offer]').value;
  const collab = f.querySelector('[name=collab]').value;
  const links = f.querySelector('[name=links]').value;
  const msg = encodeURIComponent(`Hi, I'd like to explore a BIB partnership!\n\nBusiness: ${business}\nContact: ${contact}\nPhone: ${phone}\nEmail: ${email}\nLocation: ${location}\nIndustry: ${industry}\nWhat we offer: ${offer}\nHow we could collaborate: ${collab}\nLinks: ${links}`);
  document.getElementById('partnerFormSuccess').style.display = 'block';
  setTimeout(() => window.open(`https://wa.me/27636377014?text=${msg}`, '_blank'), 700);
}
