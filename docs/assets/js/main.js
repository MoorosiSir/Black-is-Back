/* ── Mobile drawer ── */
function toggleDrawer() {
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('mobileDrawer');
  const isOpen = burger.classList.toggle('open');
  drawer.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
  drawer.setAttribute('aria-hidden', String(!isOpen));
  drawer.toggleAttribute('inert', !isOpen);
}
function closeDrawer() {
  const burger = document.getElementById('burger');
  burger.classList.remove('open');
  document.getElementById('mobileDrawer').classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.getElementById('mobileDrawer').setAttribute('aria-hidden', 'true');
  document.getElementById('mobileDrawer').setAttribute('inert', '');
}

/* Escape closes the mobile menu and returns focus to the menu button */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const drawer = document.getElementById('mobileDrawer');
  if (drawer && drawer.classList.contains('open')) {
    closeDrawer();
    document.getElementById('burger')?.focus();
  }
});

/* ── Active nav link (desktop + mobile) ── */
(function markActive() {
  const pathParts = location.pathname.split('/').filter(Boolean);
  let path = pathParts.length ? pathParts[pathParts.length - 1] : 'index.html';
  if (!path.endsWith('.html')) path += '.html';
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.getAttribute('data-nav') === path) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
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
  document.querySelectorAll('.faq-item').forEach(faq => {
    faq.classList.remove('open');
    const question = faq.querySelector('.faq-q');
    question?.setAttribute('aria-expanded', 'false');
    const answer = question?.nextElementSibling;
    answer?.setAttribute('aria-hidden', 'true');
  });
  if (!open) {
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.nextElementSibling?.setAttribute('aria-hidden', 'false');
  }
}

/* ── Gallery filter ── */

function filterGallery(cat, btn) {

  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });

  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');

  document.querySelectorAll('.gallery-project').forEach(project => {
    const projectCat = project.dataset.cat;

    project.style.display =
      (cat === 'all' || projectCat === cat) ? '' : 'none';
  });
}

/* ── Lightbox (image zoom viewer) ── */

let lbImages = [];
let lbIndex = 0;
let lbGroup = null;
let lbTrigger = null;

function buildLbImages(group) {
  if (!group) return [];

  return Array.from(
    group.querySelectorAll('.gallery-item img, .mtj-image img')
  ).map(img => ({
    src: img.getAttribute('src'),
    alt: img.getAttribute('alt') || ''
  }));
}

function openLightbox(index, group, trigger) {
  if (!group) return;

  const images = buildLbImages(group);

  if (!images.length) return;
  if (index < 0 || index >= images.length) return;

  lbGroup = group;
  lbImages = images;
  lbIndex = index;
  lbTrigger = trigger;

  updateLightbox();

  const lightboxEl = document.getElementById('lightbox');
  if (!lightboxEl) return;

  lightboxEl.classList.add('open');
  lightboxEl.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxEl.querySelector('.lb-close')?.focus();
}

function closeLightbox() {
  const lightboxEl = document.getElementById('lightbox');

  if (lightboxEl) {
    lightboxEl.classList.remove('open');
    lightboxEl.setAttribute('aria-hidden', 'true');
  }

  document.body.style.overflow = '';
  lbTrigger?.focus();

  lbImages = [];
  lbIndex = 0;
  lbGroup = null;
  lbTrigger = null;
}

function lbNav(dir) {
  if (!lbImages.length) return;

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

  if (capEl) {
    capEl.textContent = item.alt;
  }

  if (countEl) {
    countEl.textContent = `${lbIndex + 1} / ${lbImages.length}`;
  }
}

function initLightbox() {

  /* ── Homepage gallery ── */

  document.querySelectorAll('.gallery-grid').forEach(gallery => {
    const items = Array.from(
      gallery.querySelectorAll('.gallery-item')
    ).filter(item => item.querySelector('img'));

    items.forEach((item, index) => {
      const image = item.querySelector('img');
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `View image: ${image.alt || 'project photo'}`);

      item.addEventListener('click', () => {
        openLightbox(index, gallery, item);
      });

      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(index, gallery, item);
        }
      });
    });
  });

  /* ── Gallery projects ── */

  document.querySelectorAll('.gallery-project').forEach(project => {

    const items = Array.from(
      project.querySelectorAll('.gallery-item')
    ).filter(item => item.querySelector('img'));

    items.forEach((item, index) => {
      const image = item.querySelector('img');
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `View image: ${image.alt || 'project photo'}`);

      item.addEventListener('click', () => {
        openLightbox(index, project, item);
      });

      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(index, project, item);
        }
      });

    });

  });


  /* ── More Than The Job stories ── */

  document.querySelectorAll('.mtj-story').forEach(story => {

    const items = Array.from(
      story.querySelectorAll('.mtj-image')
    ).filter(item => item.querySelector('img'));

    items.forEach((item, index) => {
      const image = item.querySelector('img');
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `View image: ${image.alt || 'project photo'}`);

      item.addEventListener('click', () => {
        openLightbox(index, story, item);
      });

      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(index, story, item);
        }
      });

    });

  });


  /* ── Close when clicking the background ── */

  const lightboxEl = document.getElementById('lightbox');

  if (lightboxEl) {

    lightboxEl.addEventListener('click', (e) => {

      if (e.target === lightboxEl) {
        closeLightbox();
      }

    });

  }


  /* ── Close / navigation buttons ── */

  const closeBtn = document.querySelector('.lb-close');
  const prevBtn = document.querySelector('.lb-prev');
  const nextBtn = document.querySelector('.lb-next');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      lbNav(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      lbNav(1);
    });
  }


  /* ── Keyboard navigation ── */

  document.addEventListener('keydown', (e) => {

    const lb = document.getElementById('lightbox');

    if (!lb || !lb.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    }

    if (e.key === 'ArrowRight') {
      lbNav(1);
    }

    if (e.key === 'ArrowLeft') {
      lbNav(-1);
    }

    if (e.key === 'Tab') {
      const focusable = Array.from(
        lb.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')
      ).filter(element => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

  });


  /* ── Touch swipe ── */

  let touchStartX = 0;

  const stage = document.querySelector('.lb-stage');

  if (stage) {

    stage.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    stage.addEventListener(
      'touchend',
      (e) => {

        const touchEndX = e.changedTouches[0].screenX;
        const dx = touchEndX - touchStartX;

        if (Math.abs(dx) > 40) {
          lbNav(dx < 0 ? 1 : -1);
        }

      },
      { passive: true }
    );

  }

}


/* ── Start Lightbox ── */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLightbox);
} else {
  initLightbox();
}

/* ── Contact form -> WhatsApp ── */
function handleFormSubmit(e) {
  e.preventDefault();
  const f = e.target;
  const first = f.querySelector('[name=first]').value;
  const last = f.querySelector('[name=last]').value;
  const phone = f.querySelector('[name=phone]').value;
  const email = f.querySelector('[name=email]').value;
  const service = f.querySelector('[name=service]').value;
  const details = f.querySelector('[name=details]').value;

  const msg = encodeURIComponent(`Hi, I'd like to discuss my project!

Name: ${first} ${last}
Phone: ${phone}
Email: ${email || 'Not provided'}
What I'm planning: ${service}
Details: ${details}`);

  const whatsappUrl = `https://wa.me/27636377014?text=${msg}`;
  const whatsappWindow = window.open(whatsappUrl, '_blank');
  if (whatsappWindow) whatsappWindow.opener = null;
  const success = document.getElementById('formSuccess');
  success.style.display = 'block';
  success.textContent = whatsappWindow
    ? 'Your details are ready to send in WhatsApp.'
    : "WhatsApp didn't open automatically. Continue using this link: ";

  if (!whatsappWindow) {
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Open WhatsApp';
    link.setAttribute('aria-label', 'Open WhatsApp (opens in a new tab)');
    success.append(link);
  }
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
  const whatsappUrl = `https://wa.me/27636377014?text=${msg}`;
  const whatsappWindow = window.open(whatsappUrl, '_blank');
  if (whatsappWindow) whatsappWindow.opener = null;
  const success = document.getElementById('partnerFormSuccess');
  success.style.display = 'block';
  success.textContent = whatsappWindow
    ? "Your details are ready to send in WhatsApp. We'll be in touch after you send them."
    : "WhatsApp didn't open automatically. Continue using this link: ";

  if (!whatsappWindow) {
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Open WhatsApp';
    link.setAttribute('aria-label', 'Open WhatsApp (opens in a new tab)');
    success.append(link);
  }
}

/* ── BIB Promotion System ── */
const BIB_PROMOTIONS = [

    {
      id: "bib-birthday-month-2026",
      title: "BIB BIRTHDAY MONTH SPECIAL",
      accentWords: ["BIRTHDAY", "SPECIAL"],
      subtitle: "YOUR DREAM SPACE. A BETTER PRICE.",
      description: "Celebrate with Black Is Back Projects! Enjoy 30% off kitchen labour and up to 50% off custom wardrobe labour. Bring your ideas to life at a better price.",
      startDate: "2026-11-10T00:00:00",
      endDate: "2026-12-10T23:59:59",
      spotsTotal: 5,
      spotsRemaining: 5,
      active: true,
      image: "assets/images/web/BIB-Birthday-Month.webp",
      featured: true,
      whatsappMessage: "Hi BIB, I'm interested in the Birthday Month Special. I'd like to enquire about a kitchen or custom wardrobe project."
    }
,
  {
    id: "test-wardrobe-offer",
    title: "WARDROBE SPECIAL",
    accentWords: ["SPECIAL"],
    subtitle: "MORE STORAGE. BETTER SPACE.",
    description: "A special BIB offer on selected wardrobe projects. Message us to find out what's included.",
    startDate: "2026-09-14T00:00:00",
    endDate: "2026-10-21T23:59:59",
    spotsTotal: 5,
    spotsRemaining: 5,
    active: true,
    image: "assets/images/web/SkyCity-2-kitchen-After.webp",
    featured: false,
    whatsappMessage: "Hi BIB, I'd like to know about the Wardrobe Special."
  }
];

/* ── Determine promotion status ── */
function getPromotionStatus(promotion) {
  const now = new Date();
  const start = new Date(promotion.startDate);
  const end = new Date(promotion.endDate);

  if (!promotion.active) {
    return "closed";
  }

  if (now < start) {
    return "upcoming";
  }

  if (now > end || promotion.spotsRemaining <= 0) {
    return "closed";
  }

  const timeRemaining = end - now;
  const daysRemaining = timeRemaining / (1000 * 60 * 60 * 24);

  if (daysRemaining <= 3) {
    return "ending-soon";
  }

  return "active";
}

/* ── Find all current BIB promotions ── */
function getCurrentPromotions() {
  const currentPromotions = [];

  for (const promotion of BIB_PROMOTIONS) {
    const status = getPromotionStatus(promotion);

    if (status === "active" || status === "ending-soon") {
      currentPromotions.push({
        ...promotion,
        status: status
      });
    }
  }

  return currentPromotions;
}

/* ── Calculate promotion countdown ── */
function getPromotionCountdown(promotion) {
  const now = new Date();
  const end = new Date(promotion.endDate);
  const difference = end - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      closed: true
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    closed: false
  };
}

/* ── Keep promotion countdown updated ── */
function startPromotionCountdown(updateFunction) {
  updateFunction();
  updateHomePromotion();

  setInterval(() => {
    const promotions = getCurrentPromotions();

    if (promotions.length === 0) {
      updateFunction();
      updateHomePromotion();
      return;
    }

    promotions.forEach(promotion => {
      const card = document.querySelector(`[data-promotion-id="${promotion.id}"]`);

      if (card) {
        const countdown = getPromotionCountdown(promotion);

        card.querySelector('[data-time="days"]').innerHTML = `${countdown.days} <small>DAYS</small>`;
        card.querySelector('[data-time="hours"]').innerHTML = `${countdown.hours} <small>HRS</small>`;
        card.querySelector('[data-time="minutes"]').innerHTML = `${countdown.minutes} <small>MIN</small>`;
        card.querySelector('[data-time="seconds"]').innerHTML = `${countdown.seconds} <small>SEC</small>`;

        const status = card.querySelector(".promotion-status");

        if (status) {
          status.style.display = promotion.status === "ending-soon" ? "block" : "none";
        }
      }
    });

    /* Update homepage countdown */
    const homePromotion = document.getElementById("homePromotionCard");

    if (homePromotion) {
      const promotion = promotions.find(p => p.featured) || promotions[0];
      const countdown = getPromotionCountdown(promotion);

      const days = homePromotion.querySelector('[data-home-time="days"]');
      const hours = homePromotion.querySelector('[data-home-time="hours"]');
      const minutes = homePromotion.querySelector('[data-home-time="minutes"]');
      const seconds = homePromotion.querySelector('[data-home-time="seconds"]');

      if (days) days.innerHTML = `${countdown.days} <small>DAYS</small>`;
      if (hours) hours.innerHTML = `${countdown.hours} <small>HRS</small>`;
      if (minutes) minutes.innerHTML = `${countdown.minutes} <small>MIN</small>`;
      if (seconds) seconds.innerHTML = `${countdown.seconds} <small>SEC</small>`;
    }

  }, 1000);
}


/* ── Display promotion cards ── */
function updatePromotionCards() {
  const container = document.getElementById("promotionCards");

  if (!container) {
    return;
  }

  const promotions = getCurrentPromotions();

  if (promotions.length === 0) {
    /* no offers: show one clean centred card, not a cell inside the 3-column card grid */
    container.classList.remove("card-grid", "services-3");
    container.innerHTML = `
      <div class="promotion-empty">
        <div class="eyebrow"><span>No Active Offers</span></div>
        <h2>NOTHING <em>RUNNING RIGHT NOW</em></h2>
        <p>We don't have a special promotion running at the moment, but you can still talk to us about your project.</p>
        <a href="https://wa.me/27636377014?text=Hi%20BIB%2C%20I'd%20like%20to%20discuss%20a%20project." class="btn btn-primary" target="_blank">
          <i class="fab fa-whatsapp" aria-hidden="true"></i> Talk To BIB
        <span class="sr-only"> (opens in a new tab)</span></a>
      </div>
    `;
    return;
  }

  container.className = `promotion-grid promotion-count-${promotions.length}`;
  
  container.innerHTML = promotions.map((promotion, index) => {
    const countdown = getPromotionCountdown(promotion);
    const featuredClass = promotion.featured ? " featured" : "";
    const endingSoon = promotion.status === "ending-soon";

    return `
      <div class="promotion-card${featuredClass}" data-promotion-id="${promotion.id}">
        <div class="promotion-image">
          <img src="${promotion.image}" alt="${promotion.title}" loading="lazy" onerror="this.parentElement.style.display='none';">
        </div>

        <div class="service-num">OFFER ${String(index + 1).padStart(2, "0")}</div>

        <div class="promotion-status" ${endingSoon ? "" : 'style="display:none;"'}>
          ENDING SOON
        </div>

        <h2>${promotion.title}</h2>
        <p>${promotion.subtitle}</p>
        <p>${promotion.description}</p>

        <div class="promotion-countdown">
          <span data-time="days">${countdown.days} <small>DAYS</small></span>
          <span data-time="hours">${countdown.hours} <small>HRS</small></span>
          <span data-time="minutes">${countdown.minutes} <small>MIN</small></span>
          <span data-time="seconds">${countdown.seconds} <small>SEC</small></span>
        </div>

        <div class="service-tag">
          ${promotion.spotsRemaining} of ${promotion.spotsTotal} spots remaining
        </div>

        <a href="https://wa.me/27636377014?text=${encodeURIComponent(promotion.whatsappMessage)}" class="btn btn-primary btn-block" target="_blank">
          <i class="fab fa-whatsapp" aria-hidden="true"></i> Claim This Offer
        <span class="sr-only"> (opens in a new tab)</span></a>
      </div>
    `;
  }).join("");
}


/* ── Start promotion card display ── */
startPromotionCountdown(updatePromotionCards);

/* ── Homepage Promotion ── */

function formatPromotionTitle(promotion) {
  let title = promotion.title;

  if (!promotion.accentWords || promotion.accentWords.length === 0) {
    return title;
  }

  promotion.accentWords.forEach(word => {
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    title = title.replace(
      new RegExp(`\\b${escapedWord}\\b`, "gi"),
      match => `<em>${match}</em>`
    );
  });

  return title;
}

function updateHomePromotion() {
  const container = document.getElementById("homePromotionCard");

  if (!container) {
    return;
  }

  const promotions = getCurrentPromotions();

  if (promotions.length === 0) {
    document.getElementById("homePromotion")?.remove();
    return;
  }

  const promotion = promotions.find(p => p.featured) || promotions[0];
  const countdown = getPromotionCountdown(promotion);

  container.innerHTML = `
    <div class="home-promotion-card">
      <div class="home-promotion-image">
        <img src="${promotion.image}" alt="${promotion.title}" onerror="this.parentElement.style.display='none';">
      </div>

      <div class="home-promotion-content">
        <div class="service-num">LIMITED TIME</div>

        <h3>${formatPromotionTitle(promotion)}</h3>
        <p class="home-promotion-subtitle">${promotion.subtitle}</p>
        <p>${promotion.description}</p>

        <div class="promotion-countdown">
          <span data-home-time="days">${countdown.days} <small>DAYS</small></span>
          <span data-home-time="hours">${countdown.hours} <small>HRS</small></span>
          <span data-home-time="minutes">${countdown.minutes} <small>MIN</small></span>
          <span data-home-time="seconds">${countdown.seconds} <small>SEC</small></span>
        </div>

        <a href="https://wa.me/27636377014?text=${encodeURIComponent(promotion.whatsappMessage)}" class="btn btn-primary" target="_blank">
          <i class="fab fa-whatsapp" aria-hidden="true"></i> Claim This Offer
        <span class="sr-only"> (opens in a new tab)</span></a>
      </div>
    </div>
  `;
}

updateHomePromotion();

/* =========================================================
   BIB REVIEWS & TESTIMONIALS
   One source of truth for the whole website
========================================================= */

(function () {

  /* ---------------------------------------------------------
     BIB FEEDBACK DATA

     Add all genuine BIB reviews/testimonials here.

     type:
       "review"      = has a star rating
       "testimonial" = written feedback without stars

     featured:
       true  = eligible to appear on homepage
       false = Reviews page only

     source:
       "Google"
       "Direct"
       "WhatsApp"
       etc.
  --------------------------------------------------------- */

  window.BIB_REVIEWS = [

  {
    name: "L. Tebane",
    type: "testimonial",
    project: "Ceiling Project",
    location: "Evaton West",
    text: "Hi, I'm one of the customers who experienced the work of Black Is Back Projects. They're young and ambitious, their work is so perfect. They work with passion and love their work. Big up guys! May God protect your business and may you get bigger and bigger, with more customers. 🔥",
    source: "Direct",
    date: "2025-05-17",
    featured: true
  },

    {
    name: "Gloria",
    type: "testimonial",
    project: "Kitchen remake",
    location: "Drieziek",
    text: "Hi, The guys worked at my kitchen, they renewed it and it was a smooth and best service. they are respectful and communicte very well. I recommend their service",
    source: "Direct",
    date: "2025-07-28",
    featured: true
  }
];


  /* ---------------------------------------------------------
     HOMEPAGE MODE

     Launch:
       "testimonials"

     Later:
       "google"

     We are building the system now so this can be changed
     without rebuilding the homepage.
  --------------------------------------------------------- */

  window.BIB_HOME_REVIEWS_MODE = "testimonials";


  /* ---------------------------------------------------------
     HELPER FUNCTIONS
  --------------------------------------------------------- */

  function formatDate(date) {

    if (!date) return "";

    return new Date(date + "T00:00:00").toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

  }


  function getStars(rating) {

    if (!rating) return "";

    return "★".repeat(rating) +
           "☆".repeat(5 - rating);

  }


  function getInitial(name) {

    return name
      ? name.charAt(0).toUpperCase()
      : "?";

  }


  function getProjectInfo(review) {

    return review.project +
      (review.location ? " · " + review.location : "");

  }


  /* ---------------------------------------------------------
     BUILD A REVIEW / TESTIMONIAL CARD
  --------------------------------------------------------- */

  function buildReviewCard(review) {

    const stars = getStars(review.rating);
    const initial = getInitial(review.name);
    const projectInfo = getProjectInfo(review);
    const reviewDate = formatDate(review.date);

    return `
      <article class="review-card">

        ${stars ? `
          <div class="stars">
            ${stars}
          </div>
        ` : ""}

        <p class="quote">
          "${review.text}"
        </p>

        <div class="review-who">

          <div class="review-avatar">
            ${initial}
          </div>

          <div>

            <div class="review-name">
              ${review.name}
            </div>

            <div class="review-meta">
              ${projectInfo}
            </div>

            ${reviewDate ? `
              <div class="review-date">
                ${reviewDate}
              </div>
            ` : ""}

          </div>

        </div>

      </article>
    `;

  }


  /* =========================================================
     REVIEWS PAGE
  ========================================================= */

  const reviewsList = document.getElementById("reviewsList");
  const reviewsEmpty = document.getElementById("reviewsEmpty");

  if (reviewsList) {

    const reviewAverage =
      document.getElementById("reviewAverage");

    const reviewAverageStars =
      document.getElementById("reviewAverageStars");

    const reviewCount =
      document.getElementById("reviewCount");


    /* Show / hide empty state */

    if (reviewsEmpty) {

      reviewsEmpty.style.display =
        window.BIB_REVIEWS.length === 0
          ? ""
          : "none";

    }


    /* Render all feedback */

    if (window.BIB_REVIEWS.length > 0) {

      reviewsList.innerHTML =
        window.BIB_REVIEWS
          .map(buildReviewCard)
          .join("");

    }

    /* Calculate rating */

    const ratedReviews =
      window.BIB_REVIEWS.filter(function (review) {
        return Number(review.rating) > 0;
      });

    if (ratedReviews.length === 0) {
      if (reviewAverage) reviewAverage.textContent = "—";
      if (reviewAverageStars) reviewAverageStars.textContent = "";
      if (reviewCount) {
        reviewCount.textContent =
          window.BIB_REVIEWS.length === 1
            ? "1 client testimonial"
            : window.BIB_REVIEWS.length + " client testimonials";
      }
    }


    if (ratedReviews.length > 0) {

      const totalRating =
        ratedReviews.reduce(function (sum, review) {
          return sum + Number(review.rating);
        }, 0);


      const averageRating =
        totalRating / ratedReviews.length;


      if (reviewAverage) {

        reviewAverage.textContent =
          averageRating.toFixed(1);

      }


      if (reviewAverageStars) {

        const roundedRating =
          Math.round(averageRating);

        reviewAverageStars.textContent =
          "★".repeat(roundedRating) +
          "☆".repeat(5 - roundedRating);

      }


      if (reviewCount) {

        reviewCount.textContent =
          ratedReviews.length === 1
            ? "1 client review"
            : ratedReviews.length + " client reviews";

      }

    }

  }


const homeReviewsList =
  document.getElementById("homeReviewsList");

if (homeReviewsList) {

  let homeReviews = [];


  /* ---------------------------------------------------------
     SELECT HOMEPAGE REVIEWS
  --------------------------------------------------------- */

  if (window.BIB_HOME_REVIEWS_MODE === "testimonials") {

    homeReviews =
      window.BIB_REVIEWS.filter(function (review) {
        return review.featured === true;
      });

  }


  if (window.BIB_HOME_REVIEWS_MODE === "google") {

    homeReviews =
      window.BIB_REVIEWS.filter(function (review) {
        return review.source === "Google" &&
               review.featured === true;
      });

  }


  if (homeReviews.length > 0) {

    /* -------------------------------------------------------
       SETTINGS
    ------------------------------------------------------- */

    const total = homeReviews.length;      /* real reviews (dots)   */
    const MAX_VISIBLE = 3;                 /* cards on desktop      */
    const MOBILE_QUERY = "(max-width: 700px)";
    const SLIDE_DELAY = 5000;              /* ms between slides     */

    /* Clones of the first cards are added to the END of the track
       so the last real position can slide into "card 1" smoothly.
       [1][2][3][1][2][3]  ->  after the last slide we silently
       jump back to position 0, which looks identical.            */
    const cloneCount = total > 1 ? MAX_VISIBLE : 0;


    /* -------------------------------------------------------
       BUILD HTML (uses the existing buildReviewCard)
    ------------------------------------------------------- */

    function buildSlide(review, isClone) {

      return `
        <div class="review-slide${isClone ? " is-clone" : ""}"${isClone ? ' aria-hidden="true"' : ""}>
          ${buildReviewCard(review)}
        </div>
      `;

    }

    let slidesHTML = homeReviews.map(function (review) {
      return buildSlide(review, false);
    }).join("");

    for (let i = 0; i < cloneCount; i++) {
      slidesHTML += buildSlide(homeReviews[i % total], true);
    }

    homeReviewsList.innerHTML = `

      <div class="review-carousel" role="region" aria-roledescription="carousel" aria-label="Client reviews">

        <div class="review-carousel-track">
          ${slidesHTML}
        </div>

      </div>

      <div class="review-carousel-dots">

        ${homeReviews.map(function (review, index) {

          return `
            <button
              type="button"
              class="review-carousel-dot ${index === 0 ? "active" : ""}"
              data-review-index="${index}"
              aria-label="Show review ${index + 1}"
            ></button>
          `;

        }).join("")}

      </div>

    `;


    /* -------------------------------------------------------
       ELEMENTS + STATE
    ------------------------------------------------------- */

    const carousel =
      homeReviewsList.querySelector(".review-carousel");

    const track =
      homeReviewsList.querySelector(".review-carousel-track");

    const allSlides =
      homeReviewsList.querySelectorAll(".review-slide");

    const dots =
      homeReviewsList.querySelectorAll(".review-carousel-dot");

    let position = 0;       /* 0 .. total (total = the clone of card 1) */
    let slideStep = 0;      /* px moved per slide                        */
    let autoRotate = null;
    let isHovering = false;
    let focusWithin = false;
    let lastWidth = 0;


    /* -------------------------------------------------------
       LAYOUT – measured from the REAL width of .review-carousel
    ------------------------------------------------------- */

    function getVisibleCards() {

      const wanted =
        window.matchMedia(MOBILE_QUERY).matches ? 1 : MAX_VISIBLE;

      return Math.min(wanted, total);

    }


    function setTransform(animate) {

      if (!animate) {
        track.style.transition = "none";
      }

      track.style.transform =
        "translate3d(" + (-position * slideStep) + "px, 0, 0)";

      if (!animate) {
        void track.offsetWidth;          /* apply without animation */
        track.style.transition = "";
      }

    }


    function layout() {

      const visible = getVisibleCards();

      /* the gap is the slide's right padding (from the CSS) */
      const gap =
        parseFloat(
          window.getComputedStyle(allSlides[0]).paddingRight
        ) || 0;

      const width = carousel.getBoundingClientRect().width;

      lastWidth = width;

      /* visible cards + (visible - 1) gaps  =  container width */
      slideStep = (width + gap) / visible;

      carousel.style.setProperty("--slide-w", slideStep + "px");

      setTransform(false);

    }


    /* -------------------------------------------------------
       DOTS
    ------------------------------------------------------- */

    function updateDots() {

      const activeIndex = position % total;

      dots.forEach(function (dot, dotIndex) {

        dot.classList.toggle("active", dotIndex === activeIndex);
        if (dotIndex === activeIndex) { dot.setAttribute("aria-current", "true"); } else { dot.removeAttribute("aria-current"); }

      });

    }


    /* -------------------------------------------------------
       MOVEMENT
    ------------------------------------------------------- */

    function nextReview() {

      if (position >= total) {           /* safety: still on the clone */
        position = 0;
        setTransform(false);
      }

      position += 1;
      setTransform(true);
      updateDots();

    }


    function goToReview(index) {

      if (position >= total) {
        position = 0;
        setTransform(false);
      }

      position = index;
      setTransform(true);
      updateDots();

    }


    /* When we have slid onto the clone of card 1, jump back to the real
       card 1 with no animation (looks identical, so no visible jump). */
    track.addEventListener("transitionend", function (event) {

      if (event.target !== track ||
          event.propertyName !== "transform") {
        return;
      }

      if (position >= total) {
        position = 0;
        setTransform(false);
      }

    });


    /* -------------------------------------------------------
       AUTO ROTATION
    ------------------------------------------------------- */

    function stopAutoRotate() {

      if (autoRotate) {

        clearInterval(autoRotate);
        autoRotate = null;

      }

    }


    function startAutoRotate() {

      stopAutoRotate();

      if (total > 1 &&
          !isHovering &&
          !focusWithin &&
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

        autoRotate = setInterval(nextReview, SLIDE_DELAY);

      }

    }


    /* -------------------------------------------------------
       DOT CONTROLS
    ------------------------------------------------------- */

    dots.forEach(function (dot) {

      dot.addEventListener("click", function () {

        goToReview(Number(dot.dataset.reviewIndex));
        startAutoRotate();

      });

    });


    /* -------------------------------------------------------
       PAUSE ON HOVER (mouse only, so phones never get stuck)
    ------------------------------------------------------- */

    homeReviewsList.addEventListener("pointerenter", function (event) {

      if (event.pointerType !== "mouse") return;

      isHovering = true;
      stopAutoRotate();

    });

    /* Keyboard users: pause while focus is inside the reviews, resume when it leaves */
    homeReviewsList.addEventListener("focusin", function () {

      focusWithin = true;
      stopAutoRotate();

    });

    homeReviewsList.addEventListener("focusout", function (event) {

      if (homeReviewsList.contains(event.relatedTarget)) return;

      focusWithin = false;
      startAutoRotate();

    });

    homeReviewsList.addEventListener("pointerleave", function (event) {

      if (event.pointerType !== "mouse") return;

      isHovering = false;
      startAutoRotate();

    });


    /* -------------------------------------------------------
       KEEP WIDTHS CORRECT WHEN THE CONTAINER CHANGES SIZE
    ------------------------------------------------------- */

    if ("ResizeObserver" in window) {

      new ResizeObserver(function () {

        if (carousel.getBoundingClientRect().width !== lastWidth) {
          layout();
        }

      }).observe(carousel);

    }

    window.addEventListener("resize", layout);


    /* -------------------------------------------------------
       START
    ------------------------------------------------------- */

    layout();
    updateDots();
    startAutoRotate();

  }

}

})();


/* These marls are used to make notes, 
and everything written within the marks 
will not be read as part of the code 
so to omit something, use these marks 
or even // tetx... */
