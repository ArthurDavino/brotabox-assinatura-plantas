import { useState } from "react";
import { Link } from "react-router-dom";
import { clearAdminKey, hasAdminKey, setAdminKey, verifyAdminKey } from "../lib/api";
import LeadsTab from "../components/admin/LeadsTab";
import ClientsTab from "../components/admin/ClientsTab";
import DeliveriesTab from "../components/admin/DeliveriesTab";
import RemindersTab from "../components/admin/RemindersTab";

type Tab = "leads" | "clientes" | "entregas" | "lembretes";

export default function Admin() {
  const [authed, setAuthed] = useState(hasAdminKey());

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return <AdminPanel onLogout={() => { clearAdminKey(); setAuthed(false); }} />;
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError("");
    try {
      const ok = await verifyAdminKey(key);
      if (!ok) {
        setError("Chave incorreta.");
        return;
      }
      setAdminKey(key);
      onSuccess();
    } catch {
      setError("Não foi possível conectar à API. Ela está rodando?");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="container" style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 360, width: "100%" }}>
        <h2 style={{ marginTop: 0 }}>Painel BrotaBox</h2>
        <label>Chave de administrador</label>
        <input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="ADMIN_KEY" required />
        {error && <p style={{ color: "var(--colordanger)" }}>{error}</p>}
        <button className="btn btnprimary" style={{ marginTop: 12, width: "100%" }} disabled={checking}>
          {checking ? "Verificando..." : "Entrar"}
        </button>
        <p style={{ fontSize: "0.8rem", color: "var(--colortextmuted)", marginTop: 12 }}>
          A chave é a mesma definida em <code>ADMIN_KEY</code> no servidor (ver <code>.env.example</code>).
        </p>
        <Link to="/" style={{ fontSize: "0.85rem" }}>
          ← Voltar para a landing page
        </Link>
      </form>
    </div>
  );
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("leads");

  const tabs: { id: Tab; label: string }[] = [
    { id: "leads", label: "Leads" },
    { id: "clientes", label: "Clientes" },
    { id: "entregas", label: "Entregas" },
    { id: "lembretes", label: "Lembretes" },
  ];

  return (
    <div className="container" style={{ padding: "24px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: "var(--colorprimarydark)" }}>🌿 Painel BrotaBox</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/" className="btn btnoutline">Ver landing page</Link>
          <button className="btn btnghost" onClick={onLogout}>Sair</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? "btn btnprimary" : "btn btnoutline"}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        {tab === "leads" && <LeadsTab />}
        {tab === "clientes" && <ClientsTab />}
        {tab === "entregas" && <DeliveriesTab />}
        {tab === "lembretes" && <RemindersTab />}
      </div>
    </div>
  );
}
