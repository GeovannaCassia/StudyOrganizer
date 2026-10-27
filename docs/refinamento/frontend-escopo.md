# Escopo do Frontend — Study Organizer
> Refinamento realizado em 13/10/2026. Fonte de verdade da API: `server/` (commit `ffeec24`).
> Revisado em 26/10/2026: inclusão de login com JWT (seções 2, 3, 4.0, 6, 7, 9 e 11).

## 1. Visão e objetivo da entrega

Entregar um **MVP enxuto** do frontend do Study Organizer: uma aplicação web pessoal para organizar disciplinas, acompanhar o progresso pelos tópicos concluídos e registrar o tempo de estudo.

O MVP cobre o cadastro de disciplinas, tópicos e sessões, o progresso por disciplina e um dashboard com indicadores e um gráfico simples. O cronômetro, o histórico geral de sessões e outros recursos ficam para a fase 2 (ver seção 9).

## 2. Restrições e premissas

- **Uma única conta, com login.** *(Revisado em 26/10/2026 — antes: "sem login".)* O backend tem autenticação JWT; o cadastro só fica aberto enquanto não existe nenhuma conta, e a primeira conta assume as disciplinas já existentes. Os dados são isolados por usuário.
- **Layout responsivo, pensado primeiro para desktop.**
- **Protótipos visuais serão criados depois deste refinamento**, antes de implementar as telas.
- **Stack já definida:** Vite 8, React 19, TypeScript, Tailwind CSS v4, React Router 7, Axios, React Hook Form, Zod, lucide-react, react-hot-toast e date-fns.
- **As correções do backend (seção 8) precedem as telas que dependem delas.**
- Volume de dados pequeno (dezenas de disciplinas e centenas de sessões), então filtros e cálculos no navegador são aceitáveis.

## 3. Mapa de telas e rotas

| Rota | Tela | Objetivo | Endpoints usados |
|---|---|---|---|
| `/login` | Entrar *(pública)* | Entrar com e-mail e senha | `GET /api/Auth/status`, `POST /api/Auth/login` |
| `/cadastro` | Criar conta *(pública)* | Criar a única conta; só acessível com o cadastro aberto | `GET /api/Auth/status`, `POST /api/Auth/register` |
| `/` | Dashboard | Visão geral: tempo estudado, progresso, sessões recentes e gráfico dos últimos 7 dias | `GET /api/Subject`, `GET /api/Subject/{id}/progress`, `GET /api/StudySession`, `GET /api/StudySession/TotalTime` |
| `/disciplinas` | Lista de disciplinas | Ver, criar, editar e excluir disciplinas | `GET /api/Subject`, `GET /api/Subject/{id}/progress`, `GET /api/StudySession/subjectId/TotalTime/{id}`, `POST`/`PATCH`/`DELETE /api/Subject` |
| `/disciplinas/:id` | Detalhe da disciplina | Gerenciar os tópicos e as sessões de uma disciplina (abas) | `GET /api/Subject/{id}`, `GET /api/Subject/{id}/progress`, `GET /api/StudyTopics/subjectId/{id}`, `GET /api/StudySession/subjectId/{id}`, `GET /api/StudySession/subjectId/TotalTime/{id}`, CRUD de tópicos e sessões |
| `*` | Não encontrada | Rota inexistente, ou disciplina inexistente (404) | — |

Todas as rotas, exceto `/login` e `/cadastro`, são **protegidas**: sem sessão, redirecionam para `/login`.

**Navegação**
- Menu lateral fixo com o logo e os itens **Dashboard** e **Disciplinas**, mais o botão para alternar entre tema claro e escuro e, no rodapé do menu, o nome da pessoa logada com o botão **Sair**.
- `/login` e `/cadastro` não têm menu lateral: cartão centralizado com o logo, no mesmo visual pastel.
- No celular, o menu fica escondido e abre por um botão no topo.
- Todos os formulários de criar e editar abrem em **janela modal**.

## 4. Funcionalidades por módulo

### 4.0 Autenticação *(adicionado em 26/10/2026)*

**A1 — Criar a conta.** Como estudante, quero criar minha conta no primeiro acesso, para que só eu acesse meus estudos.
- **Dado** que não existe nenhuma conta (`GET /api/Auth/status` → `registrationOpen: true`), **quando** acesso o app, **então** sou levada para `/cadastro`.
- Formulário com **Nome**, **E-mail**, **Senha** e **Confirmar senha** (com botão de mostrar/ocultar senha).
- Validações (Zod, iguais às do backend): nome obrigatório (até 80); e-mail válido; senha de 8 a 128 caracteres com letras e números; confirmação igual à senha.
- **Quando** salvo, **então** a conta é criada, já entro logada e vou para o Dashboard, com as disciplinas que já existiam.
- **Dado** que o cadastro está fechado, **quando** acesso `/cadastro`, **então** sou redirecionada para `/login`, e a tela de login não mostra o link "Criar conta".

**A2 — Entrar.** Como estudante, quero entrar com e-mail e senha.
- Campos **E-mail**, **Senha** (mostrar/ocultar) e a caixa **"Lembrar de mim"** (sessão de 30 dias; sem ela, 8 horas e termina ao fechar o navegador).
- **Dado** e-mail ou senha errados, **então** aparece "E-mail ou senha inválidos." no formulário (sem dizer qual dos dois).
- **Dado** o limite de tentativas (429), **então** aparece "Muitas tentativas. Aguarde um minuto e tente novamente." e o botão fica desabilitado por 60 s.
- **Quando** entro, **então** vou para a página que tentei abrir antes do login (ou para o Dashboard).

**A3 — Sessão e saída.**
- Ao abrir o app, o front chama `GET /api/Auth/me`: 200 → mostra o app; 401 → `/login`. Enquanto verifica, mostra uma tela de carregamento com o logo.
- **Qualquer** resposta 401 da API limpa o cache do TanStack Query e redireciona para `/login` com o aviso "Sua sessão expirou. Faça login novamente."
- **Sair** (menu lateral): `POST /api/Auth/logout`, limpa o cache e vai para `/login`.
- O token **nunca** é lido nem guardado pelo JavaScript (cookie `HttpOnly`); o front guarda só os dados do usuário (`{ id, name, email }`) num contexto.

### 4.1 Disciplinas

**D1 — Listar disciplinas.** Como estudante, quero ver todas as minhas disciplinas com o progresso, para saber como estou em cada uma.
- **Dado** que existem disciplinas, **quando** acesso `/disciplinas`, **então** vejo um card por disciplina, em ordem alfabética, com:
  - nome e descrição (cortada em 2 linhas);
  - barra de progresso com %;
  - tópicos concluídos sobre o total;
  - tempo total estudado (ex.: `12h30`);
  - data de criação (ex.: `criada em 13/10/2026`).
- **Dado** que os dados estão carregando, **então** vejo blocos cinza no formato dos cards.
- **Dado** que não há disciplinas, **então** vejo uma mensagem dizendo isso e o botão **"Criar primeira disciplina"**.
- **Dado** que a API falhou, **então** vejo uma mensagem de erro com o botão **"Tentar novamente"**.
- **Quando** clico em um card, **então** vou para `/disciplinas/:id`.

**D2 — Criar disciplina.** Como estudante, quero cadastrar uma disciplina, para organizar meus estudos.
- **Quando** clico em **"+ Nova disciplina"**, **então** abre uma janela modal com os campos Nome e Descrição.
- **Dado** um nome válido, **quando** salvo, **então** a janela fecha, aparece um aviso de sucesso e o card surge na lista e no dashboard.
- **Dado** que já existe uma disciplina com esse nome, **quando** salvo, **então** a janela continua aberta e aparece o erro "Já existe uma disciplina com esse nome", vindo da mensagem 400 da API.
- Validações:
  - **Nome:** obrigatório, de 1 a 80 caracteres, sem espaços sobrando nas pontas.
  - **Descrição:** opcional, até 200 caracteres.

**D3 — Editar disciplina.** Como estudante, quero corrigir o nome ou a descrição de uma disciplina.
- O formulário é o mesmo de D2, já preenchido. A edição pode ser aberta pelo menu `⋮` do card ou pelo botão **Editar** no detalhe.
- As mesmas validações de D2 se aplicam, incluindo o nome duplicado.

**D4 — Excluir disciplina.** Como estudante, quero excluir uma disciplina que não uso mais, sabendo o que será perdido.
- **Quando** escolho **Excluir**, **então** abre uma janela de confirmação: *"Excluir 'Matemática'? Isso também apagará 10 tópicos e 7 sessões. Essa ação não pode ser desfeita."*
- **Quando** confirmo, **então** a disciplina some da lista e do dashboard e aparece um aviso de sucesso. Se eu estiver no detalhe, volto para `/disciplinas`.
- O botão de confirmar usa a cor de **perigo** (vermelho pastel).

### 4.2 Detalhe da disciplina

**DT1 — Ver o detalhe.** Como estudante, quero ver tudo de uma disciplina em um só lugar.
- Cabeçalho com nome, descrição, barra de progresso com %, tópicos concluídos sobre o total, tempo total e as ações **Editar** e `⋮` (Excluir).
- Duas abas abaixo: **Tópicos** (aberta por padrão) e **Sessões**. A aba aberta fica guardada na URL (`?aba=sessoes`).
- **Dado** um id inexistente, **então** vejo a página "Disciplina não encontrada" com um link para voltar à lista (a API devolve 404).

### 4.3 Tópicos

**T1 — Listar tópicos.**
- Lista de marcar, com contador `Tópicos (6/10)` e filtro **Todos | Pendentes | Concluídos** (padrão: Todos).
- Ordem: pendentes primeiro, depois os concluídos; dentro de cada grupo, a ordem de criação.
- Tópicos concluídos aparecem com o título riscado e o selo **Concluído** (verde pastel). Os pendentes têm o selo **Pendente** (amarelo pastel).
- A descrição aparece embaixo do título, em texto menor.
- Se não houver tópicos, aparece a mensagem *"Adicione os tópicos que você precisa estudar"* com um botão.

**T2 — Criar e editar tópico.**
- Janela modal com **Título** (obrigatório, de 1 a 120 caracteres) e **Descrição** (opcional, até 300 caracteres).
- Na edição, o estado "concluído" que o tópico já tinha é mantido.

**T3 — Marcar e desmarcar como concluído.** Como estudante, quero marcar os tópicos que terminei, para acompanhar meu progresso.
- **Quando** clico na caixa de seleção, **então** ela muda **na hora**, e o contador, a barra de progresso do cabeçalho e o dashboard são atualizados.
- **Se** a API falhar, **então** a mudança é desfeita e aparece um aviso de erro.
- Para marcar, o frontend usa `PATCH /api/StudyTopics/completed/{id}`. Para desmarcar, usa `PATCH /api/StudyTopics/{id}` com o DTO completo e `isCompleted: false`.

**T4 — Excluir tópico.**
- Janela de confirmação simples. Depois de excluir, a lista e o progresso são atualizados.

### 4.4 Sessões

**S1 — Listar sessões da disciplina.**
- Total estudado no topo da aba e o botão **"+ Registrar sessão"**.
- Uma linha por sessão, das mais recentes para as mais antigas: data (`13/10`), horário (`14:00–15:30`), duração (`1h30`) e o botão de excluir.
- Mostra as 10 primeiras sessões, com um botão **"Ver mais"** que carrega mais 10 (a paginação é feita no navegador).
- Não há edição de sessão no MVP.

**S2 — Registrar sessão.** Como estudante, quero registrar quanto tempo estudei, para acompanhar minha dedicação.
- Janela modal com **Data** (padrão: hoje), **Início** e **Fim** (horas e minutos). A duração calculada aparece na hora.
- **Sessão que passa da meia-noite:** se o fim for menor ou igual ao início, o fim conta como dia seguinte (ex.: 23:00–01:00 = 2h). O formulário mostra "termina em 14/10" para deixar claro.
- Validações (com Zod e testes no Vitest):
  - a duração precisa ser maior que zero;
  - o fim não pode ser no futuro;
  - a duração máxima é **12h**;
  - **sobreposição:** se a sessão coincidir com outra da mesma disciplina, aparece um aviso em **amarelo pastel**: *"Essa sessão coincide com outra registrada das 14:00 às 15:00"*. O aviso não impede salvar.
- **Envio:** `startTime` e `endTime` são convertidos do horário local para UTC, no formato ISO terminando em `Z`.
- Depois de salvar, aparece um aviso de sucesso e a lista, o total da disciplina e o dashboard são atualizados.

**S3 — Excluir sessão.**
- Janela de confirmação simples. Depois de excluir, a lista e os totais são atualizados.

### 4.5 Dashboard

**DB1 — Cards de resumo.**
- Quatro cards:
  - **Tempo total estudado**, de `GET /api/StudySession/TotalTime`;
  - **Disciplinas**, com a quantidade;
  - **Tópicos concluídos**, somando o progresso de todas as disciplinas;
  - **Esta semana**, com a soma das sessões de **segunda a domingo** da semana atual, calculada no navegador.

**DB2 — Progresso por disciplina.**
- Uma lista com o nome, a barra de progresso e o % de cada disciplina. Clicar leva ao detalhe.

**DB3 — Sessões recentes.**
- As 5 sessões mais recentes de qualquer disciplina, mostrando a disciplina, a data, o horário e a duração.

**DB4 — Gráfico: horas por dia nos últimos 7 dias.**
- Gráfico de barras com um dia por barra, terminando hoje, e eixo em horas. Calculado no navegador a partir de `GET /api/StudySession`.
- Uma sessão é contada no **dia em que começou** (no horário local).
- Ao passar o mouse sobre uma barra, aparecem o dia e o total (ex.: `qua 08/10 — 2h15`).
- Dias sem sessão aparecem com barra zerada.

**DB5 — Primeiro acesso.**
- Sem disciplinas, o dashboard mostra o ícone, o texto *"Comece criando sua primeira disciplina"* e um botão que abre o formulário de D2.

## 5. UX e identidade visual

### 5.1 Paleta (tons pastel)

O roxo do logo é adaptado para um **roxo pastel (lavanda)**. As cores de status (confirmar, pendente, excluir) usam **verde, amarelo e vermelho pastel**.

**Regra de contraste:** sobre um fundo pastel, o texto **sempre** usa o tom escuro da mesma cor, **nunca branco**. Isso mantém o contraste mínimo de 4,5:1 (padrão WCAG AA).

| Papel | Fundo (pastel) | Borda / hover | Texto sobre o fundo | Onde usar |
|---|---|---|---|---|
| **Marca / primária** (lavanda) | `#DCD0F7` | `#C5B3F0` | `#3B2A73` | Botões principais ("+ Nova disciplina"), item ativo do menu, links, abas ativas, foco dos campos |
| Barra de progresso | trilho `#ECE6FB` | preenchimento `#8B6DD6` (escuro: `#A98FE6`) | — | Barras de progresso (com 100%, o preenchimento fica verde `#5FBF8F`) |
| Borda de campos | — | `#9A90B0` (escuro: `#6E6688`) | — | Inputs, textareas e caixas de seleção (contraste mínimo de 3:1 com o fundo) |
| **Confirmar / sucesso** (verde) | `#D5F2E3` | `#A8E0C2` | `#1E6B47` | Botões Salvar/Confirmar, selo "Concluído", aviso de sucesso, caixa de seleção marcada |
| **Pendente / atenção** (amarelo) | `#FBF0C9` | `#F2DD8C` | `#7A5A0B` | Selo "Pendente", aviso de sobreposição de sessão, alertas |
| **Excluir / erro** (vermelho) | `#F9D6D5` | `#F0AEAC` | `#9B2C2C` | Botões Excluir, confirmação de exclusão, erros de formulário, aviso de erro |

**Escala lavanda completa (referência):** 50 `#F6F3FD` · 100 `#ECE6FB` · 200 `#DCD0F7` · 300 `#C5B3F0` · 400 `#A98FE6` · 500 `#8B6DD6` · 700 `#5B3FA3` · 800 `#3B2A73` · 900 `#2E2152`.

**Tema claro**
- Fundo da página `#F7F6FB`, cards brancos `#FFFFFF` com borda `#ECE6FB`, texto principal `#2B2540` e texto secundário `#6B6580`.
- **Menu lateral** em lavanda clara (`#ECE6FB`), com texto `#3B2A73` e item ativo em `#DCD0F7`. Isso substitui o "roxo escuro" decidido antes, para manter tudo em tom pastel.

**Tema escuro**
- Fundo `#16131F`, cards `#1F1B2C`, borda `#2E2840`, texto principal `#ECE9F5` e secundário `#A49DB8`.
- Menu lateral `#1F1B2C`, com o item ativo em lavanda `#C5B3F0` e texto `#2E2152`.
- As cores pastel continuam iguais nos botões e selos, com o texto escuro da mesma cor. Em fundos escuros, os textos de status usam a versão pastel (ex.: um erro escrito direto no fundo usa `#F0AEAC`).

**Implementação**
- As cores viram variáveis de tema do Tailwind v4 (`@theme`), com nomes como `primary`, `success`, `warning`, `danger`, `surface` e `muted`, ligadas às variáveis do shadcn/ui.
- O modo escuro é ativado pela classe `.dark`.
- Os valores exatos podem ser ajustados nos protótipos, mantendo a regra de contraste.

### 5.2 Logo
- **Decidido em 15/10/2026 — opção A (texto escuro):** fundo lavanda chapado `#C5B3F0`, ícone e "Study" em `#2E2152`, "Organizer" em `#5B3FA3` (contraste ~7:1). Sem degradê.
- Ícone do app (menu lateral e favicon): quadrado arredondado `#C5B3F0` com o livro em `#2E2152`; funciona nos dois temas.
- Adaptar `logo.png` e `logo-small.png` (e o `favicon.svg`) no item **F2** do backlog, seguindo o quadro "Logo — opção A" dos protótipos.

### 5.3 Protótipos
- Canvas navegável (privado): https://claude.ai/artifact/HsfGnPG5K6cnYTuWJz8Kvp — telas em claro/escuro, janelas modais (disciplina, tópico, sessão, exclusões), versões de celular, primeiro acesso, paleta e logo.
- Os protótipos são a referência visual da implementação; em caso de divergência com este documento, as regras deste documento prevalecem.

### 5.4 Demais diretrizes
- **Fonte:** Inter (pesos 400, 500, 600 e 700).
- **Componentes:** shadcn/ui (Dialog, AlertDialog, Tabs, DropdownMenu, Checkbox, Button, Input, Textarea, Card, Progress, Skeleton, Chart) com o tema pastel aplicado.
- **Ícones:** lucide-react.
- **Avisos:** react-hot-toast no canto superior direito, com as cores de sucesso e erro acima. Mensagens curtas, como "Disciplina criada", "Sessão registrada" ou "Não foi possível salvar. Tente novamente."
- **Estados de tela:**
  - carregando: blocos cinza no formato do conteúdo;
  - vazio: ícone, texto e botão de ação;
  - erro: mensagem com o botão "Tentar novamente".
- **Acessibilidade mínima:**
  - todo campo tem rótulo e toda mensagem de erro é ligada ao campo;
  - tudo funciona pelo teclado (as janelas modais prendem o foco e fecham com Esc);
  - o foco fica visível;
  - contraste AA;
  - botões só com ícone têm texto para leitores de tela (`aria-label`).
- **Idioma e formatos:** português do Brasil. Datas como `dd/MM/yyyy`, horas no formato 24h e durações como `1h30` ou `45min` (date-fns, locale `ptBR`).

## 6. Decisões técnicas

| Tema | Decisão | Motivo |
|---|---|---|
| Dados da API | Axios (`services/`) + **TanStack Query** (`hooks/`) | Cache compartilhado entre o dashboard e o detalhe, atualização automática depois de criar/editar/excluir, e mudança imediata nos tópicos |
| Tipos | Escritos à mão em `types/` | Só 3 entidades; a documentação OpenAPI tem imprecisões |
| Formulários | React Hook Form + Zod (`schemas/`) | Já instalados; os schemas validam e geram os tipos |
| Gráfico | shadcn/ui Chart (Recharts) | Mesmo visual dos outros componentes |
| Componentes | shadcn/ui | Componentes acessíveis, com código dentro do projeto |
| Datas | date-fns + `ptBR`; envio em UTC (ISO com `Z`), exibição no horário local | Evita erros de fuso horário |
| Conexão em desenvolvimento | **Proxy do Vite**: `/api` → `http://localhost:5071` | Resolve o CORS sem depender do backend; o Axios usa `baseURL: '/api'` |
| Rotas | React Router 7 (`createBrowserRouter`), estado das abas na URL | Já configurado |
| Erros da API | Interceptor do Axios lê o `message` (400) e transforma em aviso; 404 vira "não encontrado" | Depende das correções do backend B3 |
| Testes | **Vitest** para as funções de `lib/` e para os schemas | Cobre as regras de maior risco (datas, durações, sobreposição) |
| Atalho de import | `@/` → `src/` | Exigido pelo shadcn/ui |
| Autenticação | JWT em cookie `HttpOnly`/`SameSite=Strict` emitido pela API; `AuthContext` com o usuário de `GET /api/Auth/me`; componente `RotaProtegida` | O token fica inacessível a scripts (proteção contra XSS); o proxy do Vite mantém front e API na mesma origem, então o cookie funciona sem CORS |

**Estrutura de pastas**
```text
client/src/
├── components/
│   ├── ui/          # shadcn/ui
│   └── shared/      # EmptyState, ErrorState, ConfirmDialog, ProgressBar, PageHeader...
├── layouts/         # LayoutApp (menu lateral, tema)
├── pages/
│   ├── Dashboard/
│   ├── Subjects/    # lista + componentes da tela
│   ├── SubjectDetails/ # cabeçalho, TopicsTab, SessionsTab
│   └── NotFound/
├── services/        # api.ts (instância Axios), subjectService, topicService, sessionService
├── hooks/           # useSubjects, useSubjectProgress, useTopics, useSessions...
├── schemas/         # subjectSchema, topicSchema, sessionSchema
├── types/           # Subject, Topic, Session, Progress
├── lib/             # time.ts (parseTimeSpan, formatDuration), sessions.ts (semana, 7 dias, sobreposição)
└── routes/
```

## 7. Contrato da API consumido

> Já considera as correções do backend da seção 8. Os nomes de campo estão em camelCase, como o ASP.NET serializa.

| Método | Rota | Payload | Resposta |
|---|---|---|---|
| GET | `/api/Auth/status` *(pública)* | — | `{ registrationOpen }` |
| POST | `/api/Auth/register` *(pública)* | `{ name, email, password }` | 200 `{ id, name, email }` + cookie · 400 `{ message }` (validação ou cadastro fechado) · 429 |
| POST | `/api/Auth/login` *(pública)* | `{ email, password, rememberMe }` | 200 `{ id, name, email }` + cookie · 401 `{ message }` · 429 |
| POST | `/api/Auth/logout` *(pública)* | — | 204 (apaga o cookie) |
| GET | `/api/Auth/me` | — | `{ id, name, email }` · 401 |
| GET | `/api/Subject` | — | `Subject[]` = `{ id, name, description, createdAt }` |
| GET | `/api/Subject/{id}` | — | `Subject` · **404** se não existir |
| GET | `/api/Subject/{id}/progress` | — | `{ progress: { subjectName, totalTopics, totalTopicsCompleted, progress } }`, com `progress` de 0 a 100 (0 quando não há tópicos) |
| POST | `/api/Subject` | `{ name, description? }` | 201 + `Subject` · **400** `{ message }` |
| PATCH | `/api/Subject/{id}` | `{ name, description? }` | 200 · 400 `{ message }` · 404 |
| DELETE | `/api/Subject/{id}` | — | 204 (apaga junto os tópicos e as sessões) |
| GET | `/api/StudyTopics/subjectId/{id}` | — | `{ id, title, description, isCompleted, subjectId, subjectName }[]` |
| POST | `/api/StudyTopics` | `{ title, description?, isCompleted: false, subjectId }` | 201 + tópico · 400 `{ message }` |
| PATCH | `/api/StudyTopics/{id}` | `{ title, description, isCompleted }` | 200 · 404 |
| PATCH | `/api/StudyTopics/completed/{id}` | — | 200 · 404 |
| DELETE | `/api/StudyTopics/{id}` | — | 204 |
| GET | `/api/StudySession` | — | `{ id, startTime, endTime, duration, subjectId }[]` |
| GET | `/api/StudySession/TotalTime` | — | TimeSpan em texto |
| GET | `/api/StudySession/subjectId/{id}` | — | sessões da disciplina |
| GET | `/api/StudySession/subjectId/TotalTime/{id}` | — | TimeSpan em texto |
| POST | `/api/StudySession` | `{ startTime, endTime, subjectId }` (ISO em UTC) | 200 + sessão · 400 `{ message }` se fim ≤ início |
| DELETE | `/api/StudySession/{id}` | — | 204 |

**Observações de formato**
- **TimeSpan** (`duration`, `TotalTime`) vem como texto `"hh:mm:ss"`, `"d.hh:mm:ss"` quando passa de 24h, e pode ter frações (`"01:30:00.1234567"`). A função `parseTimeSpan` em `lib/time.ts` converte para minutos e tem testes no Vitest.
- **Datas:** todas voltam em UTC (ISO terminando em `Z`). O frontend converte para o horário local na exibição.
- **Erros de formato do JSON** (ex.: tipo errado num campo) são respondidos pelo próprio ASP.NET no formato `ProblemDetails` (`{ title, errors }`), não `{ message }`. O interceptor deve usar uma mensagem genérica quando não houver `message`.
- Para obter os nomes das disciplinas nas sessões recentes, o frontend cruza `subjectId` com a lista de disciplinas que já está em cache.

## 8. Lacunas do backend e encaminhamento

| # | Lacuna | Impacto no frontend | Decisão |
|---|---|---|---|
| 1 | Sem CORS | O navegador bloqueia as chamadas | **Contornar:** proxy do Vite. Configurar CORS no deploy (fase 2) |
| 2 | Rotas `subjectId/{id}` e `subjectId/TotalTime/{id}` de sessões com o parâmetro `SubjectId` diferente de `{id}` (sempre voltam vazias ou zeradas) | A aba Sessões e o tempo por disciplina não funcionam | **Corrigir (B1)** |
| 3 | O progresso divide por zero quando não há tópicos (NaN → erro 500 na serialização) | Toda disciplina nova quebra o card e o dashboard | **Corrigir (B2)** |
| 4 | Id inexistente gera NullReference → 500 em vez de 404 | Não dá para mostrar "não encontrada" | **Corrigir (B3)** |
| 5 | Validações lançam `Exception` → 500 sem corpo | Não dá para mostrar "nome duplicado" | **Corrigir (B3):** 400 com `{ message }` |
| 6 | PATCH de disciplina recebe a entidade inteira, ignora o id da rota e não checa nome duplicado | Contrato frágil e permite duplicar nomes | **Corrigir (B4):** `UpdateSubjectDTO` |
| 7 | Sessão sem validação de fim > início | Dados inválidos chegam por outros caminhos | **Corrigir (B5)**; o frontend também valida |
| 8 | Campo `subscription` com nome errado | Confusão no contrato | **Corrigir (B6):** renomear para `description`, com migration |
| 9 | README com rotas erradas | Documentação enganosa | **Corrigir (B7)** |
| 10 | Desmarcar tópico só pelo PATCH completo | Pequena complexidade no frontend | **Contornar:** usar `PATCH /api/StudyTopics/{id}` |
| 11 | Sem edição de sessão, paginação ou filtros no servidor | — | **Fora do escopo** (fase 2) |

## 9. Fora do escopo (fase 2)

- Cronômetro para registrar sessões, com persistência caso a página recarregue.
- Tela de histórico geral de sessões e filtros por período.
- Edição de sessão (exige endpoint novo).
- Busca e ordenação na lista de disciplinas.
- Outros gráficos (tempo por disciplina, horas empilhadas por disciplina).
- ~~Login e multiusuário~~ — login entrou no escopo em 26/10/2026 (seção 4.0); continuam fora: cadastro aberto a outras pessoas, recuperação de senha por e-mail, troca de senha e exclusão de conta.
- Paginação no servidor.
- CORS e configuração de deploy em produção.
- Testes de componentes (Testing Library) e testes de ponta a ponta (Playwright).

## 10. Em aberto

- ~~**Formato de data da API**~~ — **resolvido em 13/10/2026:** o `AppDbContext` passou a gravar e ler todas as datas como UTC, e a API devolve ISO terminando em `Z`.
- ~~**Logo pastel**~~ — **resolvido em 15/10/2026:** opção A, texto escuro (seção 5.2).
- ~~**Ajuste fino da paleta**~~ — **resolvido em 15/10/2026:** validada nos protótipos, com os ajustes de barra de progresso e borda de campos (seção 5.1).

## 11. Backlog priorizado

| # | Item | Tamanho | Depende de |
|---|---|---|---|
| ✅ **B1** | Corrigir o parâmetro das rotas de sessão por disciplina (`SubjectId` → `id`) | P | — |
| ✅ **B2** | Progresso devolve 0 quando não há tópicos | P | — |
| ✅ **B3** | Tratamento de erros: 404 para item inexistente e 400 com `{ message }` nas validações (exceções próprias + middleware ou filtro) | M | — |
| ✅ **B4** | `UpdateSubjectDTO` no PATCH de disciplina, usando o id da rota e checando nome duplicado | P | B3 |
| ✅ **B5** | Validar `endTime > startTime` na criação de sessão | P | B3 |
| ✅ **B6** | Renomear `subscription` → `description` (model, DTOs e migration) | M | — |
| ✅ **B7** | Atualizar o README do backend com as rotas e os contratos reais | P | B1–B6 |
| ✅ **B8** | Autenticação JWT (26/10/2026): usuário, cadastro só da primeira conta, login/logout/me, cookie `HttpOnly`, login obrigatório por padrão, limite de tentativas, dados isolados por usuário (migration `AddUsersAndSubjectOwner`), criação devolve DTOs | G | B3 |
| ✅ ~~**D1**~~ | ~~Protótipos navegáveis das 3 telas (claro e escuro, desktop e mobile) com a paleta pastel~~ — concluído em 15/10/2026 (seção 5.3) | M | — |
| ✅ **F1** | Fundação: proxy do Vite, atalho `@/`, shadcn/ui, fonte Inter, variáveis de cor pastel (claro e escuro), Toaster, QueryClient, Vitest configurado — concluído em 27/10/2026 | M | — |
| ✅ **F2** | Adaptar o logo (normal e pequeno) para o roxo pastel — concluído em 27/10/2026: componente `components/brand/Logo.tsx` (`Logo` e `AppIcon`) e `public/favicon.svg` | P | D1 |
| ✅ **F3** | Layout: menu lateral responsivo, botão de tema, rotas (`/`, `/disciplinas`, `/disciplinas/:id`, 404) — concluído em 27/10/2026 | M | F1 |
| ✅ **F4** | Camada de dados: `api.ts` com interceptor de erros (incluindo 401 → `/login`), `types/`, services, hooks do TanStack Query, `lib/time.ts` (+ testes) — concluído em 27/10/2026 (o redirecionamento do 401 é ligado pelo AuthContext na F4a) | M | F1, B3, B6 |
| ✅ **F4a** | Autenticação no front: `authService`, `AuthContext` (`/me`), `RotaProtegida`, tela de carregamento inicial, Sair no menu lateral — concluído em 27/10/2026: o usuário fica no cache do TanStack Query (`useCurrentUser`); o `AuthProvider` liga o 401 ao fim da sessão; `RotaProtegida` e `RotaPublica` | M | F3, F4, B8 |
| ✅ **F4b** | Telas `/login` e `/cadastro` (schemas Zod, mostrar/ocultar senha, "Lembrar de mim", tratamento de 401/429, redirecionamento pós-login) — concluído em 27/10/2026 | M | F4a |
| ✅ **F5** | Componentes compartilhados: EmptyState, ErrorState, ConfirmDialog, ProgressBar e selos de status — concluído em 27/10/2026 | P | F1 |
| ✅ **F6** | Lista de disciplinas: cards, blocos de carregamento, estado vazio — concluído em 27/10/2026 | M | F3, F4, F4a, F5, B1, B2 |
| ✅ **F7** | Criar, editar e excluir disciplina (janelas modais + schema Zod + confirmação com contagem) — concluído em 27/10/2026; `SubjectFormDialog` e `DeleteSubjectDialog` ficam em `components/subjects/` para o detalhe (F8) e o dashboard (F12) reaproveitarem | M | F6, B4 |
| ✅ **F8** | Detalhe da disciplina: cabeçalho e abas na URL; página "não encontrada" — concluído em 27/10/2026 | P | F6 |
| ✅ **F9** | Aba Tópicos: lista, filtro, criar/editar/excluir, marcar e desmarcar com mudança imediata — concluído em 27/10/2026; marcar usa atualização otimista (`useToggleTopic`) e desfaz só o tópico que falhou | G | F8 |
| ✅ **F10** | Aba Sessões: lista com "ver mais", total, exclusão — concluído em 27/10/2026; a duração de cada sessão é calculada pelo início e fim (`sessionMinutes`), porque sessões antigas do banco têm o campo `duration` zerado | M | F8, B1 |
| ✅ **F11** | Registrar sessão: formulário, meia-noite, validações, aviso de sobreposição, conversão para UTC (+ testes) — concluído em 27/10/2026 (`lib/sessions.ts`, `schemas/sessionSchema.ts`) | G | F10, B5 |
| ✅ **F12** | Dashboard: cards de resumo (incluindo a semana), progresso por disciplina, sessões recentes, primeiro acesso (+ testes dos cálculos) — concluído em 27/10/2026 (`lib/dashboard.ts`) | M | F4, F5 |
| ✅ **F13** | Gráfico dos últimos 7 dias (shadcn Chart) — concluído em 27/10/2026; cores dos eixos passadas direto ao Recharts 3 (o seletor do `chart.tsx` não as aplica) | M | F12 |
| **F14** | Revisão final: acessibilidade, responsividade, tema escuro, textos | P | F6–F13 |
