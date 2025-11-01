console.log("✅ main.js is connected!");

// Floating particles
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
    particlesContainer.appendChild(particle);
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('mobile-active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('mobile-active');
    });
});

// Smooth scroll for scroll indicator
document.querySelector('.scroll-indicator').addEventListener('click', () => {
    window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    });
});

// Gallery Lightbox with Navigation + Mobile Swipe
(function() {
    console.log("🎨 Gallery script initializing...");

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightbox = document.getElementById('closeLightbox');
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');
    const counter = document.getElementById('imageCounter');
    const galleryItems = document.querySelectorAll('.gallery-item-new img');

    let currentIndex = 0;
    const totalImages = galleryItems.length;

    if (!lightbox || !lightboxImg || !closeLightbox) {
        console.error("❌ Lightbox elements missing!");
        return;
    }

    console.log(`✅ Found ${totalImages} gallery images`);

    function openLightbox(index) {
        currentIndex = index;
        const imgSrc = galleryItems[index].src;
        const imgAlt = galleryItems[index].alt;
        
        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgAlt;
        lightbox.classList.add('show');
        updateCounter();
        document.body.style.overflow = 'hidden';
        
        console.log(`🖼️ Opened image ${index + 1}/${totalImages}`);
    }

    function closeLightboxFn() {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
        console.log("❌ Lightbox closed");
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % totalImages;
        openLightbox(currentIndex);
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        openLightbox(currentIndex);
    }

    function updateCounter() {
        counter.textContent = `${currentIndex + 1} / ${totalImages}`;
    }

    galleryItems.forEach((img, index) => {
        img.parentElement.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    closeLightbox.addEventListener('click', closeLightboxFn);

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightboxFn();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        
        if (e.key === 'Escape') closeLightboxFn();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    //Add Mobile Swipe Support
    let startX = 0;
    let endX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    lightbox.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    });

    lightbox.addEventListener('touchend', () => {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) { // minimum swipe distance
            if (diff > 0) {
                showNext(); // swipe left
            } else {
                showPrev(); // swipe right
            }
        }
        startX = 0;
        endX = 0;
    });

    console.log("✅ Gallery lightbox ready with mobile swipe!");
})();

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
