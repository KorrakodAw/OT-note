namespace OtNote.Models;

public class OtEntry
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public DateOnly Date { get; set; }
    public TimeOnly? StartTime { get; set; }
    public TimeOnly? EndTime { get; set; }
    public double Hours { get; set; }
    public string Task { get; set; } = "";
}
