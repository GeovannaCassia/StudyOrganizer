namespace StudyOrganizer.DTOs.StudyTopics;
public class ResponseStudyTopicsWithSubjectDTO
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public int SubjectId { get; set; }
    public string? SubjectName { get; set; }
}