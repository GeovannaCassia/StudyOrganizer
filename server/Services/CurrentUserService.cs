namespace Auth.Services;

using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;

public interface ICurrentUserService
{
    // null quando a requisição não está autenticada (ou fora de uma requisição, ex.: migrations)
    int? UserId { get; }
}

// Lê o id do usuário logado a partir do token JWT da requisição atual
public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int? UserId
    {
        get
        {
            var principal = _httpContextAccessor.HttpContext?.User;
            var value = principal?.FindFirstValue(JwtRegisteredClaimNames.Sub);

            return int.TryParse(value, out var id) ? id : null;
        }
    }
}
