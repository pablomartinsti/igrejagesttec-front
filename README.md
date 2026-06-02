# IgrejaGestTec — Frontend

Frontend do sistema de gestão financeira e espiritual para igrejas. Desenvolvido com **React**, **TypeScript** e **Styled Components**.

---

## 🚀 Funcionalidades implementadas

### ✅ Autenticação

- Tela de login com validação via Zod
- Armazenamento de token JWT no localStorage
- Contexto de autenticação global
- Rotas protegidas — redireciona para login se não autenticado

### ✅ Layout

- Menu lateral responsivo com navegação
- Header com nome da tela e informações do usuário
- Menu hamburguer para dispositivos móveis
- Botão de logout

### 🔜 Dashboard _(em desenvolvimento)_

### 🔜 Cultos _(planejado)_

### 🔜 Transações _(planejado)_

### 🔜 Categorias _(planejado)_

### 🔜 Relatórios _(planejado)_

### 🔜 Configurações _(planejado)_

---

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** — bundler
- **React Router DOM** — navegação
- **Styled Components** — estilização
- **React Hook Form** + **Zod** — formulários e validação
- **Axios** — requisições HTTP
- **Recharts** — gráficos
- **Day.js** — manipulação de datas

---

## ⚙️ Pré-requisitos

- Node.js 18+
- npm
- API do IgrejaGestTec rodando em `http://localhost:3333`

---

## 🚀 Rodando localmente

**1. Clone o repositório**

```bash
git clone https://github.com/pablomartinsti/igrejagesttec-front.git
cd igrejagesttec-front
```

**2. Instale as dependências**

```bash
npm install
```

**3. Configure o ambiente**

Crie um arquivo `.env` na raiz:

```env
VITE_API_URL=http://localhost:3333
```

**4. Inicie o servidor**

```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🔐 Autenticação

O sistema usa JWT. Ao fazer login, o token é salvo no `localStorage` e enviado automaticamente em todas as requisições via header `Authorization: Bearer token`.

**Perfis de acesso:**

| Perfil   | Permissões                            |
| -------- | ------------------------------------- |
| `ADMIN`  | Acesso total — cria, edita, visualiza |
| `PASTOR` | Somente visualização                  |

---

## 🗄️ Estrutura do projeto

```
src/
  components/
    layout/        — menu lateral + topbar
  contexts/
    auth.context   — autenticação global
  hooks/           — hooks personalizados
  pages/
    login/         — tela de login
    dashboard/     — painel principal
    cultos/        — gestão de cultos
    transacoes/    — gestão de transações
    categorias/    — gestão de categorias
    relatorios/    — relatórios
    configuracoes/ — configurações
  routes/          — definição de rotas
  services/
    api.ts         — cliente axios configurado
  styles/
    theme.ts       — tema global
    global.ts      — estilos globais
  utils/           — funções utilitárias
  validators/      — schemas Zod
```

---

## 📦 Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Compilar para produção
npm run preview  # Visualizar build
```

---

## 📄 Licença

MIT — consulte o arquivo [LICENSE](LICENSE) para detalhes.
