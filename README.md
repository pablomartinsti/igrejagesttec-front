# IgrejaGestTec Frontend

Frontend do IgrejaGestTec, sistema de gestao financeira e espiritual para igrejas.

A aplicacao foi criada com React, TypeScript, Vite, Styled Components, React Hook Form, Zod e Axios. Ela consome a API do IgrejaGestTec e entrega as telas de painel, cultos, transacoes, categorias, relatorios e configuracoes.

## Estado Atual

O frontend ja possui:

- Login com JWT.
- Persistencia de usuario, igreja e token no `localStorage`.
- Layout autenticado com menu lateral e informacoes do usuario.
- Painel financeiro com filtro por periodo.
- Card de saldo em caixa e saldo do periodo.
- Grafico de gastos por categoria.
- Grafico de evolucao financeira anual.
- Cadastro e listagem de categorias financeiras.
- Cadastro e listagem de categorias de culto.
- Cadastro e listagem de cultos.
- Tela de detalhes do culto.
- Lancamentos financeiros vinculados ao culto, incluindo dizimos e ofertas.
- Lancamento financeiro vinculado ao culto.
- Registros espirituais por culto.
- Transacoes avulsas fora do culto.
- Relatorio geral financeiro e espiritual.
- Tela de configuracoes para admin editar dados da igreja e criar usuarios.
- Permissoes visuais por perfil.

## Tecnologias

- React 18
- TypeScript
- Vite
- React Router
- Styled Components
- React Hook Form
- Zod
- Axios
- Day.js
- Recharts / Nivo

## Requisitos

- Node.js 18+
- npm
- API do IgrejaGestTec rodando

## Configuracao Local

Instale as dependencias:

```bash
npm install
```

Crie o arquivo `.env` na raiz do front:

```env
VITE_API_URL=http://localhost:3333
```

Inicie o front:

```bash
npm run dev
```

URL padrao:

```txt
http://localhost:5173
```

## Scripts

```bash
npm run dev      # inicia o Vite em desenvolvimento
npm run build    # compila TypeScript e gera build de producao
npm run preview  # abre preview do build
npm run lint     # roda ESLint nos arquivos TS/TSX
npm run format   # formata arquivos do src com Prettier
```

## Autenticacao

O contexto de autenticacao fica em:

```txt
src/contexts/auth.context.tsx
```

Chaves salvas no `localStorage`:

```txt
@igrejagesttec:token
@igrejagesttec:user
@igrejagesttec:church
```

O cliente Axios fica em:

```txt
src/services/api.ts
```

Ele usa `VITE_API_URL` e envia o token no header:

```txt
Authorization: Bearer token
```

## Perfis e Permissoes no Front

| Perfil | Comportamento na interface |
| --- | --- |
| `ADMIN` | Ve configuracoes, cria usuarios, cria/edita/lanca e exclui dados |
| `TREASURER` | Cria e edita cultos, categorias e lancamentos; nao ve botoes de excluir |
| `PASTOR` | Visualiza dados, cultos, painel, transacoes e relatorios |

Regras importantes:

- `Configuracoes` aparece apenas para `ADMIN`.
- Botoes de exclusao aparecem apenas para `ADMIN`.
- Botoes de criacao/edicao operacional aparecem para `ADMIN` e `TREASURER`.

Arquivos principais de permissao:

```txt
src/components/layout/index.tsx
src/routes/index.tsx
src/pages/cultos/index.tsx
src/pages/culto-detalhe/index.tsx
src/pages/transacoes/index.tsx
src/pages/categorias/index.tsx
```

## Rotas do Front

| Rota | Tela | Observacao |
| --- | --- | --- |
| `/login` | Login | Publica |
| `/dashboard` | Painel | Requer login |
| `/cultos` | Cultos | Lista cultos e categorias de culto |
| `/cultos/:id` | Detalhes do culto | Registros espirituais e lancamentos financeiros do culto |
| `/transacoes` | Transacoes | Lancamentos avulsos e filtros |
| `/categorias` | Categorias financeiras | Categorias usadas em transacoes |
| `/relatorios` | Relatorios | Resumo financeiro e espiritual |
| `/configuracoes` | Configuracoes | Apenas `ADMIN` |

## Services

Os arquivos em `src/services` concentram as chamadas para a API.

| Arquivo | Responsabilidade |
| --- | --- |
| `api.ts` | Instancia Axios e baseURL |
| `api-types.ts` | Tipos compartilhados pelas telas |
| `dashboard.service.ts` | Dashboard e evolucao financeira |
| `categories.service.ts` | Categorias financeiras |
| `cultos.service.ts` | Cultos, categorias de culto, categorias e registros espirituais |
| `transactions.service.ts` | Transacoes avulsas e vinculadas ao culto |
| `churches.service.ts` | Dados da igreja |
| `users.service.ts` | Usuarios |

Sempre que uma resposta da API mudar, revise primeiro:

```txt
src/services/api-types.ts
```

Depois ajuste o service e a tela que consome esse dado.

## Paginas

```txt
src/pages/login
src/pages/dashboard
src/pages/cultos
src/pages/culto-detalhe
src/pages/transacoes
src/pages/categorias
src/pages/relatorios
src/pages/configuracoes
```

Cada pagina segue o padrao:

```txt
index.tsx   # logica, formularios e chamadas de API
styles.ts   # componentes styled-components da tela
```

## Fluxos Principais

### Fluxo financeiro avulso

1. Criar categoria financeira em `Categorias`.
2. Criar transacao em `Transacoes`.
3. Conferir resultado no `Painel`.
4. Conferir resultado em `Relatorios`.

### Fluxo de culto

1. Criar categoria de culto em `Cultos > Categorias`.
2. Criar culto informando data, categoria e pregador.
3. Abrir `Ver detalhes`.
4. Lancar dizimos e ofertas como entradas financeiras do culto.
5. Lancar registros espirituais.
6. Lancar transacao vinculada ao culto, se necessario.
7. Conferir painel e relatorios.

### Fluxo de configuracao

1. Entrar como `ADMIN`.
2. Abrir `Configuracoes`.
3. Atualizar dados da igreja.
4. Criar usuarios `ADMIN`, `TREASURER` ou `PASTOR`.

## Padroes de Dados

- Valores financeiros chegam da API em centavos.
- Use `formatCurrency` para exibir valores em reais.
- Datas de input usam `YYYY-MM-DD`.
- Use `formatDate` antes de enviar datas para a API quando a tela permitir digitacao ou selecao.
- Transacao vinculada ao culto envia `cultoId`.
- Transacao avulsa nao envia `cultoId`.

Utilitarios:

```txt
src/utils/format-currency.ts
src/utils/format-date.ts
```

## Como Dar Manutencao

### Criar uma nova tela

1. Crie a pasta em `src/pages/nome-da-tela`.
2. Crie `index.tsx` e `styles.ts`.
3. Adicione a rota em `src/routes/index.tsx`.
4. Se precisar aparecer no menu, adicione em `src/components/layout/index.tsx`.
5. Crie ou reutilize um service em `src/services`.
6. Atualize tipos em `src/services/api-types.ts`, se necessario.
7. Rode `npm run build`.

### Alterar permissao de um botao

Use o padrao:

```ts
const canManage = user?.role === 'ADMIN' || user?.role === 'TREASURER';
const canDelete = user?.role === 'ADMIN';
```

Regra atual:

- Criar/editar/lancar: `canManage`.
- Excluir: `canDelete`.
- Configuracoes: apenas `ADMIN`.

### Alterar uma chamada da API

1. Ajuste o metodo no service correspondente.
2. Ajuste o tipo em `api-types.ts`.
3. Ajuste a tela que chama o service.
4. Teste manualmente no front.
5. Rode `npm run build`.

## Checklist de Teste Manual

Antes de apresentar para cliente:

1. Logar como `ADMIN`.
2. Atualizar dados da igreja em `Configuracoes`.
3. Criar usuario `TREASURER`.
4. Criar categoria financeira.
5. Criar categoria de culto.
6. Criar culto.
7. Entrar nos detalhes do culto.
8. Lancar dizimo/oferta usando a categoria financeira correspondente.
9. Lancar registro espiritual.
10. Lancar transacao avulsa.
11. Verificar painel.
12. Verificar relatorios.
13. Logar como `TREASURER` e confirmar que cria/edita, mas nao exclui.
14. Logar como `PASTOR` e confirmar visualizacao.

## Build

```bash
npm run build
```

O build precisa passar antes de qualquer commit de entrega.
