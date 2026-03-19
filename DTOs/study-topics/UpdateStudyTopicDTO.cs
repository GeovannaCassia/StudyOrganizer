namespace StudyOrganizer.DTOs.StudyTopics;
public class UpdateStudyTopicDTO
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
}