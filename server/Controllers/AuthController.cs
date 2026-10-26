namespace Auth.Controllers;

using Auth.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using StudyOrganizer.DTOs.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _service;
    private readonly ICurrentUserService _currentUser;
    private readonly IWebHostEnvironment _environment;

    public AuthController(AuthService service, ICurrentUserService currentUser, IWebHostEnvironment environment)
    {
        _service = service;
        _currentUser = currentUser;
        _environment = environment;
    }

    [AllowAnonymous]
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        return Ok(await _service.GetStatusAsync());
    }

    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDTO dto)
    {
        var result = await _service.RegisterAsync(dto);
        AppendTokenCookie(result);
        return Ok(result.User);
    }

    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO dto)
    {
        var result = await _service.LoginAsync(dto);
        AppendTokenCookie(result);
        return Ok(result.User);
    }

    [AllowAnonymous]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(JwtSettings.CookieName, BuildCookieOptions());
        return NoContent();
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        return Ok(await _service.GetCurrentUserAsync(_currentUser.UserId));
    }

    // O token fica num cookie httpOnly: o JavaScript da página não consegue lê-lo
    private void AppendTokenCookie(AuthResult result)
    {
        var options = BuildCookieOptions();

        // Sem "Lembrar de mim", o cookie é de sessão (some ao fechar o navegador); o token expira em 8h de qualquer forma
        if (result.Persistent)
            options.Expires = result.ExpiresAt;

        Response.Cookies.Append(JwtSettings.CookieName, result.Token, options);
    }

    private CookieOptions BuildCookieOptions()
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps || !_environment.IsDevelopment(),
            SameSite = SameSiteMode.Strict,
            Path = "/",
            IsEssential = true
        };
    }
}
