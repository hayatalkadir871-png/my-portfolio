// Portfolio site interactivity
const body = document.body;

// Mobile navigation
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Navbar scroll effect and active link highlighting
const header = document.getElementById('site-header');
const sections = Array.from(document.querySelectorAll('main section[id]'));

function handleHeaderScroll() {
  if (!header) return;
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', () => {
  handleHeaderScroll();
  highlightActiveLink();
  backToTopButton.classList.toggle('visible', window.scrollY > 420);
});

function highlightActiveLink() {
  const scrollPosition = window.scrollY + 120;
  let activeId = 'home';

  sections.forEach(section => {
    if (section.offsetTop <= scrollPosition) {
      activeId = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    const linkSection = link.getAttribute('href');
    if (linkSection && linkSection === `#${activeId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// IntersectionObserver for reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal').forEach(element => {
  observer.observe(element);
});

// Header initial position
handleHeaderScroll();

// Typing hero subtitle
const heroSubtitle = document.querySelector('.typing-text');
if (heroSubtitle) {
  const subtitleText = heroSubtitle.textContent.trim();
  heroSubtitle.textContent = '';

  let i = 0;
  function typeText() {
    heroSubtitle.textContent = subtitleText.slice(0, i);
    i += 1;
    if (i <= subtitleText.length) {
      setTimeout(typeText, 30);
    } else {
      setTimeout(() => {
        heroSubtitle.textContent = subtitleText;
      }, 900);
    }
  }
  typeText();
}

// Animated counters
const counters = document.querySelectorAll('[data-counter]');

function animateCounters() {
  counters.forEach(counter => {
    const target = Number(counter.getAttribute('data-counter'));
    const duration = 1200;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = target * progress;
      counter.textContent = target % 1 === 0 ? Math.round(value) : value.toFixed(2);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target % 1 === 0 ? target : target.toFixed(2);
      }
    }

    requestAnimationFrame(update);
  });
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.45 });

if (counters.length > 0) {
  counterObserver.observe(document.querySelector('.hero-stats'));
}

// Skills animation when visible
const skillBars = document.querySelectorAll('.skill-level span');
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.getAttribute('style').replace(/width:\s?/, '');
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => {
  const originalWidth = bar.getAttribute('style').match(/width:\s?([0-9%.]+)/)?.[1] || '0%';
  bar.setAttribute('data-width', originalWidth);
  bar.style.width = '0%';
  skillObserver.observe(bar);
});

// Need to trigger skill bars visible animation after skill panel enters viewport
// CSS set on initial widths; JS below applies once the panel is visible by updating style width attribute
const skillPanelObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bars = entry.target.querySelectorAll('[class="skill-level"] span');
      bars.forEach(bar => {
        const width = bar.getAttribute('data-width') || '0%';
        bar.style.width = width;
      });
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-panel').forEach(panel => {
  skillPanelObserver.observe(panel);
});

// Project filtering
const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('[data-category]');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');

    filterButtons.forEach(item => item.classList.toggle('active', item === button));

    projectCards.forEach(card => {
      const cardCategories = card.getAttribute('data-category').split(' ');
      const visible = filter === 'all' || cardCategories.includes(filter);
      card.classList.toggle('is-hidden', !visible);
    });
  });
});

// Contact form validation and demo success message
const contactForm = document.querySelector('.contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm && formMessage) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !email || !message) {
      formMessage.className = 'form-message error';
      formMessage.textContent = 'Please complete all fields before sending your message.';
      return;
    }

    if (!emailIsValid) {
      formMessage.className = 'form-message error';
      formMessage.textContent = 'Please enter a valid email address.';
      return;
    }

    formMessage.className = 'form-message success';
    formMessage.textContent = 'Thank you. Your message has been received as a frontend demo and can be connected to a backend or email service later.';
    contactForm.reset();
  });
}

// Back-to-top button
const backToTopButton = document.querySelector('.back-to-top');

if (backToTopButton) {
  backToTopButton.addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    const icon = themeToggle.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = body.classList.contains('dark-mode') ? '🌙' : '☀️';
    }
  });
}

// Smooth scrolling for same-page links (using CSS scroll-behavior and anchor fallback)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();

    if (history.pushState) {
      history.pushState(null, '', targetId);
    } else {
      location.hash = targetId;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
