namespace eventLars.Server.Models;

public class Event
{
    public required Guid Guid { get; set; }
    public required string Title { get; set; }

    public required string Intro { get; set; }

    public IEnumerable<DateOnly>? Dates { get; set; }

    public IEnumerable<EventAnswerForm>? Answers { get; set; }
}
