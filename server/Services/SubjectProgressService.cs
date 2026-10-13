namespace SubjectProgress.Services;

using StudyTopics.Services;
using StudyOrganizer.DTOs.Subjects;
using Subject.Services;

public class SubjectProgressService
{
    private readonly StudyTopicsService _topicsService;
    private readonly SubjectService _subjectService;

    public SubjectProgressService(StudyTopicsService topicsService, SubjectService subjectService)
    {
        _topicsService = topicsService;
        _subjectService = subjectService;
    }

    public async Task<ResponseProgressDTO> CalculateProgress(int subjectId)
    {
        var subject = await _subjectService.GetSubjectById(subjectId);
        var topics = await _topicsService.GetTopicsBySubjectIdAsync(subjectId);
        var completedTopics = await _topicsService.GetTopicsCompletdBySubjectIdAsync(subjectId);

        var totalTopics = topics.Count();
        var totalCompleted = completedTopics.Count();

        // Sem tópicos, o progresso é 0 (evita divisão por zero)
        var progress = totalTopics == 0
            ? 0
            : Math.Round((double)totalCompleted / totalTopics * 100, 2);

        var subjectProgress = new ResponseProgressDTO
        {
            SubjectName = subject.Name ?? string.Empty,
            TotalTopics = totalTopics,
            TotalTopicsCompleted = totalCompleted,
            Progress = progress
        };

        return subjectProgress;
    }
 }