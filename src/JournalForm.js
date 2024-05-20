import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  handleSaveEntry, // Pass handleSaveEntry from App.js
  setIsEditing,
}) {
  const [selectedFont, setSelectedFont] = useState("monospace");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const index = params.get("index");

    if (index !== null) {
      const entry = entries[index];
      setEditingIndex(index);
      setCurrentEntry(entry.text);
      setSelectedDate(new Date(entry.date));
      setMood(entry.mood);
      setSelectedTracks(entry.tracks);
    } else {
      setCurrentEntry(""); // Reset entry text
      setMood(""); // Reset mood
      setSelectedTracks([]); // Reset selected tracks
      setSelectedDate(new Date()); // Reset selected date
    }
  }, [
    location,
    entries,
    setCurrentEntry,
    setSelectedDate,
    setMood,
    setSelectedTracks,
    setEditingIndex,
  ]);

  const handleMoodClick = (selectedMood) => {
    setMood(selectedMood);
  };

  const SelectedMusic = ({ selectedTracks, handleRemoveTrack }) => {
    return (
      <div className="selected-music-container">
        {selectedTracks && selectedTracks.length > 0 && (
          <div>
            <h3>Selected Tracks:</h3>
            <ul className="track-list">
              {selectedTracks.map((track, index) => (
                <li key={index} className="track-item journal-track">
                  <div className="track-info">
                    <p>
                      {track.name} by{" "}
                      {Array.isArray(track.artists)
                        ? track.artists.map((artist) => artist.name).join(", ")
                        : track.artists}
                    </p>
                  </div>
                  <div className="remove-button-container">
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveTrack(track.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const handleRemoveTrack = (trackId) => {
    setSelectedTracks(selectedTracks.filter((track) => track.id !== trackId));
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentEntry("");
    setMood("");
    setSelectedTracks([]);
    setSelectedDate(new Date());
    setEditingIndex(null);
  };

  const MoodTrack = ({ mood, handleMoodClick }) => {
    return (
      <div className="mood-buttons">
        {mood && <p className="selected-mood">Selected Mood: {mood}</p>}
        <button
          className={`mood-button ${mood === "happy" ? "selected" : ""}`}
          onClick={() => handleMoodClick("happy")}
        >
          <FontAwesomeIcon icon={faSmile} className="icon" size="2x" />
        </button>
        <button
          className={`mood-button ${mood === "sad" ? "selected" : ""}`}
          onClick={() => handleMoodClick("sad")}
        >
          <FontAwesomeIcon icon={faFrown} className="icon" size="2x" />
        </button>
        <button
          className={`mood-button ${mood === "neutral" ? "selected" : ""}`}
          onClick={() => handleMoodClick("neutral")}
        >
          <FontAwesomeIcon icon={faMeh} className="icon" size="2x" />;
        </button>
        <button
          className={`mood-button ${mood === "tired" ? "selected" : ""}`}
          onClick={() => handleMoodClick("tired")}
        >
          <FontAwesomeIcon icon={faTired} className="icon" size="2x" />
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
          <SelectedMusic
            selectedTracks={selectedTracks}
            handleRemoveTrack={handleRemoveTrack}
          />

          <textarea
            className="textarea"
            rows="5"
            cols="40"
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            style={{ fontFamily: selectedFont }} // Apply selected font style
            placeholder="Write your entry here..."
          />
        </div>
        <br />
        <div className="saventrybtn">
          <button style={{ marginInline: "1%" }} onClick={handleSaveEntry}>
            {editingIndex !== null ? "Update Entry" : "Save Entry"}
          </button>
          <button onClick={cancelEdit}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default JournalForm;
