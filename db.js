const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'pousa.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    price INTEGER NOT NULL,
    rating REAL NOT NULL,
    tag TEXT,
    color_from TEXT,
    color_to TEXT,
    emoji TEXT
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    listing_id INTEGER NOT NULL,
    UNIQUE(user_id, listing_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(listing_id) REFERENCES listings(id)
  );
`);

const count = db.prepare('SELECT COUNT(*) AS c FROM listings').get().c;
if (count === 0) {
  const seed = db.prepare(`
    INSERT INTO listings (title, location, price, rating, tag, color_from, color_to, emoji)
    VALUES (@title, @location, @price, @rating, @tag, @color_from, @color_to, @emoji)
  `);
  const listings = [
    { title: 'Cabana na Serra da Mantiqueira', location: 'Monte Verde, MG', price: 420, rating: 4.9, tag: 'Vista da montanha', color_from: '#2c5f5a', color_to: '#0f3d3e', emoji: '🏔️' },
    { title: 'Casa de vidro na Praia do Rosa', location: 'Imbituba, SC', price: 680, rating: 4.95, tag: 'Frente ao mar', color_from: '#ff8c69', color_to: '#ff6b4a', emoji: '🌊' },
    { title: 'Loft no coração da Vila Madalena', location: 'São Paulo, SP', price: 310, rating: 4.7, tag: 'Vida urbana', color_from: '#5a4a7a', color_to: '#3a2c5a', emoji: '🏙️' },
    { title: 'Chalé entre araucárias', location: 'Gramado, RS', price: 550, rating: 4.98, tag: 'Lareira a lenha', color_from: '#3e5c3a', color_to: '#1f3a1c', emoji: '🌲' },
    { title: 'Rede na varanda, Chapada', location: 'Chapada Diamantina, BA', price: 290, rating: 4.85, tag: 'Nascer do sol', color_from: '#ffd9a0', color_to: '#ff6b4a', emoji: '🌅' },
    { title: 'Palafita sobre o rio', location: 'Alter do Chão, PA', price: 380, rating: 4.9, tag: 'Amazônia', color_from: '#1b6b6b', color_to: '#0d3d3d', emoji: '🛶' },
    { title: 'Container design na duna', location: 'Jericoacoara, CE', price: 470, rating: 4.92, tag: 'Pôr do sol', color_from: '#e0663f', color_to: '#a8402a', emoji: '🏜️' },
    { title: 'Fazenda de café centenária', location: 'Vale do Café, RJ', price: 340, rating: 4.8, tag: 'Sítio histórico', color_from: '#7a5c3a', color_to: '#4a3520', emoji: '☕' },
  ];
  const insertMany = db.transaction((rows) => rows.forEach((r) => seed.run(r)));
  insertMany(listings);
}

module.exports = db;
