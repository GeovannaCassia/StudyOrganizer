namespace StudyOrganizer.DTOs.StudySession;
public class CreateStudySessionDTO
{
    public DateTime StartTime { get; set;}
    public DateTime EndTime { get; set; }

    public TimeSpan Duration
    {
        get
        {
            return EndTime - StartTime;
        }
    }
    
    public int SubjectId { get; set; }
}