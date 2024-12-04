import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Calendar from '../components/Calendar';

describe('Calendar Component', () => {
  const mockSetTasks = jest.fn();
  const mockSetSelectedDate = jest.fn();

  const tasks = [
    { id: 1, title: 'Task 1', date: '2024-12-01', priority: 'high', isCompleted: false },
    { id: 2, title: 'Task 2', date: '2024-12-02', priority: 'medium', isCompleted: true },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the current month and year', () => {
    render(
      <Calendar
        selectedDate={new Date('2024-12-01')}
        setSelectedDate={mockSetSelectedDate}
        tasks={tasks}
        setTasks={mockSetTasks}
      />
    );
    expect(screen.getByText(/December 2024/i)).toBeInTheDocument();
  });

  test('renders calendar with no tasks initially', () => {
    render(
      <Calendar
        selectedDate={new Date('2024-12-01')}
        setSelectedDate={mockSetSelectedDate}
        tasks={[]} // Empty tasks array
        setTasks={mockSetTasks}
      />
    );

    // Verify no tasks are displayed
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();

    // Verify calendar renders correctly
    expect(screen.getByText('1')).toBeInTheDocument(); // Day 1
    expect(screen.getByText('2')).toBeInTheDocument(); // Day 2
  });

  test('renders tasks for the correct date', () => {
    render(
      <Calendar
        selectedDate={new Date('2024-12-01')}
        setSelectedDate={mockSetSelectedDate}
        tasks={tasks}
        setTasks={mockSetTasks}
      />
    );
  
    // Check for task rendering
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });
  

  test('changes month when navigation arrows are clicked', () => {
    render(
      <Calendar
        selectedDate={new Date('2024-12-01')}
        setSelectedDate={mockSetSelectedDate}
        tasks={tasks}
        setTasks={mockSetTasks}
      />
    );

    // Click next month arrow
    fireEvent.click(screen.getByText('▶'));
    expect(screen.getByText(/January 2025/i)).toBeInTheDocument();

    // Click previous month arrow twice
    fireEvent.click(screen.getByText('◀'));
    fireEvent.click(screen.getByText('◀'));
    expect(screen.getByText(/November 2024/i)).toBeInTheDocument();
  });

  test('handles drag and drop for tasks', () => {
    render(
      <Calendar
        selectedDate={new Date('2024-12-01')}
        setSelectedDate={mockSetSelectedDate}
        tasks={tasks}
        setTasks={mockSetTasks}
      />
    );
  
    const task = screen.getByText('Task 1');
    const dropZone = screen.getByText('2'); // Day 2 in the calendar
  
    fireEvent.dragStart(task);
    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone);
  
    // Verify `setTasks` is called with the correct data
    expect(mockSetTasks).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ id: 1, date: '2024-12-02' }),
    ]));
  });
  
  
});
