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
