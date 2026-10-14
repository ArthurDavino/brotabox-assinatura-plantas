import { useEffect, useState } from "react";
import { api, type Client, type Reminder } from "../../lib/api";

const TYPE_LABELS: Record<Reminder["type"], string> = {
  rega: "Rega",
  adubo: "Adubo",
  cobranca: "Cobrança",
  renovacao: "Renovação",
};

export default function RemindersTab() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ clientId: string; type: Reminder["type"]; dueDate: string; notes: string }>({
    clientId: "",
    type: "rega",
    dueDate: "",
    notes: "",
  });

  async function load() {
    setLoading(true);
    const [r, c] = await Promise.all([api.listReminders(), api.listClients()]);
    setReminders(r);
    setClients(c);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function clientName(id: string) {
    return clients.find((c) => c.id === id)?.name ?? "Cliente removido";
  }

  async function addReminder(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientId || !form.dueDate) return;
    await api.createReminder(form);
    setForm({ clientId: "", type: "rega", dueDate: "", notes: "" });
    load();
  }

  async function toggleDone(id: string, done: boolean) {
    await api.updateReminder(id, { done });
    load();
  }

  async function remove(id: string) {
    if (!window.confirm("Remover este lembrete?")) return;
    await api.deleteReminder(id);
    load();
  }

  if (loading) return <p>Carregando lembretes...</p>;

  return (
    <div>
      <form onSubmit={addReminder} className="card" style={{ display: "grid", gap: 10, marginBottom: 20 }}>
        <strong>Novo lembrete</strong>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
          <div>
            <label>Cliente</label>
            <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} required>
              <option value="">Selecione...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Tipo</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Reminder["type"] })}>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Data</label>
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
          </div>
        </div>
        <button type="submit" className="btn btnprimary" style={{ justifySelf: "start" }}>
          Criar lembrete
        </button>
      </form>

      {reminders.length === 0 ? (
        <p>Nenhum lembrete criado ainda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Feito</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((r) => (
              <tr key={r.id}>
                <td data-label="Cliente">{clientName(r.clientId)}</td>
                <td data-label="Tipo">{TYPE_LABELS[r.type]}</td>
                <td data-label="Data">{r.dueDate}</td>
                <td data-label="Feito">
                  <input type="checkbox" style={{ width: "auto" }} checked={r.done} onChange={(e) => toggleDone(r.id, e.target.checked)} />
                </td>
                <td data-label="Ações">
                  <button className="btn btnghost" onClick={() => remove(r.id)}>
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
