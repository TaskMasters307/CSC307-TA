// src/components/Calendar.jsx
import React from 'react';

/**
 * Calendar Component
 * Displays a monthly calendar view
 */
const Calendar = ({ selectedDate, setSelectedDate }) => {
  // Calculate number of days in current month
  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();
  
  // Calculate the day of week the month starts on (0-6)
  const startDay = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  ).getDay();

  return (
    <div className="calendar">
      <h2>October</h2>
      <div className="calendar-grid">
        {/* Render day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-header">
            {day}
          </div>
        ))}
        {/* Render empty cells for days before month starts */}
        {[...Array(startDay)].map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty"></div>
        ))}
        {/* Render days of the month */}
        {[...Array(daysInMonth)].map((_, i) => (
          <div
            key={i + 1}
            className="calendar-day"
            onClick={() => setSelectedDate(
              new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1)
            )}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;