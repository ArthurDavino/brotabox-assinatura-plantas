import { Fragment, useEffect, useState } from "react";
import { api, type Lead } from "../../lib/api";
import { PLANTS, FREQUENCIES } from "../../lib/data";

export default function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [address, setAddress] = useState("");

  async function load() {
    setLoading(true);
    try {
      setLeads(await api.listLeads());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar leads.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: Lead["status"]) {
    await api.updateLead(id, { status });
    load();
  }

  async function confirmConvert(lead: Lead) {
    await api.convertLead(lead.id, address);
    setConvertingId(null);
    setAddress("");
    load();
  }

  async function remove(id: string) {
    if (!window.confirm("Remover este lead?")) return;
    await api.deleteLead(id);
    load();
  }

  if (loading) return <p>Carregando leads...</p>;
  if (error) return <p style={{ color: "var(--color-danger)" }}>{error}</p>;
  if (leads.length === 0) return <p>Nenhum lead ainda. Compartilhe a landing page!</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Contato</th>
          <th>Plano</th>
          <th>Valor</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <Fragment key={lead.id}>
            <tr>
              <td data-label="Nome">{lead.name}</td>
              <td data-label="Contato">
                {lead.phone}
                {lead.email ? ` · ${lead.email}` : ""}
              </td>
              <td data-label="Plano">
                {lead.plan.plantIds
                  .map((id) => PLANTS.find((p) => p.id === id)?.name)
                  .filter(Boolean)
                  .join(", ")}{" "}
                ({FREQUENCIES.find((f) => f.id === lead.plan.frequencyId)?.label})
              </td>
              <td data-label="Valor">R$ {lead.plan.priceEstimate.toFixed(2)}</td>
              <td data-label="Status">
                <select value={lead.status} onChange={(e) => updateStatus(lead.id, e.target.value as Lead["status"])}>
                  <option value="novo">Novo</option>
                  <option value="contatado">Contatado</option>
                  <option value="convertido">Convertido</option>
                  <option value="perdido">Perdido</option>
                </select>
              </td>
              <td data-label="Ações" style={{ display: "flex", gap: 6 }}>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setConvertingId(lead.id);
                    setAddress("");
                  }}
                >
                  Converter em cliente
                </button>
                <button className="btn btn-ghost" onClick={() => remove(lead.id)}>
                  Remover
                </button>
              </td>
            </tr>
            {convertingId === lead.id && (
              <tr>
                <td colSpan={6}>
                  <div
                    className="card"
                    style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap", background: "var(--color-primary-light)" }}
                  >
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <label>Endereço de entrega de {lead.name}</label>
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Rua, número, bairro, cidade"
                        autoFocus
                      />
                    </div>
                    <button className="btn btn-primary" onClick={() => confirmConvert(lead)}>
                      Confirmar
                    </button>
                    <button className="btn btn-ghost" onClick={() => setConvertingId(null)}>
                      Cancelar
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}
