import { useMemo, useState } from "react";
import { PLANTS, FREQUENCIES, ADD_ONS, calculatePlanPrice } from "../lib/data";
import { api } from "../lib/api";
import { buildWhatsappLink, buildWhatsappMessage } from "../lib/whatsapp";

type Step = "plantas" | "frequencia" | "extras" | "contato" | "pronto";

export default function PlanBuilder() {
  const [step, setStep] = useState<Step>("plantas");
  const [plantIds, setPlantIds] = useState<string[]>([]);
  const [frequencyId, setFrequencyId] = useState(FREQUENCIES[0].id);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const price = useMemo(
    () => calculatePlanPrice(plantIds, frequencyId, addOnIds),
    [plantIds, frequencyId, addOnIds]
  );

  function togglePlant(id: string) {
    setPlantIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function toggleAddOn(id: string) {
    setAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (plantIds.length === 0) {
      setError("Escolha pelo menos uma planta.");
      setStep("plantas");
      return;
    }
    if (!name || !phone) {
      setError("Nome e WhatsApp são obrigatórios.");
      return;
    }
    setSubmitting(true);
    try {
      const plan = { plantIds, frequencyId, addOnIds, priceEstimate: price };
      await api.createLead({ name, phone, email, plan, message: "" });
      const message = buildWhatsappMessage({ name, plantIds, frequencyId, addOnIds, priceEstimate: price });
      setWhatsappUrl(buildWhatsappLink(message));
      setStep("pronto");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 640, margin: "0 auto" }}>
      <StepIndicator step={step} />

      {error && (
        <p style={{ color: "var(--colordanger)", fontWeight: 600, marginTop: 0 }}>{error}</p>
      )}

      {step === "plantas" && (
        <div>
          <h3 style={{ marginTop: 0 }}>1. Escolha as plantas do seu plano</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {PLANTS.map((plant) => (
              <label
                key={plant.id}
                className="card"
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  cursor: "pointer",
                  borderColor: plantIds.includes(plant.id) ? "var(--colorprimary)" : undefined,
                  background: plantIds.includes(plant.id) ? "var(--colorprimarylight)" : undefined,
                }}
              >
                <input
                  type="checkbox"
                  style={{ width: "auto", marginTop: 4 }}
                  checked={plantIds.includes(plant.id)}
                  onChange={() => togglePlant(plant.id)}
                />
                <div style={{ flex: 1 }}>
                  <strong>{plant.name}</strong> — R$ {plant.price}/mês
                  <div style={{ fontSize: "0.85rem", color: "var(--colortextmuted)" }}>
                    {plant.tagline}. {plant.care}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btnprimary" onClick={() => setStep("frequencia")}>
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === "frequencia" && (
        <div>
          <h3 style={{ marginTop: 0 }}>2. Com que frequência quer receber?</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {FREQUENCIES.map((f) => (
              <label
                key={f.id}
                className="card"
                style={{
                  display: "flex",
                  gap: 12,
                  cursor: "pointer",
                  borderColor: frequencyId === f.id ? "var(--colorprimary)" : undefined,
                  background: frequencyId === f.id ? "var(--colorprimarylight)" : undefined,
                }}
              >
                <input
                  type="radio"
                  style={{ width: "auto" }}
                  checked={frequencyId === f.id}
                  onChange={() => setFrequencyId(f.id)}
                />
                <div>
                  <strong>{f.label}</strong>{" "}
                  {f.discount > 0 && <span className="badge">-{f.discount * 100}%</span>}
                  <div style={{ fontSize: "0.85rem", color: "var(--colortextmuted)" }}>
                    {f.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <StepNav onBack={() => setStep("plantas")} onNext={() => setStep("extras")} />
        </div>
      )}

      {step === "extras" && (
        <div>
          <h3 style={{ marginTop: 0 }}>3. Quer algum extra?</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {ADD_ONS.map((a) => (
              <label
                key={a.id}
                className="card"
                style={{
                  display: "flex",
                  gap: 12,
                  cursor: "pointer",
                  borderColor: addOnIds.includes(a.id) ? "var(--colorprimary)" : undefined,
                  background: addOnIds.includes(a.id) ? "var(--colorprimarylight)" : undefined,
                }}
              >
                <input
                  type="checkbox"
                  style={{ width: "auto", marginTop: 4 }}
                  checked={addOnIds.includes(a.id)}
                  onChange={() => toggleAddOn(a.id)}
                />
                <div>
                  <strong>{a.label}</strong> — +R$ {a.price}/mês
                  <div style={{ fontSize: "0.85rem", color: "var(--colortextmuted)" }}>
                    {a.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <PriceSummary price={price} />
          <StepNav onBack={() => setStep("frequencia")} onNext={() => setStep("contato")} />
        </div>
      )}

      {step === "contato" && (
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginTop: 0 }}>4. Para onde mandamos sua proposta?</h3>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label>Seu nome</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Como podemos te chamar?" required />
            </div>
            <div>
              <label>WhatsApp (com DDD)</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="11912345678" required />
            </div>
            <div>
              <label>Email (opcional)</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
            </div>
          </div>
          <PriceSummary price={price} />
          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
            <button type="button" className="btn btnghost" onClick={() => setStep("extras")}>
              Voltar
            </button>
            <button type="submit" className="btn btnprimary" disabled={submitting}>
              {submitting ? "Enviando..." : "Ver meu plano e falar no WhatsApp"}
            </button>
          </div>
        </form>
      )}

      {step === "pronto" && (
        <div style={{ textAlign: "center" }}>
          <h3>Seu plano está pronto, {name.split(" ")[0]}! 🌿</h3>
          <p style={{ color: "var(--colortextmuted)" }}>
            Valor estimado: <strong>R$ {price.toFixed(2)}/mês</strong>. Recebemos seus dados por
            aqui — agora é só confirmar no WhatsApp para fecharmos sua assinatura e combinar a
            entrega.
          </p>
          <a className="btn btnwhatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
            Falar no WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "plantas", label: "Plantas" },
    { id: "frequencia", label: "Frequência" },
    { id: "extras", label: "Extras" },
    { id: "contato", label: "Contato" },
    { id: "pronto", label: "Pronto" },
  ];
  const activeIndex = steps.findIndex((s) => s.id === step);
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
      {steps.map((s, i) => (
        <span
          key={s.id}
          className="badge"
          style={{
            background: i <= activeIndex ? "var(--colorprimary)" : "var(--colorprimarylight)",
            color: i <= activeIndex ? "white" : "var(--colorprimarydark)",
          }}
        >
          {i + 1}. {s.label}
        </span>
      ))}
    </div>
  );
}

function StepNav({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
      <button type="button" className="btn btnghost" onClick={onBack}>
        Voltar
      </button>
      <button type="button" className="btn btnprimary" onClick={onNext}>
        Continuar
      </button>
    </div>
  );
}

function PriceSummary({ price }: { price: number }) {
  return (
    <div
      className="card"
      style={{ marginTop: 16, background: "var(--colorprimarylight)", border: "none", display: "flex", justifyContent: "space-between" }}
    >
      <span>Valor estimado do plano</span>
      <strong>R$ {price.toFixed(2)}/mês</strong>
    </div>
  );
}
