namespace StudyOrganizer.Exceptions;

// Recurso solicitado não existe (respondido como 404)
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message)
    {
    }
}
