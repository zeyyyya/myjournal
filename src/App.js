import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import JournalForm from "./JournalForm";
import SearchMusic from "./SearchMusic";
import CalendarDate from "./CalendarDate";
import Login from "./Login";
import Register from "./Register";
import "./App.css";
import "react-calendar/dist/Calendar.css";

const CLIENT_ID = "9df9c2d5ff4b4c5aac9d6f752e31ec48";
const CLIENT_SECRET = "67db982056d842b289a0b6a8d92051d2";

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
  const [isEditing, setIsEditing] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUsername, setLoggedInUsername] = useState("admin");
  const [loggedInPassword, setLoggedInPassword] = useState("admin1234");

  const handleRegister = (name, email, username, password) => {
    console.log("Registered:", { name, email, username, password });
  };

  const logout = () => {
    setLoggedIn(false);
  };

  const handleLogin = (enteredUsername, enteredPassword) => {
    if (
      enteredUsername === loggedInUsername &&
      enteredPassword === loggedInPassword
    ) {
      setLoggedIn(true);
      console.log("Logged in successfully");
    } else {
      console.log("Incorrect username or password");
    }
  };

  useEffect(() => {
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

  useEffect(() => {
    const savedEntries = sessionStorage.getItem("entries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  const deleteEntry = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  const editEntry = (index, updatedEntry) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = updatedEntry;
    setEntries(updatedEntries);
  };

  const handleSaveEntry = () => {
    if (currentEntry.trim() !== "") {
      const entry = {
        date: selectedDate.toDateString(),
        text: currentEntry,
        mood: mood,
        tracks: selectedTracks.map((track) => ({
          name: track.name,
          artists: Array.isArray(track.artists)
            ? track.artists.map((artist) => artist.name).join(", ")
            : track.artists,
        })),
      };

      if (editingIndex !== null) {
        editEntry(editingIndex, entry); // Update the existing entry
      } else {
        setEntries([...entries, entry]); // Add a new entry
      }

      setCurrentEntry("");
      setMood("");
      setSelectedTracks([]);
      setSelectedDate(new Date());
      setIsEditing(false);
      setEditingIndex(null);
    }
  };

  return (
    <Router>
      <div className="App">
        {loggedIn && (
          <Navbar
            logout={logout} // Pass the logout function
          />
        )}{" "}
        {/* Render Navbar only if logged in */}
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? (
                <Navigate to="/home" />
              ) : (
                <Login
                  setLoggedIn={setLoggedIn}
                  handleRegister={handleRegister} // Ensure handleRegister is passed
                  handleLogin={handleLogin}
                />
              )
            }
          />
          <Route
            path="/register"
            element={
              <Register
                handleRegister={handleRegister}
                setName={setName}
                setEmail={setEmail}
                setUsername={setUsername}
                setPassword={setPassword}
              />
            }
          />
          <Route
            path="/home"
            element={
              loggedIn ? (
                <Home
                  entries={entries}
                  deleteEntry={deleteEntry}
                  editEntry={editEntry}
                  selectedDate={selectedDate}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/journal"
            element={
              loggedIn ? (
                <>
                  <JournalForm
                    currentEntry={currentEntry}
                    setCurrentEntry={setCurrentEntry}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    editingIndex={editingIndex}
                    setEditingIndex={setEditingIndex}
                    mood={mood}
                    setMood={setMood}
                    selectedTracks={selectedTracks}
                    setSelectedTracks={setSelectedTracks}
                    entries={entries}
                    setEntries={setEntries}
                    handleSaveEntry={handleSaveEntry}
                    setIsEditing={setIsEditing}
                  />
                  <div className="calendar-music-container">
                    <CalendarDate
                      value={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                    />
                    <SearchMusic
                      setMusic={setMusic}
                      music={music}
                      query={query}
                      setQuery={setQuery}
                      accessToken={accessToken}
                      selectedTracks={selectedTracks}
                      setSelectedTracks={setSelectedTracks}
                    />
                  </div>
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
