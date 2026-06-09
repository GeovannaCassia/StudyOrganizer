namespace StudySession.Models;

using Subject.Models;

public class StudySession
{
    public int Id { get; set; }
    public DateTime StartTime { get; set;}
    public DateTime EndTime { get; set; }
    public TimeSpan Duration { get; set; }
    public int SubjectId { get; set; }
    public Subject Subject { get; set; }
}