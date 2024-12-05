import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Calendar from './Calendar';
import TaskList from './TaskList';

// Mock data for testing
const mockTasks = [
    {
        _id: '1',
        title: 'High Priority Task',
        date: '2024-01-15',
        priority: 'high',
        isCompleted: false
    },
    {
        _id: '2',
        title: 'Completed Task',
        date: '2024-01-15',
        priority: 'low',
        isCompleted: true
    }
];

describe('Calendar Component', () => {
    let setSelectedDateMock;
    let setTasksMock;

    beforeEach(() => {
        setSelectedDateMock = jest.fn();
        setTasksMock = jest.fn();

        const mockDate = new Date(2024, 0, 1); // January 1, 2024
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders calendar with correct month and year', () => {
        render(
            <Calendar 
                selectedDate={new Date(2024, 0, 1)}
                setSelectedDate={setSelectedDateMock}
                tasks={mockTasks}
                setTasks={setTasksMock}
            />
        );

        const header = screen.queryByText(/January 2024/i);
        expect(header).toBeInTheDocument();
    });

    test('renders empty slots for the start of the month', () => {
        render(
            <Calendar 
                selectedDate={new Date(2024, 0, 1)}
                setSelectedDate={setSelectedDateMock}
                tasks={mockTasks}
                setTasks={setTasksMock}
            />
        );

        const emptySlots = screen.getAllByText('', { exact: true });
        expect(emptySlots.length).toBeGreaterThan(0);
    });

    test('renders tasks for a specific date', () => {
        render(
            <Calendar 
                selectedDate={new Date(2024, 0, 1)}
                setSelectedDate={setSelectedDateMock}
                tasks={mockTasks}
                setTasks={setTasksMock}
            />
        );

        const day15 = screen.queryByText('15');
        expect(day15).toBeInTheDocument();
        const taskContainer = day15.closest('.calendar-day');
        const tasks = within(taskContainer).queryAllByText(/Task/);
        expect(tasks.length).toBeGreaterThan(0);
    });

    test('updates tasks on drop', () => {
        render(
            <Calendar 
                selectedDate={new Date(2024, 0, 1)}
                setSelectedDate={setSelectedDateMock}
                tasks={mockTasks}
                setTasks={setTasksMock}
            />
        );

        const day16 = screen.queryByText('16');
        expect(day16).toBeInTheDocument();
        fireEvent.drop(day16, {
            dataTransfer: { getData: () => '1' } // Mock task ID
        });
        expect(setTasksMock).toHaveBeenCalled();
    });

    test('handles drag over correctly', () => {
        render(
            <Calendar 
                selectedDate={new Date(2024, 0, 1)}
                setSelectedDate={setSelectedDateMock}
                tasks={mockTasks}
                setTasks={setTasksMock}
            />
        );

        const day15 = screen.queryByText('15');
        expect(day15).toBeInTheDocument();
        fireEvent.dragOver(day15);
        // If additional drag-over validation is needed, test for state or style changes
    });

    test('changes month correctly', () => {
        render(
            <Calendar 
                selectedDate={new Date(2024, 0, 1)}
                setSelectedDate={setSelectedDateMock}
                tasks={mockTasks}
                setTasks={setTasksMock}
            />
        );

        const nextMonthButton = screen.queryByText('▶');
        fireEvent.click(nextMonthButton);

        const header = screen.queryByText(/February 2024/i);
        expect(header).toBeInTheDocument();
    });

    test('renders task completion styles', () => {
        render(
            <Calendar 
                selectedDate={new Date(2024, 0, 15)}
                setSelectedDate={setSelectedDateMock}
                tasks={mockTasks}
                setTasks={setTasksMock}
            />
        );

        const completedTask = screen.queryByText('Completed Task');
        expect(completedTask).toHaveClass('completed');
    });

    test('generates correct dates for the month', () => {
        const dates = [
            null, null, null, null, null, null, '2024-01-01', '2024-01-31'
        ]; // Mocked result
        dates.forEach((date, index) => {
            expect(date).toBeTruthy();
        });
    });

    test('renders tasks with correct classes and is draggable', () => {
        render(
            <TaskList tasks={mockTasks} toggleTask={jest.fn()} />
        );
    
        mockTasks.forEach((task) => {
            const taskElement = screen.getByText(new RegExp(task.title, 'i'));
            expect(taskElement).toHaveClass('task-item');
            expect(taskElement).toHaveAttribute('draggable', 'true');
        });
    });

    test('sets task ID on drag start', () => {
        render(
            <TaskList tasks={mockTasks} toggleTask={jest.fn()} />
        );

        const taskElement = screen.queryByText(/High Priority Task/i);
        expect(taskElement).toBeInTheDocument();

        const dataTransferMock = { setData: jest.fn() };
        fireEvent.dragStart(taskElement, { dataTransfer: dataTransferMock });

        expect(dataTransferMock.setData).toHaveBeenCalledWith('text', '1');
    });

    test('updates tasks on valid drop', () => {
        render(
            <TaskList tasks={mockTasks} toggleTask={jest.fn()} />
        );

        const taskElement = screen.queryByText(/High Priority Task/i);
        const day16 = screen.queryByText('16');
        expect(taskElement).toBeInTheDocument();
        expect(day16).toBeInTheDocument();

        const dataTransferMock = { setData: jest.fn(), getData: jest.fn(() => '1') };
        fireEvent.dragStart(taskElement, { dataTransfer: dataTransferMock });
        fireEvent.drop(day16, { dataTransfer: dataTransferMock });

        expect(setTasksMock).toHaveBeenCalled();
    });

    test('prevents default behavior on drag over', () => {
        render(
            <Calendar 
                selectedDate={new Date(2024, 0, 1)}
                setSelectedDate={setSelectedDateMock}
                tasks={mockTasks}
                setTasks={setTasksMock}
            />
        );

        const day15 = screen.queryByText('15');
        expect(day15).toBeInTheDocument();

        const preventDefaultMock = jest.fn();
        fireEvent.dragOver(day15, { preventDefault: preventDefaultMock });

        expect(preventDefaultMock).toHaveBeenCalled();
    });

    test('navigates to previous month on arrow click', () => {
        render(
            <Calendar 
                selectedDate={new Date(2024, 0, 1)}
                setSelectedDate={setSelectedDateMock}
                tasks={mockTasks}
                setTasks={setTasksMock}
            />
        );

        const prevMonthArrow = screen.getByText('◀');
        fireEvent.click(prevMonthArrow);

        const header = screen.queryByText(/December 2023/i);
        expect(header).toBeInTheDocument();
    });

    test('calls handleDrop on valid drop with date', () => {
        render(
            <Calendar 
                selectedDate={new Date(2024, 0, 15)}
                setSelectedDate={setSelectedDateMock}
                tasks={mockTasks}
                setTasks={setTasksMock}
            />
        );

        const day16 = screen.queryByText('16');
        expect(day16).toBeInTheDocument();

        fireEvent.drop(day16, { dataTransfer: { getData: () => '1' } });
        expect(setTasksMock).toHaveBeenCalled();
    });
});
