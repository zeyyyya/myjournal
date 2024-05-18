import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Home({ entries, deleteEntry, editEntry, selectedDate, setEntries }) {
  const [editIndex, setEditIndex] = useState(null);
  const [editedEntry, setEditedEntry] = useState("");
  const [editedMood, setEditedMood] = useState("");
  const [editedTracks, setEditedTracks] = useState([]);
  const navigate = useNavigate();

  const handleEditClick = (index) => {
    const entry = entries[index];
    setEditIndex(index);
    setEditedEntry(entry.text);
    setEditedMood(entry.mood);
    setEditedTracks(entry.tracks);
    navigate(`/journal?index=${index}`); // Navigate to JournalForm.js with the index parameter
  };

  const saveEditedEntry = (index) => {
    const updatedEntry = {
      ...entries[index],
      text: editedEntry,
      mood: editedMood,
      tracks: editedTracks,
    };
    editEntry(index, updatedEntry); // Call the editEntry function to update the entry
    setEditIndex(null);
    setEditedEntry("");
    setEditedMood("");
    setEditedTracks([]);
    setEntries([...entries]); // Update the entries array
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditedEntry("");
    setEditedMood("");
    setEditedTracks([]);
  };

  return (
    <div className="entries">
      <h1>Journal Entries</h1>
      <div className="entry">
        <div className="entry-row">
          <div className="entry-column">
            <strong>Date</strong>
          </div>
          <div className="entry-column">
            <strong>Mood</strong>
          </div>
          <div className="entry-column">
            <strong>Entry</strong>
          </div>
          <div className="entry-column">
            <strong>Music</strong>
          </div>
          <div className="entry-actions">
            <strong>Actions</strong>
          </div>
        </div>
        {Array.isArray(entries) && entries.length > 0 ? (
          entries.map((entry, index) => (
            <div key={index} className="entry-row">
              <div className="entry-column">{entry.date}</div>
              <div className="entry-column">{entry.mood}</div>
              <div className="entry-column">
                {editIndex === index ? (
                  <textarea
                    value={editedEntry}
                    onChange={(e) => setEditedEntry(e.target.value)}
                  />
                ) : (
                  <p>{entry.text}</p>
                )}
              </div>
              <div className="entry-column">
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editedTracks
                      .map(
                        (track) =>
                          `${track.name} by ${track.artists
                            .map((artist) => artist.name)
                            .join(", ")}`
                      )
                      .join(", ")}
                    onChange={(e) =>
                      setEditedTracks(
                        e.target.value.split(", ").map((trackStr) => {
                          const [trackName, artistNames] =
                            trackStr.split(" by ");
                          return {
                            name: trackName,
                            artists: artistNames
                              .split(", ")
                              .map((name) => ({ name })),
                          };
                        })
                      )
                    }
                  />
                ) : (
                  entry.tracks &&
                  entry.tracks.length > 0 && (
                    <ul>
                      {entry.tracks.map((track, trackIndex) => (
                        <li key={trackIndex}>
                          {track.name} by{" "}
                          {Array.isArray(track.artists)
                            ? track.artists
                                .map((artist) => artist.name)
                                .join(", ")
                            : track.artists}
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </div>
              <div className="entry-actions">
                {editIndex === index ? (
                  <>
                    <button onClick={() => saveEditedEntry(index)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEditClick(index)}>Edit</button>
                )}
                <button onClick={() => deleteEntry(index)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div>No entries found</div>
        )}
      </div>
    </div>
  );
}

export default Home;
