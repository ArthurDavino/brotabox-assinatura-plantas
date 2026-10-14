import PlanBuilder from "../components/PlanBuilder";

export default function Landing() {
  return (
    <div>
      <header style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
          <strong style={{ fontSize: "1.2rem", color: "var(--color-primary-dark)" }}>🌿 BrotaBox</strong>
          <a href="#planos" className="btn btn-outline">Montar meu plano</a>
        </div>
      </header>

      <section className="container" style={{ padding: "60px 20px 30px", textAlign: "center" }}>
        <span className="badge">Assinatura de plantas fáceis</span>
        <h1 style={{ fontSize: "2.4rem", margin: "16px 0", color: "var(--color-primary-dark)" }}>
          Você mata plantas. A gente resolve isso por assinatura.
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--color-text-muted)", maxWidth: 640, margin: "0 auto 24px" }}>
          Toda assinatura do BrotaBox traz plantas quase indestrutíveis, escolhidas para o seu
          nível de cuidado, com lembretes de rega pelo WhatsApp. Sem vaso quebrado, sem
          vergonha de admitir que esqueceu de novo.
        </p>
        <a href="#planos" className="btn btn-primary" style={{ fontSize: "1rem", padding: "14px 28px" }}>
          Montar meu plano agora
        </a>
      </section>

      <section className="container" style={{ padding: "30px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <HowItWorksCard emoji="🌱" title="1. Monte seu plano" text="Escolha as plantas, a frequência de entrega e os extras." />
          <HowItWorksCard emoji="💬" title="2. Fale com a gente" text="Confirme os detalhes direto no WhatsApp, sem burocracia." />
          <HowItWorksCard emoji="📦" title="3. Receba em casa" text="Sua planta chega pronta, com instruções simples de cuidado." />
          <HowItWorksCard emoji="⏰" title="4. Não esqueça mais" text="Lembretes no WhatsApp avisam quando regar e adubar." />
        </div>
      </section>

      <section id="planos" className="container" style={{ padding: "30px 20px 70px" }}>
        <h2 style={{ textAlign: "center", color: "var(--color-primary-dark)" }}>Monte seu plano</h2>
        <PlanBuilder />
      </section>

      <footer style={{ borderTop: "1px solid var(--color-border)", padding: "24px 20px", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
        BrotaBox — MVP criado como projeto de portfólio. <a href="/admin">Painel administrativo</a>
      </footer>
    </div>
  );
}

function HowItWorksCard({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="card">
      <div style={{ fontSize: "1.8rem" }}>{emoji}</div>
      <h4 style={{ margin: "8px 0 6px" }}>{title}</h4>
      <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.9rem" }}>{text}</p>
    </div>
  );
}
