namespace Subject.Services;

using Subject.Models;
using Subject.Repositories.Interface;
using StudyOrganizer.DTOs.Subjects;
using StudyOrganizer.Exceptions;

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
            Description = subj.Description,
            CreatedAt = subj.CreatedAt
        }).ToList();
    }

    public async Task<ResponseSubjectDTO> GetSubjectById(int id)
    {
        var subject = await _repository.GetByIdAsync(id);

        if (subject == null)
            throw new NotFoundException("Disciplina não encontrada.");

        var subjectDTO = new ResponseSubjectDTO
        {
            Id = subject.Id,
            Name = subject.Name,
            Description = subject.Description,
            CreatedAt = subject.CreatedAt
        };

        return subjectDTO;
    }

    public async Task<Subject> CreateSubjectAsync(CreateSubjectDTO dto)
    {
        var name = await ValidateNameAsync(dto.Name);

        var subject = new Subject
        {
            Name = name,
            Description = dto.Description
        };

        await _repository.AddAsync(subject);
        return subject;
    }

    public async Task UpdateSubjectAsync(int id, UpdateSubjectDTO dto)
    {
        var subject = await _repository.GetByIdAsync(id);

        if (subject == null)
            throw new NotFoundException("Disciplina não encontrada.");

        subject.Name = await ValidateNameAsync(dto.Name, id);
        subject.Description = dto.Description;

        await _repository.UpdateAsync(subject);
    }

    public async Task DeleteSubjectAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }

    // Nome obrigatório e único (sem diferenciar maiúsculas); ignora a própria disciplina na edição
    private async Task<string> ValidateNameAsync(string? name, int? ignoreId = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessRuleException("O nome da disciplina é obrigatório.");

        var trimmedName = name.Trim();
        var subjects = await _repository.GetAllAsync();

        if (subjects.Any(subj => subj.Id != ignoreId &&
                                 string.Equals(subj.Name?.Trim(), trimmedName, StringComparison.OrdinalIgnoreCase)))
        {
            throw new BusinessRuleException("Já existe uma disciplina com esse nome.");
        }

        return trimmedName;
    }
}
