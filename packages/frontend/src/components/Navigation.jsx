import React from 'react'
import { NavLink } from 'react-router-dom'

/**
 * Navigation Component
 * Handles navigation between different views
 */
const Navigation = () => (
    <nav className="navigation">
        <NavLink
            to="/welcome"
            className={({ isActive }) => (isActive ? 'active' : '')}
        >
            Home
        </NavLink>
        <NavLink
            to="/tasks"
            className={({ isActive }) => (isActive ? 'active' : '')}
        >
            Tasks
        </NavLink>
        <NavLink
            to="/calendar"
            className={({ isActive }) => (isActive ? 'active' : '')}
        >
            Calendar
        </NavLink>
        <NavLink
            to="/leaderboard"
            className={({ isActive }) => (isActive ? 'active' : '')}
        >
            Leaderboard
        </NavLink>
    </nav>
)

export default Navigation
