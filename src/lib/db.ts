import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { Product } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const db = new Database(join(__dirname, '../../fourth-coffee.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price REAL NOT NULL,
    roast TEXT NOT NULL,
    origin TEXT NOT NULL,
    notes TEXT
  )
`);

const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO products (name, slug, description, price, roast, origin, notes) VALUES (?, ?, ?, ?, ?, ?, ?)');
  insert.run('Ethiopian Yirgacheffe', 'ethiopian-yirgacheffe', 'Bright and fruity with wine-like acidity.', 18.99, 'Light', 'Ethiopia', 'Blueberry, citrus, floral');
  insert.run('Colombian Supremo', 'colombian-supremo', 'Perfectly balanced with nutty sweetness.', 16.99, 'Medium', 'Colombia', 'Caramel, walnut, mild citrus');
  insert.run('Sumatra Mandheling', 'sumatra-mandheling', 'Full-bodied and earthy.', 17.99, 'Dark', 'Indonesia', 'Earthy, herbal, dark chocolate');
  insert.run('Sunrise Blend', 'sunrise-blend', 'Our signature morning blend.', 15.99, 'Medium', 'Blend', 'Caramel, orange, chocolate');
}

export type { Product };
export function getAllProducts(): Product[] { return db.prepare('SELECT * FROM products ORDER BY name').all() as Product[]; }
export function getProductBySlug(slug: string): Product | undefined { return db.prepare('SELECT * FROM products WHERE slug = ?').get(slug) as Product | undefined; }
export { db };