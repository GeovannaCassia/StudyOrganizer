# Study Organizer

Aplicação web pessoal para organizar disciplinas de estudo, tópicos e sessões de estudo. Login com JWT; uma única conta (o cadastro fecha depois da primeira).

- `server/` — API REST em ASP.NET Core (.NET 10) + EF Core 8 + SQLite
- `client/` — frontend em React 19 + Vite 8 + TypeScript + Tailwind CSS v4 (em desenvolvimento)
- `docs/refinamento/frontend-escopo.md` — **escopo do frontend** (telas, regras, paleta, decisões técnicas e backlog). Consulte antes de implementar qualquer coisa no `client/`.

## Regras de trabalho

- **Commits são feitos pela usuária.** Não commitar nem alterar o índice do git (`git add`/`git rm --cached`) sem pedido explícito; ao terminar, resumir as alterações e sugerir a mensagem de commit.
- Quando pedirem um commit: **nunca adicionar autoria do Claude** (sem `Co-Authored-By` ou "Generated with Claude Code") e **nunca versionar `.claude/`**. Mensagens no estilo `tipo: Descrição em português`.
- Textos de interface, mensagens de erro da API, comentários e documentação em **português do Brasil**.
- Antes de alterar o schema do banco, faça backup do `server/study.db` (contém dados reais da usuária).

## Como rodar

```bash
# Backend (http://localhost:5071, Swagger em /swagger)
cd server
dotnet user-secrets set "Jwt:Key" "<chave aleatória ≥ 32 bytes>"   # só na primeira vez; sem ela a API não inicia
dotnet build
dotnet ef database update      # aplica migrations
dotnet run --launch-profile http

# Frontend (http://localhost:5173)
cd client
npm install
npm run dev
npm run build                  # tsc -b + vite build
npm run lint
npm test                       # Vitest (src/**/*.test.ts)
```

Para testar a API manualmente: `server/SistemaDeDisciplinas.http` (REST Client do VS Code) ou o Swagger.

## Backend (`server/`)

- Camadas: `Controllers` → `Services` (regras de negócio) → `Repositories` (`Interface/` + `Implementations/`) → `Data/AppDbContext`. Registre novos serviços e repositórios no `Program.cs`.
- Namespaces seguem o padrão por entidade (`Subject.Services`, `StudyTopics.Repositories.Interface`...); DTOs ficam em `StudyOrganizer.DTOs.<Entidade>`, com classes `Create*DTO`, `Update*DTO` e `Response*DTO`.
- Rotas usam `api/[controller]`: `/api/Subject`, `/api/StudyTopics`, `/api/StudySession`.
- **Erros:** nos services, lance `NotFoundException` (→ 404) ou `BusinessRuleException` (→ 400), de `server/Exceptions/`. O `ExceptionHandlingMiddleware` responde `{ "message": "..." }`. Não lance `Exception` genérica nem retorne null para "não encontrado".
- **Datas:** sempre UTC; o `AppDbContext` converte todas as `DateTime` para UTC e a API devolve ISO com `Z`.
- Excluir uma disciplina remove em cascata os tópicos e as sessões.
- **Autenticação:** JWT em cookie `HttpOnly` `so_token` (`AuthController`, `AuthService`, `TokenService`). Todo endpoint exige login por padrão (`FallbackPolicy`); use `[AllowAnonymous]` só quando for intencional. Cadastro aberto apenas enquanto não existe nenhuma conta.
- **Dados por usuário:** `Subject.UserId` + filtros globais no `AppDbContext` (`HasQueryFilter`) isolam disciplinas, tópicos e sessões do usuário logado — não filtre manualmente nos repositórios. Ao criar uma disciplina, preencha `UserId` com `ICurrentUserService.UserId`. `IgnoreQueryFilters()` só em casos explícitos (ex.: `AssignOrphansToUserAsync`).
- Services devolvem `Response*DTO`, nunca entidades (evita expor `UserId` e navegações).
- **Testes manuais que criam conta ou alteram dados:** nunca no `study.db` real (a primeira conta adota os dados e fecha o cadastro). Copie o banco e suba uma API de teste em outra porta, sem derrubar a da usuária: `ConnectionStrings__Default="Data Source=<cópia>" dotnet run --launch-profile http --urls http://localhost:5072`; no front, `API_PROXY_TARGET=http://localhost:5072 npx vite --port 5180`.
- Migrations: `dotnet ef migrations add <Nome>` e revise o arquivo gerado (prefira `RenameColumn` a drop/add para não perder dados).
- Sem CORS configurado: em desenvolvimento o frontend usa o proxy do Vite.

## Frontend (`client/`)

Decisões já tomadas no refinamento (detalhes em `docs/refinamento/frontend-escopo.md`):

- Rotas: `/login`, `/cadastro` (públicas) e, protegidas, `/` (dashboard), `/disciplinas`, `/disciplinas/:id` (abas Tópicos/Sessões) com React Router 7.
- Auth: o token nunca passa pelo JavaScript (cookie `HttpOnly`). O usuário vem de `GET /api/Auth/me` e fica no cache do TanStack Query (`useCurrentUser` em `hooks/useAuth.ts`: `undefined` verificando, `null` sem sessão). `RotaProtegida` manda para `/login` (ou `/cadastro` se ainda não há conta) guardando a página de origem; `RotaPublica` devolve para ela depois do login. Qualquer 401 fora de `/Auth/*` limpa o cache e avisa "Sua sessão expirou" (`AuthProvider`). Entrar e sair apagam o cache de dados (chaves fora de `['auth']`).
- Dados: Axios (`services/`, `baseURL: '/api'`) + TanStack Query (`hooks/`); proxy do Vite `/api` → `http://localhost:5071`.
- Formulários: React Hook Form + Zod (`schemas/`); tipos escritos à mão em `types/`.
- UI: shadcn/ui + lucide-react + react-hot-toast; fonte Inter; gráfico com shadcn Chart (Recharts).
- Paleta **pastel** (lavanda como marca; verde/amarelo/vermelho pastel para confirmar/pendente/excluir), tema claro e escuro. Texto sobre fundo pastel usa sempre o tom escuro da mesma cor, nunca branco.
- Datas: enviar em UTC, exibir no horário local com date-fns (`ptBR`). TimeSpan da API chega como texto `"hh:mm:ss"` / `"d.hh:mm:ss"`. A duração de uma sessão é calculada pelo início e fim (`sessionMinutes` em `lib/sessions.ts`): sessões antigas do banco têm o campo `duration` zerado. Nos formulários, use `DateInput` (dd/mm/aaaa + calendário pt-BR) e `TimeInput` (24h, hh:mm) de `components/shared/`, nunca `<input type="date|time">`: os nativos seguem o idioma do navegador (mm/dd/aaaa, AM/PM).
- Testes: Vitest para as regras em `lib/` e `schemas/`.
- Formulários de criar/editar sempre em modal; estados de loading (skeleton), vazio e erro em todas as listas.
- Erros: o interceptor do `services/api.ts` transforma toda falha em `ApiError` (mensagem pronta em português). Mutations mostram toast de erro automaticamente (`MutationCache`), exceto com `meta: { skipErrorToast: true }`, usado quando o formulário mostra o erro; consultas mostram `ErrorState`.
- Cache: chaves em `hooks/queryKeys.ts`, hierárquicas (invalidar `['subjects']` atualiza lista, detalhe e progresso; `['sessions']` atualiza listas e totais). Marcar/desmarcar tópico é otimista (`useToggleTopic`): muda a lista e o progresso no cache na hora e, se a API falhar, desfaz só aquele tópico.
