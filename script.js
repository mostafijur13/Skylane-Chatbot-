// Footer year
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in-view'));
}

// Generic carousel controller (works for the countries + testimonials carousels)
function initCarousel(trackId, dotsSelector) {
  const track = document.getElementById(trackId);
  if (!track) return;

  const shell = track.closest('.carousel-shell');
  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  const prevBtn = shell?.querySelector('.carousel-btn.prev');
  const nextBtn = shell?.querySelector('.carousel-btn.next');
  const dotsContainer = document.querySelector(dotsSelector);

  if (slides.length === 0) return;

  let index = 0;

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === index) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    if (dotsContainer) {
      Array.from(dotsContainer.children).forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
  }

  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));

  renderDots();
  update();
}

initCarousel('countriesTrack', '[data-carousel-dots="countries"]');
initCarousel('testimonialsTrack', '[data-carousel-dots="testimonials"]');