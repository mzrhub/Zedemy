/* =====================================================================
   ZEDEMY NURSING TEST PORTAL - script.js
   ---------------------------------------------------------------------
   TO ADD A NEW TEST:    add { name: "Test 6", url: "https://forms.gle/..." }
                         to the `tests` list of a subject below.
   TO ADD A NEW SUBJECT: copy one subject block, change the values.
   Counts, cards, filters and search update automatically.
   ===================================================================== */
const SUBJECTS = [
  {
    id: "ahn", short: "AHN", name: "Adult Health Nursing",
    icon: "fa-user-nurse",
    description: "Care of adult patients across common medical-surgical conditions.",
    fullBook: "https://forms.gle/ckEfEEaADFMU6NzG7",   // set to null if no full-book test
    tests: [
      { name: "Test 1 (Unit 1)", url: "https://forms.gle/M9rejJ7P3MgDDNJm6" },
      { name: "Test 2", url: "https://forms.gle/kq2D6AGX8ggjhLg96" },
      { name: "Test 3", url: "https://forms.gle/AcvwiwCHca6vq6Ej8" },
      { name: "Test 4", url: "https://forms.gle/FCnCFg9q7bfFmd5EA" },
      { name: "Test 5", url: "https://forms.gle/FoqVXt1LLUKEErYM9" },
      { name: "Test 6", url: "https://forms.gle/k8JMD2YzTXhb6ztZ6" },
      { name: "Test 7", url: "https://forms.gle/xKr9czMZpMvY7nmE7" },
      { name: "Test 8", url: "https://forms.gle/PsTFv8Ve2LSMjKXp8" },
      { name: "Test 9", url: "https://forms.gle/3eTm9ab79uQ2NH4NA" }
    ]
  },
  {
    id: "pharma", short: "Pharmacology", name: "Pharmacology",
    icon: "fa-pills",
    description: "Drug classes, actions, side effects and safe nursing administration.",
    fullBook: "https://forms.gle/GA4x8JgwnTjwoq348",
    tests: [
      { name: "Test 1", url: "https://forms.gle/efUCmCN9gWwZsHc37" },
      { name: "Test 2", url: "https://forms.gle/13EP3KzPnd1JMA7W6" },
      { name: "Test 3", url: "https://forms.gle/9PQByYP6KnaD3LUTA" },
      { name: "Test 4", url: "https://forms.gle/fF8VXgKx47PdX9dE6" },
      { name: "Test 5", url: "https://forms.gle/g2fT4rGyZ1VBpMah9" }
    ]
  },
  {
    id: "ha", short: "HA", name: "Health Assessment",
    icon: "fa-stethoscope",
    description: "History taking and head-to-toe physical examination skills.",
    fullBook: null,
    tests: [
      { name: "Test 1", url: "https://forms.gle/T3CTas9FgcPULF887" },
      { name: "Test 2", url: "https://forms.gle/ajEULnMrd3BEyzkJ9" },
      { name: "Test 3", url: "https://forms.gle/H42jn9vPB2XQZh6z9" },
      { name: "Test 4", url: "https://forms.gle/HWAtP8edY9vqF7AZ7" },
      { name: "Test 5", url: "https://forms.gle/n7xC9rHReistDEGo7" }
    ]
  },
  {
    id: "micro", short: "Microbiology", name: "Microbiology",
    icon: "fa-microscope",
    description: "Microorganisms, infection, immunity and infection control basics.",
    fullBook: null,
    tests: [
      { name: "Test 1", url: "https://forms.gle/eKBkfjYPLzeQtVHK7" },
      { name: "Test 2", url: "https://forms.gle/3oz8PgApv2MZNwET7" },
      { name: "Test 3", url: "https://forms.gle/JDkjbN8UpT7cyy9w7" }
    ]
  }
];

/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);
const countOf = (s) => s.tests.length + (s.fullBook ? 1 : 0);
const TOTAL = SUBJECTS.reduce((n, s) => n + countOf(s), 0);

/* Build a flat list of every test so filtering/search is simple */
const ALL = [];
SUBJECTS.forEach((s) => {
  if (s.fullBook) ALL.push({ subject: s, name: "Full Book Test", url: s.fullBook, full: true });
  s.tests.forEach((t) => ALL.push({ subject: s, name: t.name, url: t.url, full: false }));
});

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}
/* Every test link opens in a new tab with the exact URL from the data above */
function link(url, cls, html) {
  const a = el("a", cls, html);
  a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
  return a;
}

/* ---------- Counters ---------- */
$("statTests").textContent = TOTAL;
$("statSubjects").textContent = SUBJECTS.length;
$("totalCount").textContent = TOTAL;

/* ---------- Subject dashboard ---------- */
let activeFilter = "all";
const grid = $("subjectGrid");
SUBJECTS.forEach((s) => {
  const card = el("article", "subject-card");
  card.innerHTML = `<div class="icon"><i class="fa-solid ${s.icon}"></i></div>
    <h3>${s.name}</h3><p>${s.description}</p>
    <p class="count"><b>${countOf(s)}</b> tests available${s.fullBook ? ' <span class="badge">FULL BOOK</span>' : ""}</p>`;
  const row = el("div", "card-actions");
  const view = el("button", "btn btn-primary btn-sm", "View Tests");
  view.type = "button";
  view.onclick = () => { setFilter(s.id); $("tests").scrollIntoView(); };
  row.appendChild(view);
  if (s.fullBook) row.appendChild(link(s.fullBook, "btn btn-accent btn-sm", "Full Book Test"));
  card.appendChild(row);
  grid.appendChild(card);
});

/* ---------- Filter buttons ---------- */
const filters = $("filters");
[{ id: "all", label: "All Subjects" }, ...SUBJECTS.map((s) => ({ id: s.id, label: s.short }))].forEach((f) => {
  const b = el("button", "chip", f.label);
  b.type = "button"; b.dataset.id = f.id;
  b.onclick = () => setFilter(f.id);
  filters.appendChild(b);
});
function setFilter(id) { activeFilter = id; render(); }

/* ---------- Render tests (runs on every search / filter change) ---------- */
const sections = $("testSections");
function render() {
  const q = $("search").value.trim().toLowerCase();
  document.querySelectorAll(".chip").forEach((c) => {
    const on = c.dataset.id === activeFilter;
    c.classList.toggle("active", on); c.setAttribute("aria-pressed", on);
  });
  sections.innerHTML = "";
  let shown = 0;
  SUBJECTS.forEach((s) => {
    if (activeFilter !== "all" && activeFilter !== s.id) return;
    const subjectHit = (s.name + " " + s.short).toLowerCase().includes(q);
    const items = ALL.filter((t) => t.subject === s &&
      (subjectHit || (t.name + " " + (t.full ? "full book" : "practice test")).toLowerCase().includes(q)));
    if (!items.length) return;
    shown += items.length;
    const wrap = el("div", "test-group");
    wrap.appendChild(el("h3", "group-title", `<i class="fa-solid ${s.icon}"></i> ${s.name} <span>${countOf(s)} tests</span>`));
    const g = el("div", "test-grid");
    items.forEach((t) => {
      const c = el("div", "test-card" + (t.full ? " full" : ""));
      c.innerHTML = `${t.full ? '<span class="badge">FULL BOOK</span>' : ""}
        <h4>${s.short} – ${t.name}</h4>
        <ul><li>Subject: ${s.name}</li><li>Test Type: ${t.full ? "Full Book Test" : "Practice Test"}</li><li>Status: <b class="ok">Available</b></li></ul>`;
      c.appendChild(link(t.url, "btn " + (t.full ? "btn-accent" : "btn-primary") + " btn-block", "Attempt Test →"));
      g.appendChild(c);
    });
    wrap.appendChild(g);
    sections.appendChild(wrap);
  });
  $("noResults").hidden = shown > 0;
}
$("search").addEventListener("input", render);
$("clearBtn").onclick = () => { $("search").value = ""; activeFilter = "all"; render(); };
render();

/* ---------- Mobile menu ---------- */
const menu = $("menu"), menuBtn = $("menuBtn");
menuBtn.onclick = () => {
  const open = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
};
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
  menu.classList.remove("open"); menuBtn.setAttribute("aria-expanded", false);
}));

/* ---------- Back to top ---------- */
const toTop = $("toTop");
window.addEventListener("scroll", () => { toTop.hidden = window.scrollY < 600; }, { passive: true });
toTop.onclick = () => window.scrollTo({ top: 0 });
