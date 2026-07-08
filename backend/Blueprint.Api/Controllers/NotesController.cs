using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Blueprint.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : ControllerBase
    {
        private readonly string _notesFile = "notes.json";

        public class NoteModel
        {
            public string Id { get; set; } = Guid.NewGuid().ToString();
            public string RepositoryId { get; set; } = string.Empty;
            public string FilePath { get; set; } = string.Empty;
            public string Content { get; set; } = string.Empty;
            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        }

        private List<NoteModel> GetNotes()
        {
            if (!System.IO.File.Exists(_notesFile)) return new List<NoteModel>();
            var json = System.IO.File.ReadAllText(_notesFile);
            return JsonSerializer.Deserialize<List<NoteModel>>(json) ?? new List<NoteModel>();
        }

        private void SaveNotes(List<NoteModel> notes)
        {
            System.IO.File.WriteAllText(_notesFile, JsonSerializer.Serialize(notes));
        }

        [HttpGet("{repoId}")]
        public IActionResult GetNotesForRepo(string repoId)
        {
            var notes = GetNotes().Where(n => n.RepositoryId == repoId).OrderByDescending(n => n.CreatedAt).ToList();
            return Ok(notes);
        }

        [HttpPost]
        public IActionResult AddNote([FromBody] NoteModel request)
        {
            if (string.IsNullOrEmpty(request.RepositoryId) || string.IsNullOrEmpty(request.Content))
                return BadRequest("Invalid note.");

            var notes = GetNotes();
            request.Id = Guid.NewGuid().ToString();
            request.CreatedAt = DateTime.UtcNow;
            notes.Add(request);
            SaveNotes(notes);

            return Ok(request);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteNote(string id)
        {
            var notes = GetNotes();
            notes.RemoveAll(n => n.Id == id);
            SaveNotes(notes);
            return NoContent();
        }
    }
}
