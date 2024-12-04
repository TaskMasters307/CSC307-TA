// src/components/Settings.jsx
import React, { useState } from 'react';
import '../css/Settings.css'

const Settings = ({ onLogout, toggleDarkMode, isDarkMode }) => {
  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="setting">
        <label htmlFor="dark-mode">Dark Mode</label>
        <input
          type="checkbox"
          id="dark-mode"
          checked={isDarkMode}
          onChange={toggleDarkMode}
        />
      </div>
      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default Settings;