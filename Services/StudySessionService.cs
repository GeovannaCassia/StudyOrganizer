namespace StudySession.Services;

using Microsoft.AspNetCore.Identity;
using StudySession.Models;
using StudySession.Repositories.Interface;
using StudyOrganizer.DTOs.StudySession;
using Microsoft.AspNetCore.Http.HttpResults;

public class StudySessionService
{
    private readonly IStudySessionRepository _repository;

    public StudySessionService(IStudySessionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ResponseStudySessionDTO>> GetAllSessionsAsync()
    {
        var sessions = await _repository.GetAllAsync();

        return sessions.Select(session => new ResponseStudySessionDTO
        {
            Id = session.Id,
            StartTime = session.StartTime,
            EndTime = session.EndTime,
            Duration = session.Duration,
            SubjectId = session.SubjectId
        }).ToList();
    }

    public async Task<TimeSpan> GetTotaStudyTimeSessionsAsync()
    {
        return await _repository.GetTotalStudyTimeAsync();
    }

    public async Task<IEnumerable<ResponseStudySessionDTO?>> GetSessionsBySubjectAsync(int subjectId)
    {
        var sessions = await _repository.GetBySubjectAsync(subjectId);
        Console.WriteLine(sessions);

        return sessions.Select(session => new ResponseStudySessionDTO
        {
            Id = session.Id,
            StartTime = session.StartTime,
            EndTime = session.EndTime,
            Duration = session.Duration,
            SubjectId = session.SubjectId
        }).ToList();
    }

    public async Task<TimeSpan> GetTotalStudySessionBySubjectAsync(int SubjectId)
    {
        return await _repository.GetTotalStudyTimeBySubjectAsync(SubjectId);
    }

    public async Task<StudySession> CreateStudySession(CreateStudySessionDTO dto)
    {
        var session = new StudySession
        {
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Duration = dto.Duration,
            SubjectId = dto.SubjectId
        };

        await _repository.AddAsync(session);

        return session;
    }

    public async Task DeleteStudySessionAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }
}