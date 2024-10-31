// src/components/Navigation.jsx
import React from 'react';

/**
 * Navigation Component
 * Handles switching between different views
*/
const Navigation = ({ currentView, setCurrentView }) => (
  <nav className="navigation">
    <button
      className={currentView === 'welcome' ? 'active' : ''}
      onClick={() => setCurrentView('welcome')}
    >
      Home
    </button>
    <button
      className={currentView === 'tasks' ? 'active' : ''}
      onClick={() => setCurrentView('tasks')}
    >
      Tasks
    </button>
    <button
      className={currentView === 'calendar' ? 'active' : ''}
      onClick={() => setCurrentView('calendar')}
    >
      Calendar
    </button>
  </nav>
);

export default Navigation;
