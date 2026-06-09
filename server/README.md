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

### 3. Executar Migrations (Criar Banco de Dados)
```bash
dotnet ef database update
```

### 4. Executar a Aplicação
```bash
dotnet run
```

A aplicação estará disponível em `https://localhost:5001` (HTTPS) ou `http://localhost:5000` (HTTP).

### 5. Acessar a Documentação Swagger
Abra seu navegador e acesse:
```
https://localhost:5001/swagger
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
    public string? Subscription { get; set; }
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

### Disciplinas (Subject)
- `GET /api/subject` - Listar todas as disciplinas
- `GET /api/subject/{id}` - Obter disciplina por ID
- `POST /api/subject` - Criar nova disciplina
- `PUT /api/subject/{id}` - Atualizar disciplina
- `DELETE /api/subject/{id}` - Remover disciplina

### Tópicos de Estudo (StudyTopics)
- `GET /api/study-topics` - Listar todos os tópicos
- `GET /api/study-topics/{id}` - Obter tópico por ID
- `POST /api/study-topics` - Criar novo tópico
- `PUT /api/study-topics/{id}` - Atualizar tópico
- `DELETE /api/study-topics/{id}` - Remover tópico

### Sessões de Estudo (StudySessions)
- `GET /api/study-sessions` - Listar todas as sessões
- `GET /api/study-sessions/{id}` - Obter sessão por ID
- `POST /api/study-sessions` - Criar nova sessão
- `DELETE /api/study-sessions/{id}` - Remover sessão

## 💾 Banco de Dados

O projeto utiliza **SQLite** para armazenar os dados. O arquivo de banco de dados é criado automaticamente na primeira execução:

```
study.db
```

### Migrações
As migrações do Entity Framework estão em `Migrations/`:
- `Version1.0` - Primeira versão estável
- `Version2.0` - Melhorias na estrutura
- `Version3.0` - Versão atual

## 🔐 Segurança

A aplicação implementa:
- HTTPS redirection (segurança em trânsito)
- Entity Framework Core (proteção contra SQL Injection)
- Validações de entrada em DTOs

## 📝 Como Usar

### Exemplo: Criar uma Disciplina
```bash
POST /api/subject
Content-Type: application/json

{
  "name": "Matemática",
  "subscription": "Disciplina obrigatória"
}
```

### Exemplo: Criar um Tópico de Estudo
```bash
POST /api/study-topics
Content-Type: application/json

{
  "title": "Álgebra",
  "description": "Introdução a Álgebra Linear",
  "subjectId": 1
}
```

### Exemplo: Registrar uma Sessão de Estudo
```bash
POST /api/study-sessions
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
