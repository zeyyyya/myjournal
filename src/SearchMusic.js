import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTimes,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function SearchMusic({
  setMusic,
  music,
  query,
  setQuery,
  accessToken,
  selectedTracks,
  setSelectedTracks,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialSelectedTracks, setInitialSelectedTracks] = useState([]);
  const [currentTrackId, setCurrentTrackId] = useState(null); // Track the currently playing track

  useEffect(() => {
    if (setSelectedTracks) {
      setSelectedTracks(initialSelectedTracks);
    }
  }, [initialSelectedTracks, setSelectedTracks]);

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    if (!query) return;

    const fetchMusic = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            query
          )}&type=track`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        if (data.tracks && data.tracks.items) {
          setMusic(data.tracks.items);
        } else {
          setMusic([]);
        }
      } catch (error) {
        setError("Failed to fetch music");
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, [query, accessToken, setMusic]);

  const handleAddTrack = (track) => {
    if (
      !selectedTracks.find((selectedTrack) => selectedTrack.id === track.id)
    ) {
      setSelectedTracks([...selectedTracks, track]);
    }
  };

  const handleRemoveTrack = (trackId) => {
    setSelectedTracks(selectedTracks.filter((track) => track.id !== trackId));
  };

  const handlePlayTrack = (trackId) => {
    setCurrentTrackId(trackId);
  };

  const handlePauseTrack = () => {
    setCurrentTrackId(null);
  };

  return (
    <div className="search-music">
      <div className="fixed-container">
        <input
          type="text"
          placeholder="Search for music..."
          value={query}
          onChange={handleSearchChange} // Use the handleSearchChange function here
        />
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
      </div>
      <div className="music-container">
        <ul>
          {music.map((track) => (
            <li
              key={track.id}
              className={`track-item ${
                selectedTracks.find(
                  (selectedTrack) => selectedTrack.id === track.id
                )
                  ? "journal-track"
                  : "searched-track"
              }`}
            >
              <div className="addremovebtn">
                {selectedTracks.find(
                  (selectedTrack) => selectedTrack.id === track.id
                ) ? (
                  <button onClick={() => handleRemoveTrack(track.id)}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                ) : (
                  <button onClick={() => handleAddTrack(track)}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                )}
              </div>
              <div className="track-info">
                {track.name} by{" "}
                {track.artists.map((artist) => artist.name).join(", ")}
              </div>
              <div className="track-play">
                {track.preview_url &&
                  (currentTrackId === track.id ? (
                    <button className="pausebtn" onClick={handlePauseTrack}>
                      <FontAwesomeIcon icon={faPause} />
                    </button>
                  ) : (
                    <button
                      className="playbtn"
                      onClick={() => handlePlayTrack(track.id)}
                    >
                      <FontAwesomeIcon icon={faPlay} />
                    </button>
                  ))}
                {track.preview_url && currentTrackId === track.id && (
                  <audio
                    src={track.preview_url}
                    autoPlay
                    onEnded={handlePauseTrack}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchMusic;
