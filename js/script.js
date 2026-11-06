/**
 * Eye Hospital — Premium Healthcare Website
 * Vanilla JavaScript Implementation
 * 
 * Features:
 * 1. Mobile Menu Drawer & Keyboard Accessibility
 * 2. Sticky Header with Scroll Shadow
 * 3. Active Nav Link on Scroll (IntersectionObserver)
 * 4. Smooth Anchor Navigation with Offset
 * 5. Animated Number Counters (Statistics)
 * 6. Testimonials Carousel with Touch Swiping & Autoplay
 * 7. Video Modal ("Watch Our Story")
 * 8. Appointment Form Validation & Submission State
 * 9. Scroll Reveal Animations
 * 10. Back to Top Button
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Sticky Header & Active Navigation
  // -------------------------------------------------------------------------
  const navbar = document.getElementById('main-navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  const handleScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header sticky shadow
    if (navbar) {
      if (scrollY > 20) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Back to top action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Active navigation links based on visible section
  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      }
    );

    sections.forEach((sec) => navObserver.observe(sec));
  }

  // -------------------------------------------------------------------------
  // 2. Mobile Navigation Drawer
  // -------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileCloseBtn = document.getElementById('mobile-menu-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    if (!mobileDrawer || !mobileBackdrop) return;
    mobileDrawer.classList.remove('translate-x-full');
    mobileBackdrop.classList.remove('hidden');
    setTimeout(() => mobileBackdrop.classList.remove('opacity-0'), 10);
    document.body.style.overflow = 'hidden';
    mobileCloseBtn?.focus();
  };

  const closeMobileMenu = () => {
    if (!mobileDrawer || !mobileBackdrop) return;
    mobileDrawer.classList.add('translate-x-full');
    mobileBackdrop.classList.add('opacity-0');
    setTimeout(() => {
      mobileBackdrop.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
    mobileToggleBtn?.focus();
  };

  mobileToggleBtn?.addEventListener('click', openMobileMenu);
  mobileCloseBtn?.addEventListener('click', closeMobileMenu);
  mobileBackdrop?.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // -------------------------------------------------------------------------
  // 3. Smooth Scrolling with Offset for Sticky Header
  // -------------------------------------------------------------------------
  const internalAnchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  internalAnchors.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const headerOffset = navbar ? navbar.offsetHeight + 10 : 80;
        const elemPos = targetElem.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elemPos - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // -------------------------------------------------------------------------
  // 4. Statistics Number Counter Animation
  // -------------------------------------------------------------------------
  const statsElements = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const animateCounters = () => {
    if (statsCounted) return;
    statsElements.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-target') || '0', 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        stat.textContent = `${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = `${target}${suffix}`;
        }
      };

      requestAnimationFrame(updateCount);
    });
    statsCounted = true;
  };

  const aboutSection = document.getElementById('about');
  if (aboutSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(aboutSection);
  } else {
    animateCounters();
  }

  // -------------------------------------------------------------------------
  // 5. Testimonial Carousel
  // -------------------------------------------------------------------------
  const carouselTrack = document.getElementById('testimonial-track');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  const totalSlides = 3;
  let autoplayTimer = null;

  const updateCarousel = (slideIndex) => {
    if (!carouselTrack) return;
    currentSlide = (slideIndex + totalSlides) % totalSlides;
    
    // For desktop (3 cards visible side by side) vs tablet (1 or 2) vs mobile (1)
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    if (isMobile) {
      carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    } else if (isTablet) {
      carouselTrack.style.transform = `translateX(-${currentSlide * 50}%)`;
    } else {
      // On wide desktop all 3 are visible at once, but we can do a gentle highlight/shift or keep at 0
      carouselTrack.style.transform = `translateX(-${currentSlide * 0}%)`;
    }

    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');
      }
    });
  };

  const nextSlide = () => updateCarousel(currentSlide + 1);
  const prevSlide = () => updateCarousel(currentSlide - 1);

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-index') || '0', 10);
      updateCarousel(targetIndex);
    });
  });

  // Touch Swipe for Mobile Carousel
  if (carouselTrack) {
    let startX = 0;
    let endX = 0;

    carouselTrack.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
      pauseAutoplay();
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    }, { passive: true });

    const handleSwipe = () => {
      const threshold = 40;
      if (startX - endX > threshold) {
        nextSlide();
      } else if (endX - startX > threshold) {
        prevSlide();
      }
    };

    // Autoplay feature
    const startAutoplay = () => {
      if (window.innerWidth < 1024) {
        autoplayTimer = setInterval(nextSlide, 5000);
      }
    };

    const pauseAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    carouselTrack.parentElement?.addEventListener('mouseenter', pauseAutoplay);
    carouselTrack.parentElement?.addEventListener('mouseleave', startAutoplay);

    window.addEventListener('resize', () => updateCarousel(currentSlide));
    startAutoplay();
  }

  // -------------------------------------------------------------------------
  // 6. Video Modal ("Watch Our Story")
  // -------------------------------------------------------------------------
  const playStoryBtn = document.getElementById('play-story-btn');
  const videoModal = document.getElementById('video-modal');
  const closeVideoBtn = document.getElementById('close-video-modal');
  const videoIframe = document.getElementById('story-video-iframe');
  const defaultVideoSrc = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1'; // configurable placeholder

  const openVideoModal = () => {
    if (!videoModal) return;
    videoModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    if (videoIframe && !videoIframe.src) {
      videoIframe.src = defaultVideoSrc;
    }
    closeVideoBtn?.focus();
  };

  const closeVideoModal = () => {
    if (!videoModal) return;
    videoModal.classList.remove('is-active');
    document.body.style.overflow = '';
    if (videoIframe) {
      videoIframe.src = '';
    }
    playStoryBtn?.focus();
  };

  playStoryBtn?.addEventListener('click', openVideoModal);
  closeVideoBtn?.addEventListener('click', closeVideoModal);

  videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      closeVideoModal();
    }
  });

  // Global ESC key to close any active modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (videoModal && videoModal.classList.contains('is-active')) {
        closeVideoModal();
      }
      if (mobileDrawer && !mobileDrawer.classList.contains('translate-x-full')) {
        closeMobileMenu();
      }
      closeSuccessModal();
    }
  });

  // -------------------------------------------------------------------------
  // 7. Appointment Booking Form Validation & Submission
  // -------------------------------------------------------------------------
  const appointmentForm = document.getElementById('appointment-form');
  const appointmentDateInput = document.getElementById('appointmentDate');
  const submitBtn = document.getElementById('appointment-submit-btn');
  const submitText = document.getElementById('submit-btn-text');
  const submitSpinner = document.getElementById('submit-btn-spinner');
  const successModal = document.getElementById('appointment-success-modal');
  const closeSuccessBtn = document.getElementById('close-success-modal');

  // Prevent past dates
  if (appointmentDateInput) {
    const today = new Date().toISOString().split('T')[0];
    appointmentDateInput.setAttribute('min', today);
  }

  // Field validation helpers
  const validateField = (input, validator, errorMsg) => {
    const errorElem = document.getElementById(`${input.id}-error`);
    const isValid = validator(input.value.trim());

    if (!isValid) {
      input.classList.add('is-invalid');
      if (errorElem) {
        errorElem.textContent = errorMsg;
        errorElem.classList.remove('hidden');
      }
      return false;
    } else {
      input.classList.remove('is-invalid');
      if (errorElem) {
        errorElem.classList.add('hidden');
      }
      return true;
    }
  };

  const validators = {
    name: (val) => val.length >= 2,
    phone: (val) => /^[+0-9\s\-()]{7,20}$/.test(val),
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    service: (val) => val !== '',
    date: (val) => {
      if (!val) return false;
      const selected = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    },
    time: (val) => val !== ''
  };

  // Attach live validation on blur
  const fields = [
    { id: 'fullName', validator: validators.name, msg: 'Please enter your full name (at least 2 letters).' },
    { id: 'phoneNumber', validator: validators.phone, msg: 'Please enter a valid contact phone number.' },
    { id: 'emailAddress', validator: validators.email, msg: 'Please provide a valid email address.' },
    { id: 'serviceSelect', validator: validators.service, msg: 'Please select an eye care service.' },
    { id: 'appointmentDate', validator: validators.date, msg: 'Please choose a future or today\'s date.' },
    { id: 'appointmentTime', validator: validators.time, msg: 'Please select a preferred appointment time.' }
  ];

  fields.forEach(({ id, validator, msg }) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur', () => validateField(el, validator, msg));
      el.addEventListener('input', () => {
        if (el.classList.contains('is-invalid')) {
          validateField(el, validator, msg);
        }
      });
    }
  });

  const closeSuccessModal = () => {
    if (!successModal) return;
    successModal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  closeSuccessBtn?.addEventListener('click', closeSuccessModal);
  successModal?.addEventListener('click', (e) => {
    if (e.target === successModal) closeSuccessModal();
  });

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;
      let firstInvalidInput = null;

      fields.forEach(({ id, validator, msg }) => {
        const input = document.getElementById(id);
        if (input) {
          const valid = validateField(input, validator, msg);
          if (!valid) {
            isFormValid = false;
            if (!firstInvalidInput) firstInvalidInput = input;
          }
        }
      });

      if (!isFormValid) {
        firstInvalidInput?.focus();
        return;
      }

      // Enter Loading State
      if (submitBtn && submitSpinner && submitText) {
        submitBtn.disabled = true;
        submitSpinner.classList.remove('hidden');
        submitText.textContent = 'Processing Booking...';
      }

      // Collect data
      const bookingData = {
        fullName: document.getElementById('fullName')?.value.trim(),
        phoneNumber: document.getElementById('phoneNumber')?.value.trim(),
        emailAddress: document.getElementById('emailAddress')?.value.trim(),
        serviceSelect: document.getElementById('serviceSelect')?.value,
        doctorSelect: document.getElementById('doctorSelect')?.value || 'Any Available Specialist',
        visitType: document.querySelector('input[name="visitType"]:checked')?.value || 'First Time Visit',
        appointmentDate: document.getElementById('appointmentDate')?.value,
        appointmentTime: document.getElementById('appointmentTime')?.value,
      };

      // Execute submission: Try backend API first, gracefully fall back to local demo
      const processBooking = async () => {
        let appointmentRef = null;

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);

          const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData),
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            if (data && data.appointmentId) {
              appointmentRef = data.appointmentId;
            }
          }
        } catch (err) {
          // If server is not running or static Live Server, use fallback smoothly
          console.info('Client-side demo mode active (backend server not connected).');
        }

        // Reset submit button state
        if (submitBtn && submitSpinner && submitText) {
          submitBtn.disabled = false;
          submitSpinner.classList.add('hidden');
          submitText.textContent = 'Submit Appointment';
        }

        // Fill modal confirmation details
        const confirmName = document.getElementById('confirm-name');
        const confirmService = document.getElementById('confirm-service');
        const confirmDateTime = document.getElementById('confirm-datetime');
        const confirmRefContainer = document.getElementById('confirm-ref-container');
        const confirmRefBadge = document.getElementById('confirm-ref-badge');

        if (confirmName) confirmName.textContent = bookingData.fullName;
        if (confirmService) confirmService.textContent = bookingData.serviceSelect;
        if (confirmDateTime) confirmDateTime.textContent = `${bookingData.appointmentDate} at ${bookingData.appointmentTime}`;

        if (appointmentRef && confirmRefContainer && confirmRefBadge) {
          confirmRefBadge.textContent = `Booking ID: ${appointmentRef}`;
          confirmRefContainer.classList.remove('hidden');
        } else if (confirmRefContainer) {
          confirmRefContainer.classList.add('hidden');
        }

        // Show success modal
        if (successModal) {
          successModal.classList.add('is-active');
          document.body.style.overflow = 'hidden';
        }

        // Reset form
        appointmentForm.reset();
      };

      // Run submission with slight delay for realistic UX
      setTimeout(processBooking, 800);
    });
  }

  // -------------------------------------------------------------------------
  // 8. Scroll Reveal Animations (IntersectionObserver)
  // -------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if observer not supported
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // -------------------------------------------------------------------------
  // 9. Interactive Biometric HUD Toggle (Hero Section)
  // -------------------------------------------------------------------------
  const hudToggleBtn = document.getElementById('hud-toggle-btn');
  const hudOuter = document.getElementById('hud-reticle-outer');
  const hudInner = document.getElementById('hud-reticle-inner');
  const hudStatusDot = document.getElementById('hud-status-dot');
  const hudToggleText = document.getElementById('hud-toggle-text');
  let isHudActive = true;

  if (hudToggleBtn && hudOuter && hudInner) {
    hudToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isHudActive = !isHudActive;
      if (isHudActive) {
        hudOuter.style.display = 'block';
        hudInner.style.display = 'block';
        hudStatusDot?.classList.add('animate-ping', 'bg-tealAccent');
        hudStatusDot?.classList.remove('bg-slate-400');
        if (hudToggleText) hudToggleText.textContent = 'Biometric HUD: Active';
      } else {
        hudOuter.style.display = 'none';
        hudInner.style.display = 'none';
        hudStatusDot?.classList.remove('animate-ping', 'bg-tealAccent');
        hudStatusDot?.classList.add('bg-slate-400');
        if (hudToggleText) hudToggleText.textContent = 'Biometric HUD: Paused';
      }
    });
  }

  // -------------------------------------------------------------------------
  // 10. Service Category Filtering
  // -------------------------------------------------------------------------
  const serviceFilterBtns = document.querySelectorAll('.service-filter-btn');
  const serviceCards = document.querySelectorAll('#services-grid .service-card');

  serviceFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      // Update button active states
      serviceFilterBtns.forEach((b) => {
        b.classList.remove('bg-tealAccent', 'text-white', 'shadow-sm', 'active');
        b.classList.add('bg-white', 'text-secondaryText');
      });
      btn.classList.add('bg-tealAccent', 'text-white', 'shadow-sm', 'active');
      btn.classList.remove('bg-white', 'text-secondaryText');

      // Filter cards
      serviceCards.forEach((card) => {
        const cardType = card.getAttribute('data-service-type');
        if (category === 'all' || cardType === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 11. Pre-fill Triggers for Services & Doctors
  // -------------------------------------------------------------------------
  const bookServiceBtns = document.querySelectorAll('.book-service-btn');
  const bookDoctorBtns = document.querySelectorAll('.book-doctor-btn');
  const serviceDropdown = document.getElementById('serviceSelect');
  const doctorDropdown = document.getElementById('doctorSelect');
  const appointmentSec = document.getElementById('appointment');

  const scrollToAppointment = () => {
    if (appointmentSec) {
      const headerOffset = navbar ? navbar.offsetHeight + 10 : 80;
      const targetPos = appointmentSec.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  };

  bookServiceBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      if (serviceDropdown && serviceName) {
        serviceDropdown.value = serviceName;
        serviceDropdown.classList.add('ring-2', 'ring-tealAccent');
        setTimeout(() => serviceDropdown.classList.remove('ring-2', 'ring-tealAccent'), 2000);
      }
      scrollToAppointment();
    });
  });

  bookDoctorBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const doctorName = btn.getAttribute('data-doctor');
      if (doctorDropdown && doctorName) {
        doctorDropdown.value = doctorName;
        doctorDropdown.classList.add('ring-2', 'ring-tealAccent');
        setTimeout(() => doctorDropdown.classList.remove('ring-2', 'ring-tealAccent'), 2000);
      }
      scrollToAppointment();
    });
  });

  // -------------------------------------------------------------------------
  // 12. FAQ Accordion Collapse / Expand
  // -------------------------------------------------------------------------
  const faqToggles = document.querySelectorAll('.faq-toggle');

  faqToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const content = toggle.nextElementSibling;
      const icon = toggle.querySelector('.faq-icon');

      // Close other open items
      faqToggles.forEach((otherToggle) => {
        if (otherToggle !== toggle) {
          otherToggle.setAttribute('aria-expanded', 'false');
          const otherContent = otherToggle.nextElementSibling;
          const otherIcon = otherToggle.querySelector('.faq-icon');
          if (otherContent) otherContent.classList.add('hidden');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
          otherToggle.parentElement?.classList.remove('border-tealAccent', 'bg-white', 'shadow-sm');
          otherToggle.parentElement?.classList.add('bg-[#FBFDFE]');
        }
      });

      // Toggle current
      if (isExpanded) {
        toggle.setAttribute('aria-expanded', 'false');
        content?.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
        toggle.parentElement?.classList.remove('border-tealAccent', 'bg-white', 'shadow-sm');
        toggle.parentElement?.classList.add('bg-[#FBFDFE]');
      } else {
        toggle.setAttribute('aria-expanded', 'true');
        content?.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
        toggle.parentElement?.classList.add('border-tealAccent', 'bg-white', 'shadow-sm');
        toggle.parentElement?.classList.remove('bg-[#FBFDFE]');
      }
    });
  });

  // -------------------------------------------------------------------------
  // 13. Toast Notification Utility
  // -------------------------------------------------------------------------
  const showToast = (message, type = 'info') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    const icon = type === 'success' ? '✓' : (type === 'warn' ? '⚠️' : 'ℹ️');
    toast.innerHTML = `
      <span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0">${icon}</span>
      <span class="leading-tight">${message}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 350);
    }, 3400);
  };

  // -------------------------------------------------------------------------
  // 14. Healthcare Accessibility & Eye-Comfort Controls
  // -------------------------------------------------------------------------
  const eyeComfortBtn = document.getElementById('toggle-eye-comfort');
  const contrastBtn = document.getElementById('toggle-contrast');
  const fontDecreaseBtn = document.getElementById('font-decrease');
  const fontResetBtn = document.getElementById('font-reset');
  const fontIncreaseBtn = document.getElementById('font-increase');
  const htmlEl = document.documentElement;

  // Restore saved accessibility preferences
  if (localStorage.getItem('eye_comfort_mode') === 'true') {
    htmlEl.classList.add('eye-comfort-mode');
    eyeComfortBtn?.classList.add('text-amber-300');
  }

  if (localStorage.getItem('eye_contrast_mode') === 'true') {
    htmlEl.classList.add('high-contrast-mode');
    contrastBtn?.classList.add('text-cyanAccent');
  }

  const savedFontSize = localStorage.getItem('eye_font_scale');
  if (savedFontSize) {
    htmlEl.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl');
    htmlEl.classList.add(savedFontSize);
  }

  // Eye Comfort Mode Toggle (Reduces harsh blue glare for patients with sensitive eyes)
  eyeComfortBtn?.addEventListener('click', () => {
    const isActive = htmlEl.classList.toggle('eye-comfort-mode');
    localStorage.setItem('eye_comfort_mode', isActive ? 'true' : 'false');
    eyeComfortBtn.classList.toggle('text-amber-300', isActive);
    showToast(
      isActive ? 'Eye-Comfort reading filter enabled (reduces eye strain)' : 'Eye-Comfort mode disabled',
      isActive ? 'success' : 'info'
    );
  });

  // High Contrast Mode Toggle
  contrastBtn?.addEventListener('click', () => {
    const isActive = htmlEl.classList.toggle('high-contrast-mode');
    localStorage.setItem('eye_contrast_mode', isActive ? 'true' : 'false');
    contrastBtn.classList.toggle('text-cyanAccent', isActive);
    showToast(
      isActive ? 'High contrast accessibility mode enabled' : 'Default contrast restored',
      'info'
    );
  });

  // Font Sizing Controls
  fontDecreaseBtn?.addEventListener('click', () => {
    htmlEl.classList.remove('font-size-md', 'font-size-lg', 'font-size-xl');
    htmlEl.classList.add('font-size-sm');
    localStorage.setItem('eye_font_scale', 'font-size-sm');
    showToast('Text size set to Compact', 'info');
  });

  fontResetBtn?.addEventListener('click', () => {
    htmlEl.classList.remove('font-size-sm', 'font-size-lg', 'font-size-xl');
    htmlEl.classList.add('font-size-md');
    localStorage.setItem('eye_font_scale', 'font-size-md');
    showToast('Default text size restored', 'info');
  });

  fontIncreaseBtn?.addEventListener('click', () => {
    const isLg = htmlEl.classList.contains('font-size-lg');
    htmlEl.classList.remove('font-size-sm', 'font-size-md');
    if (isLg) {
      htmlEl.classList.remove('font-size-lg');
      htmlEl.classList.add('font-size-xl');
      localStorage.setItem('eye_font_scale', 'font-size-xl');
      showToast('Text size set to Extra Large', 'success');
    } else {
      htmlEl.classList.add('font-size-lg');
      localStorage.setItem('eye_font_scale', 'font-size-lg');
      showToast('Text size enlarged for easy reading', 'success');
    }
  });

  // -------------------------------------------------------------------------
  // 15. Vision Symptom & Specialist Matcher (Clinical Triage)
  // -------------------------------------------------------------------------
  const symptomData = {
    cataract: {
      title: 'Cloudy, Foggy or Glare at Night',
      condition: 'Cataract or Lens Opacification',
      clinic: 'Robotic Cataract & Advanced IOL Clinic',
      doctor: 'Dr. Rajesh Sharma',
      doctorRole: 'Senior Cataract & LASIK Surgeon',
      doctorImg: 'assets/images/doctor-1.jpg',
      service: 'Cataract Surgery',
      advice: 'Micro-incision blade-free Phaco surgery with foldable multifocal/toric lens. 15-minute painless daycare procedure with same-day return home.'
    },
    lasik: {
      title: 'Desire Freedom from Glasses & Contact Lenses',
      condition: 'Refractive Error (Myopia, Hyperopia, Astigmatism)',
      clinic: 'Blade-Free Contoura Vision & SMILE Pro Suite',
      doctor: 'Dr. Sunita Rao',
      doctorRole: 'Cornea & Refractive Specialist',
      doctorImg: 'assets/images/doctor-2.jpg',
      service: 'LASIK Surgery',
      advice: 'Customized robotic laser specs removal with 0.5-micron eye-tracking accuracy. Quick 10-minute stitchless treatment with crystal-clear 24-hr recovery.'
    },
    dryeye: {
      title: 'Dry, Gritty, Burning or Screen Eye Fatigue',
      condition: 'Computer Vision Syndrome (CVS) / Dry Eye Disease',
      clinic: 'Dry Eye Spa & Meibomian Tear-Film Suite',
      doctor: 'Dr. Rajesh Sharma',
      doctorRole: 'Senior Ophthalmology Consultant',
      doctorImg: 'assets/images/doctor-1.jpg',
      service: 'Eye Checkup',
      advice: 'Comprehensive non-invasive infrared meibography, tear break-up time (TBUT) analysis, and thermal pulsation therapy for long-lasting comfort.'
    },
    retina: {
      title: 'Flashes of Light, Floating Dark Spots, or Shadows',
      condition: 'Vitreo-Retinal / Diabetic Retinopathy Urgent Care',
      clinic: 'Vitreo-Retinal Center & Green Laser Suite',
      doctor: 'Dr. Vikramaditya Reddy',
      doctorRole: 'Vitreo-Retinal Surgeon',
      doctorImg: 'assets/images/doctor-3.jpg',
      service: 'Retina Care',
      advice: 'Immediate high-definition OCT angiography and dilated peripheral fundus screening to preserve retina health and prevent vision loss.'
    },
    pediatric: {
      title: 'Child Squinting, Sitting Too Close to Screen or Eye Rubbing',
      condition: 'Pediatric Refractive Error, Amblyopia (Lazy Eye) or Strabismus',
      clinic: 'Pediatric Ophthalmology & Binocular Vision Center',
      doctor: 'Dr. Ananya Mukherjee',
      doctorRole: 'Pediatric & Squint Specialist',
      doctorImg: 'assets/images/doctor-4.jpg',
      service: "Children's Eye Care",
      advice: 'Gentle child-friendly non-dilating autorefraction, 3D depth-perception games, and lazy-eye orthoptic stimulation tailored for young eyes.'
    },
    glaucoma: {
      title: 'High Eye Pressure, Tunnel Vision or Family History',
      condition: 'Glaucoma (Optic Nerve Pressure Monitoring)',
      clinic: 'Glaucoma Early Detection & SLT Laser Suite',
      doctor: 'Dr. Sunita Rao',
      doctorRole: 'Cornea & Glaucoma Specialist',
      doctorImg: 'assets/images/doctor-2.jpg',
      service: 'Glaucoma Treatment',
      advice: 'Goldmann applanation tonometry, pachymetry corneal thickness measurement, and automated 24-2 Humphrey Visual Field (HFA) nerve mapping.'
    }
  };

  const symptomCards = document.querySelectorAll('.symptom-card');
  const recommendationPanel = document.getElementById('symptom-recommendation-panel');

  const renderSymptomRecommendation = (symptomKey) => {
    if (!recommendationPanel) return;
    const data = symptomData[symptomKey] || symptomData.cataract;

    recommendationPanel.innerHTML = `
      <div class="border-b border-borderLight pb-3.5">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-tealAccent/10 text-tealAccent font-bold text-[11px] tracking-wide uppercase">
          Clinical Recommendation
        </span>
        <h3 class="text-base sm:text-lg font-bold font-heading text-primaryNavy mt-2">
          ${data.clinic}
        </h3>
        <p class="text-xs text-secondaryBlue font-semibold mt-0.5">
          Primary Concern: ${data.condition}
        </p>
      </div>

      <!-- Specialist Doctor Info -->
      <div class="flex items-center gap-3 bg-lightBlueBg p-3 rounded-xl border border-borderLight/80">
        <img src="${data.doctorImg}" alt="${data.doctor}" class="w-12 h-12 rounded-full object-cover border-2 border-tealAccent flex-shrink-0">
        <div>
          <h4 class="text-xs sm:text-sm font-bold text-primaryNavy">${data.doctor}</h4>
          <p class="text-[11px] text-secondaryText">${data.doctorRole}</p>
          <div class="flex items-center gap-2 mt-0.5 text-[10.5px] text-emerald-600 font-semibold">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Available for Consultation</span>
          </div>
        </div>
      </div>

      <!-- Clinical Protocol Advice -->
      <div class="text-xs text-secondaryText leading-relaxed bg-[#FBFDFE] p-3 rounded-xl border border-borderLight/60">
        <strong class="text-primaryNavy block mb-0.5">Clinical Protocol:</strong>
        ${data.advice}
      </div>

      <!-- 1-Click Schedule Action -->
      <button type="button" id="symptom-book-btn"
        class="w-full bg-tealAccent hover:bg-[#0fa19a] text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 shadow-teal hover:shadow-lg flex items-center justify-center gap-2">
        <span>Book ${data.service} with ${data.doctor}</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    `;

    // Bind 1-click CTA button
    const symptomBookBtn = document.getElementById('symptom-book-btn');
    symptomBookBtn?.addEventListener('click', () => {
      const serviceDropdown = document.getElementById('serviceSelect');
      const docDropdown = document.getElementById('doctorSelect');
      const appointmentSec = document.getElementById('appointment');

      if (serviceDropdown && data.service) {
        serviceDropdown.value = data.service;
      }
      if (docDropdown && data.doctor) {
        docDropdown.value = data.doctor;
      }

      const formCard = document.getElementById('appointment-form');
      if (formCard) {
        formCard.classList.remove('flash-highlight');
        void formCard.offsetWidth; // trigger reflow
        formCard.classList.add('flash-highlight');
      }

      if (appointmentSec) {
        appointmentSec.scrollIntoView({ behavior: 'smooth' });
      }

      showToast(`Selected ${data.doctor} for ${data.service}`, 'success');
    });
  };

  // Bind symptom card click listeners
  symptomCards.forEach((card) => {
    card.addEventListener('click', () => {
      symptomCards.forEach((c) => {
        c.classList.remove('is-selected');
        const dot = c.querySelector('.symptom-radio-dot');
        if (dot) {
          dot.style.backgroundColor = '';
          dot.style.transform = 'scale(0)';
        }
      });

      card.classList.add('is-selected');
      const activeDot = card.querySelector('.symptom-radio-dot');
      if (activeDot) {
        activeDot.style.backgroundColor = 'var(--color-teal)';
        activeDot.style.transform = 'scale(1)';
      }

      const symptomId = card.getAttribute('data-symptom-id');
      renderSymptomRecommendation(symptomId);
    });
  });

  // Initial render for default symptom
  renderSymptomRecommendation('cataract');

  // -------------------------------------------------------------------------
  // 16. Doctor Profile & OPD Schedule Modal
  // -------------------------------------------------------------------------
  const doctorProfiles = {
    'Dr. Rajesh Sharma': {
      name: 'Dr. Rajesh Sharma',
      specialty: 'Senior Cataract & LASIK Surgeon',
      degrees: 'MBBS, MS (AIIMS New Delhi), FRCS (Glasgow)',
      exp: '18+ Years',
      surgeries: '15,000+',
      img: 'assets/images/doctor-1.jpg',
      schedule: [
        'Mon, Wed, Fri: 09:00 AM – 01:00 PM (Morning OPD)',
        'Tue, Thu, Sat: 04:00 PM – 08:00 PM (Evening OPD)',
        'Sun: Emergency On-Call Only'
      ],
      specializations: [
        'Blade-Free Robotic Cataract',
        'Trifocal & Toric Foldable IOLs',
        'Contoura Vision LASIK',
        'Complex Anterior Segment Reconstruction'
      ]
    },
    'Dr. Sunita Rao': {
      name: 'Dr. Sunita Rao',
      specialty: 'Cornea & Refractive Specialist',
      degrees: 'MBBS, MS (Sankara Nethralaya), FICO (UK)',
      exp: '14+ Years',
      surgeries: '10,000+',
      img: 'assets/images/doctor-2.jpg',
      schedule: [
        'Monday to Saturday: 10:00 AM – 02:00 PM',
        'Tuesday & Thursday: 05:00 PM – 07:30 PM (LASIK Evaluations)'
      ],
      specializations: [
        'Blade-Free Contoura LASIK',
        'SMILE Pro Lenticule Extraction',
        'Corneal Collagen Cross-Linking (C3R)',
        'Dry Eye Thermal Pulsation Therapy'
      ]
    },
    'Dr. Vikramaditya Reddy': {
      name: 'Dr. Vikramaditya Reddy',
      specialty: 'Vitreo-Retinal Surgeon',
      degrees: 'MBBS, MD (AIIMS), Fellow LV Prasad Eye Institute',
      exp: '16+ Years',
      surgeries: '8,500+',
      img: 'assets/images/doctor-3.jpg',
      schedule: [
        'Mon, Wed, Thu, Sat: 11:00 AM – 04:00 PM',
        '24/7 Urgent Vitreo-Retinal Emergency Coverage'
      ],
      specializations: [
        'Sutureless 25G/27G Vitrectomy',
        'Diabetic Retinopathy & Laser Photocoagulation',
        'Retinal Detachment Repair',
        'Anti-VEGF Macular Injections'
      ]
    },
    'Dr. Ananya Mukherjee': {
      name: 'Dr. Ananya Mukherjee',
      specialty: 'Pediatric & Squint Specialist',
      degrees: 'MBBS, DNB, Fellow Aravind Eye Hospital',
      exp: '11+ Years',
      surgeries: '6,200+',
      img: 'assets/images/doctor-4.jpg',
      schedule: [
        'Tue, Thu, Fri: 09:30 AM – 01:30 PM',
        'Saturday & Sunday: 10:00 AM – 02:00 PM (Kids Vision Clinic)'
      ],
      specializations: [
        'Pediatric Cataract with IOL',
        'Strabismus (Squint) Correction',
        'Amblyopia (Lazy Eye) Therapy',
        'Childhood Myopia Progression Control'
      ]
    }
  };

  const doctorModal = document.getElementById('doctor-profile-modal');
  const closeDoctorModalBtn = document.getElementById('close-doctor-modal');
  const doctorModalBookBtn = document.getElementById('doctor-modal-book-btn');
  let currentViewingDoctor = null;

  const openDoctorModal = (doctorName) => {
    const data = doctorProfiles[doctorName];
    if (!data || !doctorModal) return;

    currentViewingDoctor = data;

    const modalName = document.getElementById('doctor-modal-name');
    const modalSpecialty = document.getElementById('doctor-modal-specialty');
    const modalDeg = document.getElementById('doctor-modal-deg');
    const modalExp = document.getElementById('doctor-modal-exp');
    const modalSurgeries = document.getElementById('doctor-modal-surgeries');
    const modalImg = document.getElementById('doctor-modal-img');
    const modalSchedule = document.getElementById('doctor-modal-schedule');
    const modalSpecs = document.getElementById('doctor-modal-specializations');

    if (modalName) modalName.textContent = data.name;
    if (modalSpecialty) modalSpecialty.textContent = data.specialty;
    if (modalDeg) modalDeg.textContent = data.degrees;
    if (modalExp) modalExp.textContent = data.exp;
    if (modalSurgeries) modalSurgeries.textContent = data.surgeries;
    if (modalImg) modalImg.src = data.img;

    if (modalSchedule) {
      modalSchedule.innerHTML = data.schedule
        .map((s) => `<div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-tealAccent"></span><span>${s}</span></div>`)
        .join('');
    }

    if (modalSpecs) {
      modalSpecs.innerHTML = data.specializations
        .map((spec) => `<span class="px-2.5 py-1 rounded-full bg-lightBlueBg border border-borderLight text-[11px] font-medium text-primaryNavy">${spec}</span>`)
        .join('');
    }

    doctorModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeDoctorModal = () => {
    if (!doctorModal) return;
    doctorModal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.view-doctor-bio-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const docName = btn.getAttribute('data-doctor-name');
      if (docName) openDoctorModal(docName);
    });
  });

  closeDoctorModalBtn?.addEventListener('click', closeDoctorModal);
  doctorModal?.addEventListener('click', (e) => {
    if (e.target === doctorModal) closeDoctorModal();
  });

  doctorModalBookBtn?.addEventListener('click', () => {
    if (!currentViewingDoctor) return;
    closeDoctorModal();

    const doctorSelect = document.getElementById('doctorSelect');
    if (doctorSelect) {
      doctorSelect.value = currentViewingDoctor.name;
    }

    const appointmentSec = document.getElementById('appointment');
    if (appointmentSec) {
      appointmentSec.scrollIntoView({ behavior: 'smooth' });
    }

    const formCard = document.getElementById('appointment-form');
    if (formCard) {
      formCard.classList.remove('flash-highlight');
      void formCard.offsetWidth;
      formCard.classList.add('flash-highlight');
    }

    showToast(`Pre-filled appointment for ${currentViewingDoctor.name}`, 'success');
  });

  // -------------------------------------------------------------------------
  // 17. Appointment Form Date Shortcuts & Time Slot Chips
  // -------------------------------------------------------------------------
  const dateInput = document.getElementById('appointmentDate');
  const dateQuickBtns = document.querySelectorAll('.date-quick-btn');
  const timeSelect = document.getElementById('appointmentTime');
  const timeChips = document.querySelectorAll('.time-slot-chip');

  const setDateOffset = (days) => {
    if (!dateInput) return;
    const target = new Date();
    target.setDate(target.getDate() + days);
    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    const dd = String(target.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  };

  dateQuickBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      dateQuickBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const days = parseInt(btn.getAttribute('data-days') || '0', 10);
      setDateOffset(days);
    });
  });

  timeChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      timeChips.forEach((c) => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      const slotVal = chip.getAttribute('data-time');
      if (timeSelect && slotVal) {
        timeSelect.value = slotVal;
      }
    });
  });

  timeSelect?.addEventListener('change', () => {
    const selectedVal = timeSelect.value;
    timeChips.forEach((chip) => {
      if (chip.getAttribute('data-time') === selectedVal) {
        chip.classList.add('is-selected');
      } else {
        chip.classList.remove('is-selected');
      }
    });
  });

  // -------------------------------------------------------------------------
  // 18. Interactive LASIK Candidacy Quick Tool
  // -------------------------------------------------------------------------
  let selectedCalcAge = '18-24';
  let selectedCalcStability = 'yes';

  const ageBtns = document.querySelectorAll('#calc-age-group .calc-option-btn');
  const stabilityBtns = document.querySelectorAll('#calc-stability-group .calc-option-btn');
  const calcResultTitle = document.getElementById('calc-result-title');
  const calcResultDesc = document.getElementById('calc-result-desc');
  const calcBookCta = document.getElementById('calc-book-cta');

  const updateCalcResults = () => {
    if (!calcResultTitle || !calcResultDesc) return;

    if (selectedCalcStability === 'no') {
      calcResultTitle.textContent = 'Preliminary Clinic Screening Advised';
      calcResultDesc.textContent = 'Since your spectacle prescription has changed recently, a preliminary refraction & corneal topography check is advised before laser surgery.';
    } else if (selectedCalcAge === '40+') {
      calcResultTitle.textContent = 'Presbyopia & Blended Vision Match (94%)';
      calcResultDesc.textContent = 'Customized PresbyMAX LASIK or Refractive Lens Exchange with Trifocal IOL recommended for spectacle-free reading and distance vision.';
    } else {
      calcResultTitle.textContent = 'High Candidacy Match (98%)';
      calcResultDesc.textContent = 'Blade-Free Contoura LASIK or SMILE Pro recommended. 10-minute stitchless procedure with 24-hr recovery.';
    }
  };

  ageBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      ageBtns.forEach((b) => {
        b.classList.remove('is-active', 'bg-tealAccent', 'text-white');
        b.classList.add('bg-white/10', 'text-slate-200');
      });
      btn.classList.add('is-active', 'bg-tealAccent', 'text-white');
      btn.classList.remove('bg-white/10', 'text-slate-200');
      selectedCalcAge = btn.getAttribute('data-value') || '18-24';
      updateCalcResults();
    });
  });

  stabilityBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      stabilityBtns.forEach((b) => {
        b.classList.remove('is-active', 'bg-tealAccent', 'text-white');
        b.classList.add('bg-white/10', 'text-slate-200');
      });
      btn.classList.add('is-active', 'bg-tealAccent', 'text-white');
      btn.classList.remove('bg-white/10', 'text-slate-200');
      selectedCalcStability = btn.getAttribute('data-value') || 'yes';
      updateCalcResults();
    });
  });

  calcBookCta?.addEventListener('click', () => {
    const serviceDropdown = document.getElementById('serviceSelect');
    const doctorDropdown = document.getElementById('doctorSelect');
    const appointmentSec = document.getElementById('appointment');

    if (serviceDropdown) serviceDropdown.value = 'LASIK Surgery';
    if (doctorDropdown) doctorDropdown.value = 'Dr. Sunita Rao';

    const formCard = document.getElementById('appointment-form');
    if (formCard) {
      formCard.classList.remove('flash-highlight');
      void formCard.offsetWidth;
      formCard.classList.add('flash-highlight');
    }

    if (appointmentSec) {
      appointmentSec.scrollIntoView({ behavior: 'smooth' });
    }

    showToast('Selected Dr. Sunita Rao for Blade-Free LASIK evaluation scan', 'success');
  });

  console.log('Eye Hospital web application initialized successfully.');
});

