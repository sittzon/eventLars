namespace eventLars.Server.Models;

public class Stats
{
    public required Guid Guid { get; set; }

    public required IEnumerable<Stat> DatesAndAnswers { get; set; }
}

public class Stat
{
    public required DateOnly Date { get; set; }
    public required int Yes { get; set; }
    public required int No { get; set; }
    public required int Maybe { get; set; }
}
