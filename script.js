const pages = document.querySelectorAll(".app-page");
const homePage = document.getElementById("homePage");
const modal = document.getElementById("materialModal");
const modalContent = document.getElementById("modalContent");
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

function showPage(pageId, push = true) {
  pages.forEach(page => page.classList.remove("active"));
  const target = document.getElementById(pageId) || homePage;
  target.classList.add("active");

  if (push) {
    history.pushState({page: target.id}, "", target.id === "homePage" ? location.pathname : "#" + target.id.replace("Page",""));
  }

  window.scrollTo({top: 0, behavior: "instant"});
  navLinks?.classList.remove("open");
  closeModal(false);
}

document.querySelectorAll("[data-page]").forEach(btn => {
  btn.addEventListener("click", () => showPage(btn.dataset.page));
});

document.querySelectorAll("[data-home]").forEach(btn => {
  btn.addEventListener("click", () => showPage("homePage"));
});

document.querySelector("[data-scroll-top]")?.addEventListener("click", () => {
  document.querySelector(".home-topics")?.scrollIntoView({behavior:"smooth"});
});

menuBtn?.addEventListener("click", () => navLinks?.classList.toggle("open"));

window.addEventListener("popstate", () => {
  const hash = location.hash.replace("#", "");
  showPage(hash ? hash + "Page" : "homePage", false);
});

function openModal(templateId) {
  const template = document.getElementById(templateId);
  if (!template) return;
  modalContent.innerHTML = "";
  modalContent.appendChild(template.content.cloneNode(true));
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  window.scrollTo({top:0, behavior:"instant"});
  setupCalculator();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalContent.innerHTML = "";
}

document.addEventListener("click", (e) => {
  const card = e.target.closest("[data-modal]");
  if (card) openModal(card.dataset.modal);

  if (e.target.closest("[data-close-modal]")) closeModal();

  const img = e.target.closest(".modal-posters img");
  if (img) {
    window.open(img.src, "_blank");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

function setupCalculator() {
  const calculateBtn = document.getElementById("calculateCycle");
  if (!calculateBtn) return;

  calculateBtn.addEventListener("click", () => {
    const dateValue = document.getElementById("lastPeriod").value;
    const cycle = Number(document.getElementById("cycleLength").value);
    const result = document.getElementById("cycleResult");

    if (!dateValue || !cycle || cycle < 21 || cycle > 45) {
      result.innerHTML = `
        <span class="result-icon">🌸</span>
        <h3>Data belum lengkap</h3>
        <p>Masukkan tanggal menstruasi terakhir dan siklus antara 21–45 hari.</p>
      `;
      return;
    }

    const last = new Date(dateValue + "T00:00:00");
    const next = new Date(last);
    next.setDate(next.getDate() + cycle);

    const ovulation = new Date(next);
    ovulation.setDate(ovulation.getDate() - 14);

    const fertileStart = new Date(ovulation);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulation);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    const fmt = d => d.toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric"
    });

    result.innerHTML = `
      <span class="result-icon">🌷</span>
      <h3>Perkiraan siklus</h3>
      <p><strong>Menstruasi berikutnya:</strong><br>${fmt(next)}</p>
      <p><strong>Perkiraan masa subur:</strong><br>${fmt(fertileStart)} – ${fmt(fertileEnd)}</p>
      <small>Hasil ini hanya perkiraan berdasarkan data yang dimasukkan dan tidak dapat digunakan sebagai diagnosis atau metode kontrasepsi yang pasti.</small>
    `;
  });
}

// Tampilkan Home saat pertama kali dibuka, atau halaman sesuai hash.
(function initPage() {
  const hash = location.hash.replace("#", "");
  const requested = hash ? document.getElementById(hash + "Page") : null;
  pages.forEach(page => page.classList.remove("active"));
  (requested || homePage).classList.add("active");
  window.scrollTo(0, 0);
})();
