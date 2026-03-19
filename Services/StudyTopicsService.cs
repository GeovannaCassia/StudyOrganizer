namespace StudyTopics.Services;

using StudyTopics.Models;
using StudyTopics.Repositories.Interface;
using StudyOrganizer.DTOs.StudyTopics;

public class StudyTopicsService
{
    private readonly IStudyTopicsRepository _repository;

    public StudyTopicsService(IStudyTopicsRepository repository)
    {
        _repository = repository;
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
            throw new  Exception("O titulo do topico é obrigatório.");
        }

        await _repository.AddAsync(topic);
        return topic;
    }

    public async Task UpdateTopicAsync(int id, UpdateStudyTopicDTO dto)
    {
        var topic = await _repository.GetByIdAsync(id);
        
        if(topic == null)
            throw new Exception("Topico não encontrado");

        topic.Title = dto.Title;
        topic.Description = dto.Description;
        topic.IsCompleted = dto.IsCompleted;

        await _repository.UpdateAsync(topic);
    }

    public async Task MarkedAsCompletedTopicAsync(int id)
    {
         var topic = await _repository.GetByIdAsync(id);

        if (topic == null)
            throw new Exception("Topic not found");

        topic.IsCompleted = true;

        await _repository.UpdateAsync(topic);
    }

    public async Task DeleteTopicAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }
}