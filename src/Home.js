import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Home({ entries, deleteEntry, editEntry }) {
  const [editIndex, setEditIndex] = useState(null);
  const [editedEntry, setEditedEntry] = useState("");
  const [editedMood, setEditedMood] = useState("");
  const [editedTracks, setEditedTracks] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filteredEntries, setFilteredEntries] = useState(entries);
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredEntries(entries);
  }, [entries]);

  const handleEditClick = (index) => {
    const entry = entries[index];
    setEditIndex(index);
    setEditedEntry(entry.text);
    setEditedMood(entry.mood);
    setEditedTracks(entry.tracks);
    navigate(`/journal?index=${index}`);
  };

  const saveEditedEntry = (index) => {
    const updatedEntry = {
      ...entries[index],
      text: editedEntry,
      mood: editedMood,
      tracks: editedTracks,
    };
    editEntry(index, updatedEntry);
    setEditIndex(null);
    setEditedEntry("");
    setEditedMood("");
    setEditedTracks([]);
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditedEntry("");
    setEditedMood("");
    setEditedTracks([]);
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilterType(selectedFilter);
    let updatedEntries = [...entries];

    if (selectedFilter === "date-asc") {
      updatedEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (selectedFilter === "date-desc") {
      updatedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (selectedFilter.startsWith("mood:")) {
      const mood = selectedFilter.split(":")[1];
      updatedEntries = entries.filter(
        (entry) => entry.mood.toLowerCase() === mood
      );
    }

    setFilteredEntries(updatedEntries);
  };

  const handleShowAll = () => {
    setFilteredEntries(entries);
  };

  const handleDeleteEntry = (index) => {
    deleteEntry(index);
    const updatedEntries = entries.filter((_, i) => i !== index);
    setFilteredEntries(updatedEntries);
  };

  return (
    <div className="entries">
      <h1>Journal Entries</h1>
      <div className="filter-actions">
        <label>Filter by: </label>
        <select onChange={handleFilterChange} className="filter-dropdown">
          <option value="">Select Filter</option>
          <option value="date-asc">Oldest to Newest</option>
          <option value="date-desc">Newest to Oldest</option>
          <option value="mood:happy">Mood: Happy</option>
          <option value="mood:sad">Mood: Sad</option>
          <option value="mood:neutral">Mood: Neutral</option>
          <option value="mood:tired">Mood: Tired</option>
        </select>
        <button onClick={handleShowAll} className="show-all-button">
          Show All
        </button>
      </div>
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
        {Array.isArray(filteredEntries) && filteredEntries.length > 0 ? (
          filteredEntries.map((entry, index) => (
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
                <button onClick={() => handleDeleteEntry(index)}>Delete</button>
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
