using OtNote.Models;

namespace OtNote.Services;

public class OtNoteService(LocalStorageService storage)
{
    private const string StorageKey = "ot-notes";
    private List<OtEntry>? _cache;

    private async Task<List<OtEntry>> LoadAsync()
    {
        if (_cache is not null) return _cache;
        _cache = await storage.GetItemAsync<List<OtEntry>>(StorageKey) ?? [];
        return _cache;
    }

    private Task SaveAsync() => storage.SetItemAsync(StorageKey, _cache ?? []);

    public async Task<List<OtEntry>> GetAllAsync()
    {
        var entries = await LoadAsync();
        return [.. entries];
    }

    public async Task<List<OtEntry>> GetForMonthAsync(int year, int month)
    {
        var entries = await LoadAsync();
        return [.. entries
            .Where(e => e.Date.Year == year && e.Date.Month == month)
            .OrderBy(e => e.Date)];
    }

    public async Task<OtEntry?> GetForDateAsync(DateOnly date)
    {
        var entries = await LoadAsync();
        return entries.FirstOrDefault(e => e.Date == date);
    }

    public async Task<Dictionary<DateOnly, double>> GetHoursByDateForMonthAsync(int year, int month)
    {
        var entries = await GetForMonthAsync(year, month);
        return entries
            .GroupBy(e => e.Date)
            .ToDictionary(g => g.Key, g => g.Sum(e => e.Hours));
    }

    public async Task SaveEntryAsync(OtEntry entry)
    {
        var entries = await LoadAsync();
        entries.RemoveAll(e => e.Date == entry.Date);
        entries.Add(entry);
        await SaveAsync();
    }

    public async Task DeleteEntryForDateAsync(DateOnly date)
    {
        var entries = await LoadAsync();
        entries.RemoveAll(e => e.Date == date);
        await SaveAsync();
    }
}
