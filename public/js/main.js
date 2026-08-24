// Pousa — site estático. Nenhuma chamada de API: os dados das hospedagens são
// fixos aqui embaixo, e os favoritos ficam salvos só no navegador de quem visita
// (localStorage), sem login e sem banco de dados.

const LISTINGS = [
  { id: 1, title: 'Cabana na Serra da Mantiqueira', location: 'Monte Verde, MG', price: 420, rating: 4.9, tag: 'Vista da montanha', color_from: '#2c5f5a', color_to: '#0f3d3e', emoji: '🏔️' },
  { id: 2, title: 'Casa de vidro na Praia do Rosa', location: 'Imbituba, SC', price: 680, rating: 4.95, tag: 'Frente ao mar', color_from: '#ff8c69', color_to: '#ff6b4a', emoji: '🌊' },
  { id: 3, title: 'Loft no coração da Vila Madalena', location: 'São Paulo, SP', price: 310, rating: 4.7, tag: 'Vida urbana', color_from: '#5a4a7a', color_to: '#3a2c5a', emoji: '🏙️' },
  { id: 4, title: 'Chalé entre araucárias', location: 'Gramado, RS', price: 550, rating: 4.98, tag: 'Lareira a lenha', color_from: '#3e5c3a', color_to: '#1f3a1c', emoji: '🌲' },
  { id: 5, title: 'Rede na varanda, Chapada', location: 'Chapada Diamantina, BA', price: 290, rating: 4.85, tag: 'Nascer do sol', color_from: '#ffd9a0', color_to: '#ff6b4a', emoji: '🌅' },
  { id: 6, title: 'Palafita sobre o rio', location: 'Alter do Chão, PA', price: 380, rating: 4.9, tag: 'Amazônia', color_from: '#1b6b6b', color_to: '#0d3d3d', emoji: '🛶' },
  { id: 7, title: 'Container design na duna', location: 'Jericoacoara, CE', price: 470, rating: 4.92, tag: 'Pôr do sol', color_from: '#e0663f', color_to: '#a8402a', emoji: '🏜️' },
  { id: 8, title: 'Fazenda de café centenária', location: 'Vale do Café, RJ', price: 340, rating: 4.8, tag: 'Sítio histórico', color_from: '#7a5c3a', color_to: '#4a3520', emoji: '☕' },
];

const FAVORITES_KEY = 'pousa_favorites';

let favoriteIds = loadFavorites();
let activeTag = 'todos';
let onlyFavorites = false;

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    return new Set();
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favoriteIds)));
  } catch (e) {
    // localStorage indisponível (ex: modo privado) — favoritos não persistem, sem problema
  }
}

function renderListings() {
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;

  const term = (document.getElementById('searchDestino')?.value || '').toLowerCase().trim();

  const filtered = LISTINGS.filter(l => {
    const matchesTag = activeTag === 'todos' || l.tag === activeTag;
    const matchesTerm = !term || l.title.toLowerCase().includes(term) || l.location.toLowerCase().includes(term);
    const matchesFav = !onlyFavorites || favoriteIds.has(l.id);
    return matchesTag && matchesTerm && matchesFav;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty">${onlyFavorites ? 'Você ainda não favoritou nenhuma hospedagem.' : 'Nenhuma hospedagem encontrada por aqui. Tenta outro destino ou filtro.'}</div>`;
    return;
  }

  grid.innerHTML = filtered.map(cardTemplate).join('');

  grid.querySelectorAll('.card__fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      if (favoriteIds.has(id)) {
        favoriteIds.delete(id);
        btn.classList.remove('active');
        btn.textContent = '♡';
      } else {
        favoriteIds.add(id);
        btn.classList.add('active');
        btn.textContent = '♥';
      }
      saveFavorites();
      if (onlyFavorites) renderListings();
    });
  });
}

function cardTemplate(l) {
  const isFav = favoriteIds.has(l.id);
  return `
    <article class="card" data-id="${l.id}">
      <div class="card__media" style="background: linear-gradient(135deg, ${l.color_from}, ${l.color_to})">
        <span>${l.emoji}</span>
        <button class="card__fav ${isFav ? 'active' : ''}" data-id="${l.id}" aria-label="Favoritar">${isFav ? '♥' : '♡'}</button>
        <span class="card__tag">${escapeHtml(l.tag || '')}</span>
      </div>
      <div class="card__body">
        <div class="card__top">
          <div class="card__title">${escapeHtml(l.title)}</div>
          <div class="card__rating">★ ${l.rating.toFixed(2)}</div>
        </div>
        <div class="card__location">${escapeHtml(l.location)}</div>
        <div class="card__price"><strong>R$ ${l.price}</strong> / noite</div>
      </div>
    </article>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function setupChips() {
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      onlyFavorites = false;
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeTag = chip.dataset.tag;
      renderListings();
    });
  });
}

function setupSearch() {
  const btn = document.getElementById('searchBtn');
  const input = document.getElementById('searchDestino');
  if (btn) btn.addEventListener('click', () => {
    document.getElementById('explorar').scrollIntoView({ behavior: 'smooth' });
    renderListings();
  });
  if (input) input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') renderListings();
  });
}

function setupFavLink() {
  const link = document.getElementById('favLink');
  if (!link) return;
  link.addEventListener('click', () => {
    onlyFavorites = !onlyFavorites;
    link.classList.toggle('active', onlyFavorites);
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    renderListings();
  });
}

(function init() {
  setupChips();
  setupSearch();
  setupFavLink();
  renderListings();
})();