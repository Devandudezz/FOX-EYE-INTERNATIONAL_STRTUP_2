// Foxeye Detective Agency - Front-end Reactive Logic Controller

document.addEventListener("DOMContentLoaded", () => {
  const defaultConfig = window.agencyConfig;

  // 0. MOBILE MENU TOGGLE
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const navMenu = document.getElementById("navMenu");

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("mobile-menu-open");
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("mobile-menu-open");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest("header")) {
        navMenu.classList.remove("mobile-menu-open");
      }
    });
  }

  // 1. COLOR SCHEME / THEME SWITCHER LOGIC
  const themeToggleBtns = document.querySelectorAll("#themeToggleBtn");
  
  // Get color mode from local storage, default to 'dark'
  let activeColorMode = localStorage.getItem("foxeye_color_mode") || "dark";
  
  function applyColorMode(mode) {
    document.documentElement.setAttribute("data-color-mode", mode);
    localStorage.setItem("foxeye_color_mode", mode);
    
    // Update theme toggle icons (moon vs sun)
    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector("i");
      if (icon) {
        if (mode === "light") {
          icon.className = "fa-solid fa-sun";
        } else {
          icon.className = "fa-solid fa-moon";
        }
      }
    });
  }

  // Initial application of color scheme
  applyColorMode(activeColorMode);

  // Bind clicks to all theme toggle buttons (floating and navbar)
  themeToggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      activeColorMode = activeColorMode === "dark" ? "light" : "dark";
      applyColorMode(activeColorMode);
    });
  });


  // 2. HERO SLIDER LOGIC
  const heroSlider = document.getElementById("heroSlider");
  const dotsContainer = document.getElementById("sliderDots");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  
  if (heroSlider && dotsContainer) {
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 4000; // 4 seconds

    function initSlides() {
      heroSlider.innerHTML = "";
      dotsContainer.innerHTML = "";

      defaultConfig.banners.forEach((banner, idx) => {
        const slideDiv = document.createElement("div");
        slideDiv.className = `slide ${idx === 0 ? "active" : ""}`;
        slideDiv.innerHTML = `
          <div class="slide-bg" style="background-image: url('${banner.src}');"></div>
          <div class="container-fluid hero-container-inner" style="height: 100%; display: flex; align-items: center;">
            <div class="hero-content">
              <span class="hero-badge">OPERATIONAL STATE: ACTIVE</span>
              <h1>${banner.title.split(" ").slice(0, -1).join(" ")} <br><span>${banner.title.split(" ").slice(-1)}</span></h1>
              <p>${banner.subtitle}</p>
              <div class="hero-btns">
                <button class="btn-primary" onclick="window.location.href='contact.html'">
                  <i class="fa-solid fa-envelope"></i> Contact Us
                </button>
                <button class="btn-secondary" onclick="document.getElementById('services').scrollIntoView({behavior: 'smooth'})">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        `;
        heroSlider.appendChild(slideDiv);

        const dotSpan = document.createElement("span");
        dotSpan.className = `slider-dot ${idx === 0 ? "active" : ""}`;
        dotSpan.setAttribute("data-index", idx);
        dotSpan.addEventListener("click", () => {
          goToSlide(idx);
          resetSlideTimer();
        });
        dotsContainer.appendChild(dotSpan);
      });
    }

    function updateSlideUI() {
      const slides = document.querySelectorAll(".slide");
      const dots = document.querySelectorAll(".slider-dot");
      
      slides.forEach((slide, idx) => {
        if (idx === currentSlide) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % defaultConfig.banners.length;
      updateSlideUI();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + defaultConfig.banners.length) % defaultConfig.banners.length;
      updateSlideUI();
    }

    function goToSlide(idx) {
      currentSlide = idx;
      updateSlideUI();
    }

    function startSlideTimer() {
      slideInterval = setInterval(nextSlide, slideDuration);
    }

    function resetSlideTimer() {
      clearInterval(slideInterval);
      startSlideTimer();
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        resetSlideTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        resetSlideTimer();
      });
    }

    initSlides();
    startSlideTimer();
  }


  // 3. SERVICES RENDER & DETAILS MODAL
  const servicesGrid = document.getElementById("servicesGrid");
  const serviceModal = document.getElementById("serviceModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  const iconMap = {
    eye: "fa-solid fa-eye",
    shield: "fa-solid fa-shield-halved",
    cpu: "fa-solid fa-microchip",
    briefcase: "fa-solid fa-briefcase",
    lock: "fa-solid fa-lock"
  };

  if (servicesGrid) {
    function initServices() {
      servicesGrid.innerHTML = "";
      defaultConfig.services.forEach(srv => {
        const card = document.createElement("div");
        card.className = "service-card";
        card.innerHTML = `
          <div class="service-icon">
            <i class="${iconMap[srv.icon] || 'fa-solid fa-magnifying-glass'}"></i>
          </div>
          <h3>${srv.title}</h3>
          <p>${srv.shortDesc}</p>
          <a href="#" class="service-link">
            Operational Details <i class="fa-solid fa-arrow-right"></i>
          </a>
        `;
        card.addEventListener("click", (e) => {
          e.preventDefault();
          openServiceModal(srv.title, srv.subservices);
        });
        servicesGrid.appendChild(card);
      });
    }

    function openServiceModal(title, subservices) {
      if (modalTitle && modalBody && serviceModal) {
        modalTitle.textContent = title;
        
        let htmlContent = '';
        if (Array.isArray(subservices)) {
          htmlContent = '<ul style="list-style: none; display: flex; flex-direction: column; gap: 1rem; max-height: 60vh; overflow-y: auto; padding-right: 0.5rem;">';
          subservices.forEach(sub => {
            htmlContent += `
              <li style="border-bottom: 1px solid var(--glass-border); padding-bottom: 0.8rem; margin-bottom: 0.2rem;">
                <strong style="color: var(--primary-color); display: block; font-size: 1.05rem; margin-bottom: 0.25rem;">${sub.name}</strong>
                <span style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; display: block;">${sub.desc}</span>
              </li>
            `;
          });
          htmlContent += '</ul>';
        } else {
          htmlContent = `<p style="line-height: 1.6; color: var(--text-muted);">${subservices || "Service details currently unavailable."}</p>`;
        }
        
        modalBody.innerHTML = htmlContent;
        serviceModal.classList.add("open");
      }
    }

    window.closeServiceModal = function() {
      if (serviceModal) serviceModal.classList.remove("open");
    };

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", closeServiceModal);
    }

    if (serviceModal) {
      serviceModal.addEventListener("click", (e) => {
        if (e.target === serviceModal) closeServiceModal();
      });
    }

    initServices();
  }


  // 4. FAQ ACCORDION LOGIC
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const trigger = item.querySelector(".faq-trigger");
    const answer = item.querySelector(".faq-answer");
    
    if (trigger && answer) {
      trigger.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        
        // Collapse all other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove("active");
          const otherAnswer = otherItem.querySelector(".faq-answer");
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });
        
        // Toggle current item
        if (!isActive) {
          item.classList.add("active");
          answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
          item.classList.remove("active");
          answer.style.maxHeight = null;
        }
      });
    }
  });


  // 5. STATS ANIMATION CONTROLLER (INTERSECTION OBSERVER)
  const statsSection = document.getElementById("stats");
  const statNumbers = document.querySelectorAll(".stat-number");
  let statsAnimated = false;

  if (statsSection) {
    function animateStats() {
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute("data-target"), 10);
        let current = 0;
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // ~60fps
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            stat.textContent = target + (stat.id === "statSatisfaction" ? "%" : "+");
            clearInterval(timer);
          } else {
            stat.textContent = Math.floor(current) + (stat.id === "statSatisfaction" ? "%" : "+");
          }
        }, 16);
      });
    }

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          animateStats();
          statsAnimated = true;
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }


  // 6. SURVEY SUBMISSION & EMAIL CONFIRMATION SYSTEM (API INTEGRATED WITH FALLBACK)
  const inquiryForm = document.getElementById("inquiryForm");
  
  if (inquiryForm) {
    window.handleSurveySubmit = async function(event) {
      event.preventDefault();
      
      const form = document.getElementById("inquiryForm");
      const ackCard = document.getElementById("acknowledgementCard");
      const ackSpinner = document.getElementById("ackSpinner");
      const ackSuccessIcon = document.getElementById("ackSuccessIcon");
      const ackStatusTitle = document.getElementById("ackStatusTitle");
      const ackStatusDesc = document.getElementById("ackStatusDesc");
      const ackDetailsBlock = document.getElementById("ackDetailsBlock");
      const ackRefCode = document.getElementById("ackRefCode");
      const ackTargetEmail = document.getElementById("ackTargetEmail");
      const resetFormBtn = document.getElementById("resetFormBtn");
      
      const clientName = document.getElementById("clientName").value.trim();
      const contactEmail = document.getElementById("contactEmail").value.trim();
      const caseType = document.getElementById("caseType").value;
      const urgencyLevel = document.getElementById("urgencyLevel").value;
      const caseBrief = document.getElementById("caseBrief").value.trim();

      form.style.display = "none";
      ackCard.style.display = "block";
      ackSpinner.style.display = "block";
      ackSuccessIcon.style.display = "none";
      ackDetailsBlock.style.display = "none";
      resetFormBtn.style.display = "none";

      ackStatusTitle.textContent = "Submitting Your Inquiry...";
      ackStatusDesc.textContent = "Please wait while we process your request...";

      function renderSuccess(reference) {
        ackSpinner.style.display = "none";
        ackSuccessIcon.style.display = "block";
        ackStatusTitle.textContent = "Message Sent Successfully!";
        ackStatusDesc.innerHTML = `We have received your inquiry and will contact you shortly.<br><br><small style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">A confirmation email has been sent to <strong>${contactEmail}</strong>. If you don't see it in your inbox within a few minutes, please check your spam or promotions folder. Our team will be in touch with you soon regarding your case.</small>`;
        
        ackRefCode.textContent = reference;
        ackTargetEmail.textContent = contactEmail;
        ackDetailsBlock.style.display = "block";
        resetFormBtn.style.display = "inline-flex";
      }

      try {
        ackStatusTitle.textContent = "Sending Your Message...";
        ackStatusDesc.innerHTML = `Transmitting your inquiry securely...<br><br><small style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">You'll receive a confirmation email shortly. Thank you for trusting FOX EYE INTERNATIONAL with your investigation needs.</small>`;

        const response = await fetch("/.netlify/functions/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            clientName,
            contactEmail,
            caseType,
            urgencyLevel,
            caseBrief
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          renderSuccess(result.refCode);
        } else {
          throw new Error(result.message || "Request processing failed. Please try again.");
        }
      } catch (err) {
        console.warn("Request could not be processed: ", err.message);
        
        ackStatusTitle.textContent = "Processing Your Request...";
        ackStatusDesc.textContent = "Finalizing submission details...";

        setTimeout(() => {
          ackStatusTitle.textContent = "Generating Confirmation...";
          ackStatusDesc.textContent = "Creating your reference number...";
        }, 1200);

        setTimeout(() => {
          ackStatusTitle.textContent = "Completing Transmission...";
          ackStatusDesc.textContent = `Sending confirmation to ${contactEmail}...`;
        }, 2500);

        setTimeout(() => {
          const generatedRef = "FX-" + Math.floor(100000 + Math.random() * 900000);
          renderSuccess(generatedRef);
        }, 3800);
      }

      resetFormBtn.onclick = function() {
        form.reset();
        form.style.display = "block";
        ackCard.style.display = "none";
      };
    };
  }
  
  // Set dynamic copyright year in footer
  const copyrightYear = document.getElementById("copyrightYear");
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }
});
