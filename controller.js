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

  // Fonction pour changer de section
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

    // Fermer le menu mobile s'il est ouvert
    if (navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      hamburger.querySelector("i").classList.add("fa-bars");
      hamburger.querySelector("i").classList.remove("fa-times");
    }

    // Faire défiler vers le haut de la section
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

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
});

//Emailjs
function sendMail() {
  let parms = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  emailjs
    .send("service_lwbz2hc", "template_g44eowe", parms)
    .then(alert("Email Sent"));
}

// =====================================
// PROJECT CAROUSEL CLASS - À ajouter à la fin de controller.js
// =====================================

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
    // Données des projets - Remplacez par vos vraies images
    this.projectData = {
      "maintenance-app": {
        title: "Industrial Maintenance Management App",
        slides: [
          {
            image:
              "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
            description:
              "Dashboard overview showing real-time maintenance status and equipment health monitoring.",
          },
          {
            image:
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
            description:
              "Interactive charts displaying maintenance schedules and performance metrics.",
          },
          {
            image:
              "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
            description:
              "Mobile-responsive interface for field technicians to update maintenance records.",
          },
          {
            image:
              "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=400&fit=crop",
            description:
              "Equipment database with detailed specifications and maintenance history.",
          },
        ],
      },
      "glass-printing": {
        title: "Digital Glass Printing Web Site",
        slides: [
          {
            image:
              "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop",
            description:
              "Modern homepage design showcasing glass printing services and capabilities.",
          },
          {
            image:
              "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop",
            description:
              "Product gallery featuring various glass printing samples and customization options.",
          },
          {
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
            description:
              "Client portal for order tracking and project management.",
          },
        ],
      },
      "jade-ecommerce": {
        title: "Jade E-commerce Website",
        slides: [
          {
            image:
              "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
            description:
              "Clean and modern product catalog with advanced filtering options.",
          },
          {
            image:
              "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
            description:
              "Secure shopping cart and checkout process with multiple payment options.",
          },
          {
            image:
              "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=800&h=400&fit=crop",
            description:
              "Responsive design optimized for mobile shopping experience.",
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

// Initialiser le carousel quand le DOM est prêt
document.addEventListener("DOMContentLoaded", function () {
  // Vos autres scripts existants...

  // Initialiser le carousel à la fin
  setTimeout(() => {
    new ProjectCarousel();
  }, 500); // Petit délai pour s'assurer que tout est chargé
});
