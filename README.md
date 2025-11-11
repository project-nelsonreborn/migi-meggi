# 🍔 Top Deals Schweiz

Zeigt automatisch aktuelle Deals von McDonald's Schweiz, Burger King Schweiz und Migros Zürich – live aus Supabase.

## 🚀 Setup

1. Erstelle ein Supabase-Projekt unter [https://supabase.com](https://supabase.com)
2. Lege eine Tabelle `deals` an mit Spalten:

| Spalte | Typ | Beispiel |
|---------|------|----------|
| id | bigint (PK) | auto |
| restaurant | text | "mcdonalds" |
| title | text | "Big Mac Menü CHF 9.90" |
| description | text | "Nur heute in der App" |
| image_url | text | "https://..." |
| valid_until | date | "2025-11-11" |

3. Setze in `script.js` deine `SUPABASE_URL` & `SUPABASE_ANON_KEY` ein.
4. Aktiviere in Supabase Row Level Security (RLS) und erlaube nur SELECT:

```sql
alter table deals enable row level security;
create policy "Public read access" on deals for select using (true);
