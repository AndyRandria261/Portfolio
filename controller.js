// Script pour la gestion des sections
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const navMenu = document.querySelector(".nav-menu");
  const hamburger = document.querySelector(".hamburger");

  // Ajoute une classe quand on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Animation pour les liens de navigation au survol
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      link.style.transform = "translateY(-3px)";
      link.style.transition = "transform 0.3s ease";
    });

    link.addEventListener("mouseleave", () => {
      link.style.transform = "translateY(0)";
    });
  });

  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      navbar.style.padding = "10px 0";
      navbar.style.background = "rgba(10, 25, 47, 0.98)";
    } else {
      navbar.style.padding = "20px 0";
      navbar.style.background = "rgba(10, 25, 47, 0.9)";
    }
  });

  // Gestion des clics sur les liens de navigation
  document.querySelectorAll(".nav-link, .mobile-nav-item").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const sectionId = this.getAttribute("data-section");

      // Mettre à jour l'élément actif dans la navigation
      document.querySelectorAll(".nav-link, .mobile-nav-item").forEach((el) => {
        el.classList.remove("active");
      });
      this.classList.add("active");

      // Afficher la section correspondante
      showSection(sectionId);
    });
  });

  // Contact form handling - NOUVELLE SECTION
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", sendMail);
  }

  // Initialiser le carousel à la fin
  setTimeout(() => {
    new ProjectCarousel();
  }, 500); // Petit délai pour s'assurer que tout est chargé
});

// MOVE showSection FUNCTION OUTSIDE - Make it globally accessible
function showSection(sectionId) {
  // Masquer toutes les sections
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active");
  });

  // Afficher la section sélectionnée
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active");
  }

  // Update navigation active state
  document.querySelectorAll(".nav-link, .mobile-nav-item").forEach((el) => {
    el.classList.remove("active");
  });

  // Find and activate the corresponding navigation link
  const navLink = document.querySelector(`[data-section="${sectionId}"]`);
  if (navLink) {
    navLink.classList.add("active");
  }

  // Faire défiler vers le haut de la section
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Function SendEmail
async function sendMail(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector(".submit-btn");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoading = submitBtn.querySelector(".btn-loading");

  // Show loading state
  submitBtn.disabled = true;
  if (btnText && btnLoading) {
    btnText.style.display = "none";
    btnLoading.style.display = "inline";
  } else {
    submitBtn.textContent = "Sending...";
  }

  const formData = new FormData(form);
  const data = {
    name: formData.get("name") || document.getElementById("name").value,
    email: formData.get("email") || document.getElementById("email").value,
    subject:
      formData.get("subject") || document.getElementById("subject").value,
    message:
      formData.get("message") || document.getElementById("message").value,
  };

  try {
    console.log("Sending data:", data); // Debug log

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Response status:", response.status); // Debug log
    console.log("Response headers:", response.headers); // Debug log

    const result = await response.json();
    console.log("Response data:", result); // Debug log

    if (response.ok && result.success) {
      alert("✅ Thank you! Your message has been sent successfully.");
      form.reset();
    } else {
      throw new Error(
        result.message || `HTTP ${response.status}: Failed to send message`
      );
    }
  } catch (error) {
    console.error("Complete error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    // More specific error messages
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      alert("⚠️ Network error. Please check your connection and try again.");
    } else if (error.message.includes("404")) {
      alert("⚠️ API endpoint not found. Please contact the administrator.");
    } else if (error.message.includes("500")) {
      alert("⚠️ Server error. Please try again later.");
    } else {
      alert("⚠️ Unable to send your message: " + error.message);
    }
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    if (btnText && btnLoading) {
      btnText.style.display = "inline";
      btnLoading.style.display = "none";
    } else {
      submitBtn.textContent = "Send";
    }
  }
}

// PROJECT CAROUSEL CLASS (inchangée)
class ProjectCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = [];
    this.autoPlayInterval = null;
    this.progressInterval = null;
    this.autoPlayDuration = 4000; // 4 secondes
    this.isPlaying = false;

    this.initializeElements();
    this.bindEvents();
    this.loadProjectData();
  }

  initializeElements() {
    this.modal = document.getElementById("projectModal");
    this.modalTitle = document.getElementById("modalTitle");
    this.modalClose = document.getElementById("modalClose");
    this.carouselWrapper = document.getElementById("carouselWrapper");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.indicators = document.getElementById("carouselIndicators");
    this.progressBar = document.getElementById("carouselProgress");
  }

  bindEvents() {
    // Contrôles modal
    this.modalClose.addEventListener("click", () => this.closeModal());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    // Contrôles navigation
    this.prevBtn.addEventListener("click", () => this.previousSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());

    // Navigation clavier
    document.addEventListener("keydown", (e) => {
      if (!this.modal.classList.contains("active")) return;

      switch (e.key) {
        case "Escape":
          this.closeModal();
          break;
        case "ArrowLeft":
          this.previousSlide();
          break;
        case "ArrowRight":
          this.nextSlide();
          break;
      }
    });

    // Boutons projet
    document.querySelectorAll(".btn-details").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const projectId = btn.getAttribute("data-project");
        if (projectId) {
          this.openModal(projectId);
        }
      });
    });

    // Pause autoplay au survol
    this.modal.addEventListener("mouseenter", () => this.pauseAutoPlay());
    this.modal.addEventListener("mouseleave", () => this.resumeAutoPlay());
  }

  loadProjectData() {
    // Données des projets
    this.projectData = {
      "maintenance-app": {
        title: "Industrial Maintenance Management App",
        slides: [
          {
            image: "/../assets/img/LoginPage.png",
            description: "Secure login interface with role-based access.",
          },
          {
            image: "/../assets/img/DashboardHead.png",
            description:
              "Dashboard for the Head of Maintenance with real-time insights and quick actions.",
          },
          {
            image: "/../assets/img/TechLists.png",
            description:
              "Complete list of technicians with search and management options.",
          },
          {
            image: "/../assets/img/AddTech.png",
            description:
              "Form to add a new technician with assigned roles and machine permissions.",
          },
          {
            image: "/../assets/img/EditTech.png",
            description:
              "Technician details editing page for updating roles, status, and information.",
          },
          {
            image: "/../assets/img/ListMachine.png",
            description:
              "Overview of all machines including status, category, and assigned technicians.",
          },
          {
            image: "/../assets/img/AddMachine.png",
            description:
              "Machine registration form for adding new industrial equipment.",
          },
          {
            image: "/../assets/img/EditMachine.png",
            description:
              "Machine editing interface for updating specifications and maintenance data.",
          },
        ],
      },
      "jade-ecommerce": {
        title: "Jade E-commerce Website",
        slides: [
          {
            image: "/../assets/img/LoginForm.png",
            description: "Login page with secure authentication.",
          },
          {
            image: "/../assets/img/RegisterForm.png",
            description: "User registration form with real-time validation.",
          },
          {
            image: "/../assets/img/mainPage",
            description: "Main homepage showcasing products and categories.",
          },
          {
            image: "/../assets/img/Footer.png",
            description: "Website footer with quick links and company details.",
          },
          {
            image: "/../assets/img/ProductForm",
            description:
              "Product creation form for adding new items to the store.",
          },
          {
            image: "/../assets/img/ProductOverplay.png",
            description: "Product preview overlay inspired by Shein's UI.",
          },
          {
            image: "/../assets/img/TagPage.png",
            description:
              "Tag management page used to organize and filter items.",
          },
          {
            image: "/../assets/img/TaxForm2.png",
            description: "Tax configuration form for pricing and invoicing.",
          },
          {
            image: "/../assets/img/PenalitiesForm.png",
            description:
              "Penalties setup form for late payments or violations.",
          },
          {
            image: "/../assets/img/ComplaintsForm.png",
            description: "Complaint submission form to handle customer issues.",
          },
          {
            image: "/../assets/img/ComplaintsForm.png",
            description: "Complaint form (duplicate slide).",
          },
          {
            image: "/../assets/img/ContactForm.png",
            description:
              "Contact form allowing users to reach customer support.",
          },
        ],
      },
      "student-management": {
        title: "Student Management System",
        slides: [
          {
            image:
              "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop",
            description:
              "Comprehensive student registration and enrollment management interface.",
          },
          {
            image:
              "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
            description:
              "Grade tracking and academic performance analytics dashboard.",
          },
          {
            image:
              "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=400&fit=crop",
            description:
              "Attendance monitoring system with automated reporting features.",
          },
        ],
      },
    };
  }

  openModal(projectId) {
    const project = this.projectData[projectId];
    if (!project) {
      console.warn(`Project ${projectId} not found`);
      return;
    }

    this.modalTitle.textContent = project.title;
    this.slides = project.slides;
    this.currentSlide = 0;

    this.renderSlides();
    this.renderIndicators();
    this.updateSlidePosition();
    this.updateIndicators();

    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";

    this.startAutoPlay();
  }

  closeModal() {
    this.modal.classList.remove("active");
    document.body.style.overflow = "";
    this.stopAutoPlay();
  }

  renderSlides() {
    this.carouselWrapper.innerHTML = "";

    this.slides.forEach((slide, index) => {
      const slideElement = document.createElement("div");
      slideElement.className = "carousel-slide";
      slideElement.innerHTML = `
                <img src="${slide.image}" alt="Slide ${
        index + 1
      }" class="slide-image" loading="lazy">
                <div class="slide-description">
                    <p>${slide.description}</p>
                </div>
            `;
      this.carouselWrapper.appendChild(slideElement);
    });
  }

  renderIndicators() {
    this.indicators.innerHTML = "";

    this.slides.forEach((_, index) => {
      const indicator = document.createElement("button");
      indicator.className = "carousel-indicator";
      indicator.addEventListener("click", () => this.goToSlide(index));
      this.indicators.appendChild(indicator);
    });
  }

  updateSlidePosition() {
    const translateX = -this.currentSlide * 100;
    this.carouselWrapper.style.transform = `translateX(${translateX}%)`;
  }

  updateIndicators() {
    const indicators = this.indicators.querySelectorAll(".carousel-indicator");
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentSlide);
    });
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateSlidePosition();
    this.updateIndicators();
    this.resetAutoPlay();
  }

  previousSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.updateSlidePosition();
    this.updateIndicators();
    this.resetAutoPlay();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateSlidePosition();
    this.updateIndicators();
    this.resetAutoPlay();
  }

  startAutoPlay() {
    this.isPlaying = true;
    this.startProgress();

    this.autoPlayInterval = setInterval(() => {
      if (this.isPlaying) {
        this.nextSlide();
      }
    }, this.autoPlayDuration);
  }

  stopAutoPlay() {
    this.isPlaying = false;
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
    this.stopProgress();
  }

  pauseAutoPlay() {
    this.isPlaying = false;
    this.stopProgress();
  }

  resumeAutoPlay() {
    if (this.autoPlayInterval && this.modal.classList.contains("active")) {
      this.isPlaying = true;
      this.startProgress();
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  startProgress() {
    this.progressBar.style.width = "0%";
    let progress = 0;
    const increment = 100 / (this.autoPlayDuration / 100);

    this.progressInterval = setInterval(() => {
      if (this.isPlaying) {
        progress += increment;
        this.progressBar.style.width = `${Math.min(progress, 100)}%`;

        if (progress >= 100) {
          this.progressBar.style.width = "0%";
          progress = 0;
        }
      }
    }, 100);
  }

  stopProgress() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    this.progressBar.style.width = "0%";
  }
}
