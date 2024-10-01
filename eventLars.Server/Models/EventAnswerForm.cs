namespace eventLars.Server.Models;

public class EventAnswerForm
{
    public required IEnumerable<EventAnswer> Answers { get; set; }
    public required string Name { get; set; }
}
