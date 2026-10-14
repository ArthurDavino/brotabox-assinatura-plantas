export type Plant = {
  id: string;
  name: string;
  tagline: string;
  care: string;
  price: number;
};

export type Frequency = {
  id: string;
  label: string;
  description: string;
  discount: number; // 0..1, applied over base price
};

export type AddOn = {
  id: string;
  label: string;
  description: string;
  price: number;
};

export const PLANTS: Plant[] = [
  {
    id: "zz",
    name: "Zamioculca (ZZ)",
    tagline: "Quase impossível matar",
    care: "Rega a cada 15 dias, aguenta pouca luz.",
    price: 39,
  },
  {
    id: "jiboia",
    name: "Jiboia",
    tagline: "Cresce rápido e perdoa esquecimentos",
    care: "Rega semanal, gosta de luz indireta.",
    price: 29,
  },
  {
    id: "espadasaojorge",
    name: "Espada de São Jorge",
    tagline: "Resistente e diz que traz proteção",
    care: "Rega quinzenal, sol direto ou meia sombra.",
    price: 34,
  },
  {
    id: "suculentamix",
    name: "Mix de Suculentas",
    tagline: "Pequenas, charmosas e teimosas de viver",
    care: "Rega a cada 10 dias, luz direta.",
    price: 27,
  },
  {
    id: "linguadesogra",
    name: "Língua de Sogra",
    tagline: "Sobrevive até a quem não tem rotina",
    care: "Rega mensal, qualquer luz serve.",
    price: 32,
  },
];

export const FREQUENCIES: Frequency[] = [
  {
    id: "mensal",
    label: "Mensal",
    description: "Uma planta nova por mês, no seu ritmo.",
    discount: 0,
  },
  {
    id: "bimestral",
    label: "Bimestral",
    description: "Uma planta nova a cada 2 meses.",
    discount: 0.1,
  },
  {
    id: "trimestral",
    label: "Trimestral",
    description: "Uma planta nova a cada 3 meses, ideal para começar devagar.",
    discount: 0.15,
  },
];

export const ADD_ONS: AddOn[] = [
  {
    id: "vaso",
    label: "Vaso de cerâmica combinando",
    description: "Já chega pronta para expor, sem trocar de vaso.",
    price: 19,
  },
  {
    id: "adubo",
    label: "Kit de adubo + medidor de umidade",
    description: "Para quem quer parar de adivinhar quando regar.",
    price: 15,
  },
  {
    id: "lembreteswhats",
    label: "Lembretes de cuidado pelo WhatsApp",
    description: "Avisos no dia certo de regar e adubar cada planta.",
    price: 9,
  },
];

export function calculatePlanPrice(
  plantIds: string[],
  frequencyId: string,
  addOnIds: string[]
) {
  const plantsTotal = plantIds.reduce((sum, id) => {
    const plant = PLANTS.find((p) => p.id === id);
    return sum + (plant?.price ?? 0);
  }, 0);
  const frequency = FREQUENCIES.find((f) => f.id === frequencyId);
  const discount = frequency?.discount ?? 0;
  const addOnsTotal = addOnIds.reduce((sum, id) => {
    const addOn = ADD_ONS.find((a) => a.id === id);
    return sum + (addOn?.price ?? 0);
  }, 0);
  const discounted = plantsTotal * (1 - discount);
  return Math.round((discounted + addOnsTotal) * 100) / 100;
}
