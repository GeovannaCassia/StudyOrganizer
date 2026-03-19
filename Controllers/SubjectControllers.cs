namespace Subject.Controllers;

using Microsoft.AspNetCore.Mvc;
using Subject.Services;
using SubjectProgress.Services;
using Subject.Models;
using StudyOrganizer.DTOs.Subjects;

[ApiController]
[Route("api/[controller]")]
public class SubjectController : ControllerBase
{
    private readonly SubjectService _service;
    private readonly SubjectProgressService _progressService;

    public SubjectController(SubjectService service, SubjectProgressService progressService)
    {
        _service = service;
        _progressService = progressService;
    }

    [HttpGet]
    public async Task<IActionResult> GetSubjects()
    {
        var subjects = await _service.GetAllSubjectsAsync();

        if(subjects == null)
            return NotFound();

        return Ok(subjects);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSubject(int id)
    {
        var subject = await _service.GetSubjectById(id);

        if (subject == null)
            return NotFound();

        return Ok(subject);
    }

    [HttpGet("{id}/progress")]
    public async Task<IActionResult> GetProgress(int id)
    {
        var progress = await _progressService.CalculateProgress(id);

        return Ok(new { progress });
    }

    [HttpPost]
    public async Task<IActionResult> CreateSubject(CreateSubjectDTO dto)
    {
        var subject = await _service.CreateSubjectAsync(dto);
        return CreatedAtAction(nameof(GetSubject), new { id = subject.Id }, subject);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateSubject(Subject subject)
    {
        await _service.UpdateSubjectAsync(subject);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSubject(int id)
    {
        await _service.DeleteSubjectAsync(id);
        return NoContent();
    }
}

