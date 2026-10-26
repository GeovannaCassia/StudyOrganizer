namespace StudySession.Services;

using Microsoft.AspNetCore.Identity;
using StudySession.Models;
using StudySession.Repositories.Interface;
using StudyOrganizer.DTOs.StudySession;
using StudyOrganizer.Exceptions;
using Subject.Repositories.Interface;

public class StudySessionService
{
    private readonly IStudySessionRepository _repository;
    private readonly ISubjectRepository _subjectRepository;

    public StudySessionService(IStudySessionRepository repository, ISubjectRepository subjectRepository)
    {
        _repository = repository;
        _subjectRepository = subjectRepository;
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

    public async Task<ResponseStudySessionDTO> CreateStudySession(CreateStudySessionDTO dto)
    {
        if (dto.EndTime <= dto.StartTime)
            throw new BusinessRuleException("O horário de fim deve ser posterior ao horário de início.");

        if (await _subjectRepository.GetByIdAsync(dto.SubjectId) == null)
            throw new BusinessRuleException("A disciplina informada não existe.");

        var session = new StudySession
        {
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Duration = dto.Duration,
            SubjectId = dto.SubjectId
        };

        await _repository.AddAsync(session);

        return new ResponseStudySessionDTO
        {
            Id = session.Id,
            StartTime = session.StartTime,
            EndTime = session.EndTime,
            Duration = session.Duration,
            SubjectId = session.SubjectId
        };
    }

    public async Task DeleteStudySessionAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }
}