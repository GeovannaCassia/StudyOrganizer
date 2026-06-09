namespace StudyOrganizer.DTOs.Subjects;
public class ResponseSubjectDTO
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Subscription { get; set; }
    public DateTime CreatedAt { get; set; }
}