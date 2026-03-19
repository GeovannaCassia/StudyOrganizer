namespace StudyTopics.Models;

using Subject.Models;

public class StudyTopics
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public int SubjectId { get; set; }
    public Subject Subject { get; set; }
}