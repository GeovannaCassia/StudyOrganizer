namespace StudyOrganizer.Exceptions;

// Credenciais inválidas ou sessão ausente (respondido como 401)
public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message) : base(message)
    {
    }
}
