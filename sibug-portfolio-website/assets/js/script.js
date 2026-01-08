'use strict';

// Utility: toggle element active class
const elementToggleFunc = function (elem) { if (elem) elem.classList.toggle('active'); };

// ---------- Mobile Menu Toggle ----------
const menuToggle = document.querySelector('[data-menu-toggle]');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (menuToggle) {
  menuToggle.addEventListener('click', function () {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  // Close menu when clicking on a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 767) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 767) {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    }
  });

  // Close menu on window resize if it becomes desktop size
  window.addEventListener('resize', function () {
    if (window.innerWidth > 767) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
}

// ---------- Sidebar (mobile) ----------
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
if (sidebarBtn) sidebarBtn.addEventListener('click', function () { elementToggleFunc(sidebar); });

// ---------- Portfolio filter / custom select ----------
const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-selecct-value]'); // note: HTML has this spelling
const filterBtn = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');

if (select) select.addEventListener('click', function () { elementToggleFunc(this); });

if (selectItems && selectItems.length) {
  for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener('click', function () {
      const selectedValue = this.innerText.trim().toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText.trim();
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  }
}

const filterFunc = function (selectedValue) {
  if (!filterItems) return;
  for (let i = 0; i < filterItems.length; i++) {
    const category = (filterItems[i].dataset.category || '').toLowerCase();
    if (selectedValue === 'all' || selectedValue === category) {
      filterItems[i].classList.add('active');
    } else {
      filterItems[i].classList.remove('active');
    }
  }
};

let lastClickedBtn = (filterBtn && filterBtn.length) ? filterBtn[0] : null;
if (filterBtn && filterBtn.length) {
  for (let i = 0; i < filterBtn.length; i++) {
    filterBtn[i].addEventListener('click', function () {
      const selectedValue = this.innerText.trim().toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText.trim();
      filterFunc(selectedValue);

      if (lastClickedBtn) lastClickedBtn.classList.remove('active');
      this.classList.add('active');
      lastClickedBtn = this;
    });
  }
}

// Initialize filters to "all" on load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    filterFunc('all');
  });
}

// ---------- Contact form ----------
const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

if (formInputs && formInputs.length) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener('input', function () {
      if (form && form.checkValidity()) {
        if (formBtn) formBtn.removeAttribute('disabled');
      } else {
        if (formBtn) formBtn.setAttribute('disabled', '');
      }
    });
  }
}

// Optional: prevent actual submit for demo (remove if you handle sending)
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // For now, just clear the form and disable the button
    if (formBtn) formBtn.setAttribute('disabled', '');
    form.reset();
    return false;
  });
}

// ---------- Page navigation (About / Resume / Portfolio / Blog / Contact) ----------
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

// Defensive: ensure navbar is interactive (in case CSS overlays interfere)
const navbarEl = document.querySelector('.navbar');
if (navbarEl) {
  navbarEl.style.pointerEvents = 'auto';
  navbarEl.style.zIndex = '9999';
}

// We use a delegated click handler below to manage navigation clicks.
// Individual per-link listeners were removed to avoid duplicated handlers
// and pointer-event conflicts when overlays are present.

// Map navbar link text to page names
const pageMap = {
  'home': 'home',
  'about': 'about',
  'projects': 'portfolio',
  'certificates': 'blog',
  'contact': 'contact'
};

// Delegated handler: also listen on document to catch clicks if individual listeners fail
document.addEventListener('click', function (e) {
  const btn = e.target.closest && e.target.closest('[data-nav-link]');
  if (!btn) return;
  
  // Prevent default link behavior
  e.preventDefault();
  
  // Get target from href hash or text content
  let target = '';
  const href = btn.getAttribute('href');
  if (href && href.startsWith('#')) {
    target = href.substring(1).toLowerCase();
  } else {
    target = btn.textContent.trim().toLowerCase();
  }
  
  // Map the target to the correct page name
  const pageName = pageMap[target] || target;

  // Find the target article/section
  const targetArticle = document.querySelector(`[data-page="${pageName}"]`);
  const targetSection = document.querySelector(`#${target}`);

  // Show the matching page
  if (pages && pages.length) {
    for (let j = 0; j < pages.length; j++) {
      if ((pages[j].dataset.page || '').toLowerCase() === pageName) {
        pages[j].classList.add('active');
      } else {
        pages[j].classList.remove('active');
      }
    }
  }

  // Update nav active state
  if (navigationLinks && navigationLinks.length) {
    for (let k = 0; k < navigationLinks.length; k++) {
      if (navigationLinks[k] === btn) {
        navigationLinks[k].classList.add('active');
      } else {
        navigationLinks[k].classList.remove('active');
      }
    }
  }

  // Scroll to the target section smoothly
  setTimeout(() => {
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 64;
    let scrollTarget = null;
    
    // Special handling for about vs home
    if (target === 'about') {
      // For "About", scroll to experiences section or the about article
      const experiencesSection = document.querySelector('#experiences');
      scrollTarget = experiencesSection || targetArticle;
    } else if (target === 'home') {
      // For "Home", scroll to the home hero section
      scrollTarget = document.querySelector('#home-hero') || document.querySelector('#home') || targetArticle;
    } else if (targetSection) {
      // For other targets, use the section if it exists
      scrollTarget = targetSection;
    } else if (targetArticle) {
      // Fallback to the article
      scrollTarget = targetArticle;
    }
    
    if (scrollTarget) {
      const targetPosition = scrollTarget.offsetTop - navbarHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }, 100);

  // Update URL hash
  if (history.pushState) {
    history.pushState(null, null, '#' + target);
  }
});

// Handle initial page load with hash
function handleInitialPageLoad() {
  const hash = window.location.hash.substring(1).toLowerCase();
  if (hash) {
    const pageName = pageMap[hash] || hash;
    const targetPage = document.querySelector(`[data-page="${pageName}"]`);
    if (targetPage) {
      // Show the matching page
      if (pages && pages.length) {
        for (let j = 0; j < pages.length; j++) {
          if ((pages[j].dataset.page || '').toLowerCase() === pageName) {
            pages[j].classList.add('active');
          } else {
            pages[j].classList.remove('active');
          }
        }
      }

      // Update nav active state
      const targetLink = document.querySelector(`[data-nav-link][href="#${hash}"]`);
      if (targetLink && navigationLinks && navigationLinks.length) {
        for (let k = 0; k < navigationLinks.length; k++) {
          if (navigationLinks[k] === targetLink) {
            navigationLinks[k].classList.add('active');
          } else {
            navigationLinks[k].classList.remove('active');
          }
        }
      }
    }
  }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
  handleInitialPageLoad();
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  handleInitialPageLoad();
  initScrollSpy();
});

// Scroll spy functionality to highlight active navbar item based on scroll position
function initScrollSpy() {
  const sections = [
    { id: 'home', navLink: 'home' },
    { id: 'experiences', navLink: 'about' },
    { id: 'projects', navLink: 'projects' },
    { id: 'certificates', navLink: 'certificates' },
    { id: 'contact', navLink: 'contact' }
  ];

  const navLinks = document.querySelectorAll('[data-nav-link]');
  const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 64;

  function updateActiveNavLink() {
    let currentSection = '';
    const scrollPosition = window.scrollY + navbarHeight + 100; // Offset for better detection

    // Check each section to see if it's in view
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.querySelector(`#${sections[i].id}`);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = sections[i].navLink;
          break;
        }
      }
    }

    // If no section found, check if we're at the top (home section)
    if (!currentSection && window.scrollY < 200) {
      currentSection = 'home';
    }

    // Update active state on nav links
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const linkTarget = href.substring(1).toLowerCase();
        if (linkTarget === currentSection) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  // Throttle scroll events for better performance
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateActiveNavLink();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial check
  updateActiveNavLink();
}

  // Make the hero "GitHub Profile" button open the user's GitHub profile.
  // Derives the profile owner from the existing `.github-repo-btn` href when possible.
  document.addEventListener('DOMContentLoaded', function () {
    const heroBtn = document.querySelector('.hero-cta .btn-primary');
    if (!heroBtn) return;

    heroBtn.addEventListener('click', function (e) {
      // If the element is a link with a real href, allow default navigation.
      const isLink = heroBtn.tagName.toLowerCase() === 'a';
      const href = heroBtn.getAttribute && heroBtn.getAttribute('href');
      if (isLink && href && href !== '#') return;

      e.preventDefault();

      let profileUrl = 'https://github.com/';
      const repoAnchor = document.querySelector('.github-repo-btn');
      if (repoAnchor && repoAnchor.href) {
        try {
          const u = new URL(repoAnchor.href);
          const parts = u.pathname.split('/').filter(Boolean);
          if (parts.length >= 1) profileUrl = `${u.origin}/${parts[0]}`;
        } catch (err) {
          /* ignore and fallback */
        }
      }

      window.open(profileUrl, '_blank', 'noopener');
    });
  });

// ---------- Preloader ----------
document.addEventListener('DOMContentLoaded', function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  document.body.classList.add('preloading');

  const hidePreloader = () => {
    preloader.classList.add('hide');
    preloader.setAttribute('aria-hidden', 'true');
    setTimeout(() => document.body.classList.remove('preloading'), 200);
  };

  // Ensure the preloader stays ~4s, but also waits for load when possible
  const MIN_DURATION = 4000;
  const startTime = performance.now();

  const maybeHide = () => {
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, MIN_DURATION - elapsed);
    setTimeout(hidePreloader, remaining);
  };

  window.addEventListener('load', maybeHide);

  // Absolute fallback: hide after 4.5s in case load never fires
  setTimeout(hidePreloader, 4500);
});

// ---------- Contact form mailto send ----------
document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.querySelector('[data-form]');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = contactForm.querySelector('input[name="fullname"]')?.value || 'Visitor';
    const email = contactForm.querySelector('input[name="email"]')?.value || '';
    const message = contactForm.querySelector('textarea[name="message"]')?.value || '';

    const subject = `Portfolio Contact from ${name}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
    const mailtoLink = `mailto:lancesibug757@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    window.location.href = mailtoLink;
    contactForm.reset();
  });
});

// ---------- Project modal (lightbox) ----------
document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const modalImg = modal.querySelector('#project-modal-img');
  const modalTitle = modal.querySelector('#project-modal-title');
  const modalCategory = modal.querySelector('#project-modal-category');
  const closeButtons = modal.querySelectorAll('[data-project-modal-close]');

  const openModal = (src, title, category, altText) => {
    if (modalImg) {
      modalImg.src = src;
      modalImg.alt = altText || title || 'Project preview';
    }
    if (modalTitle) modalTitle.textContent = title || '';
    if (modalCategory) modalCategory.textContent = category || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  };

  closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  const previewLinks = document.querySelectorAll('.project-item a, .blog-post-item a');
  previewLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const img = link.querySelector('img');
      const titleEl = link.querySelector('.project-title');
      const blogTitleEl = link.querySelector('.blog-item-title');
      const categoryEl = link.querySelector('.project-category, .blog-category, .blog-meta .blog-category');
      const src = img ? img.src : '';
      const title = (titleEl || blogTitleEl) ? (titleEl || blogTitleEl).textContent.trim() : '';
      const category = categoryEl ? categoryEl.textContent.trim() : '';
      const altText = img ? img.alt : '';
      if (src) {
        openModal(src, title, category, altText);
      }
    });
    });
  });
