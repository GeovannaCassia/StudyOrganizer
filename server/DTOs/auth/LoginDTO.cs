namespace StudyOrganizer.DTOs.Auth;
public class LoginDTO
{
    public string? Email { get; set; }
    public string? Password { get; set; }

    // true: sessão de 30 dias; false: 8 horas (cookie de sessão do navegador)
    public bool RememberMe { get; set; }
}
