let currentUser = null;
let allListings = [];
let favoriteIds = new Set();
let activeTag = 'todos';

async function fetchMe() {
  const res = await fetch('/api/me');
  const data = await res.json();
  currentUser = data.user;
  renderNavUser();
  if (currentUser) await fetchFavorites();
}

function renderNavUser() {
  const el = document.getElementById('navUser');
  if (!el) return;
  if (currentUser) {
    const initial = currentUser.name.trim().charAt(0).toUpperCase();
    el.innerHTML = `
      <span class="link-muted">Olá, ${escapeHtml(currentUser.name.split(' ')[0])}</span>
      <div class="avatar">${initial}</div>
      <button class="btn btn--ghost" id="logoutBtn">Sair</button>
    `;
    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await fetch('/api/logout', { method: 'POST' });
      window.location.reload();
    });
  } else {
    el.innerHTML = `
      <a href="/login.html" class="btn btn--ghost">Entrar</a>
      <a href="/register.html" class="btn btn--dark">Criar conta</a>
    `;
  }
}

async function fetchFavorites() {
  const res = await fetch('/api/favorites');
  if (!res.ok) return;
  const favs = await res.json();
  favoriteIds = new Set(favs.map(f => f.id));
}

async function fetchListings() {
  const res = await fetch('/api/listings');
  allListings = await res.json();
  renderListings();
}

function renderListings() {
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;

  const term = (document.getElementById('searchDestino')?.value || '').toLowerCase().trim();

  const filtered = allListings.filter(l => {
    const matchesTag = activeTag === 'todos' || l.tag === activeTag;
    const matchesTerm = !term || l.title.toLowerCase().includes(term) || l.location.toLowerCase().includes(term);
    return matchesTag && matchesTerm;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty">Nenhuma hospedagem encontrada por aqui. Tenta outro destino ou filtro.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(cardTemplate).join('');

  grid.querySelectorAll('.card__fav').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      if (!currentUser) {
        window.location.href = '/login.html';
        return;
      }
      if (favoriteIds.has(Number(id))) {
        await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
        favoriteIds.delete(Number(id));
        btn.classList.remove('active');
      } else {
        await fetch(`/api/favorites/${id}`, { method: 'POST' });
        favoriteIds.add(Number(id));
        btn.classList.add('active');
      }
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

(async function init() {
  setupChips();
  setupSearch();
  await fetchMe();
  await fetchListings();
})();
