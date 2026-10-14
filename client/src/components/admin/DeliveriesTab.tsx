import { useEffect, useState } from "react";
import { api, type Client, type Delivery } from "../../lib/api";

export default function DeliveriesTab() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ clientId: "", date: "", items: "", notes: "" });

  async function load() {
    setLoading(true);
    const [d, c] = await Promise.all([api.listDeliveries(), api.listClients()]);
    setDeliveries(d);
    setClients(c);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function clientName(id: string) {
    return clients.find((c) => c.id === id)?.name ?? "Cliente removido";
  }

  async function addDelivery(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientId || !form.date) return;
    await api.createDelivery(form);
    setForm({ clientId: "", date: "", items: "", notes: "" });
    load();
  }

  async function updateStatus(id: string, status: Delivery["status"]) {
    await api.updateDelivery(id, { status });
    load();
  }

  async function remove(id: string) {
    if (!window.confirm("Remover esta entrega?")) return;
    await api.deleteDelivery(id);
    load();
  }

  if (loading) return <p>Carregando entregas...</p>;

  return (
    <div>
      <form onSubmit={addDelivery} className="card" style={{ display: "grid", gap: 10, marginBottom: 20 }}>
        <strong>Agendar nova entrega</strong>
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
            <label>Data</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div>
            <label>Itens</label>
            <input value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} placeholder="Ex: ZZ + vaso" />
          </div>
        </div>
        <button type="submit" className="btn btnprimary" style={{ justifySelf: "start" }}>
          Agendar entrega
        </button>
      </form>

      {deliveries.length === 0 ? (
        <p>Nenhuma entrega agendada ainda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Data</th>
              <th>Itens</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((d) => (
              <tr key={d.id}>
                <td data-label="Cliente">{clientName(d.clientId)}</td>
                <td data-label="Data">{d.date}</td>
                <td data-label="Itens">{d.items || "—"}</td>
                <td data-label="Status">
                  <select value={d.status} onChange={(e) => updateStatus(d.id, e.target.value as Delivery["status"])}>
                    <option value="agendada">Agendada</option>
                    <option value="enviada">Enviada</option>
                    <option value="entregue">Entregue</option>
                    <option value="atrasada">Atrasada</option>
                  </select>
                </td>
                <td data-label="Ações">
                  <button className="btn btnghost" onClick={() => remove(d.id)}>
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
