// ========================================
// HEADER SCROLL EFFECT
// ========================================
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ========================================
// MOBILE MENU
// ========================================
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const nav = document.getElementById("nav");

if (mobileMenuBtn && nav) {
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenuBtn.classList.toggle("active");
    nav.classList.toggle("active");
  });

  // Close menu when clicking a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenuBtn.classList.remove("active");
      nav.classList.remove("active");
    });
  });
}

// ========================================
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ========================================
// RESULTS FILTER
// ========================================
const filterBtns = document.querySelectorAll(".filter-btn");
const resultCards = document.querySelectorAll(".result-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    filterBtns.forEach((b) => b.classList.remove("active"));
    // Add active class to clicked button
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    resultCards.forEach((card) => {
      if (filter === "all" || card.getAttribute("data-category") === filter) {
        card.classList.remove("hidden");
        card.style.display = "block";
      } else {
        card.classList.add("hidden");
        card.style.display = "none";
      }
    });
  });
});

// ========================================
// TESTIMONIALS SLIDER
// ========================================
const track = document.getElementById("testimonials-track");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const dots = document.querySelectorAll(".dot");
const testimonialCards = document.querySelectorAll(".testimonial-card");

let currentSlide = 0;
const totalSlides = testimonialCards ? testimonialCards.length : 0;
let autoplayInterval;

function updateSlider() {
  if (!track) return;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

function nextSlide() {
  if (totalSlides === 0) return;
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider();
}

function prevSlide() {
  if (totalSlides === 0) return;
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlider();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlider();
}

function startAutoplay() {
  if (totalSlides > 0) {
    autoplayInterval = setInterval(nextSlide, 5000);
  }
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
}

// Event Listeners
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    nextSlide();
    stopAutoplay();
    startAutoplay();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    prevSlide();
    stopAutoplay();
    startAutoplay();
  });
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    goToSlide(index);
    stopAutoplay();
    startAutoplay();
  });
});

// Start autoplay
startAutoplay();

// Pause on hover
if (track) {
  track.addEventListener("mouseenter", stopAutoplay);
  track.addEventListener("mouseleave", startAutoplay);
}

// ========================================
// CONTACT FORM (Node.js Integration via API)
// ========================================
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const alertBox = document.getElementById("form-alert");

  const showAlert = (message, type = "success") => {
    alertBox.style.display = "block";
    alertBox.className = type;
    alertBox.innerHTML = message;

    // scroll suave até o alerta
    alertBox.scrollIntoView({ behavior: "smooth", block: "center" });

    // some após 5 segundos
    setTimeout(() => {
      alertBox.style.display = "none";
    }, 5000);
  };

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    const formData = new FormData(this);

    const data = {
      name: formData.get("Nome"),
      email: formData.get("Email"),
      phone: formData.get("Telefone"),
      service: formData.get("Serviço"),
      message: formData.get("Mensagem"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showAlert(
          "✅ Mensagem enviada com sucesso! Entraremos em contato em breve.",
          "success",
        );
        this.reset();
      } else {
        const errorMsg = result.errors
          ? result.errors.map((err) => err.msg).join("<br>")
          : result.message || "Erro ao enviar mensagem.";

        showAlert("❌ " + errorMsg, "error");
      }
    } catch (error) {
      console.error("Erro:", error);
      showAlert("❌ Erro de conexão com o servidor.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add animation classes to elements
document
  .querySelectorAll(".service-card, .result-card, .credential, .contact-item")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

// CSS class for animation
const style = document.createElement("style");
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ========================================
// ACTIVE NAV LINK ON SCROLL
// ========================================
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});
