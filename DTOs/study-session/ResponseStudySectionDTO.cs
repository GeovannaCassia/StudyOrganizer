namespace StudyOrganizer.DTOs.StudySession;
public class ResponseStudySessionDTO
{
    public int Id { get; set; }
    public DateTime StartTime { get; set;}
    public DateTime EndTime { get; set; }
    public TimeSpan Duration { get; set; }
    public int SubjectId { get; set; }
}