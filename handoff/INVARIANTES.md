# Invariantes — o que não pode quebrar

Construtor por conversa esquece restrição antiga quando você pede coisa
nova. Cole o bloco abaixo **no fim de todo pedido de mudança grande**, e
use a lista de conferência depois de cada tanda de alterações.

---

## Bloco para colar junto do pedido

> Ao fazer esta mudança, mantenha valendo:
>
> 1. Nenhuma unidade da franquia enxerga dados de outra.
> 2. Quem usa o app de Produção enxerga apenas os projetos em que está
>    escalado, como fabricante ou instalador.
> 3. Valor cobrado do cliente, custo de material, lucro e margem só
>    aparecem para a Gestão. O único valor que a Produção vê é quanto a
>    própria pessoa recebe, nos projetos dela.
> 4. Isso vale no armazenamento dos dados, não só em esconder campo na
>    tela: a mesma consulta feita por fora da interface também não pode
>    devolver o que a pessoa não deveria ver.
> 5. Abrir projeto, cadastrar equipe e marcar pagamento são da Gestão.
> 6. Na tela do projeto, a foto de referência e a quantidade continuam
>    no bloco de destaque no topo, em corpo grande.
> 7. Valores sempre em dólar. Idiomas português, inglês e espanhol.

---

## Conferência depois de mudar

O perigo não é quebrar uma tela — isso você vê na hora. É **vazar sem
ver**, porque você confere pelo seu próprio acesso de Gestão, onde tudo
aparece de qualquer jeito.

Por isso: **crie um usuário de teste com acesso de Produção** e escalado
em um ou dois projetos. Depois de cada tanda de mudanças, entre por ele
e confira:

- [ ] Ele vê **só os projetos dele**? Some algum projeto de colega na
      lista, na busca ou em algum relatório?
- [ ] Em nenhuma tela aparece **valor cobrado do cliente, custo de
      material, lucro ou margem**?
- [ ] O valor "você recebe" mostrado é o **dele**, e não o de outra
      pessoa?
- [ ] Ele **não** consegue abrir projeto novo, editar a equipe nem
      marcar pagamento?
- [ ] A tela do projeto ainda abre com **foto de referência e
      quantidade em destaque**?
- [ ] No **celular**, nenhuma tela rola para o lado?

Leva um minuto e é a única forma de enxergar o problema.

---

## Decisões já tomadas — não refaça sem querer

Coisas que parecem detalhe mas foram decididas por um motivo:

- **A foto de referência é por projeto, não catálogo de modelos.**
  Chegou-se a considerar uma lista fixa de modelos com código; foi
  descartado.
- **O período de um projeto é a data de instalação**; sem data marcada,
  vale a data de abertura. Está escrito na tela de propósito.
- **O gráfico da Gestão é sempre mensal**, mesmo quando o filtro está em
  Semana ou Total. Ele mostra evolução; o filtro move os números do topo.
- **Projetos sem fabricante escalado** aparecem numa linha própria no
  "Por fabricante" — senão esse faturamento sumiria da conta.
- **O painel de equipe da Produção não tem contagem de projetos.** Como
  cada um só vê os seus, o número falaria de quem está olhando.
- **Quem sai da equipe fica inativo, não é apagado**, para o histórico
  dos projetos antigos não perder o nome de quem fez.
- **Editar valores do financeiro não desfaz um pagamento já marcado.**
- **O custo de fabricação é o que o fabricante recebe** — é o mesmo
  número visto dos dois lados, não são dois campos diferentes.

---

## Ponto em aberto

Um projeto **sem fabricante escalado** hoje não aparece para ninguém da
Produção, só para a Gestão. É consequência da regra 2 e foi decidido
assim (a Gestão escala). Se a operação preferir que a produção "pegue"
trabalhos disponíveis, essa é a regra a mudar — e só ela.
