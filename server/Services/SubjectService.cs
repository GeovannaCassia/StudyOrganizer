namespace Subject.Services;

using Subject.Models;
using Subject.Repositories.Interface;
using StudyOrganizer.DTOs.Subjects;
using Microsoft.AspNetCore.Http.HttpResults;

public class SubjectService
{
    private readonly ISubjectRepository _repository;

    public SubjectService(ISubjectRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ResponseSubjectDTO>> GetAllSubjectsAsync()
    {
        var subjects = await _repository.GetAllAsync();

        return subjects.Select(subj => new ResponseSubjectDTO
        {
            Id = subj.Id,
            Name = subj.Name,
            Subscription = subj.Subscription,
            CreatedAt = subj.CreatedAt
        }).ToList();
    }

    public async Task<ResponseSubjectDTO> GetSubjectById(int id)
    {
        var subject = await _repository.GetByIdAsync(id);

        var subjectDTO = new ResponseSubjectDTO
        {
            Id = subject.Id,
            Name = subject?.Name,
            Subscription = subject?.Subscription,
            CreatedAt = subject.CreatedAt
        };

        return subjectDTO;
    }

    public async Task<Subject> CreateSubjectAsync(CreateSubjectDTO dto)
    {
        var subject = new Subject
        {
            Name = dto.Name,
            Subscription = dto.Subscription
        };

        if (string.IsNullOrWhiteSpace(subject.Name))
        {
            throw new Exception("O nome da disciplina é obrigatorio.");
        }
        
        var subjects = await _repository.GetAllAsync();

        if(subjects.Any(subj => subj.Name == subject.Name))
        {
            throw new Exception("O nome da disciplina já existe e não pode ser duplicado.");
        }

        await _repository.AddAsync(subject);
        return subject;
    }

    public async Task UpdateSubjectAsync(Subject subject)
    {
        var existSubject =  await _repository.GetByIdAsync(subject.Id);

        if(existSubject == null)
            throw new Exception("Subject não foi encontrado.");

        if(subject.Id <= 0)
            throw new Exception("Id inválido");
        
        await _repository.UpdateAsync(subject);
    }

    public async Task DeleteSubjectAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }
}