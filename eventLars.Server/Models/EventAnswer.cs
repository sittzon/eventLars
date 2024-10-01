namespace eventLars.Server.Models;

public class EventAnswer
{
    public required DateOnly Date { get; set; }
    public bool? Yes { get; set; }
    public bool? No { get; set; }
    public bool? Maybe { get; set; }
}
