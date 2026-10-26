using System.Threading.RateLimiting;
using Auth.Models;
using Auth.Repositories.Implementations;
using Auth.Repositories.Interface;
using Auth.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using StudyOrganizer.Data;
using StudyOrganizer.Middlewares;
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
// Padrão: study.db na pasta server; pode ser trocado por ConnectionStrings__Default (ex.: banco de testes)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default") ?? "Data Source=study.db"));

builder.Services.AddScoped<ISubjectRepository, SubjectRepository>();
builder.Services.AddScoped<IStudyTopicsRepository, StudyTopicsRepository>();
builder.Services.AddScoped<IStudySessionRepository, StudySessionRepository>();

builder.Services.AddScoped<SubjectService>();
builder.Services.AddScoped<StudyTopicsService>();
builder.Services.AddScoped<StudySessionService>();
builder.Services.AddScoped<SubjectProgressService>();

// Autenticação: JWT assinado com a chave de "Jwt:Key", enviado num cookie httpOnly
var jwtSettings = JwtSettings.FromConfiguration(builder.Configuration);
builder.Services.AddSingleton(jwtSettings);
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPasswordHasher<AppUser>, PasswordHasher<AppUser>>();
builder.Services.AddSingleton<TokenService>();
builder.Services.AddScoped<AuthService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = jwtSettings.SigningKey,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),
            NameClaimType = JwtRegisteredClaimNames.Name
        };
        options.Events = new JwtBearerEvents
        {
            // O token vem do cookie; o header Authorization continua aceito (útil no Swagger e em testes)
            OnMessageReceived = context =>
            {
                if (string.IsNullOrEmpty(context.Request.Headers.Authorization) &&
                    context.Request.Cookies.TryGetValue(JwtSettings.CookieName, out var token))
                {
                    context.Token = token;
                }
                return Task.CompletedTask;
            },
            // 401 no mesmo formato { message } dos outros erros da API
            OnChallenge = async context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(new { message = "Sua sessão expirou ou você não está logado. Faça login novamente." });
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    // Todo endpoint exige login, a não ser que esteja marcado com [AllowAnonymous]
    options.FallbackPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
});

// Limita tentativas de login/cadastro: 5 por minuto por IP
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, cancellationToken) =>
        await context.HttpContext.Response.WriteAsJsonAsync(
            new { message = "Muitas tentativas. Aguarde um minuto e tente novamente." }, cancellationToken);
    options.AddPolicy("auth", httpContext => RateLimitPartition.GetFixedWindowLimiter(
        httpContext.Connection.RemoteIpAddress?.ToString() ?? "desconhecido",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 5, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
});

builder.Services.AddControllers();

builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi().AllowAnonymous();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();
app.MapControllers();
app.Run();
