using Microsoft.AspNetCore.Mvc;
using eventLars.Server.Models;
using System.Text.Json;

namespace eventLars.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class EventController : ControllerBase
{
    private static readonly string dataRoot = @"";
    private static readonly string eventsFileName = dataRoot + @"events.json";
    private readonly ILogger<Event> _logger;

    public EventController(ILogger<Event> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IEnumerable<Event>? Get()
    {
        var allEvents = new List<Event>();
        var fileInfos = new List<FileInfo>();
        // Exclude dotfiles
        var files = new DirectoryInfo(dataRoot)
            .GetFiles()
            .Where(x => !x.Name.FirstOrDefault().Equals('.'))
            .Where(x => x.Name.Contains(".json"));
        fileInfos.AddRange(files);

        foreach(var currentFile in fileInfos) {
            var bytes = System.IO.File.ReadAllBytes(currentFile.FullName);
            var e = JsonSerializer.Deserialize<Event>(bytes);
            if (e != null) {
                allEvents.Add(e);
            }
        }

        return allEvents;
    }

    [HttpGet("{guid}")]
    public Event? GetSingleEvent(string guid)
    {
        // Cannot parse string to guid
        if (!Guid.TryParse(guid, out _)) {
            return null;
        }

        // No traversing the filesystem all willy-nilly
        if (guid.Contains('/') || guid.Contains('\\') || guid.Contains('.')) {
            return null;
        }

        var fileName = dataRoot + guid.ToString() + ".json";
        if (!System.IO.File.Exists(fileName)) {
            return null;
        }

        var bytes = System.IO.File.ReadAllBytes(fileName);
        return JsonSerializer.Deserialize<Event>(bytes);
    }

    [HttpPost]
    public IActionResult PostEvent([FromBody] PostEvent postEvent)
    {
        if (postEvent == null) {
            return BadRequest("Event data is invalid.");
        }

        // Add validation if needed, e.g., checking required fields
        if (string.IsNullOrEmpty(postEvent.Title) || string.IsNullOrEmpty(postEvent.Intro))
        {
            return BadRequest("Event must include Title and Intro data.");
        }

        var e = new Event() {
            Guid = Guid.NewGuid(),
            Title = postEvent.Title,
            Intro = postEvent.Intro,
            Dates = postEvent.Dates
        };
        
        var fileName = dataRoot + e.Guid.ToString() + ".json";
        if (System.IO.File.Exists(fileName)) {
            return BadRequest("Event already exist");
        }
        
        System.IO.File.WriteAllText(fileName, JsonSerializer.Serialize(e));
        return CreatedAtAction(nameof(PostEvent), new { id = e.Guid }, e);
    }
    
    [HttpPost("{guid}")]
    public IActionResult Submit(string guid, [FromBody] EventAnswerForm eaf)
    {
        if (string.IsNullOrWhiteSpace(guid) || 
            string.IsNullOrWhiteSpace(eaf.Name) || 
            eaf.Answers.Count() <= 0) {
            return BadRequest(ModelState);
        }

        // Cannot parse string to guid
        if (!Guid.TryParse(guid, out _)) {
            return BadRequest(ModelState);
        }

        // No traversing the filesystem I said!
        if (guid.Contains('/') || guid.Contains('\\') || guid.Contains('.')) {
            return BadRequest(ModelState);
        }

        // Collect all answers
        var allAnswers = new List<EventAnswer>();
        foreach(var v in eaf.Answers) {
            var a = new EventAnswer() {
                Date = v.Date,
                Yes = v.Yes,
                Maybe = v.Maybe,
                No = v.No
            };
            allAnswers.Add(a);
        }

        // Create person and answer object to append to event
        var personAndAnswers = new EventAnswerForm() {
            Name = eaf.Name,
            Answers = allAnswers
        };

        // Read event data
        var fileName = dataRoot + guid + ".json";
        if (!System.IO.File.Exists(fileName)) {
            return BadRequest(ModelState);
        }

        var bytes = System.IO.File.ReadAllBytes(fileName);
        var e = JsonSerializer.Deserialize<Event>(bytes);

        if (e == null) {
            return BadRequest(ModelState);
        }

        // Create Answer array if not exists
        if (e.Answers == null) {
            e.Answers = new List<EventAnswerForm>();
        }

        // Check if Answers already exist from same person
        if (e.Answers.Any(x => x.Name.Equals(eaf.Name))) {
            return BadRequest(ModelState);
        }

        // Append answers from person
        e.Answers = e.Answers.Append(personAndAnswers);

        System.IO.File.WriteAllText(fileName, JsonSerializer.Serialize(e));

        return Ok(new { message = "Form submitted successfully"});
    }

    [HttpGet("{guid}/stats")]
    public Stats? GetStats(string guid)
    {
        // Cannot parse string to guid
        if (!Guid.TryParse(guid, out _)) {
            return null;
        }
        // No traversing the filesystem for the last time!
        if (guid.Contains('/') || guid.Contains('\\') || guid.Contains('.')) {
            return null;
        }

        var fileName = dataRoot + guid.ToString() + ".json";
        if (!System.IO.File.Exists(fileName)) {
            return null;
        }

        var bytes = System.IO.File.ReadAllBytes(fileName);
        var e = JsonSerializer.Deserialize<Event>(bytes);

        if (e == null || e.Answers == null || e.Answers.Count() <= 0 || e.Dates == null) {
            return null;
        }

        // Group according to dates
        var stats = new List<Stat>();
        foreach(var currentDate in e.Dates.Order()) {
            var date = currentDate;
            var stat = new Stat() {
                Date = currentDate,
                Yes = 0,
                Maybe = 0,
                No = 0
            };
            foreach (var a in e.Answers) {
                var name = a.Name;
                foreach (var answer in a.Answers.Where(x => x.Date.Equals(date))) {
                    if (answer.Yes.HasValue && answer.Yes.Value.Equals(true)) {
                        stat.Yes += 1;
                    }
                    if (answer.Maybe.HasValue && answer.Maybe.Value.Equals(true)) {
                        stat.Maybe += 1;
                    }
                    if (answer.No.HasValue && answer.No.Value.Equals(true)) {
                        stat.No += 1;
                    }
                }
            }                
            stats.Add(stat);
        }
        
        var guidDatesAndStats = new Stats() {
            Guid = Guid.Parse(guid),
            DatesAndAnswers = stats
        };

        return guidDatesAndStats;
    }
}
