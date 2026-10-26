# Study Organizer 📚

Uma API REST moderna para gerenciar disciplinas de estudo, tópicos de aprendizagem e sessões de estudo. Construída com ASP.NET Core 10 e Entity Framework Core.

## 🎯 Sobre o Projeto

Study Organizer é uma aplicação web que permite:
- **Gerenciar Disciplinas**: Criar, atualizar, listar e remover disciplinas de estudo
- **Organizar Tópicos**: Adicionar tópicos específicos dentro de cada disciplina
- **Rastrear Sessões**: Registrar sessões de estudo com duração e progresso
- **Monitorar Progresso**: Acompanhar o progresso em cada disciplina

## 🛠️ Tecnologias Utilizadas

- **Runtime**: .NET 10
- **Framework**: ASP.NET Core Web API
- **Banco de Dados**: SQLite
- **ORM**: Entity Framework Core 8.0.25
- **Documentação API**: Swagger/OpenAPI
- **Injeção de Dependência**: Built-in .NET Core DI

## 📋 Requisitos

- .NET 10 SDK ou superior
- Visual Studio Code, Visual Studio ou JetBrains Rider (opcional)
- Windows, Linux ou macOS

## 🚀 Instalação e Execução

### 1. Clonar o Repositório
```bash
git clone <seu-repositorio>
cd SistemaDeDisciplinas
```

### 2. Restaurar Dependências
```bash
dotnet restore
```

### 3. Configurar a chave do JWT
A API não inicia sem uma chave secreta de pelo menos 32 bytes. Em desenvolvimento ela fica no *user-secrets* (fora do repositório):
```bash
dotnet user-secrets set "Jwt:Key" "<uma chave aleatória longa>"
# ex.: gerar com  openssl rand -base64 48
```
Em produção, defina a variável de ambiente `Jwt__Key`.

### 4. Executar Migrations (Criar Banco de Dados)
```bash
dotnet ef database update
```

### 5. Executar a Aplicação
```bash
dotnet run
```

A aplicação estará disponível em `http://localhost:5071` (perfil `http`) ou `https://localhost:7268` (perfil `https`), conforme `Properties/launchSettings.json`.

### 6. Acessar a Documentação Swagger
Abra seu navegador e acesse:
```
http://localhost:5071/swagger
```

## 📁 Estrutura do Projeto

```
SistemaDeDisciplinas/
├── Controllers/               # Controladores da API
│   ├── StudySessionsControllers.cs
│   ├── StudyTopicsControllers.cs
│   └── SubjectControllers.cs
├── Models/                   # Entidades do Banco de Dados
│   ├── Subject.cs
│   ├── StudyTopics.cs
│   └── StudySession.cs
├── DTOs/                     # Data Transfer Objects
│   ├── study-session/
│   ├── study-topics/
│   └── subject/
├── Data/                     # Contexto do Entity Framework
│   └── AppDbContext.cs
├── Exceptions/               # Exceções da aplicação (NotFound, BusinessRule)
├── Middlewares/              # Tratamento global de erros
├── Repositories/             # Padrão Repository
│   ├── Interface/
│   └── Implementations/
├── Services/                 # Lógica de Negócio
│   ├── SubjectService.cs
│   ├── StudyTopicsService.cs
│   ├── StudySessionService.cs
│   └── SubjectProgressService.cs
├── Migrations/              # Migrations do Entity Framework
└── Program.cs               # Configuração Principal
```

## 📊 Modelos de Dados

### Subject (Disciplina)
```csharp
public class Subject
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

### StudyTopics (Tópicos de Estudo)
```csharp
public class StudyTopics
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public int SubjectId { get; set; }
    public Subject Subject { get; set; }
}
```

### StudySession (Sessão de Estudo)
```csharp
public class StudySession
{
    public int Id { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public TimeSpan Duration { get; set; }
    public int SubjectId { get; set; }
    public Subject Subject { get; set; }
}
```

## 🔌 Endpoints da API

> Todos os endpoints exigem login, exceto os marcados como **público**. Cada usuário só enxerga as próprias disciplinas, tópicos e sessões.

### Autenticação (Auth)
- `GET /api/Auth/status` - **público** - Indica se o cadastro está aberto (`{ registrationOpen }`)
- `POST /api/Auth/register` - **público** - Cria a conta (`{ name, email, password }`). Só funciona enquanto não existe nenhuma conta; a primeira conta assume as disciplinas criadas antes do login existir
- `POST /api/Auth/login` - **público** - Entra (`{ email, password, rememberMe }`)
- `POST /api/Auth/logout` - **público** - Sai (apaga o cookie)
- `GET /api/Auth/me` - Dados do usuário logado (`{ id, name, email }`)

O login devolve o token JWT num cookie `so_token` (`HttpOnly`, `SameSite=Strict`, `Secure` fora do desenvolvimento), que o navegador envia sozinho nas próximas requisições. A sessão dura 8 horas, ou 30 dias com `rememberMe`. O header `Authorization: Bearer <token>` também é aceito. Login e cadastro aceitam no máximo 5 tentativas por minuto por IP.

Regras do cadastro: nome obrigatório (até 80 caracteres), e-mail válido, senha com 8 a 128 caracteres contendo letras e números.

### Disciplinas (Subject)
- `GET /api/Subject` - Listar todas as disciplinas
- `GET /api/Subject/{id}` - Obter disciplina por ID
- `GET /api/Subject/{id}/progress` - Progresso da disciplina (`{ progress: { subjectName, totalTopics, totalTopicsCompleted, progress } }`; 0 quando não há tópicos)
- `POST /api/Subject` - Criar nova disciplina (`{ name, description }`)
- `PATCH /api/Subject/{id}` - Atualizar disciplina (`{ name, description }`)
- `DELETE /api/Subject/{id}` - Remover disciplina (remove em cascata os tópicos e as sessões)

### Tópicos de Estudo (StudyTopics)
- `GET /api/StudyTopics` - Listar todos os tópicos
- `GET /api/StudyTopics/{id}` - Obter tópico por ID
- `GET /api/StudyTopics/subjectId/{id}` - Listar tópicos de uma disciplina
- `GET /api/StudyTopics/subjectId/{id}/completed` - Listar tópicos concluídos de uma disciplina
- `POST /api/StudyTopics` - Criar novo tópico (`{ title, description, isCompleted, subjectId }`)
- `PATCH /api/StudyTopics/{id}` - Atualizar tópico (`{ title, description, isCompleted }`)
- `PATCH /api/StudyTopics/completed/{id}` - Marcar tópico como concluído
- `DELETE /api/StudyTopics/{id}` - Remover tópico

### Sessões de Estudo (StudySession)
- `GET /api/StudySession` - Listar todas as sessões
- `GET /api/StudySession/TotalTime` - Tempo total de estudo (TimeSpan, ex.: `"01:30:00"`)
- `GET /api/StudySession/subjectId/{id}` - Listar sessões de uma disciplina
- `GET /api/StudySession/subjectId/TotalTime/{id}` - Tempo total de estudo de uma disciplina
- `POST /api/StudySession` - Criar nova sessão (`{ startTime, endTime, subjectId }`, datas em UTC)
- `DELETE /api/StudySession/{id}` - Remover sessão

### Respostas de erro
Os erros da aplicação são devolvidos no formato `{ "message": "..." }`:
- `404 Not Found` - recurso inexistente (ex.: `"Disciplina não encontrada."`)
- `400 Bad Request` - regra de negócio violada (ex.: `"Já existe uma disciplina com esse nome."`, `"O horário de fim deve ser posterior ao horário de início."`)
- `401 Unauthorized` - não logado, sessão expirada ou credenciais inválidas (`"E-mail ou senha inválidos."`)
- `429 Too Many Requests` - limite de tentativas de login/cadastro atingido
- `500 Internal Server Error` - erro inesperado (detalhes apenas no log do servidor)

### Datas
Todas as datas são gravadas e devolvidas em UTC (ISO 8601 terminando em `Z`). A conversão para o horário local fica a cargo do cliente.

## 💾 Banco de Dados

O projeto utiliza **SQLite** para armazenar os dados. O arquivo de banco de dados é criado automaticamente na primeira execução:

```
study.db
```

### Migrações
As migrações do Entity Framework estão em `Migrations/`:
- `Version1.0` - Primeira versão estável
- `Version2.0` - Melhorias na estrutura
- `Version3.0` - Ajustes de estrutura
- `RenameSubscriptionToDescription` - Renomeia o campo `Subscription` da disciplina para `Description`
- `AddUsersAndSubjectOwner` - Cria a tabela `Users` e a coluna `Subject.UserId` (dono da disciplina) (versão atual)

## 🔐 Segurança

A aplicação implementa:
- HTTPS redirection (segurança em trânsito)
- Entity Framework Core (proteção contra SQL Injection)
- Validações de regras de negócio nos services, com respostas de erro padronizadas
- Autenticação JWT em cookie `HttpOnly` (inacessível ao JavaScript da página) e login obrigatório por padrão em todos os endpoints
- Senhas guardadas com hash PBKDF2 com salt (`PasswordHasher` do ASP.NET Core Identity)
- Isolamento de dados por usuário com filtros globais do EF Core
- Limite de tentativas de login e mensagem genérica de erro (não revela se o e-mail existe)
- Chave do JWT fora do repositório (user-secrets / variável de ambiente)

## 📝 Como Usar

### Exemplo: Criar uma Disciplina
```bash
POST /api/Subject
Content-Type: application/json

{
  "name": "Matemática",
  "description": "Disciplina obrigatória"
}
```

### Exemplo: Criar um Tópico de Estudo
```bash
POST /api/StudyTopics
Content-Type: application/json

{
  "title": "Álgebra",
  "description": "Introdução a Álgebra Linear",
  "subjectId": 1
}
```

### Exemplo: Registrar uma Sessão de Estudo
```bash
POST /api/StudySession
Content-Type: application/json

{
  "startTime": "2026-03-19T10:00:00Z",
  "endTime": "2026-03-19T11:30:00Z",
  "subjectId": 1
}
```

## 🧪 Testes

Para testar a API, você pode:
1. Usar o Swagger (disponível em `/swagger`)
2. Usar ferramentas como Postman, Insomnia ou Thunder Client
3. Usar o arquivo `SistemaDeDisciplinas.http` (se estiver usando REST Client no VS Code)

## 🔧 Desenvolvimento

### Debug
Para executar em modo debug:
```bash
dotnet run --configuration Debug
```

### Publicar
Para publicar a aplicação:
```bash
dotnet publish -c Release -o ./publish
```

## 📌 Versão Atual

- **Versão**: 3.0
- **Data da Última Atualização**: 17 de Março de 2026
- **Status**: ✅ Em Desenvolvimento
