import "./App.css";

const CLIENT_ID = "9df9c2d5ff4b4c5aac9d6f752e31ec48";
const CLIENT_SECRET = "67db982056d842b289a0b6a8d92051d2";

function SearchMusic({
  setMusic,
  music,
  query,
  setQuery,
  accessToken,
  addMusicToSelectedTracks,
}) {
  async function search() {
    console.log("Searching for.." + query);

    try {
      var trackParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      var response = await fetch(
        "https://api.spotify.com/v1/search?q=" + query + "&type=track&limit=30",
        trackParameters
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tracks");
      }

      var data = await response.json();

      if (!data || !data.tracks || !data.tracks.items) {
        throw new Error("Invalid response format");
      }

      setMusic(data.tracks.items);
    } catch (error) {
      console.error("Error searching for music:", error);
    }
  }

  return (
    <div className="music-container">
      <div className="music-section">
        <h1>Music</h1>
        <input
          className="search"
          type="text"
          placeholder="Search Songs.."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search();
            }
          }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="btnSearchSong" onClick={search}>
          Search
        </button>

        <div className="music-container">
          {music &&
            music.map((track) => (
              <div key={track.id}>
                <p>{track.name}</p>
                <p>
                  by {track.artists.map((artist) => artist.name).join(", ")}
                </p>
                <button onClick={() => addMusicToSelectedTracks(track)}>
                  Add
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
//button onclick addMusicToEntry = never adds the music
//button onclick addToJournal = diretso upload

export default SearchMusic;
