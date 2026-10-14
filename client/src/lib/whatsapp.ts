// NÚMERO DE EXEMPLO — troque pelo WhatsApp real do negócio antes de publicar de verdade.
export const WHATSAPP_NUMBER = "5511999999999";

import { PLANTS, FREQUENCIES, ADD_ONS } from "./data";

export function buildWhatsappMessage(params: {
  name: string;
  plantIds: string[];
  frequencyId: string;
  addOnIds: string[];
  priceEstimate: number;
}) {
  const plantNames = params.plantIds
    .map((id) => PLANTS.find((p) => p.id === id)?.name)
    .filter(Boolean)
    .join(", ");
  const frequencyLabel = FREQUENCIES.find((f) => f.id === params.frequencyId)?.label ?? "";
  const addOnNames = params.addOnIds
    .map((id) => ADD_ONS.find((a) => a.id === id)?.label)
    .filter(Boolean)
    .join(", ");

  const lines = [
    `Olá! Sou ${params.name} e montei meu plano no BrotaBox:`,
    `🌱 Plantas: ${plantNames || "a combinar"}`,
    `📅 Frequência: ${frequencyLabel}`,
    addOnNames ? `✨ Extras: ${addOnNames}` : null,
    `💰 Valor estimado: R$ ${params.priceEstimate.toFixed(2)}/mês`,
    `Quero assinar, podemos fechar por aqui?`,
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildWhatsappLink(message: string, phone = WHATSAPP_NUMBER) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
