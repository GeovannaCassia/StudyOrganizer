namespace StudyOrganizer.Exceptions;

// Violação de regra de negócio ou dado inválido (respondido como 400)
public class BusinessRuleException : Exception
{
    public BusinessRuleException(string message) : base(message)
    {
    }
}
