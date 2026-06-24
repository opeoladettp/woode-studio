/**
 * WOODE Studio - JS Interactive Interactions
 * Author: Antigravity / DeepMind
 * Description: Premium animations, parallax controls, dark mode, and UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- UI Elements ---
  const header = document.getElementById('site-header');
  const themeToggle = document.getElementById('theme-toggle');
  const menuBtn = document.getElementById('menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const consultationForm = document.getElementById('consultation-form');
  const formFeedback = document.getElementById('form-feedback');
  const customCursor = document.getElementById('custom-cursor');

  // --- Custom Cursor Logic (Only on devices with pointer) ---
  if (window.matchMedia('(pointer: fine)').matches && customCursor) {
    customCursor.style.display = 'block';
    
    document.addEventListener('mousemove', (e) => {
      customCursor.style.left = `${e.clientX}px`;
      customCursor.style.top = `${e.clientY}px`;
    });

    // Cursor scale up on link and button hover
    const hoverTargets = document.querySelectorAll('a, button, input, textarea, select, .floating-badge, .collection-item-small');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        customCursor.classList.add('hovered');
      });
      target.addEventListener('mouseleave', () => {
        customCursor.classList.remove('hovered');
      });
    });
  } else if (customCursor) {
    customCursor.style.display = 'none';
  }

  // --- Header Styling on Scroll ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Dark / Light Theme Toggle ---
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    const iconSpan = themeToggle.querySelector('.material-symbols-rounded');
    if (theme === 'dark') {
      iconSpan.textContent = 'light_mode';
    } else {
      iconSpan.textContent = 'dark_mode';
    }
  }

  // --- Responsive Drawer Menu ---
  menuBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    const iconSpan = menuBtn.querySelector('.material-symbols-rounded');
    iconSpan.textContent = isOpen ? 'close' : 'menu';
  });

  // Close menu when clicking link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', false);
      menuBtn.querySelector('.material-symbols-rounded').textContent = 'menu';
    });
  });

  // --- Active Navigation Link Tracking on Scroll ---
  const sections = document.querySelectorAll('section');
  const scrollOffset = 150; // offset to trigger active class slightly earlier

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - scrollOffset;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // --- Smooth Parallax Scroll Effect ---
  window.addEventListener('scroll', () => {
    // Only run parallax on desktop viewports to save memory/battery
    if (window.innerWidth > 992) {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('[data-speed]');
      
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed')) || 0;
        const yPos = scrolled * speed;
        // Translate3d uses GPU acceleration for performance
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    }
  });

  // --- Reveal Elements on Scroll (Intersection Observer) ---
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // trigger animation only once
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px'
  });

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- Consultation Form Submit Handler ---
  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = consultationForm.querySelector('.submit-btn');
      const originalBtnText = submitBtn.textContent;
      
      // Visual feedback loading state
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      
      // Simulate client consultation receipt API call
      setTimeout(() => {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="material-symbols-rounded">check_circle</span>
            <span>Inquiry received. Charity will contact you within 24 hours.</span>
          </div>
        `;
        
        // Reset form
        consultationForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 6000);
      }, 1500);
    });
  }


  // --- Rotating Badge Interactive Click ---
  const rotatingBadge = document.getElementById('rotating-badge');
  if (rotatingBadge) {
    rotatingBadge.addEventListener('click', () => {
      // Smooth scroll to the contact form on badge click
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
