import { useEffect, useState } from "react";
import "./App.css";
import Calendar from "react-calendar"; //npm install react-calendar
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSmile,
  faFrown,
  faMeh,
  faTired,
} from "@fortawesome/free-solid-svg-icons";

const CLIENT_ID = "9df9c2d5ff4b4c5aac9d6f752e31ec48";
const CLIENT_SECRET = "67db982056d842b289a0b6a8d92051d2";

function Search({
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
              <button onClick={() => addMusicToSelectedTracks(track)}>
                Add to Selected Tracks
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
  const [mood, setMood] = useState("");

  const handleMoodClick = (selectedMood) => {
    setMood(selectedMood);
  };

  const addMusicToSelectedTracks = (track) => {
    setSelectedTracks([...selectedTracks, track]);
  };

  const SelectedMusic = ({ selectedTracks }) => {
    return (
      <div className="selected-music-container">
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
          </div>
        )}
      </div>
    );
  };

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
      let entryText = currentEntry;

      if (mood !== "") {
        entryText += `\nMood: ${mood}\n\n`;
      }
      // <SelectedMusic selectedTracks={selectedTracks} />;

      if (selectedTracks.length > 0) {
        entryText += "\nSelected Tracks:\n";
        selectedTracks.forEach((track) => {
          entryText += `- ${track.name} by ${track.artists
            .map((artist) => artist.name)
            .join(", ")}\n`;
        });

        entryText += "\n";
      }

      const entryWithDate = `${selectedDate.toDateString()} - ${entryText}`;

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
      setMood(""); // Clear selected mood
      setSelectedTracks([]); // Clear selected music tracks
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

  const viewEntry = (index) => {
    const entryContent = entries[index];
    alert(entryContent);
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

  const MoodTrack = ({ mood }) => {
    return (
      <div className="mood-container">
        {mood && <p className="selected-mood">Selected Mood: {mood}</p>}
        <button
          className={`mood-button ${mood === "happy" ? "selected" : ""}`}
          onClick={(e) => handleMoodClick("happy", e)}
        >
          <FontAwesomeIcon icon={faSmile} size="2x" />
        </button>
        <button
          className={`mood-button ${mood === "sad" ? "selected" : ""}`}
          onClick={(e) => handleMoodClick("sad", e)}
        >
          <FontAwesomeIcon icon={faFrown} size="2x" />
        </button>
        <button
          className={`mood-button ${mood === "neutral" ? "selected" : ""}`}
          onClick={(e) => handleMoodClick("neutral", e)}
        >
          <FontAwesomeIcon icon={faMeh} size="2x" />
        </button>
        <button
          className={`mood-button ${mood === "tired" ? "selected" : ""}`}
          onClick={(e) => handleMoodClick("tired", e)}
        >
          <FontAwesomeIcon icon={faTired} size="2x" />
        </button>
      </div>
    );
  };

  return (
    <div className="App">
      <div className="journal-section">
        <h1>My Journal</h1>
        <div className="entry-form">
          <div className="textarea-container">
            {/* Render the MoodTrack component */}
            <MoodTrack mood={mood} handleMoodClick={handleMoodClick} />

            {/* Render the SelectedMusic component */}
            <SelectedMusic selectedTracks={selectedTracks} />

            {/* Render the textarea for the entry */}
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
                <button onClick={() => viewEntry(index)}>View</button>
                <button
                  onClick={() => editEntry(index)}
                  style={{ margin: "2%" }}
                >
                  Edit
                </button>
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
            className="search-music"
            setMusic={setMusic}
            music={music}
            query={query}
            setQuery={setQuery}
            accessToken={accessToken}
            addMusicToSelectedTracks={addMusicToSelectedTracks} // Pass the function as a prop
            addToJournal={addToJournal}
            addMusicToEntry={addMusicToEntry}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
