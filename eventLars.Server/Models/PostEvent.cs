namespace eventLars.Server.Models;

public class PostEvent
{
    public required string Title { get; set; }

    public required string Intro { get; set; }

    public IEnumerable<DateOnly>? Dates { get; set; }
}
