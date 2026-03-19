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
        var topics = await _topicsService.GetTopicsBySubjectIdAsync(subjectId);
        var completedTopics = await _topicsService.GetTopicsCompletdBySubjectIdAsync(subjectId);
        var subject = await _subjectService.GetSubjectById(subjectId);

        var progress = Math.Round(
            (double)completedTopics.Count() / topics.Count() * 100,
            2
        );

        var subjectProgress = new ResponseProgressDTO
        {
            SubjectName = subject.Name,
            TotalTopics = topics.Count(),
            TotalTopicsCompleted = completedTopics.Count(),
            Progress = progress
        };

        return subjectProgress;
    }
 }