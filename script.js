// ==== Supabase Setup ====
const SUPABASE_URL = "https://jubiilhzffyrpmkxtmwk.supabase.co"; // Deine Supabase-URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1YmlpbGh6ZmZ5cnBta3h0bXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MTk4NDgsImV4cCI6MjA3ODM5NTg0OH0.MP4jIu9-VCyDhGYXfMHVJab3NmtzkTkNiy5xZq8sCC8";        // Dein Anon Key
// ===============================
// Supabase Setup
// ===============================
               // <--- ersetzen

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===============================
// Slider Variablen
// ===============================
let currentIndex = 0;
let dealsData = [];

// ===============================
// Funktion: Deals laden (nur aktuelle)
// ===============================
async function loadDeals() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .gte('valid_until', today)   // Nur gültige Deals
    .order('restaurant', { ascending: true });

  if (error) {
    console.error("Supabase Error:", error);
    document.getElementById('slider').innerHTML = `<p>Fehler: ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    document.getElementById('slider').innerHTML = "<p>Keine aktuellen Deals gefunden.</p>";
    return;
  }

  dealsData = data;
  renderSlider();
}

// ===============================
// Funktion: Slider rendern
// ===============================
function renderSlider() {
  const slider = document.getElementById('slider');
  slider.innerHTML = "";

  dealsData.forEach(deal => {
    const card = document.createElement('div');
    card.className = "deal-card";
    card.innerHTML = `
      <img src="${deal.image_url}" alt="${deal.title}" onerror="this.src='https://via.placeholder.com/250x150?text=Kein+Bild'">
      <h3>${deal.title}</h3>
      <p>${deal.description || ''}</p>
      <small>Restaurant: ${deal.restaurant}</small>
    `;
    slider.appendChild(card);
  });

  updateSliderPosition();
}

// ===============================
// Funktion: Slider Position
// ===============================
function updateSliderPosition() {
  const slider = document.getElementById('slider');
  const offset = -currentIndex * 270; // Kartenbreite + margin
  slider.style.transform = `translateX(${offset}px)`;
}

// ===============================
// Navigation
// ===============================
function nextSlide() {
  if (currentIndex < dealsData.length - Math.floor(800/270)) {
    currentIndex++;
    updateSliderPosition();
  }
}

function prevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
    updateSliderPosition();
  }
}

// ===============================
// Auto-Slide alle 5 Sekunden
// ===============================
setInterval(() => {
  if (dealsData.length === 0) return;
  if (currentIndex < dealsData.length - Math.floor(800/270)) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateSliderPosition();
}, 5000);

// ===============================
// Seite laden
// ===============================
document.addEventListener('DOMContentLoaded', loadDeals);
