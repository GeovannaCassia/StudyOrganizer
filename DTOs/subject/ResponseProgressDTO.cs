namespace StudyOrganizer.DTOs.Subjects;

public class ResponseProgressDTO
{
    public string SubjectName { get;set; }
    public int TotalTopics { get; set; }
    public int TotalTopicsCompleted { get; set; }
    public double Progress { get; set; }
}