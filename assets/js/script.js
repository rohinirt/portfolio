'use strict';

// ================= TOGGLE FUNCTION =================
const toggle = (el) => el.classList.toggle("active");

// ================= SIDEBAR =================
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebarBtn) {
  sidebarBtn.addEventListener("click", () => toggle(sidebar));
}

// ================= TESTIMONIAL MODAL =================
const modalContainer = document.querySelector("[data-modal-container]");
const overlay = document.querySelector("[data-overlay]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");

const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");
const modalRole = document.querySelector("[data-modal-role]");

const testimonials = document.querySelectorAll("[data-testimonials-item]");

const openModal = () => {
  modalContainer.classList.add("active");
  overlay.classList.add("active");
};

const closeModal = () => {
  modalContainer.classList.remove("active");
  overlay.classList.remove("active");
};

testimonials.forEach(item => {
  item.addEventListener("click", () => {
    modalImg.src = item.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = item.querySelector("[data-testimonials-avatar]").alt;

    modalTitle.innerHTML = item.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = item.querySelector("[data-testimonials-text]").innerHTML;

    const role = item.querySelector(".testimonials-role");
    modalRole.innerHTML = role ? role.innerHTML : "";

    openModal();
  });
});

modalCloseBtn?.addEventListener("click", closeModal);
overlay?.addEventListener("click", closeModal);

// ================= PROJECTS FILTER (SCOPED) =================
const projectsSection = document.querySelector('[data-page="projects"]');

if (projectsSection) {

  const filterBtns = projectsSection.querySelectorAll("[data-filter-btn]");
  const filterItems = projectsSection.querySelectorAll("[data-filter-item]");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {

      // button active state
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const selected = btn.innerText.toLowerCase().trim();

      // filtering logic
      filterItems.forEach(item => {
        const category = item.dataset.category;

        if (selected === "all" || selected === category) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });

    });
  });
}

// ================= CONTACT FORM =================
const form = document.querySelector("[data-form]");
const inputs = document.querySelectorAll("[data-form-input]");
const submitBtn = document.querySelector("[data-form-btn]");

if (form) {
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      form.checkValidity()
        ? submitBtn.removeAttribute("disabled")
        : submitBtn.setAttribute("disabled", "");
    });
  });
}

// ================= PAGE NAVIGATION =================
const navLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navLinks.forEach((link, index) => {
  link.addEventListener("click", () => {

    navLinks.forEach(l => l.classList.remove("active"));
    pages.forEach(p => p.classList.remove("active"));

    link.classList.add("active");
    pages[index].classList.add("active");

    window.scrollTo(0, 0);
  });
});
