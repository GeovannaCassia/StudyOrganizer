namespace StudyOrganizer.DTOs.Auth;
public class ResponseAuthStatusDTO
{
    // O cadastro só fica aberto enquanto não existe nenhuma conta
    public bool RegistrationOpen { get; set; }
}
