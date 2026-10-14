import { useEffect, useState } from "react";
import { api, type Client } from "../../lib/api";
import { PLANTS } from "../../lib/data";

export default function ClientsTab() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setClients(await api.listClients());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: Client["status"]) {
    await api.updateClient(id, { status });
    load();
  }

  async function remove(id: string) {
    if (!window.confirm("Remover este cliente?")) return;
    await api.deleteClient(id);
    load();
  }

  if (loading) return <p>Carregando clientes...</p>;
  if (clients.length === 0) return <p>Nenhum cliente ainda. Converta um lead na aba Leads.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Contato</th>
          <th>Plano</th>
          <th>Endereço</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => (
          <tr key={client.id}>
            <td data-label="Nome">{client.name}</td>
            <td data-label="Contato">{client.phone}</td>
            <td data-label="Plano">
              {client.plan?.plantIds
                ?.map((id) => PLANTS.find((p) => p.id === id)?.name)
                .filter(Boolean)
                .join(", ")}
            </td>
            <td data-label="Endereço">{client.address || "—"}</td>
            <td data-label="Status">
              <select value={client.status} onChange={(e) => updateStatus(client.id, e.target.value as Client["status"])}>
                <option value="ativo">Ativo</option>
                <option value="pausado">Pausado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </td>
            <td data-label="Ações">
              <button className="btn btnghost" onClick={() => remove(client.id)}>
                Remover
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
