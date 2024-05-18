import React from "react";
import Calendar from "react-calendar"; // npm install react-calendar
import "react-calendar/dist/Calendar.css"; // Make sure the CSS is imported
import "./App.css";

const CalendarDate = ({ value, onChange }) => {
  return (
    <div className="calendar-container">
      <h2>Select Date:</h2>
      <p>{value.toDateString()}</p>
      <Calendar onChange={onChange} value={value} />
    </div>
  );
};

export default CalendarDate;
