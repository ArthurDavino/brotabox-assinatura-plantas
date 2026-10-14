import "dotenv/config";
import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import { getDb } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_KEY = process.env.ADMIN_KEY || "brotabox-dev-2026";
const PORT = process.env.PORT || 4000;

function requireAdmin(req, res, next) {
  const key = req.header("x-admin-key");
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Chave de administrador inválida." });
  }
  next();
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/admin/verify", (req, res) => {
  const { key } = req.body || {};
  res.json({ ok: key === ADMIN_KEY });
});

// ----- Leads -----
app.post("/api/leads", async (req, res) => {
  const db = await getDb();
  const { name, phone, email, plan, message } = req.body || {};
  if (!name || !phone || !plan) {
    return res.status(400).json({ error: "Nome, telefone e plano são obrigatórios." });
  }
  const lead = {
    id: nanoid(10),
    name,
    phone,
    email: email || "",
    plan,
    message: message || "",
    status: "novo",
    createdAt: new Date().toISOString(),
  };
  db.data.leads.unshift(lead);
  await db.write();
  res.status(201).json(lead);
});

app.get("/api/leads", requireAdmin, async (_req, res) => {
  const db = await getDb();
  res.json(db.data.leads);
});

app.patch("/api/leads/:id", requireAdmin, async (req, res) => {
  const db = await getDb();
  const lead = db.data.leads.find((l) => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: "Lead não encontrado." });
  Object.assign(lead, req.body);
  await db.write();
  res.json(lead);
});

app.delete("/api/leads/:id", requireAdmin, async (req, res) => {
  const db = await getDb();
  db.data.leads = db.data.leads.filter((l) => l.id !== req.params.id);
  await db.write();
  res.status(204).end();
});

app.post("/api/leads/:id/convert", requireAdmin, async (req, res) => {
  const db = await getDb();
  const lead = db.data.leads.find((l) => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: "Lead não encontrado." });
  const client = {
    id: nanoid(10),
    leadId: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    plan: lead.plan,
    address: req.body?.address || "",
    status: "ativo",
    createdAt: new Date().toISOString(),
  };
  db.data.clients.unshift(client);
  lead.status = "convertido";
  await db.write();
  res.status(201).json(client);
});

// ----- Clients -----
app.get("/api/clients", requireAdmin, async (_req, res) => {
  const db = await getDb();
  res.json(db.data.clients);
});

app.post("/api/clients", requireAdmin, async (req, res) => {
  const db = await getDb();
  const client = { id: nanoid(10), status: "ativo", createdAt: new Date().toISOString(), ...req.body };
  db.data.clients.unshift(client);
  await db.write();
  res.status(201).json(client);
});

app.patch("/api/clients/:id", requireAdmin, async (req, res) => {
  const db = await getDb();
  const client = db.data.clients.find((c) => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: "Cliente não encontrado." });
  Object.assign(client, req.body);
  await db.write();
  res.json(client);
});

app.delete("/api/clients/:id", requireAdmin, async (req, res) => {
  const db = await getDb();
  db.data.clients = db.data.clients.filter((c) => c.id !== req.params.id);
  await db.write();
  res.status(204).end();
});

// ----- Deliveries -----
app.get("/api/deliveries", requireAdmin, async (_req, res) => {
  const db = await getDb();
  res.json(db.data.deliveries);
});

app.post("/api/deliveries", requireAdmin, async (req, res) => {
  const db = await getDb();
  const delivery = { id: nanoid(10), status: "agendada", createdAt: new Date().toISOString(), ...req.body };
  db.data.deliveries.unshift(delivery);
  await db.write();
  res.status(201).json(delivery);
});

app.patch("/api/deliveries/:id", requireAdmin, async (req, res) => {
  const db = await getDb();
  const delivery = db.data.deliveries.find((d) => d.id === req.params.id);
  if (!delivery) return res.status(404).json({ error: "Entrega não encontrada." });
  Object.assign(delivery, req.body);
  await db.write();
  res.json(delivery);
});

app.delete("/api/deliveries/:id", requireAdmin, async (req, res) => {
  const db = await getDb();
  db.data.deliveries = db.data.deliveries.filter((d) => d.id !== req.params.id);
  await db.write();
  res.status(204).end();
});

// ----- Reminders -----
app.get("/api/reminders", requireAdmin, async (_req, res) => {
  const db = await getDb();
  res.json(db.data.reminders);
});

app.post("/api/reminders", requireAdmin, async (req, res) => {
  const db = await getDb();
  const reminder = { id: nanoid(10), done: false, createdAt: new Date().toISOString(), ...req.body };
  db.data.reminders.unshift(reminder);
  await db.write();
  res.status(201).json(reminder);
});

app.patch("/api/reminders/:id", requireAdmin, async (req, res) => {
  const db = await getDb();
  const reminder = db.data.reminders.find((r) => r.id === req.params.id);
  if (!reminder) return res.status(404).json({ error: "Lembrete não encontrado." });
  Object.assign(reminder, req.body);
  await db.write();
  res.json(reminder);
});

app.delete("/api/reminders/:id", requireAdmin, async (req, res) => {
  const db = await getDb();
  db.data.reminders = db.data.reminders.filter((r) => r.id !== req.params.id);
  await db.write();
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`BrotaBox API rodando em http://localhost:${PORT}`);
});
