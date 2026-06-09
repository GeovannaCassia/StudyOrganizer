using Microsoft.EntityFrameworkCore;
using StudyOrganizer.Data;
using StudySession.Repositories.Implementations;
using StudySession.Repositories.Interface;
using StudySession.Services;
using StudyTopics.Repositories.Implementations;
using StudyTopics.Repositories.Interface;
using StudyTopics.Services;
using Subject.Repositories.Implementations;
using Subject.Repositories.Interface;
using Subject.Services;
using SubjectProgress.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// Injeção de dependencia, que é necessária no entity framework core
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlite("Data Source=study.db"));

builder.Services.AddScoped<ISubjectRepository, SubjectRepository>();
builder.Services.AddScoped<IStudyTopicsRepository, StudyTopicsRepository>();
builder.Services.AddScoped<IStudySessionRepository, StudySessionRepository>();

builder.Services.AddScoped<SubjectService>();
builder.Services.AddScoped<StudyTopicsService>();
builder.Services.AddScoped<StudySessionService>();
builder.Services.AddScoped<SubjectProgressService>();

builder.Services.AddControllers();

builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
