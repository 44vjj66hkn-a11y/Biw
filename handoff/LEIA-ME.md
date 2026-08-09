# Levar para outra ferramenta

Pasta com tudo que é independente deste código. Serve para continuar o
sistema em qualquer construtor de aplicativos.

## Ordem de uso

**1. Antes de construir qualquer tela**, verifique se a ferramenta
consegue fazer isto, porque é o pilar do sistema:

> Um usuário enxerga apenas as linhas de uma tabela em que ele é o
> responsável, e certas colunas dessa tabela são invisíveis para o
> perfil dele — valendo também fora da interface, não só na tela.

Se a resposta for "dá para esconder na tela", **não é a mesma coisa**.
Nesse caso, considere manter o banco no Supabase (se a ferramenta
aceitar banco externo) e rodar os arquivos de `supabase/migrations/`,
que já resolvem isso.

**2. Cole o `PROMPT-INICIAL.md` inteiro** na primeira conversa. Construir
a base de uma vez sai melhor do que ir montando aos pedaços.

**3. Confira o resultado** com a lista do `INVARIANTES.md`, entrando por
um usuário de teste com acesso de Produção.

**4. A cada mudança grande**, cole junto o bloco de invariantes.

## O que tem aqui

| Arquivo | Para quê |
|---|---|
| `PROMPT-INICIAL.md` | O sistema inteiro descrito para colar de uma vez |
| `INVARIANTES.md` | As regras que não podem quebrar + conferência |
| `logo-boston-iron-works.svg` | A marca em vetor, verde. Troque o `fill` para `#C9A227` na versão da Gestão |
| `traducoes.csv` | 117 textos em português, inglês e espanhol |

## Fora desta pasta

| Onde | O quê |
|---|---|
| `../ESPECIFICACAO.md` | A especificação completa, com o porquê de cada decisão |
| `../supabase/migrations/` | O banco em SQL, com o isolamento por unidade e por pessoa já resolvido. Funciona em qualquer projeto Supabase, com qualquer front-end |

## Cores

```
fundo          #0A0C0B
cartão         #141614
borda          #282D29
texto          #F0F3F1
texto fraco    #98A29B

acento Produção  #22B268   (verde da marca)
acento Gestão    #C9A227   (dourado)

status pendente     cinza #98A29B
status em produção  âmbar #E2A33C
status pronto       azul  #6FB8DF
status instalado    verde #3FCB84
```
