namespace Subject.Models;

using Auth.Models;

public class Subject
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Dono da disciplina. Fica nulo só nas disciplinas criadas antes do login existir,
    // até a primeira conta ser cadastrada e adotá-las (AuthService.RegisterAsync)
    public int? UserId { get; set; }
    public AppUser? User { get; set; }
}