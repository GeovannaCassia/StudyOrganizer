namespace StudyOrganizer.Middlewares;

using StudyOrganizer.Exceptions;

// Converte as exceções da aplicação em respostas HTTP no formato { message }
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (NotFoundException ex)
        {
            await WriteErrorAsync(context, StatusCodes.Status404NotFound, ex.Message);
        }
        catch (BusinessRuleException ex)
        {
            await WriteErrorAsync(context, StatusCodes.Status400BadRequest, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro não tratado ao processar {Method} {Path}", context.Request.Method, context.Request.Path);
            await WriteErrorAsync(context, StatusCodes.Status500InternalServerError, "Ocorreu um erro inesperado. Tente novamente.");
        }
    }

    private static async Task WriteErrorAsync(HttpContext context, int statusCode, string message)
    {
        context.Response.StatusCode = statusCode;
        await context.Response.WriteAsJsonAsync(new { message });
    }
}
