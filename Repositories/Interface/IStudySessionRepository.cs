namespace StudySession.Repositories.Interface;

using StudySession.Models;

public interface IStudySessionRepository
{
    Task <IEnumerable<StudySession>> GetAllAsync();
    Task <TimeSpan> GetTotalStudyTimeAsync();
    Task <IEnumerable<StudySession?>> GetBySubjectAsync(int SubjectId);
    Task <TimeSpan> GetTotalStudyTimeBySubjectAsync(int SubjectId);
    Task AddAsync(StudySession studySession);
    Task DeleteAsync(int id);
}