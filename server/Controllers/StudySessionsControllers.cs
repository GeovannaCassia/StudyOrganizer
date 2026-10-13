namespace StudySession.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using StudyOrganizer.DTOs.StudySession;
using StudySession.Models;
using StudySession.Services;

[ApiController]
[Route("api/[controller]")]
public class StudySessionController : ControllerBase
{
    private readonly StudySessionService _service;
    public StudySessionController(StudySessionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllSessions()
    {
        var sessions = await _service.GetAllSessionsAsync();

        if(sessions == null)
            return NotFound();

        return Ok(sessions);
    }

    [HttpGet("TotalTime")]
    public async Task<IActionResult> GetTotalTimeOfAllSessions()
    {
        var totalTime =  await _service.GetTotaStudyTimeSessionsAsync();

       return Ok(totalTime);
    }

    [HttpGet("subjectId/{id}")]
    public async Task<IActionResult> GetSessionsBySubjectId(int id)
    {
        var sessions = await _service.GetSessionsBySubjectAsync(id);

        if(sessions == null)
            return NotFound();

        return Ok(sessions);
    }

    [HttpGet("subjectId/TotalTime/{id}")]
    public async Task<IActionResult> GetTotalTimeBySubjectId(int id)
    {
        var totalTime = await _service.GetTotalStudySessionBySubjectAsync(id);

        return Ok(totalTime);
    }

    [HttpPost]
    public async Task<IActionResult> CreateSession(CreateStudySessionDTO dto)
    {
        var session = await _service.CreateStudySession(dto);
        return Ok(session);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSession(int id)
    {
        await _service.DeleteStudySessionAsync(id);
        return NoContent();
    }
}