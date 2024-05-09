import { useEffect, useState } from "react";
import "./App.css";
import Calendar from "react-calendar"; //npm install react-calendar
import "react-calendar/dist/Calendar.css";

const CLIENT_ID = "9df9c2d5ff4b4c5aac9d6f752e31ec48";
const CLIENT_SECRET = "67db982056d842b289a0b6a8d92051d2";

function Search({
  setMusic,
  music,
  query,
  setQuery,
  accessToken,
  addToJournal,
  addMusicToEntry,
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
    <>
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
              <p>by {track.artists.map((artist) => artist.name).join(", ")}</p>
              <button onClick={() => addToJournal(track)}>
                Add to Journal
              </button>
            </div>
          ))}
      </div>
    </>
  );
}
//button onclick addMusicToEntry = never adds the music
//button onclick addToJournal = diretso upload

function App() {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingIndex, setEditingIndex] = useState(null);
  const [music, setMusic] = useState([]);
  const [query, setQuery] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [selectedTracks, setSelectedTracks] = useState([]);

  useEffect(() => {
    //copy paste from music app
    var authParameters = {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((res) => res.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  console.log(music);

  const handleInputChange = (event) => {
    setCurrentEntry(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const addEntry = () => {
    if (currentEntry.trim() !== "") {
      const entryWithDate = `${selectedDate.toDateString()} - ${currentEntry}`;
      if (editingIndex !== null) {
        // If editing, update the existing entry
        const updatedEntries = [...entries];
        updatedEntries[editingIndex] = entryWithDate;
        setEntries(updatedEntries);
        setEditingIndex(null);
      } else {
        // If not editing, add a new entry
        setEntries([...entries, entryWithDate]);
      }
      setCurrentEntry("");
      setSelectedDate(new Date());
    }
  };

  const editEntry = (index) => {
    const confirmation = window.confirm(
      "Are you sure you want to edit this entry?"
    );
    if (confirmation) {
      const [dateString, entryText] = entries[index].split(" - ");
      setCurrentEntry(entryText);
      setSelectedDate(new Date(dateString));
      setEditingIndex(index);
    }
  };

  const deleteEntry = (index) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (confirmation) {
      const updatedEntries = [...entries];
      updatedEntries.splice(index, 1);
      setEntries(updatedEntries);
    }
  };

  const addToJournal = (track) => {
    const entryWithTrack = `${selectedDate.toDateString()} - ${currentEntry} | Track: ${
      track.name
    } by ${track.artists.map((artist) => artist.name).join(", ")}`;
    if (editingIndex !== null) {
      // If editing, update the existing entry
      const updatedEntries = [...entries];
      updatedEntries[editingIndex] = entryWithTrack;
      setEntries(updatedEntries);
      setEditingIndex(null);
    } else {
      // If not editing, add a new entry
      setEntries([...entries, entryWithTrack]);
    }
    setCurrentEntry(""); // Clear current entry after adding to journal
    setSelectedDate(new Date()); // Reset selected date
  };

  const addMusicToEntry = (track) => {
    setSelectedTracks([...selectedTracks, track]);
  };

  const confirmEntry = () => {
    // Create an entry with selected tracks
    const entryWithTracks = `${selectedDate.toDateString()} - ${currentEntry}\n\nTracks:\n${selectedTracks
      .map(
        (track) =>
          `- ${track.name} by ${track.artists
            .map((artist) => artist.name)
            .join(", ")}`
      )
      .join("\n")}`;
    if (editingIndex !== null) {
      // If editing, update the existing entry
      const updatedEntries = [...entries];
      updatedEntries[editingIndex] = entryWithTracks;
      setEntries(updatedEntries);
      setEditingIndex(null);
    } else {
      // If not editing, add a new entry
      setEntries([...entries, entryWithTracks]);
    }
    // Clear current entry and selected tracks
    setCurrentEntry("");
    setSelectedDate(new Date());
    setSelectedTracks([]);
  };

  return (
    <div className="App">
      <div className="journal-section">
        <h1>My Journal</h1>
        <div className="entry-form">
          <div className="textarea-container">
            <textarea
              className="textarea"
              rows="4"
              cols="50"
              value={currentEntry}
              onChange={handleInputChange}
              placeholder="Write your entry here..."
            />
          </div>
          <br />
          <button onClick={addEntry}>
            {editingIndex !== null ? "Update Entry" : "Add Entry"}
          </button>
        </div>
        <div className="entries">
          {entries.map((entry, index) => (
            <div key={index} className="entry">
              <p>{entry}</p>
              <div>
                <button onClick={() => editEntry(index)}>Edit</button>
                <button onClick={() => deleteEntry(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="calendar-section">
        <h1>My Calendar</h1>
        <Calendar value={selectedDate} onChange={handleDateChange} />
        <div className="music-section">
          <h2>Music</h2>
          <Search
            setMusic={setMusic}
            music={music}
            query={query}
            setQuery={setQuery}
            accessToken={accessToken}
            addToJournal={addToJournal}
            addMusicToEntry={addMusicToEntry}
          />
          {/* Display selected music tracks */}
          {selectedTracks.length > 0 && (
            <div>
              <h3>Selected Tracks:</h3>
              <ul>
                {selectedTracks.map((track, index) => (
                  <li key={index}>
                    {track.name} by{" "}
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </li>
                ))}
              </ul>
              {/* Button to confirm entry with selected tracks */}
              <button onClick={confirmEntry}>Add Entry with Music</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
