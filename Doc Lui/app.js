const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Storage keys
const themeKey = "docLuiTheme";
const appointmentKey = "docLuiAppointments";

// =====================================
// PAGE SKELETON LOADING SCREEN
// =====================================  
function initPageSkeleton() {
  if (document.querySelector(".page-skeleton")) return;
  const skeleton = document.createElement("div");
  skeleton.className = "page-skeleton";
  skeleton.setAttribute("aria-label", "Loading page");
  const header = document.querySelector("header");
  if (header) skeleton.style.top = `${header.getBoundingClientRect().height}px`;
  skeleton.innerHTML = `
    <div class="skeleton-content">
      <div class="skeleton-block skeleton-hero"></div>
      <div class="skeleton-grid">
        <div class="skeleton-block skeleton-card"></div>
        <div class="skeleton-block skeleton-card"></div>
        <div class="skeleton-block skeleton-card"></div>
        <div class="skeleton-block skeleton-card"></div>
      </div>
    </div>`;
  document.body.prepend(skeleton);

  const hideSkeleton = () => {
    window.setTimeout(() => {
      skeleton.classList.add("is-hidden");
      window.setTimeout(() => skeleton.remove(), 400);
    }, 550);
  };

  if (document.readyState === "complete") hideSkeleton();
  else window.addEventListener("load", hideSkeleton, { once: true });
}

// =====================================
// LIGHT AND DARK THEME
// =====================================
function applyTheme() {
  const dark = localStorage.getItem(themeKey) === "dark";
  document.documentElement.classList.toggle("dark", dark);
  $$(".theme-icon").forEach(icon => icon.textContent = dark ? "☀" : "☾");
}

function initTheme() {
  applyTheme();
  $$(".theme-toggle").forEach(button => button.addEventListener("click", () => {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem(themeKey, next);
    applyTheme();
  }));
}

// =====================================
// MOBILE NAVIGATION MENU
// =====================================
function initMobileMenu() {
  const button = $("#menuButton");
  const menu = $("#mobileMenu");
  if (!button || !menu) return;
  button.addEventListener("click", () => menu.classList.toggle("hidden"));
}

// =====================================
// HOME PAGE HERO CAROUSEL
// =====================================
function initCarousel() {
  const slides = $$(".hero-slide");
  if (!slides.length) return;
  let current = 0;
  const images = [
    { src: "assets/cat.jpg", alt: "Cat receiving veterinary care" },
    { src: "assets/dog.jpg", alt: "Puppy receiving gentle care" },
    { src: "assets/logo.jpg", alt: "Doc Lui veterinary clinic logo" }
  ];
  $("#heroCaption")?.remove();
  const show = index => {
    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
    $$(".carousel-dot").forEach((dot, i) => {
      dot.className = "carousel-dot h-2 rounded-full transition-all " + (i === index ? "w-7 bg-green-600" : "w-2 bg-green-200");
    });
    const status = $("#carouselStatus");
    if (status) status.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    const visual = $(".hero-visual");
    const heroImage = $("#heroImage");
    if (visual && heroImage) {
      visual.classList.add("is-changing");
      window.setTimeout(() => {
        heroImage.src = images[index].src;
        heroImage.alt = images[index].alt;
        visual.classList.remove("is-changing");
      }, 180);
    }
  };
  const move = step => { current = (current + step + slides.length) % slides.length; show(current); };
  $("#carouselPrev")?.addEventListener("click", () => move(-1));
  $("#carouselNext")?.addEventListener("click", () => move(1));
  $$(".carousel-dot").forEach((dot, i) => dot.addEventListener("click", () => { current = i; show(i); }));
  show(0);
  setInterval(() => move(1), 6000);
}

// =====================================
// APPOINTMENT LOCAL STORAGE
// =====================================
function getAppointments() {
  try { return JSON.parse(localStorage.getItem(appointmentKey)) || []; }
  catch { return []; }
}
function saveAppointments(items) { localStorage.setItem(appointmentKey, JSON.stringify(items)); }

// =====================================
// BOOKING FORM AND APPOINTMENT SUBMISSION
// =====================================
function initBooking() {
  const form = $("#bookingForm");
  if (!form) return;
  const params = new URLSearchParams(location.search);
  const serviceSelect = $("#service");
  const bookingImage = $("#bookingServiceImage");
  const serviceImages = {
    "Major and minor surgeries": { src: "assets/surgery.jpg", alt: "Major and minor veterinary surgery" },
    "Pet grooming and pet boarding": { src: "assets/pet-grooming.jpg", alt: "Pet grooming and boarding" },
    "Check-ups and consultation": { src: "assets/consultation.jpg", alt: "Pet check-up and consultation" },
    "Laboratory, blood test, and ultrasound": { src: "assets/ultrasound.jpg", alt: "Veterinary laboratory and ultrasound" }
  };
  const updateBookingImage = () => {
    const selected = serviceImages[serviceSelect?.value];
    if (!bookingImage || !selected) return;
    bookingImage.src = selected.src;
    bookingImage.alt = selected.alt;
  };
  serviceSelect?.addEventListener("change", updateBookingImage);
  const date = $("#appointmentDate");
  if (date) {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    date.min = today.toISOString().slice(0, 10);
  }
  const editingId = params.get("edit");
  if (editingId) {
    const item = getAppointments().find(a => a.id === editingId);
    if (item) {
      for (const key of ["ownerName","phone","email","petName","petType","service","appointmentDate","appointmentTime","notes"]) {
        const field = $("#" + key);
        if (field) field.value = item[key] || "";
      }
      $("#bookingTitle").textContent = "Update appointment";
      $("#submitBooking").textContent = "Save changes";
    }
  } else {
    const selectedService = params.get("service");
    const serviceSelect = $("#service");
    if (selectedService && serviceSelect) {
      const matchingOption = [...serviceSelect.options].find(option => option.value === selectedService);
      if (matchingOption) serviceSelect.value = selectedService;
    }
  }
  updateBookingImage();
  form.addEventListener("submit", event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    const phone = String(values.phone || "");
    const isLocalPhone = /^09\d{9}$/.test(phone);
    if (!isLocalPhone) {
      $("#formError").textContent =
        "Enter exactly 11 digits starting with 09.";
      $("#formError").classList.remove("hidden");
      $("#phone").focus();
      return;
    }

    const notes = String(values.notes || "").trim();
    if (notes.length < 10) {
      $("#formError").textContent =
        "Please enter at least 10 characters in Notes.";
      $("#formError").classList.remove("hidden");
      $("#notes").focus();
      return;
    }
    $("#formError").classList.add("hidden");
    const appointments = getAppointments();
    const id = editingId || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
    const record = { id, ...values, status: editingId ? (appointments.find(a => a.id === editingId)?.status || "Pending") : "Pending", createdAt: new Date().toISOString() };
    const next = editingId ? appointments.map(a => a.id === editingId ? record : a) : [...appointments, record];
    saveAppointments(next);
    $("#bookingSuccess").classList.remove("hidden");

    // Show the loading spinner and disable the submit button after success.
    const sideLoader = $("#bookingSideLoader");
    const submitButton = $("#submitBooking");
    if (sideLoader) sideLoader.classList.remove("hidden");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Request saved";
    }
    form.reset();
    setTimeout(() => location.href = "requests.html", 700);
  });
}

// =====================================
// APPOINTMENT REQUESTS LIST
// =====================================
function initRequests() {
  const list = $("#requestList");
  if (!list) return;
  const render = () => {
    const filter = $("#requestSearch")?.value.toLowerCase() || "";
    const allAppointments = getAppointments();
    const items = allAppointments.filter(a => `${a.ownerName} ${a.petName} ${a.petType} ${a.service}`.toLowerCase().includes(filter));
    if (!items.length) {
      list.innerHTML = `<div class="rounded-2xl border border-dashed border-green-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800"><p class="font-bold text-slate-700 dark:text-slate-200">No appointments yet</p><p class="mt-1 text-sm text-slate-500">Create your first booking to see it here.</p></div>`;
      return;
    }
    list.innerHTML = items.map(a => {
      const petType = String(a.petType || "").trim().toLowerCase();
      const petImage = petType === "cat"
        ? { src: "assets/cat.jpg", alt: `Cat named ${a.petName}` }
        : petType === "dog"
          ? { src: "assets/dog.jpg", alt: `Dog named ${a.petName}` }
          : { src: "", alt: "" };
      return `
      <article class="service-card overflow-hidden rounded-2xl border border-slate-100 bg-white soft-shadow dark:border-slate-700 dark:bg-slate-800">
        <div class="grid sm:grid-cols-[120px_1fr]">
          ${petImage.src ? `<img src="${petImage.src}" class="h-36 w-full object-cover sm:h-full sm:min-h-[220px]" alt="${escapeHtml(petImage.alt)}">` : `<div class="flex h-36 items-center justify-center bg-green-50 text-4xl sm:h-full sm:min-h-[220px] dark:bg-slate-900" aria-label="${escapeHtml(a.petType)} pet">🐾</div>`}
          <div class="p-5">
            <div class="flex items-start justify-between gap-3">
              <div><p class="text-xs font-bold uppercase tracking-wider text-green-600">${escapeHtml(a.service)}</p><h3 class="mt-1 text-lg font-bold text-slate-900 dark:text-white">Request #${allAppointments.findIndex(item => item.id === a.id) + 1}</h3></div>
              <span class="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">${escapeHtml(a.status)}</span>
            </div>
            <div class="mt-2 space-y-1 text-sm text-slate-500">
              <p><span class="font-bold text-slate-700 dark:text-slate-300">Owner:</span> ${escapeHtml(a.ownerName)}</p>
              <p><span class="font-bold text-slate-700 dark:text-slate-300">Pet:</span> ${escapeHtml(a.petName)}</p>
              <p><span class="font-bold text-slate-700 dark:text-slate-300">Pet type:</span> ${escapeHtml(a.petType)}</p>
              <p>${escapeHtml(a.appointmentDate)} at ${escapeHtml(a.appointmentTime)}</p>
              ${a.notes ? `<p class="mt-2 rounded-lg bg-slate-50 px-3 py-2 leading-5 dark:bg-slate-900"><span class="font-bold text-slate-700 dark:text-slate-300">Notes:</span> ${escapeHtml(a.notes)}</p>` : ""}
            </div>
            <div class="mt-4 flex gap-2">
              <a href="booking.html?edit=${encodeURIComponent(a.id)}" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-green-500 dark:border-slate-600 dark:text-slate-200">Edit</a>
              <button data-delete="${a.id}" class="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-300">Delete</button>
            </div>
          </div>
        </div>
      </article>`;
    }).join("");
    $$("[data-delete]", list).forEach(button => button.addEventListener("click", () => {
      if (confirm("Delete this appointment?")) {
        saveAppointments(getAppointments().filter(a => a.id !== button.dataset.delete));
        render();
      }
    }));
  };
  $("#requestSearch")?.addEventListener("input", render);
  render();
}

// Prevent submitted appointment content from breaking the request cards.
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char]));
}

// =====================================
// CONTACT PAGE FAQ ACCORDION
// =====================================
function initAccordions() {
  $$(".faq-button").forEach(button => button.addEventListener("click", () => {
    const panel = button.nextElementSibling;
    const open = !panel.classList.contains("hidden");
    $$(".faq-panel").forEach(item => item.classList.add("hidden"));
    $$(".faq-plus").forEach(icon => icon.textContent = "▼");
    if (!open) { panel.classList.remove("hidden"); $(".faq-plus", button).textContent = "▲"; }
  }));
}

// =====================================
// HOME PAGE SERVICE PREVIEW MODAL
// =====================================
function initServiceModal() {
  const modal = $("#serviceModal");
  if (!modal) return;

  const modalImage = $("#serviceModalImage");
  const modalTitle = $("#serviceModalTitle");
  const modalDescription = $("#serviceModalDescription");
  const closeButton = $("#serviceModalClose");

  const serviceDetails = {
    checkups: {
      title: "Check-ups and consultation",
      description: "Physical examinations, health assessments, and personalized veterinary advice.",
      image: "assets/consultation.jpg"
    },
    grooming: {
      title: "Pet grooming",
      description: "Professional bathing, grooming, nail care, and coat maintenance.",
      image: "assets/pet-grooming.jpg"
    }
  };

  const openModal = card => {
    const details = serviceDetails[card.dataset.serviceModal];
    if (!details) return;
    modalImage.src = details.image;
    modalImage.alt = details.title;
    modalTitle.textContent = details.title;
    modalDescription.textContent = details.description;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  };

  $$("[data-service-modal]").forEach(card => {
    card.addEventListener("click", () => openModal(card));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(card);
      }
    });
  });

  closeButton?.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });
  modal.addEventListener("click", event => {
    if (event.target === modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  });
}

// =====================================
// SERVICES PAGE SEARCH FILTER
// =====================================
function initServiceSearch() {
  const search = $("#serviceSearch");
  if (!search) return;
  const filterCards = () => {
    const term = search.value.toLowerCase();
    $$(".service-card").forEach(card => card.classList.toggle("hidden", !card.textContent.toLowerCase().includes(term)));
  };
  search.addEventListener("input", filterCards);
  $$(".filter-button").forEach(button => button.addEventListener("click", () => {
    $$(".filter-button").forEach(item => item.classList.remove("bg-green-700", "text-white"));
    button.classList.add("bg-green-700", "text-white");
    search.value = button.dataset.filter === "All" ? "" : button.dataset.filter;
    filterCards();
  }));
}

initPageSkeleton();

// Initialize all JavaScript features after the page loads.
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileMenu();
  initCarousel();
  initBooking();
  initRequests();
  initAccordions();
  initServiceModal();
  initServiceSearch();
});
