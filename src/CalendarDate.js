import React from "react";
import Calendar from "react-calendar"; //npm install react-calendar

function CalendarDate() {
  return (
    <div className="calendar-section">
      <h1>My Calendar</h1>
      <div className="cute-calendar">
        <Calendar />
      </div>
    </div>
  );
}

export default CalendarDate;
