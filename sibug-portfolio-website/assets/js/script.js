'use strict';

// Utility: toggle element active class
const elementToggleFunc = function (elem) { if (elem) elem.classList.toggle('active'); };

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
  'home': 'about',      // Home shows the about page (which has hero section)
  'about': 'about',
  'projects': 'portfolio',
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
    
    if (targetSection) {
      scrollTarget = targetSection;
    } else if (targetArticle) {
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
});

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
