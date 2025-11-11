// ==== Supabase Setup ====
const SUPABASE_URL = "https://jubiilhzffyrpmkxtmwk.supabase.co"; // Deine Supabase-URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1YmlpbGh6ZmZ5cnBta3h0bXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MTk4NDgsImV4cCI6MjA3ODM5NTg0OH0.MP4jIu9-VCyDhGYXfMHVJab3NmtzkTkNiy5xZq8sCC8";        // Dein Anon Key
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==== Deals laden & anzeigen ====
async function loadDeals() {
  const container = document.getElementById("deal-sections");
  container.innerHTML = "<p class='loading'>🔄 Lade aktuelle Deals ...</p>";

  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .gte("valid_until", new Date().toISOString().slice(0, 10))
    .order("restaurant");

  if (error) {
    console.error("Fehler beim Laden:", error);
    container.innerHTML = "<p>❌ Fehler beim Laden der Deals.</p>";
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = "<p>Keine aktuellen Deals gefunden.</p>";
    return;
  }

  // Nach Restaurant gruppieren
  const grouped = data.reduce((acc, d) => {
    (acc[d.restaurant] = acc[d.restaurant] || []).push(d);
    return acc;
  }, {});

  // HTML rendern
  container.innerHTML = Object.entries(grouped)
    .map(([rest, deals]) => `
      <section id="${rest}">
        <h2>${rest.charAt(0).toUpperCase() + rest.slice(1)}</h2>
        <div class="slider" data-slider="${rest}">
          <div class="slides">
            ${deals.map(d => `
              <div class="slide">
                <img src="${d.image_url}" alt="${d.title}">
                <p><strong>${d.title}</strong><br>${d.description}</p>
              </div>`).join("")}
          </div>
          <div class="controls">
            <button class="prev">⟨</button>
            <button class="next">⟩</button>
          </div>
        </div>
      </section>
    `).join("");

  initSliders();
}

// ==== Slider-Logik ====
function initSliders() {
  document.querySelectorAll(".slider").forEach(slider => {
    const slides = slider.querySelector(".slides");
    const count = slides.children.length;
    let index = 0;

    const update = () => slides.style.transform = `translateX(-${index * 100}%)`;
    slider.querySelector(".next").onclick = () => { index = (index + 1) % count; update(); };
    slider.querySelector(".prev").onclick = () => { index = (index - 1 + count) % count; update(); };
    setInterval(() => { index = (index + 1) % count; update(); }, 6000);
  });
}

// ==== Start ====
loadDeals();
