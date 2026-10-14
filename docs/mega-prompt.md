# Mega prompt — BrotaBox

O desafio pede um prompt único, em Markdown, com o fluxo do cliente, o painel de
administração e as cores, para colar em uma ferramenta de geração de app (no exemplo das
aulas, o Lovable). Este é esse prompt — é a especificação que guiou a construção do MVP
neste repositório (aqui construído diretamente em React + Express, sem o Lovable).

```markdown
# Produto: BrotaBox — assinatura de plantas fáceis de cuidar

## Contexto
Pessoas compram plantas, esquecem de cuidar e elas morrem. O BrotaBox vende uma assinatura
de plantas resistentes com lembretes de cuidado por WhatsApp, para quem não confia no
próprio hábito de cuidar de plantas.

## Fluxo do cliente (landing page pública)
1. Hero com a proposta de valor e botão "Montar meu plano".
2. "Como funciona" em 4 passos: montar plano → falar no WhatsApp → receber em casa → lembretes.
3. Formulário "Monte seu plano" em etapas:
   - Passo 1: escolher 1+ plantas de um catálogo (nome, nível de dificuldade, cuidado, preço).
   - Passo 2: escolher frequência de entrega (mensal / bimestral / trimestral, com desconto
     crescente para frequências mais longas).
   - Passo 3: escolher extras opcionais (vaso, kit de adubo, lembretes por WhatsApp).
   - Passo 4: nome, WhatsApp e e-mail (opcional).
   - Resultado: mostra o valor estimado do plano e um botão "Falar no WhatsApp" com uma
     mensagem pré-preenchida resumindo o plano escolhido.
4. Ao enviar o formulário, o lead é salvo no backend (não é só um link mailto) antes de abrir
   o WhatsApp, para que ele apareça no painel de administração mesmo que a pessoa não envie a
   mensagem.

## Painel de administração (rota protegida /admin)
- Login simples por chave de administrador (sem necessidade de cadastro de usuário).
- Aba **Leads**: lista de quem preencheu o formulário, com plano escolhido, valor estimado e
  status (novo / contatado / convertido / perdido). Ação para converter lead em cliente
  (pedindo o endereço de entrega) e ação para remover.
- Aba **Clientes**: lista de assinantes ativos, com plano, endereço e status
  (ativo / pausado / cancelado).
- Aba **Entregas**: agendar entrega (cliente, data, itens) e acompanhar status
  (agendada / enviada / entregue / atrasada).
- Aba **Lembretes**: criar lembrete (cliente, tipo: rega / adubo / cobrança / renovação, data)
  e marcar como feito.

## Dados e backend
- Sem necessidade de banco de dados próprio além de um armazenamento simples de leads,
  clientes, entregas e lembretes (no Lovable: usar o Lovable Cloud / Supabase integrado; nesta
  implementação: uma API própria com armazenamento em arquivo).
- Rotas de leitura/escrita do painel protegidas por uma chave de administrador; a criação de
  lead pelo formulário público é a única rota aberta.

## Visual e cores
- Tema "viveiro urbano": verde principal `#1F7A4D`, verde escuro `#15532F` para títulos, verde
  clarinho `#E4F2E8` para destaques e fundos de seleção, terracota `#D97B4F` como cor de
  apoio/acento, fundo geral em off-white quente `#F6F3EA`.
- Botões arredondados (pill), cards com cantos suaves (14px) e sombra leve.
- Tom de voz: direto, com leve humor sobre "matar plantas" — sem soar piadista demais.
- Totalmente responsivo: formulário em etapas vira uma coluna única no mobile; tabelas do
  painel colapsam em cartões no mobile.

## Fora de escopo deste MVP (propositalmente manual)
- Pagamento integrado (fechamento e cobrança são manuais, pelo WhatsApp).
- E-mail transacional automático de novo lead.
- Multi-fornecedor / marketplace.
```

## Correções pedidas depois do primeiro teste

Depois de montar a primeira versão, testamos o fluxo como se fôssemos um cliente real e
encontramos ajustes necessários antes de considerar o MVP pronto:

1. **Preço some durante a escolha de plantas** — no primeiro rascunho o valor estimado só
   aparecia no passo de extras; foi antecipado para aparecer logo no resumo final de cada
   etapa relevante (extras e contato), para o cliente nunca ficar sem saber o valor.
2. **Lead sem backend** — a primeira versão só abria o WhatsApp com os dados, sem registrar
   nada; corrigido para salvar o lead via API **antes** de abrir o link do WhatsApp, garantindo
   que ele apareça no painel mesmo se o cliente não enviar a mensagem.
3. **Painel aberto para qualquer pessoa** — a primeira versão do painel não tinha nenhuma
   proteção; foi adicionada a chave de administrador (`ADMIN_KEY`) exigida em todas as rotas
   de leitura/escrita do painel.
4. **Tabelas ilegíveis no celular** — as tabelas do painel quebravam o layout em telas
   pequenas; foi adicionado um modo de cartão (uma linha = um cartão) para telas estreitas.
