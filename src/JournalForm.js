import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSmile,
  faFrown,
  faMeh,
  faTired,
} from "@fortawesome/free-solid-svg-icons";

import "./App.css";

function JournalForm({
  currentEntry,
  setCurrentEntry,
  selectedDate,
  setSelectedDate,
  editingIndex,
  setEditingIndex,
  mood,
  setMood,
  selectedTracks,
  setSelectedTracks,
  entries,
  setEntries,
}) {
  useEffect(() => {
    if (!editingIndex) {
      setSelectedDate(new Date());
    }
  }, [editingIndex, setSelectedDate]);

  const handleMoodClick = (selectedMood) => {
    setMood(selectedMood);
  };

  const addMusicToSelectedTracks = (track) => {
    setSelectedTracks([...selectedTracks, track]);
  };

  const SelectedMusic = ({ selectedTracks }) => {
    return (
      <div className="selected-music-container">
        {selectedTracks && selectedTracks.length > 0 && (
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

  const addEntry = () => {
    if (currentEntry.trim() !== "") {
      let entryText = currentEntry;

      if (mood !== "") {
        entryText += `\nMood: ${mood}\n\n`;
      }

      // Don't include selected tracks in the main entry text
      // Instead, handle them separately
      let musicText = "";
      if (selectedTracks.length > 0) {
        musicText += "\nSelected Tracks:\n";
        selectedTracks.forEach((track) => {
          musicText += `- ${track.name} by ${track.artists
            .map((artist) => artist.name)
            .join(", ")}\n`;
        });

        musicText += "\n";
      }

      const entryWithDate = `${selectedDate.toDateString()} - ${entryText}`;

      if (editingIndex !== null) {
        // If editing, update the existing entry
        const updatedEntries = [...entries];
        updatedEntries[editingIndex] = entryWithDate + musicText;
        setEntries(updatedEntries);
        setEditingIndex(null);
      } else {
        // If not editing, add a new entry
        setEntries([...entries, entryWithDate + musicText]);
      }
      setCurrentEntry("");
      setMood(""); // Clear selected mood
      setSelectedTracks([]); // Clear selected music tracks
    }
  };

  const MoodTrack = ({ mood }) => {
    return (
      <div className="mood-buttons">
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
    <div className="journal-section">
      <h1>My Journal</h1>
      <div className="entry-form">
        <div className="textarea-container">
          <MoodTrack mood={mood} handleMoodClick={handleMoodClick} />

          {/* Render the SelectedMusic component */}
          <SelectedMusic selectedTracks={selectedTracks} />

          {/* Render the textarea for the entry */}

          <textarea
            className="textarea"
            rows="4"
            cols="50"
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="Write your entry here..."
          />
        </div>
        <br />
        <button onClick={addEntry}>
          {editingIndex !== null ? "Update Entry" : "Add Entry"}
        </button>
      </div>
    </div>
  );
}

export default JournalForm;
