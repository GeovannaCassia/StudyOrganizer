# 📔 Study Organizer

Um website desenvolvido com o intuito de gerenciar disciplinas de estudo, tópicos de aprendizagem e sessões de estudo.

## 🎯 Sobre o Projeto

Study Organizer é uma aplicação web pessoal que permite:
- **Gerenciar Disciplinas**: Criar, editar, listar e excluir disciplinas de estudo
- **Organizar Tópicos**: Adicionar tópicos a cada disciplina e marcá-los como concluídos
- **Registrar Sessões**: Anotar quando e por quanto tempo estudou cada disciplina
- **Monitorar Progresso**: Acompanhar o progresso de cada disciplina e o tempo estudado num dashboard com gráfico dos últimos 7 dias
- **Acesso protegido**: Login com e-mail e senha; o app tem uma única conta, criada no primeiro acesso

## 📋 Informações do Projeto

| Item                | Informação                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| **Status**          | ✅ MVP concluído (backend e frontend)                                                                |
| **Frontend**        | React 19, TypeScript, Vite 8 e Tailwind CSS v4                                                      |
| **Backend**         | C#, ASP.NET Core (.NET 10), Entity Framework Core e SQLite                                          |
| **Autenticação**    | JWT em cookie `HttpOnly`                                                                            |
| **Data de criação** | Fevereiro/2026                                                                                      |
| **Tecnologias**     | React Router, TanStack Query, Axios, React Hook Form, Zod, shadcn/ui, Recharts, date-fns, Vitest    |

## 📂 Estrutura do projeto

```text
StudyOrganizer/
├── client/                    # Frontend (React + Vite)
├── server/                    # Backend (API REST em ASP.NET Core)
├── docs/
│   └── refinamento/
│       └── frontend-escopo.md # Escopo do frontend: telas, regras, paleta e backlog
├── CLAUDE.md                  # Guia de convenções do projeto
└── README.md                  # Documentação principal
```

## 🚀 Como rodar

Pré-requisitos: **.NET 10 SDK** e **Node.js 20.19+**.

```bash
# 1. Backend — http://localhost:5071 (Swagger em /swagger)
cd server
dotnet user-secrets set "Jwt:Key" "<chave aleatória ≥ 32 bytes>"   # só na primeira vez
dotnet ef database update
dotnet run --launch-profile http

# 2. Frontend — http://localhost:5173 (em outro terminal)
cd client
npm install
npm run dev
```

Abra `http://localhost:5173`. No primeiro acesso, o app pede para criar a conta; depois disso, o cadastro fica fechado.

Em desenvolvimento, o Vite encaminha as chamadas `/api` para o backend, por isso não há CORS configurado.

## 📖 Documentação

- [Frontend](client/README.md): funcionalidades, arquitetura, estrutura de pastas, prototipação, identidade visual e acessibilidade
- [Backend](server/README.md): rotas, contratos da API e configuração
- [Escopo do frontend](docs/refinamento/frontend-escopo.md): refinamento completo, critérios de aceite e backlog
