# BIW — Project Management

Especificação do sistema de gestão de produção da Boston Iron Works.

Este documento existe para o sistema poder ser reconstruído ou continuado
em qualquer ferramenta, sem depender do código deste repositório nem de
quem esteve na conversa. Descreve **o que** o sistema faz e **por quê**,
não como está implementado.

---

## 1. O problema

Franqueados da Boston Iron Works fabricam e instalam guarda-corpos e
esquadrias. Precisam acompanhar cada trabalho da abertura até a
instalação, e saber quanto cada trabalho deu de lucro.

Dois erros acontecem com frequência na oficina e o sistema precisa
atacá-los de frente: **produzir a quantidade errada** e **produzir o
modelo errado**.

---

## 2. Multi-tenant: uma unidade por franquia

Cada unidade da franquia (Georgetown MA, Boston MA, Providence RI,
Nashua NH…) tem os próprios trabalhos, a própria equipe e os próprios
números.

**Nenhuma unidade enxerga dados de outra.** O isolamento tem que estar
no banco de dados, não só na tela — uma chamada de API feita por fora do
app não pode devolver dados de outra unidade.

---

## 3. Dois aplicativos, não um com abas

| | **Produção** | **Gestão** |
|---|---|---|
| Quem usa | Fabricante e instalador | Dono da unidade |
| Cor | Verde da marca | Dourado |
| Vê o quê | Só os trabalhos em que a pessoa está escalada | Todos os trabalhos da unidade |
| Abre projeto | Não | Sim |
| Financeiro | Só quanto a própria pessoa recebe | Preço, custos, lucro, margem |

A cor muda junto para ninguém confundir em qual app está.

### Regras de acesso, na ordem de importância

1. **Ninguém vê dados de outra unidade.**
2. **Quem é da produção vê apenas os trabalhos em que está escalado**,
   como fabricante ou como instalador.
3. **Preço cobrado do cliente, custo de material, lucro e margem são
   exclusivos da gestão.** Não podem estar na tela nem na resposta da
   API para quem é da produção.
4. **A produção vê um único valor: quanto ela mesma recebe**, e só do
   próprio trabalho. Vem de uma consulta dedicada que devolve apenas as
   linhas de quem pediu — não de acesso à tabela financeira.
5. Cadastrar equipe, abrir projeto e marcar pagamento são da gestão.

> Consequência conhecida: um trabalho **sem fabricante escalado** não
> aparece para ninguém da produção, só para a gestão. É intencional
> (a gestão escala), mas é uma decisão a revisitar se a operação
> preferir que a produção "pegue" trabalhos disponíveis.

---

## 4. Modelo de dados

### Unidade (`tenants`)
`nome`, `slug`.

### Pessoa (`profiles`)
Ligada ao usuário de autenticação.

- `unidade`
- `nível de acesso`: `producao` | `gestao` — decide **qual app abre**
- `função na obra`: `fabricante` | `instalador` | `ambos` — decide **onde
  pode ser escalada**
- `nome`, `telefone`, `ativo`

Nível de acesso e função são coisas diferentes: o dono da unidade pode
fabricar, e um fabricante nunca vê valores.

Quem sai da equipe fica **inativo**, não é apagado — senão o histórico
dos projetos antigos perde o nome de quem fez.

### Projeto (`jobs`)
Aberto pela gestão; a produção preenche o resto.

- `número` sequencial por unidade (#1042)
- `cliente`, `endereço`
- **`quantidade` + `unidade`** (un, m, m²) — campo crítico
- `descrição` ("guarda-corpo de varanda, escada e deck")
- `fabricante` e `instalador` (pessoas da equipe)
- `material usado` — texto livre, preenchido pela produção
- `status`: `pendente` → `em_producao` → `pronto` → `instalado`
- `data de instalação`

### Fotos (`job_photos`)
Três tipos, todos ligados ao projeto:

- **`referencia`** — uma por trabalho, enviada na abertura pela gestão.
  É o que foi combinado com o cliente. Campo crítico.
  Não existe catálogo de modelos: a foto é por trabalho.
- **`local`** — fotos do lugar, com legenda
- **`medida`** — foto **mais a cota digitada junto**: valor, unidade e
  tipo (largura, altura ou comprimento). A cota fica gravada para
  ninguém depender da lembrança de quem foi ao local.

### Observações (`job_notes`)
Texto, autor e data. Fabricante, instalador e gestão escrevem no mesmo
lugar, e todos leem.

### Financeiro (`job_financials`)
Tabela **separada** de propósito, para a produção simplesmente não ter
permissão de leitura nela.

- `valor cobrado do cliente`
- `custo de material`
- `custo de fabricação` — **é o que o fabricante recebe**
- `custo de instalação` — **é o que o instalador recebe**
- `pago ao fabricante em`, `pago ao instalador em`
- calculados: custo total, lucro, margem %

Editar os valores depois **não desfaz** um pagamento já registrado.

---

## 5. Telas

### Login
Escolhe a unidade da franquia, e-mail e senha. Seletor de idioma sempre
visível. Logo da empresa em verde sobre fundo escuro, sem caixa branca,
com o nome do sistema abaixo.

### Produção — lista
- **Em produção agora** e **Próxima instalação**, em cards com foto
- **Meus recebimentos**: a receber nesta semana, neste mês, já recebido
  no mês, total pendente
- **Visão do mês**: quantos trabalhos, em produção, prontos, instalados
- **Equipe da unidade**: quem é quem, com telefone clicável.
  Sem contagem de trabalhos — como cada um vê só os seus, o número
  falaria de quem está olhando, não de quem está listado.
- **Todos os trabalhos**: tabela com "Você recebe"

### Projeto (a tela mais importante)
Abre com um bloco de destaque, antes de qualquer outra coisa:

> **Foto de referência grande** · **quantidade em corpo enorme** ·
> "Confira antes de produzir — qualquer diferença, fale com a gestão
> antes de cortar material."

Esses dois campos ganharam esse peso porque são a causa mais comum de
erro. Não podem voltar a ser uma linha de texto no meio da tela.

Abaixo: cliente e endereço, escalação de fabricante e instalador,
material usado, andamento do status, fotos do local, fotos das medidas,
observações. Para a gestão, também o bloco financeiro.

### Gestão — visão geral
- Filtro de período: **semana / mês / total**, que move faturamento,
  custos, lucro, margem, a lista de margens e a tabela
- Gráfico de custos e lucro por mês (sempre mensal, mostra evolução)
- **Por fabricante**: faturamento, custo, lucro e margem de cada um no
  período, mais uma linha para os trabalhos sem fabricante escalado —
  senão esse dinheiro sumiria da conta
- Tabela de trabalhos com resultado, e botão de abrir projeto novo

### Equipe
Cadastro de pessoas: nome, telefone, função na obra e nível de acesso.
Números de cada pessoa aparecem só para a gestão ou para a própria
pessoa.

---

## 6. Regras de cálculo

- **Lucro** = valor cobrado − (material + fabricação + instalação)
- **Margem %** = lucro ÷ valor cobrado
- **O período de um trabalho** é a **data de instalação**; sem data
  marcada, vale a **data de abertura** do projeto. Isso está escrito na
  tela, para o número não parecer mágico.
- **A receber** = trabalhos do período em que a pessoa está escalada e
  que ainda não foram marcados como pagos.

---

## 7. Idioma e moeda

- **Português, inglês e espanhol**, trocáveis a qualquer momento, com o
  seletor sempre visível
- **Valores sempre em dólar**, formato americano (`$27,000` /
  `$4,200.00`), em qualquer idioma
- Datas seguem o idioma: `15/08/2026` em português e espanhol,
  `08/15/2026` em inglês

---

## 8. Visual

Tema escuro. Verde da marca (`#22B268`) no app de Produção, dourado
(`#C9A227`) no de Gestão. Fundo quase preto (`#0A0C0B`), cartões em
`#141614`.

Cores de status, separadas do acento da marca:
pendente cinza · em produção âmbar · pronto azul · instalado verde.

Precisa funcionar no celular de verdade — é onde o fabricante usa, na
oficina. Fonte grande o suficiente para ler de longe.

---

## 9. Onde roda

- **Site**, aberto pelo navegador do celular e do computador. Sem loja
  de aplicativo. Dá para adicionar à tela de início e virar ícone.
- **Banco e fotos**: Supabase (plano pago — o gratuito pausa o projeto
  depois de uma semana sem uso e não faz backup)
- **Fotos**: comprimir no envio (~1600px). Cerca de 3 MB por projeto.

---

## 10. O que ainda não existe

- **Envio de foto de verdade** — as telas registram legenda e cota, mas
  a imagem em si depende do armazenamento de arquivos
- **Login real** — depende do serviço de autenticação
- Notificação, relatório exportável, fechamento de pagamento em lote

---

## 11. O que este repositório tem de aproveitável

Independente da ferramenta que for usada daqui pra frente:

- **`supabase/migrations/`** — o banco inteiro em SQL: tabelas, as
  regras de isolamento por unidade e por pessoa, e a consulta que
  entrega a cada um só o próprio recebimento. Funciona em qualquer
  projeto Supabase, com qualquer front-end.
- **`src/components/Logo.tsx`** — a marca em vetor, que desenha na cor
  de quem a usa
- **`src/lib/i18n.ts`** — os três idiomas já traduzidos
- **`src/lib/types.ts`** — os cálculos de lucro, margem e período
