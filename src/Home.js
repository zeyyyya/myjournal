import React, { useState } from "react";
import "./App.css";

function Home({ entries, deleteEntry, editEntry, selectedDate }) {
  const [editIndex, setEditIndex] = useState(null);
  const [editedEntry, setEditedEntry] = useState("");
  const [editedMood, setEditedMood] = useState("");
  const [editedTracks, setEditedTracks] = useState("");

  const handleEdit = (index, entry) => {
    setEditIndex(index);
    const [date, entryContent] = entry.split(" - ");
    const [mood, tracks] = parseEntryContent(entryContent);
    setEditedEntry(entryContent);
    setEditedMood(mood);
    setEditedTracks(tracks);
  };

  const parseEntryContent = (entryContent) => {
    const lines = entryContent.split("\n");
    let mood = "";
    let tracks = "";
    lines.forEach((line) => {
      if (line.startsWith("Mood:")) {
        mood = line.substring(6).trim();
      } else if (line.startsWith("Selected Tracks:")) {
        tracks = line.substring(17).trim();
      }
    });
    return [mood, tracks];
  };

  const saveEditedEntry = (index) => {
    const editedEntryWithMetadata =
      editedEntry +
      (editedMood ? `\nMood: ${editedMood}` : "") +
      (editedTracks ? `\nSelected Tracks: ${editedTracks}` : "");
    editEntry(index, editedEntryWithMetadata);
    setEditIndex(null);
    setEditedEntry("");
    setEditedMood("");
    setEditedTracks("");
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditedEntry("");
    setEditedMood("");
    setEditedTracks("");
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
          entries.map((entry, index) => {
            if (!entry) return null;
            const [date, entryContent] = entry.split(" - ");
            const [mood, tracks] = parseEntryContent(entryContent);

            return (
              <div key={index} className="entry-row">
                <div className="entry-column">
                  {selectedDate.toDateString()}
                </div>
                <div className="entry-column">{mood}</div>
                <div className="entry-column">
                  {editIndex === index ? (
                    <textarea
                      value={editedEntry}
                      onChange={(e) => setEditedEntry(e.target.value)}
                    />
                  ) : (
                    <>{entryContent}</>
                  )}
                </div>
                <div className="entry-column">{tracks}</div>
                <div className="entry-actions">
                  {editIndex === index ? (
                    <>
                      <button onClick={() => saveEditedEntry(index)}>
                        Save
                      </button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(index, entry)}>
                      Edit
                    </button>
                  )}
                  <button onClick={() => deleteEntry(index)}>Delete</button>
                </div>
              </div>
            );
          })
        ) : (
          <div>No entries found</div>
        )}
      </div>
    </div>
  );
}

export default Home;
