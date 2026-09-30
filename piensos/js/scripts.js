/* ============================================
   PIENSOS JAVI - Complete JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Preloader ----- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('hidden');
    });
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 1500);
  }

  /* ----- Header scroll effect ----- */
  const header = document.getElementById('header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ----- Mobile menu ----- */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');

  function toggleMenu() {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    const isOpen = nav.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    nav.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (nav.classList.contains('active') &&
        !nav.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  /* ----- Active nav link on scroll ----- */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollPos = window.pageYOffset + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav__link[href="#${id}"]`);

      if (link && scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ----- Scroll reveal (Intersection Observer) ----- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ----- Lightbox Gallery ----- */
  const galleryItems = document.querySelectorAll('.gallery__item img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const img = galleryItems[index];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    updateCounter();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function goToPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    const img = galleryItems[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    updateCounter();
  }

  function goToNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    const img = galleryItems[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    updateCounter();
  }

  function updateCounter() {
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
    }
  }

  galleryItems.forEach((img, index) => {
    img.parentElement.addEventListener('click', () => openLightbox(index));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', goToPrev);
  lightboxNext.addEventListener('click', goToNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrev();
    if (e.key === 'ArrowRight') goToNext();
  });

  /* ----- Contact form validation ----- */
  const contactForm = document.getElementById('contact-form');
  const successMsg = document.getElementById('contact-success');

  if (contactForm) {
    const formName = document.getElementById('form-name');
    const formEmail = document.getElementById('form-email');
    const formMessage = document.getElementById('form-message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const privacyError = document.getElementById('privacy-error');
    const privacyCheckbox = contactForm.querySelector('input[name="privacy"]');

    function showError(input, errorEl, message) {
      input.classList.add('error');
      errorEl.textContent = message;
    }

    function clearError(input, errorEl) {
      input.classList.remove('error');
      errorEl.textContent = '';
    }

    function validateName() {
      const value = formName.value.trim();
      if (!value) {
        showError(formName, nameError, 'El nombre es obligatorio.');
        return false;
      }
      if (value.length < 2) {
        showError(formName, nameError, 'El nombre debe tener al menos 2 caracteres.');
        return false;
      }
      clearError(formName, nameError);
      return true;
    }

    function validateEmail() {
      const value = formEmail.value.trim();
      if (!value) {
        showError(formEmail, emailError, 'El correo electrónico es obligatorio.');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showError(formEmail, emailError, 'Introduce un correo electrónico válido.');
        return false;
      }
      clearError(formEmail, emailError);
      return true;
    }

    function validateMessage() {
      const value = formMessage.value.trim();
      if (!value) {
        showError(formMessage, messageError, 'El mensaje no puede estar vacío.');
        return false;
      }
      if (value.length < 10) {
        showError(formMessage, messageError, 'El mensaje debe tener al menos 10 caracteres.');
        return false;
      }
      clearError(formMessage, messageError);
      return true;
    }

    function validatePrivacy() {
      if (!privacyCheckbox.checked) {
        privacyError.textContent = 'Debes aceptar la política de privacidad.';
        return false;
      }
      privacyError.textContent = '';
      return true;
    }

    formName.addEventListener('blur', validateName);
    formName.addEventListener('input', () => {
      if (formName.classList.contains('error')) validateName();
    });

    formEmail.addEventListener('blur', validateEmail);
    formEmail.addEventListener('input', () => {
      if (formEmail.classList.contains('error')) validateEmail();
    });

    formMessage.addEventListener('blur', validateMessage);
    formMessage.addEventListener('input', () => {
      if (formMessage.classList.contains('error')) validateMessage();
    });

    privacyCheckbox.addEventListener('change', () => {
      if (privacyError.textContent) validatePrivacy();
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();
      const isPrivacyValid = validatePrivacy();

      if (isNameValid && isEmailValid && isMessageValid && isPrivacyValid) {
        contactForm.style.display = 'none';
        successMsg.classList.add('active');
      }
    });
  }

  /* ----- Smooth scroll for anchor links (fallback) ----- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ----- Hero carousel autoplay ----- */
  (function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-carousel__slide');
    if (slides.length < 2) return;
    let current = 0;

    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 5000);
  })();

});
