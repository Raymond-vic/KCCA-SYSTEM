import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("kcca_market.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL, -- admin, officer, applicant, vendor, director, manager, supervisor
    status TEXT DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS markets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ref_no TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    owner_id_no TEXT NOT NULL,
    owner_phone TEXT NOT NULL,
    owner_email TEXT,
    owner_address TEXT NOT NULL,
    address TEXT NOT NULL,
    type TEXT NOT NULL, -- Private, Public, Community
    size REAL NOT NULL,
    stalls_count INTEGER NOT NULL,
    year_established INTEGER,
    operating_days TEXT NOT NULL,
    operating_hours TEXT NOT NULL,
    manager_name TEXT NOT NULL,
    manager_contact TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, recommended, approved, rejected
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS vendors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ref_no TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    market_id INTEGER,
    full_name TEXT NOT NULL,
    national_id TEXT NOT NULL,
    phone TEXT NOT NULL,
    business_type TEXT NOT NULL,
    products TEXT NOT NULL,
    stall_type TEXT,
    stall_no TEXT,
    status TEXT DEFAULT 'pending', -- pending, verified, approved, rejected
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (market_id) REFERENCES markets(id)
  );

  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial users if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
  insertUser.run("Admin User", "admin@kcca.go.ug", "admin123", "admin");
  insertUser.run("Director Gender", "director@kcca.go.ug", "director123", "director");
  insertUser.run("Manager Markets", "manager@kcca.go.ug", "manager123", "manager");
  insertUser.run("Market Supervisor", "supervisor@kcca.go.ug", "supervisor123", "supervisor");
  insertUser.run("KCCA Officer", "officer@kcca.go.ug", "officer123", "officer");
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Auth API
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      const info = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(name, email, password, role || 'applicant');
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
      res.json(user);
    } catch (e) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  // Markets API
  app.get("/api/markets", (req, res) => {
    const markets = db.prepare("SELECT * FROM markets ORDER BY created_at DESC").all();
    res.json(markets);
  });

  app.post("/api/markets", (req, res) => {
    const data = req.body;
    const ref_no = "MKT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      const stmt = db.prepare(`
        INSERT INTO markets (
          ref_no, name, owner_name, owner_id_no, owner_phone, owner_email, owner_address,
          address, type, size, stalls_count, year_established, operating_days,
          operating_hours, manager_name, manager_contact, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `);
      stmt.run(
        ref_no, data.marketName, data.ownerName, data.ownerId, data.ownerPhone, data.ownerEmail, data.ownerAddress,
        data.marketAddress, data.marketType, data.marketSize, data.stallsCount, data.yearEstablished,
        data.operatingDays, data.operatingHours, data.marketManagerName, data.marketManagerContact
      );
      res.json({ ref_no });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to register market" });
    }
  });

  app.patch("/api/markets/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE markets SET status = ? WHERE id = ?").run(status, id);
    res.json({ success: true });
  });

  // Vendors API
  app.get("/api/vendors", (req, res) => {
    const vendors = db.prepare(`
      SELECT v.*, m.name as market_name 
      FROM vendors v 
      LEFT JOIN markets m ON v.market_id = m.id 
      ORDER BY v.created_at DESC
    `).all();
    res.json(vendors);
  });

  app.post("/api/vendors", (req, res) => {
    const data = req.body;
    const ref_no = "VND-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      const stmt = db.prepare(`
        INSERT INTO vendors (
          ref_no, user_id, market_id, full_name, national_id, phone,
          business_type, products, stall_type, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `);
      stmt.run(
        ref_no, data.userId, data.marketId, data.fullName, data.nationalId, data.phone,
        data.businessType, data.products, data.stallType
      );
      res.json({ ref_no });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to register vendor" });
    }
  });

  app.patch("/api/vendors/:id/status", (req, res) => {
    const { id } = req.params;
    const { status, stall_no, vendor_id_no } = req.body;
    if (stall_no) {
      db.prepare("UPDATE vendors SET status = ?, stall_no = ? WHERE id = ?").run(status, stall_no, id);
    } else if (vendor_id_no) {
       // In a real system, vendor_id_no might be a separate field or the ref_no
       db.prepare("UPDATE vendors SET status = ? WHERE id = ?").run(status, id);
    } else {
      db.prepare("UPDATE vendors SET status = ? WHERE id = ?").run(status, id);
    }
    res.json({ success: true });
  });

  // Users Management (Admin)
  app.get("/api/users", (req, res) => {
    const users = db.prepare("SELECT id, name, email, role, status FROM users").all();
    res.json(users);
  });

  // Logs
  app.get("/api/logs", (req, res) => {
    const logs = db.prepare(`
      SELECT l.*, u.name as user_name 
      FROM logs l 
      LEFT JOIN users u ON l.user_id = u.id 
      ORDER BY l.timestamp DESC LIMIT 100
    `).all();
    res.json(logs);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
