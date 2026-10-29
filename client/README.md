# 🎨 Study Organizer — Frontend

Interface web do Study Organizer: organize disciplinas, acompanhe o progresso pelos tópicos concluídos e registre o tempo de estudo. Consome a API REST de [`server/`](../server/README.md).

> O escopo completo (regras de cada tela, paleta, contrato da API e backlog) está em [`docs/refinamento/frontend-escopo.md`](../docs/refinamento/frontend-escopo.md). Este README resume o que foi construído e como o projeto está organizado.

## 📋 Sumário

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#️-tecnologias)
- [Como rodar](#-como-rodar)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Arquitetura](#️-arquitetura)
- [Prototipação e identidade visual](#-prototipação-e-identidade-visual)
- [Acessibilidade](#-acessibilidade)
- [Testes e verificação](#-testes-e-verificação)
- [Como o frontend foi construído](#-como-o-frontend-foi-construído)
- [Próximos passos (fase 2)](#-próximos-passos-fase-2)

## ✨ Funcionalidades

| Rota | Tela | O que faz |
| --- | --- | --- |
| `/cadastro` | Criar conta *(pública)* | Cria a única conta do app; só fica disponível enquanto não existe nenhuma |
| `/login` | Entrar *(pública)* | E-mail, senha (mostrar/ocultar) e "Lembrar de mim" (30 dias; sem ela, 8 horas) |
| `/` | Dashboard | Tempo total, tempo da semana, disciplinas, tópicos concluídos, gráfico dos últimos 7 dias, progresso por disciplina e sessões recentes |
| `/disciplinas` | Disciplinas | Cards com progresso, tópicos e tempo estudado; criar, editar e excluir |
| `/disciplinas/:id` | Detalhe | Cabeçalho com progresso e as abas **Tópicos** e **Sessões** (`?aba=sessoes`) |
| `*` | Não encontrada | Rota inexistente ou disciplina que não existe (404 da API) |

**Autenticação**
- Ao abrir o app, `GET /api/Auth/me` decide entre mostrar o app ou ir para `/login` (ou `/cadastro`, se ainda não há conta). A página que a pessoa tentou abrir é guardada e reaberta depois do login.
- Qualquer resposta 401 encerra a sessão e mostra "Sua sessão expirou".
- Limite de tentativas (429): o botão de entrar fica bloqueado por 60 segundos, com contagem regressiva.

**Disciplinas**
- Nome de 1 a 80 caracteres e descrição de até 200. Nome duplicado mostra o erro da API dentro do formulário.
- A exclusão avisa o que será apagado junto: *"Isso também apagará 10 tópicos e 7 sessões."*

**Tópicos**
- Filtro **Todos | Pendentes | Concluídos**; pendentes primeiro.
- Marcar e desmarcar como concluído é **imediato**: a lista, o contador e a barra de progresso mudam na hora. Se a API falhar, só aquele tópico volta ao estado anterior.

**Sessões**
- Data em `dd/mm/aaaa` (com calendário em português) e horários em **24h** (`hh:mm`).
- A duração aparece enquanto se digita. Sessões que passam da meia-noite são aceitas: 23:00–01:00 conta 2h e o formulário mostra "termina em 14/10".
- Validações: fim diferente do início, no máximo 12h e nada no futuro.
- Se a sessão coincidir com outra da mesma disciplina, aparece um aviso amarelo, que não impede salvar.
- Lista com as 10 mais recentes e o botão "Ver mais".

**Em todas as telas**
- Estados de carregamento (blocos no formato do conteúdo), vazio (com botão de ação) e erro (com "Tentar novamente").
- Tema claro e escuro, layout responsivo e menu lateral que vira gaveta no celular.
- Formulários de criar e editar sempre em janela modal; avisos de sucesso e erro com toast.

## 🛠️ Tecnologias

| Área | Escolha |
| --- | --- |
| Base | React 19, TypeScript, Vite 8 |
| Estilo | Tailwind CSS v4, fonte Inter, `tw-animate-css` |
| Componentes | shadcn/ui (Radix UI) e ícones lucide-react |
| Rotas | React Router 7 (`createBrowserRouter`, páginas com `lazy`) |
| Dados da API | Axios + TanStack Query v5 |
| Formulários | React Hook Form + Zod v4 |
| Datas | date-fns (locale `ptBR`) e react-day-picker (calendário) |
| Gráfico | shadcn Chart (Recharts 3) |
| Avisos | react-hot-toast |
| Qualidade | Vitest, ESLint, Prettier |

## 🚀 Como rodar

Pré-requisitos: **Node.js 20.19+** e a API rodando em `http://localhost:5071` (veja o [README do backend](../server/README.md)).

```bash
cd client
npm install
npm run dev        # http://localhost:5173
```

Em desenvolvimento, o Vite encaminha `/api` para a API. Assim, front e API ficam na mesma origem, o cookie de login funciona e não é preciso configurar CORS. Para apontar para outra API (por exemplo, uma cópia de teste):

```bash
API_PROXY_TARGET=http://localhost:5072 npx vite --port 5180
```

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos (`tsc -b`) + build de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | ESLint |
| `npm test` | Testes do Vitest (`src/**/*.test.ts`) |
| `npm run test:watch` | Vitest em modo observação |

## 📂 Estrutura de pastas

```text
client/
├── public/
│   └── favicon.svg            # Ícone do app (livro sobre lavanda)
├── index.html                 # Aplica o tema salvo antes de pintar a página
├── vite.config.ts             # Proxy /api, atalho @/ → src/ e Vitest
├── components.json            # Configuração do shadcn/ui
└── src/
    ├── main.tsx / App.tsx     # QueryClient, AuthProvider, Toaster e rotas
    ├── index.css              # Paleta pastel (claro e escuro) como variáveis do Tailwind
    ├── routes/
    │   ├── router.tsx         # Mapa de rotas; cada página é carregada sob demanda
    │   ├── RotaProtegida.tsx  # Sem sessão → /login (ou /cadastro)
    │   └── RotaPublica.tsx    # Já logado → volta para a página de origem
    ├── layouts/
    │   ├── LayoutApp.tsx      # Menu lateral, "Pular para o conteúdo", foco ao trocar de página
    │   ├── LayoutAuth.tsx     # Cartão centralizado do login e do cadastro
    │   └── Sidebar.tsx        # Navegação, tema e botão Sair
    ├── pages/
    │   ├── Login/  Register/
    │   ├── Dashboard/         # Dashboard, cards de resumo e gráfico da semana
    │   ├── Subjects/          # Lista de disciplinas e card
    │   ├── SubjectDetails/    # Cabeçalho, aba Tópicos e aba Sessões
    │   └── NotFound/
    ├── components/
    │   ├── ui/                # Componentes do shadcn/ui (tema pastel)
    │   ├── shared/            # EmptyState, ErrorState, ConfirmDialog, ProgressBar, DateInput, TimeInput...
    │   ├── brand/             # Logo e ícone do app
    │   ├── subjects/          # Formulário, menu ⋮ e exclusão de disciplina
    │   ├── topics/            # Formulário e item de tópico
    │   └── sessions/          # Formulário de registrar sessão
    ├── contexts/AuthContext.tsx # Liga o 401 ao fim da sessão
    ├── hooks/                 # Hooks do TanStack Query, queryKeys, tema, título da aba
    ├── services/              # Axios (api.ts) e um service por recurso da API
    ├── schemas/               # Schemas Zod dos formulários (+ testes)
    ├── lib/                   # Regras puras: datas, sessões, tópicos, dashboard, máscaras (+ testes)
    └── types/                 # Tipos da API escritos à mão
```

## 🏗️ Arquitetura

### Fluxo de dados

```text
Página → hook (TanStack Query) → service (Axios, baseURL /api) → proxy do Vite → API
```

- **Services** (`services/`) só fazem as chamadas HTTP. O interceptor de `api.ts` transforma toda falha em `ApiError`, com a mensagem pronta em português: usa o `message` da API quando existe e uma mensagem genérica quando não.
- **Hooks** (`hooks/`) guardam as respostas em cache e atualizam o que for preciso depois de criar, editar ou excluir.
- **Chaves de cache hierárquicas** (`hooks/queryKeys.ts`): invalidar `['subjects']` atualiza a lista, o detalhe e o progresso; invalidar `['sessions']` atualiza as listas e os totais de tempo. Por isso o dashboard reflete na hora o que foi feito em outra tela.
- **Erros:** mutations mostram um toast de erro automaticamente (`lib/queryClient.ts`). Formulários que exibem o erro no próprio corpo usam `meta: { skipErrorToast: true }`. Consultas com erro mostram o `ErrorState`.

### Autenticação

- O JWT fica num cookie `HttpOnly` emitido pela API, então **o token nunca passa pelo JavaScript**.
- O usuário logado vem de `GET /api/Auth/me` e fica no cache (`useCurrentUser`): `undefined` enquanto verifica, `null` sem sessão.
- Entrar e sair apagam o cache de dados, para que nada de uma sessão apareça na outra.

### Formulários

- React Hook Form + Zod. Os schemas espelham as validações do backend e convertem o formulário para o formato da API (`toSessionInput`, `toTopicFields`...).
- O schema de sessão recebe a data atual por parâmetro (`createSessionSchema(now)`), o que permite testar regras como "não pode ser no futuro".
- Cada campo é ligado à sua mensagem de erro (`fieldA11y` + `FormField`), para o leitor de tela anunciá-la.

### Datas e horários

- A API trabalha em **UTC**; o front envia ISO terminando em `Z` e exibe no horário local com date-fns.
- `DateInput` e `TimeInput` (`components/shared/`) substituem os campos nativos, que seguem o idioma do navegador (mm/dd/aaaa e AM/PM).
- TimeSpans da API (`"hh:mm:ss"` ou `"d.hh:mm:ss"`) são convertidos por `parseTimeSpan` em `lib/time.ts`.
- A duração de uma sessão é sempre calculada pelo início e fim (`sessionMinutes`), porque sessões antigas do banco têm o campo `duration` zerado.

### Regras de negócio no navegador (`lib/`)

| Arquivo | Regras |
| --- | --- |
| `time.ts` | TimeSpan → minutos, formatos `1h30` / `45min`, datas `dd/MM/yyyy` |
| `sessions.ts` | Montar o intervalo (inclusive passando da meia-noite), limite de 12h, ordenação e sobreposição |
| `topics.ts` | Ordem (pendentes primeiro), filtros e cálculo do progresso |
| `dashboard.ts` | Tempo da semana (segunda a domingo), últimos 7 dias, sessões recentes e soma de tópicos |
| `mask.ts` | Máscaras de data e hora enquanto se digita |
| `text.ts` | Plural e resumo do que a exclusão apaga |

## 🎨 Prototipação e identidade visual

### Do refinamento ao código

1. **Refinamento** (13/10/2026): telas, regras, critérios de aceite e lacunas do backend, registrados em [`frontend-escopo.md`](../docs/refinamento/frontend-escopo.md). Revisado em 26/10/2026 para incluir o login.
2. **Protótipos** (15/10/2026): um canvas navegável com todas as telas em tema claro e escuro, versões de celular, janelas modais (disciplina, tópico, sessão e exclusões), primeiro acesso, paleta e opções de logo.
3. **Backlog**: correções do backend (B1–B8) antes das telas que dependiam delas, depois os itens F1–F14 do frontend.

Os protótipos são a referência visual; quando divergem do documento de escopo, vale o documento.

### Paleta pastel

O roxo do logo original foi adaptado para **lavanda**, e os status usam verde, amarelo e vermelho pastel. **Regra:** sobre fundo pastel, o texto usa o tom escuro da mesma cor, nunca branco, garantindo contraste mínimo de 4,5:1.

| Papel | Fundo | Texto sobre o fundo | Uso |
| --- | --- | --- | --- |
| Marca (lavanda) | `#DCD0F7` | `#3B2A73` | Botões principais, item ativo do menu, abas |
| Confirmar (verde) | `#D5F2E3` | `#1E6B47` | Salvar, selo "Concluído", sucesso |
| Pendente (amarelo) | `#FBF0C9` | `#7A5A0B` | Selo "Pendente", aviso de sobreposição |
| Excluir (vermelho) | `#F9D6D5` | `#9B2C2C` | Excluir, erros |

- **Tema claro:** fundo `#F7F6FB`, cards brancos e menu lateral lavanda clara.
- **Tema escuro:** fundo `#16131F`, cards `#1F1B2C`; os botões e selos pastel continuam iguais.
- As cores ficam em `src/index.css` como variáveis do Tailwind v4 (`primary`, `success`, `warning`, `danger`...), ligadas ao shadcn/ui. O modo escuro usa a classe `.dark`, e a escolha fica salva no navegador.

### Logo

- Opção escolhida nos protótipos: fundo lavanda `#C5B3F0`, ícone e "Study" em `#2E2152`, "Organizer" em `#3B2A73`.
- Feito em código (`components/brand/Logo.tsx`), não em imagem, para ficar nítido em qualquer tamanho. O mesmo desenho está no `favicon.svg`.

### Formatos

Português do Brasil em tudo: datas `dd/MM/yyyy`, horas em 24h, durações como `1h30` ou `45min`, reticências com o caractere "…".

## ♿ Acessibilidade

Auditado com **axe-core (WCAG 2.1 AA)** em todas as telas e janelas, nos dois temas, sem violações.

- Contraste mínimo de 4,5:1 em todo texto pequeno.
- Todo campo tem rótulo, e as mensagens de erro são ligadas ao campo.
- Tudo funciona pelo teclado: as janelas prendem o foco e fecham com Esc; o foco é sempre visível.
- O primeiro Tab mostra o link **"Pular para o conteúdo"**; ao trocar de página, o foco vai para o conteúdo principal.
- Cada página define o título da aba (`useDocumentTitle`), por exemplo "Disciplinas · Study Organizer". É assim que o leitor de tela anuncia a troca de página.
- Botões só com ícone têm `aria-label`; a duração calculada da sessão é anunciada (`aria-live`).
- Menus suspensos usam `modal={false}`, para não esconder a página do leitor de tela. O gráfico é decorativo (os números estão nos cards), então fica com `aria-hidden` e `accessibilityLayer={false}`.

## 🧪 Testes e verificação

- **Vitest — 127 testes** cobrindo as regras de maior risco: conversão de TimeSpan, intervalos de sessão e meia-noite, sobreposição, semana e últimos 7 dias, progresso dos tópicos, máscaras e todos os schemas dos formulários.
- **Testes ponta a ponta** (151 verificações) e **auditoria de acessibilidade** feitos no navegador durante o desenvolvimento, sempre contra uma **cópia** do banco e uma API de teste em outra porta, nunca contra os dados reais.
- `npm run build` sem avisos e `npm run lint` limpo.

## 📈 Desempenho

Cada página é um arquivo separado, baixado só quando é aberta (`lazy` em `routes/router.tsx`). O login, por exemplo, não carrega a biblioteca do gráfico, que fica só no arquivo do dashboard. O layout e a página 404 ficam no arquivo principal.

## 🧭 Como o frontend foi construído

| Commit | Entrega | Itens do backlog |
| --- | --- | --- |
| `daeb831` | Refinamento do frontend (documento de escopo) | — |
| `57dab27` | Backend: autenticação JWT, pré-requisito do login no front | B8 |
| `b236b3c` | Fundação: proxy do Vite, atalho `@/`, shadcn/ui, Inter, paleta pastel, logo, Toaster, QueryClient e Vitest | F1, F2 |
| `30ba66d` | Layout, camada de dados, autenticação, login e cadastro, componentes compartilhados | F3, F4, F4a, F4b, F5 |
| `dec1c51` | Lista de disciplinas com criação, edição e exclusão | F6, F7 |
| `18f9ee4` | Detalhe da disciplina e aba Tópicos com atualização otimista | F8, F9 |
| `76adacf` | Aba Sessões: registro, validações, meia-noite, sobreposição; data `dd/mm/aaaa` e hora 24h | F10, F11 |
| `9107c6a` | Dashboard: cards de resumo, progresso, sessões recentes e gráfico dos últimos 7 dias | F12, F13 |
| `5488665` | Revisão final: acessibilidade, páginas sob demanda, textos e remoção de arquivos sem uso | F14 |

## 🔮 Próximos passos (fase 2)

- Cronômetro para registrar sessões.
- Histórico geral de sessões com filtros por período, e edição de sessão.
- Busca e ordenação na lista de disciplinas.
- Outros gráficos (tempo por disciplina).
- Testes de componentes (Testing Library) e ponta a ponta automatizados (Playwright).
- CORS e configuração de deploy em produção.
