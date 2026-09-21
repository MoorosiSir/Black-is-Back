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
  const email = f.querySelector('[name=email]').value;
  const service = f.querySelector('[name=service]').value;
  const details = f.querySelector('[name=details]').value;

  const msg = encodeURIComponent(`Hi, I'd like to discuss my project!

Name: ${first} ${last}
Phone: ${phone}
Email: ${email || 'Not provided'}
What I'm planning: ${service}
Details: ${details}`);

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

/* ── BIB Promotion System ── */
const BIB_PROMOTIONS = [
  {
    id: "free-3d-design",
    title: "FREE 3D DESIGN",
    accentWords: ["FREE"],
    subtitle: "SEE YOUR IDEA BEFORE WE BUILD IT",
    description: "Get a visual design of your idea before the build begins, so you can see how it could work in your space.",
    startDate: "2026-09-14T00:00:00",
    endDate: "2026-09-20T23:59:59",
    spotsTotal: 5,
    spotsRemaining: 5,
    active: true,
    image: "assets/images/image6.jpeg",
    featured: true, 
    whatsappMessage: "Hi BIB, I'd like to claim the Free 3D Design promotion."
  },
  {
    id: "test-wardrobe-offer",
    title: "WARDROBE SPECIAL",
    accentWords: ["SSPECIAL"],
    subtitle: "MORE STORAGE. BETTER SPACE.",
    description: "A special BIB offer on selected wardrobe projects. Message us to find out what's included.",
    startDate: "2026-09-14T00:00:00",
    endDate: "2026-09-21T23:59:59",
    spotsTotal: 5,
    spotsRemaining: 5,
    active: true,
    image: "assets/images/Kitchen-in-SkyCity-After.webp",
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
    container.innerHTML = `
      <div class="promotion-empty">
        <div class="eyebrow"><span>No Active Offers</span></div>
        <h2>NOTHING <em>RUNNING RIGHT NOW</em></h2>
        <p>We don't have a special promotion running at the moment, but you can still talk to us about your project.</p>
        <a href="https://wa.me/27636377014?text=Hi%20BIB%2C%20I'd%20like%20to%20discuss%20a%20project." class="btn btn-primary" target="_blank">
          <i class="fab fa-whatsapp"></i> Talk To BIB
        </a>
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

        <h3>${promotion.title}</h3>
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
          <i class="fab fa-whatsapp"></i> Claim This Offer
        </a>
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
          <i class="fab fa-whatsapp"></i> Claim This Offer
        </a>
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
      name: "Moorosi",
      type: "review",
      project: "Kitchen Project",
      location: "",
      rating: 5,
      text: "BIB understood what I wanted and brought the idea together properly.",
      source: "Direct",
      date: "2026-09-17",
      featured: true
    },

    {
      name: "Example Client",
      type: "review",
      project: "Wardrobe Project",
      location: "",
      rating: 5,
      text: "The work was neat and the final result came together just as planned.",
      source: "Direct",
      date: "2026-09-17",
      featured: true
    }

    /* -------------------------------------------------------
       ADD MORE REVIEWS / TESTIMONIALS BELOW
    ------------------------------------------------------- */

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
          <div class="stars" style="color:#D4AF37">
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


  /* =========================================================
     HOMEPAGE REVIEWS
  ========================================================= */

  const homeReviewsList =
    document.getElementById("homeReviewsList");

  if (homeReviewsList) {

    let homeReviews = [];


    /* -----------------------------------------------
       LAUNCH MODE
       Show featured testimonials/reviews.
    ----------------------------------------------- */

    if (window.BIB_HOME_REVIEWS_MODE === "testimonials") {

      homeReviews =
        window.BIB_REVIEWS.filter(function (review) {
          return review.featured === true;
        });

    }


    /* -----------------------------------------------
       FUTURE GOOGLE MODE

       We will connect Google review data here later.
       For now, do not use this mode.
    ----------------------------------------------- */

    if (window.BIB_HOME_REVIEWS_MODE === "google") {

      homeReviews =
        window.BIB_REVIEWS.filter(function (review) {
          return review.source === "Google" &&
                 review.featured === true;
        });

    }


    /* Render homepage feedback */

homeReviewsList.innerHTML = `
  <div class="review-carousel">
    <div class="review-carousel-track">
      ${homeReviews.map(function (review, index) {
        return `
          <div class="review-slide ${index === 0 ? "active" : ""}">
            ${buildReviewCard(review)}
          </div>
        `;
      }).join("")}
    </div>
  </div>
`;


/* ---------------------------------------------------------
   SIMPLE AUTO-ROTATION
--------------------------------------------------------- */

const reviewSlides =
  homeReviewsList.querySelectorAll(".review-slide");

if (reviewSlides.length > 1) {

  let currentReview = 0;

  setInterval(function () {

    reviewSlides[currentReview]
      .classList.remove("active");

    currentReview =
      (currentReview + 1) % reviewSlides.length;

    reviewSlides[currentReview]
      .classList.add("active");

  }, 5000);

}

  }

})();


/*These marls are used to make notes, 
and everything written within the marks 
will not be read as part of the code 
so to omit something, use these marks 
or even // tetx... */


