// ==== Supabase Setup ====
const SUPABASE_URL = "https://jubiilhzffyrpmkxtmwk.supabase.co"; // Deine Supabase-URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1YmlpbGh6ZmZ5cnBta3h0bXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MTk4NDgsImV4cCI6MjA3ODM5NTg0OH0.MP4jIu9-VCyDhGYXfMHVJab3NmtzkTkNiy5xZq8sCC8";        // Dein Anon Key
const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===============================
// Funktion zum Laden der Deals
// ===============================
async function loadDeals() {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .order('restaurant', { ascending: true });

  if (error) {
    console.error("Fehler beim Laden der Deals:", error);
    document.getElementById('deals-container').innerHTML = "<p>Fehler beim Laden der Deals.</p>";
    return;
  }

  const container = document.getElementById('deals-container');
  container.innerHTML = "";

  data.forEach(deal => {
    const card = document.createElement('div');
    card.className = "deal-card";
    card.innerHTML = `
      <img src="${deal.image_url}" alt="${deal.title}" onerror="this.src='https://via.placeholder.com/250x150?text=Kein+Bild'">
      <h3>${deal.title}</h3>
      <p>${deal.description || ''}</p>
      <small>Restaurant: ${deal.restaurant}</small>
    `;
    container.appendChild(card);
  });
}

// ===============================
// Seite laden
// ===============================
document.addEventListener('DOMContentLoaded', loadDeals);