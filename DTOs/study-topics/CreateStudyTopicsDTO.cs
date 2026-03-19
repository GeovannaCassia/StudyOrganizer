namespace StudyOrganizer.DTOs.StudyTopics;
public class CreateStudyTopicsDTO
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public int SubjectId { get; set; }
}