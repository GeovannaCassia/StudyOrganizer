namespace StudyTopics.Services;

using StudyTopics.Models;
using StudyTopics.Repositories.Interface;
using StudyOrganizer.DTOs.StudyTopics;
using StudyOrganizer.Exceptions;
using Subject.Repositories.Interface;

public class StudyTopicsService
{
    private readonly IStudyTopicsRepository _repository;
    private readonly ISubjectRepository _subjectRepository;

    public StudyTopicsService(IStudyTopicsRepository repository, ISubjectRepository subjectRepository)
    {
        _repository = repository;
        _subjectRepository = subjectRepository;
    }

    public async Task <IEnumerable<ResponseStudyTopicsDTO>> GetAlltopicsAsync()
    {
        var studyTopics = await _repository.GetAllAsync();

        return studyTopics.Select(topic => new ResponseStudyTopicsDTO
        {
            Id = topic.Id,
            Title = topic.Title,
            Description = topic.Description,
            IsCompleted = topic.IsCompleted,
            SubjectId = topic.SubjectId
        }).ToList();
    }

    public async Task <IEnumerable<ResponseStudyTopicsWithSubjectDTO>> GetTopicsBySubjectIdAsync(int subjectId)
    {
        var studyTopics =  await _repository.GetBySubjectIdAsync(subjectId);

        return studyTopics.Select(topic => new ResponseStudyTopicsWithSubjectDTO
        {
            Id = topic.Id,
            Title = topic.Title,
            Description = topic.Description,
            IsCompleted = topic.IsCompleted,
            SubjectId = topic.SubjectId,
            SubjectName = topic.Subject.Name
        }).ToList();
    }

    public async Task <IEnumerable<ResponseStudyTopicsWithSubjectDTO>> GetTopicsCompletdBySubjectIdAsync(int subjectId)
    {
        var studyTopics =  await _repository.GetBySubjectIdAndCompletedAsync(subjectId);

        return studyTopics.Select(topic => new ResponseStudyTopicsWithSubjectDTO
        {
            Id = topic.Id,
            Title = topic.Title,
            Description = topic.Description,
            IsCompleted = topic.IsCompleted,
            SubjectId = topic.SubjectId,
            SubjectName = topic.Subject.Name
        }).ToList();
    }

    public async Task <ResponseStudyTopicsDTO> GetTopicByIdAsync(int id)
    {
        var topic = await _repository.GetByIdAsync(id);

        if (topic == null)
            throw new NotFoundException("Tópico não encontrado.");

        var studyTopicDTO = new ResponseStudyTopicsDTO
        {
            Id = topic.Id,
            Title = topic.Title,
            Description = topic.Description,
            IsCompleted = topic.IsCompleted,
            SubjectId = topic.SubjectId
        };

        return studyTopicDTO;
    }

    public async Task<StudyTopics> CreateStudyTopicAsync(CreateStudyTopicsDTO dto)
    {
        var topic = new StudyTopics
        {
            Title = dto.Title,
            Description = dto.Description,
            IsCompleted = dto.IsCompleted,
            SubjectId = dto.SubjectId
        };

        if (string.IsNullOrWhiteSpace(topic.Title))
        {
            throw new BusinessRuleException("O título do tópico é obrigatório.");
        }

        if (await _subjectRepository.GetByIdAsync(dto.SubjectId) == null)
        {
            throw new BusinessRuleException("A disciplina informada não existe.");
        }

        await _repository.AddAsync(topic);
        return topic;
    }

    public async Task UpdateTopicAsync(int id, UpdateStudyTopicDTO dto)
    {
        var topic = await _repository.GetByIdAsync(id);
        
        if(topic == null)
            throw new NotFoundException("Tópico não encontrado.");

        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new BusinessRuleException("O título do tópico é obrigatório.");

        topic.Title = dto.Title;
        topic.Description = dto.Description;
        topic.IsCompleted = dto.IsCompleted;

        await _repository.UpdateAsync(topic);
    }

    public async Task MarkedAsCompletedTopicAsync(int id)
    {
         var topic = await _repository.GetByIdAsync(id);

        if (topic == null)
            throw new NotFoundException("Tópico não encontrado.");

        topic.IsCompleted = true;

        await _repository.UpdateAsync(topic);
    }

    public async Task DeleteTopicAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }
}