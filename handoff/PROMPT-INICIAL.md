# Prompt inicial — cole isto de uma vez

Este texto é para ser colado inteiro na primeira conversa do construtor,
antes de pedir qualquer ajuste. Construir a base de uma vez sai melhor do
que ir montando aos pedaços: o modelo de dados e as regras de acesso
ficam certos desde o começo, e os ajustes seguintes só mexem em tela.

Depois de colar, confira o resultado com o `INVARIANTES.md` antes de
começar a pedir mudanças.

---

Quero construir um sistema de gestão de produção chamado **BIW — Project
Management**, para a Boston Iron Works, que fabrica e instala
guarda-corpos e esquadrias.

## Como o sistema é organizado

São **dois aplicativos distintos** sobre os mesmos dados, não um app com
abas:

- **Produção** — usado pelo fabricante e pelo instalador. Cor de acento
  verde `#22B268`.
- **Gestão** — usado pelo dono da unidade. Cor de acento dourada
  `#C9A227`.

A cor muda junto para ninguém confundir em qual app está.

## Regras de acesso — construa estas primeiro

Estas quatro regras são a base do sistema. Elas precisam valer no
armazenamento dos dados, não apenas em esconder campo na tela: se a
mesma consulta for feita por fora da interface, ela também não pode
devolver o que a pessoa não deveria ver.

1. O sistema atende **várias unidades da franquia** (Georgetown MA,
   Boston MA, Providence RI, Nashua NH). **Nenhuma unidade enxerga
   dados de outra.**
2. Quem usa o app de **Produção enxerga apenas os projetos em que está
   escalado**, como fabricante ou como instalador. Não vê os projetos
   dos colegas.
3. **Valor cobrado do cliente, custo de material, lucro e margem são
   exclusivos da Gestão.** Nunca aparecem para quem é da Produção.
4. A Produção vê **um único valor: quanto a própria pessoa recebe** por
   aquele projeto — e só dos projetos dela.

Quem abre projeto, cadastra equipe e marca pagamento é a **Gestão**.

## Dados

**Unidade da franquia**: nome.

**Pessoa**: nome, telefone, ativo/inativo, e dois campos que são coisas
diferentes:
- *nível de acesso*: `Produção` ou `Gestão` — decide qual app ela abre
- *função na obra*: `Fabricante`, `Instalador` ou `Ambos` — decide em
  qual papel ela pode ser escalada num projeto

(O dono da unidade pode fabricar; um fabricante nunca vê valores.)

Quem sai da equipe fica **inativo**, nunca apagado — senão o histórico
dos projetos antigos perde o nome de quem fez.

**Projeto**: número sequencial por unidade (#1042), cliente, endereço,
**quantidade + unidade de medida** (un, m, m²), descrição do que será
feito, fabricante escalado, instalador escalado, material usado (texto
livre), status e data de instalação.

Status, nesta ordem: `Pendente` → `Em produção` → `Pronto` → `Instalado`.

**Fotos do projeto**, de três tipos:
- *Referência* — uma por projeto, enviada pela Gestão na abertura. É o
  que foi combinado com o cliente.
- *Do local* — várias, com legenda.
- *De medida* — foto **com a cota digitada junto**: o valor, a unidade e
  o tipo (largura, altura ou comprimento). A cota fica gravada junto da
  imagem.

**Observações**: texto, autor e data. Fabricante, instalador e gestão
escrevem no mesmo lugar e todos leem.

**Financeiro do projeto** (só Gestão): valor cobrado do cliente, custo de
material, custo de fabricação, custo de instalação, e duas marcações de
pagamento — pago ao fabricante e pago ao instalador, com data.

O **custo de fabricação é o que o fabricante recebe**, e o **custo de
instalação é o que o instalador recebe**. É o mesmo número visto dos
dois lados.

## Cálculos

- Lucro = valor cobrado − (material + fabricação + instalação)
- Margem % = lucro ÷ valor cobrado
- **O período de um projeto** é a data de instalação; se ela ainda não
  estiver marcada, vale a data de abertura do projeto. Escreva isso na
  tela, para o número não parecer mágico.
- "A receber" = projetos do período em que a pessoa está escalada e que
  ainda não foram marcados como pagos.

## Telas

### Login
Escolher a unidade da franquia, e-mail e senha. Seletor de idioma
sempre visível. Logo da empresa em verde sobre fundo escuro, sem caixa
branca.

### Produção — tela inicial
- **Em produção agora** e **Próxima instalação**, em cards com a foto de
  referência, cliente, endereço e quantidade
- **Meus recebimentos**: a receber nesta semana, a receber neste mês, já
  recebido no mês, a receber no total
- **Visão do mês**: quantos projetos, em produção, prontos, instalados
- **Equipe da unidade**: quem é quem e o telefone clicável.
  **Sem contagem de projetos por pessoa** — como cada um vê só os seus,
  um número aqui falaria de quem está olhando, não de quem está listado.
- **Meus projetos**: tabela com cliente/endereço, foto de referência,
  quantidade, **quanto você recebe**, fabricante, instalador, data de
  instalação e status

### Tela do projeto — a mais importante
Ela abre com um **bloco de destaque, antes de qualquer outra coisa**:

> foto de referência grande · **quantidade em corpo bem grande**, com a
> unidade ao lado · o aviso "Confira antes de produzir: a quantidade e a
> foto de referência acima são o que foi combinado com o cliente.
> Qualquer diferença, fale com a gestão antes de cortar material."

Esses dois campos têm esse peso porque **produzir a quantidade errada e
produzir o modelo errado são os erros mais comuns na oficina**. Não os
transforme numa linha de texto no meio da tela.

Abaixo disso: cliente e endereço; escalação de fabricante e instalador
(seletor filtrado pela função — quem é só instalador não aparece como
opção de fabricante); material usado, editável; andamento do status,
com as quatro etapas clicáveis; galeria de fotos do local com botão de
enviar; galeria de fotos de medida, cada uma mostrando a cota; e
observações, com o histórico de quem escreveu e quando.

Para a Produção, mostre também **quanto ela recebe por este projeto**,
marcado como *A receber* ou *Pago*.
Para a Gestão, mostre o **bloco financeiro**: os quatro valores, o lucro
e a margem calculados automaticamente, e um botão de marcar pagamento
para o fabricante e outro para o instalador. Editar os valores depois
**não** pode desfazer um pagamento já registrado.

### Gestão — tela inicial
- Filtro de período: **Semana / Mês / Total**, que muda todos os números
  da tela
- Faturamento, custos totais, lucro e margem média do período
- Gráfico de barras de custo e lucro por mês (o gráfico é sempre mensal,
  mostra a evolução; o filtro move os números do topo)
- **Por fabricante**: faturamento, custo, lucro e margem de cada
  fabricante no período, mais uma linha para os projetos **sem
  fabricante escalado** — senão esse dinheiro sumiria da conta
- Tabela de projetos com valor, custos, lucro e margem
- Botão de **abrir projeto novo**

### Equipe
Cadastro de pessoas com nome, telefone, função na obra e nível de
acesso. Os números de cada pessoa (quantos fabricou, quantos instalou,
faturamento) aparecem só para a Gestão ou para a própria pessoa.

## Idioma, moeda e formato

- **Português, inglês e espanhol**, com o seletor sempre visível em
  qualquer tela
- **Valores sempre em dólar**, no formato americano: `$27,000` e
  `$4,200.00`, em qualquer idioma
- Datas seguem o idioma: `15/08/2026` em português e espanhol,
  `08/15/2026` em inglês

## Visual

Tema escuro. Fundo quase preto `#0A0C0B`, cartões `#141614`, bordas
`#282D29`, texto `#F0F3F1`.

Acento verde `#22B268` na Produção e dourado `#C9A227` na Gestão.

Cores de status, separadas do acento da marca:
- Pendente: cinza
- Em produção: âmbar `#E2A33C`
- Pronto: azul `#6FB8DF`
- Instalado: verde `#3FCB84`

**Tem que funcionar bem no celular** — é onde o fabricante usa, no pátio
da oficina, às vezes com sol na tela. Fonte grande o suficiente para ler
de longe, e nada de rolagem lateral na página.
