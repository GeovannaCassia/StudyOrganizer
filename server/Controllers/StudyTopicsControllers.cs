namespace StudyTopics.Controllers;

using Microsoft.AspNetCore.Mvc;
using StudyOrganizer.DTOs.StudyTopics;
using StudyTopics.Models;
using StudyTopics.Services;

[ApiController]
[Route("api/[controller]")]
public class StudyTopicsController : ControllerBase
{
    private readonly StudyTopicsService _service;

    public StudyTopicsController(StudyTopicsService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetStudyTopics()
    {
        var topics = await _service.GetAlltopicsAsync();

        if(topics == null)
            return NotFound();

        return Ok(topics);
    }

    [HttpPatch("completed/{id}")]
    public async Task<ActionResult> UpdateTopicsMarkedAsCompleted(int id)
    {
        await _service.MarkedAsCompletedTopicAsync(id);
        return Ok();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetStudyTopic(int id)
    {
        var topic = await _service.GetTopicByIdAsync(id); 

        if(topic == null)
            return NotFound();

        return Ok(topic);
    }

    [HttpGet("subjectId/{id}")]
    public async Task <IActionResult> GetStudyTopicBysubjectId(int id)
    {
        var topics = await _service.GetTopicsBySubjectIdAsync(id);

        if(topics == null)
            return NotFound();

        return Ok(topics);
    }

    [HttpGet("subjectId/{id}/completed")]
    public async Task <IActionResult> GetStudyTopicCompletedBysubjectId(int id)
    {
        var topics = await _service.GetTopicsCompletdBySubjectIdAsync(id);

        if(topics == null)
            return NotFound();

        return Ok(topics);
    }

    [HttpPost]
    public async Task<IActionResult> CreateStudyTopic(CreateStudyTopicsDTO dto)
    {
        var topic = await _service.CreateStudyTopicAsync(dto);
        return CreatedAtAction(nameof(GetStudyTopic), new { id = topic.Id}, topic);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateStudyTopic(int id, UpdateStudyTopicDTO topic)
    {
        await _service.UpdateTopicAsync(id, topic);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudyTopic(int id)
    {
        await _service.DeleteTopicAsync(id);
        return NoContent();
    }
}
