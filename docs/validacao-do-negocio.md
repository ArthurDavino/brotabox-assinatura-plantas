# Validação do negócio — BrotaBox

> Este documento registra o raciocínio de validação feito **antes** de construir qualquer
> tela, simulando a conversa com um "co-founder de IA" pedida no desafio: dimensionar o
> mercado, montar o Business Model Canvas e listar as hipóteses que o MVP precisa testar.

## 1. A dor

Muita gente compra planta, se empolga por duas semanas, esquece de regar (ou rega demais) e
em um mês a planta está morta. A pessoa se sente mal, não compra outra, e a sala fica vazia.
Isso é diferente de "não gostar de plantas" — é falta de rotina e de orientação simples no
momento certo.

**Hipótese de negócio:** existe um público que quer ter plantas em casa, mas não confia em si
mesmo para cuidar delas. Uma assinatura que (a) escolhe só plantas difíceis de matar e (b)
manda lembrete de cuidado no WhatsApp remove as duas barreiras.

## 2. Tamanho de mercado (TAM, SAM, SOM)

Estimativas top-down, com premissas explícitas (não são dados oficiais — são o tipo de
número que um co-founder de IA ajuda a montar rapidamente para decidir se vale a pena testar):

| Camada | Definição | Estimativa | Como chegamos lá |
|---|---|---|---|
| **TAM** | Mercado brasileiro de plantas ornamentais e jardinagem doméstica | ~R$ 8 bilhões/ano | Baseado em estimativas do setor de floricultura (IBRAFLOR) para consumo doméstico de plantas e flores no Brasil. |
| **SAM** | Moradores urbanos de 22–45 anos, em apartamento, que já compraram planta e compram produtos para casa pela internet | ~2 milhões de pessoas → ~R$ 840 milhões/ano | ~25 milhões de pessoas moram em apartamento nas capitais; filtrando por quem tem interesse ativo em plantas e hábito de compra online (~8%), chegamos a ~2 milhões. Ticket hipotético de R$ 35/mês × 12. |
| **SOM** | O que o BrotaBox consegue capturar no ano 1, operando manualmente em 1–2 cidades via redes sociais e WhatsApp | ~1.000 assinantes → ~R$ 504 mil/ano | 1.000 assinantes é ~0,05% do SAM — uma fatia pequena e defensável para quem está validando com atendimento manual, sem marketing pago relevante. Ticket médio estimado em R$ 42/mês (plano + 1 extra). |

O objetivo do MVP **não** é provar o TAM, é provar que dá para conseguir os primeiros 50–100
assinantes manualmente. Se isso não acontecer, o resto do dimensionamento é irrelevante.

## 3. Business Model Canvas

| Bloco | Conteúdo |
|---|---|
| **Segmentos de clientes** | (1) Quem já matou planta e tem vergonha disso; (2) quem está montando home office/apartamento novo; (3) quem quer dar planta de presente sem arriscar que ela morra em 1 mês. |
| **Proposta de valor** | Plantas selecionadas para quase não morrerem + lembrete de cuidado no WhatsApp + sem contrato longo, cancela quando quiser. Elimina a culpa e a curva de aprendizado. |
| **Canais** | Conteúdo em Instagram/TikTok ("plantas que não morrem"), indicação de clientes, WhatsApp como canal de venda e relacionamento. |
| **Relacionamento com clientes** | Atendimento humano 1:1 no WhatsApp para fechar a venda; lembretes periódicos; sensação de "parceiro", não só fornecedor. |
| **Fontes de receita** | Assinatura mensal/bimestral/trimestral; upsell de extras (vaso, adubo, lembretes); venda avulsa como presente. |
| **Recursos principais** | Catálogo curado de plantas resistentes; relacionamento com viveiros locais; conteúdo educativo; painel de leads/clientes/entregas. |
| **Atividades-chave** | Curadoria de plantas; logística de entrega; conversão de leads no WhatsApp; gestão de lembretes e renovação. |
| **Parcerias-chave** | Viveiros/produtores locais; entregador/motoboy ou transportadora; fornecedor de vasos e adubo. |
| **Estrutura de custos** | Compra de plantas e insumos; frete; ferramentas (hospedagem, WhatsApp, e-mail transacional); tempo de atendimento manual; conteúdo/marketing. |

## 4. Hipóteses que o MVP precisa testar

1. **Desejabilidade** — pessoas que já mataram plantas aceitam pagar por uma assinatura com
   plantas resistentes + lembretes, em vez de simplesmente comprar uma planta avulsa no mercado.
2. **Preço** — um ticket entre R$ 30–45/mês é aceitável para a maioria dos leads que chegam até
   o fim do formulário (sinal: taxa de leads que chegam ao passo "contato" vs. os que desistem
   ao ver o valor estimado).
3. **Canal de venda** — fechar a venda manualmente pelo WhatsApp, sem checkout automático, é
   suficiente para converter um lead em cliente pagante no estágio inicial.
4. **Personalização percebida** — montar o próprio plano (em vez de escolher entre 3 planos
   fixos) aumenta a disposição de completar o formulário e falar no WhatsApp.

## 5. O que fica manual de propósito

- **Pagamento**: o Expert fecha no WhatsApp e manda o link de pagamento à mão (Pix, link de
  cartão). Não há checkout integrado no MVP.
- **Logística real de entrega**: a compra junto ao viveiro e o agendamento do entregador são
  combinados manualmente; o painel só registra a data e os itens.
- **E-mail de novo lead**: o alerta por e-mail (Resend) é uma melhoria futura — no MVP atual o
  administrador consulta o painel diretamente.
- **Marketplace/múltiplos fornecedores**: fica para depois que a tese se confirmar.

Essas escolhas seguem o princípio do desafio: o MVP só precisa provar a tese de que **pessoas
assinam** — o resto pode (e deve) continuar manual até isso ficar claro.
