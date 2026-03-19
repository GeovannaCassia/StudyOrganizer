namespace StudyTopics.Repositories.Interface;

using StudyTopics.Models;

public interface IStudyTopicsRepository
{
    Task <IEnumerable<StudyTopics>> GetAllAsync();
    Task <IEnumerable<StudyTopics>> GetBySubjectIdAsync(int subjectId);
    Task <IEnumerable<StudyTopics>> GetBySubjectIdAndCompletedAsync(int id);
    Task <StudyTopics?> GetByIdAsync(int id);
    Task AddAsync(StudyTopics topic);
    Task UpdateAsync(StudyTopics topic);
    Task DeleteAsync(int id);
}