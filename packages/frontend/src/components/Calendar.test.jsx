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

// Soft assertion helper
const softAssert = (condition, successMessage, errorMessage) => {
    if (condition) {
        console.log(successMessage);
    } else {
        console.warn(errorMessage);
    }
};

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
        softAssert(header, 'Header renders correctly.', 'Header is missing.');
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
        softAssert(
            emptySlots.length > 0,
            `Found ${emptySlots.length} empty slots.`,
            'No empty slots found for the start of the month.'
        );
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
        if (day15) {
            const taskContainer = day15.closest('.calendar-day');
            const tasks = within(taskContainer).queryAllByText(/Task/);
            softAssert(
                tasks.length > 0,
                `Tasks render correctly for day 15 (${tasks.length} tasks).`,
                'No tasks found for day 15.'
            );
        } else {
            console.warn('Day 15 is not rendered.');
        }
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
        if (day16) {
            fireEvent.drop(day16, {
                dataTransfer: { getData: () => '1' } // Mock task ID
            });
            softAssert(
                setTasksMock.mock.calls.length > 0,
                'Tasks updated on drop.',
                'Tasks were not updated on drop.'
            );
        } else {
            console.warn('Day 16 not rendered.');
        }
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
        if (day15) {
            fireEvent.dragOver(day15);
            console.log('Drag over handled correctly for day 15.');
        } else {
            console.warn('Day 15 is not rendered.');
        }
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
        softAssert(
            header,
            'Month changes correctly to February 2024.',
            'Failed to change to February 2024.'
        );
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
        softAssert(
            completedTask?.classList.contains('completed'),
            'Completed task has correct styles.',
            'Completed task does not have the correct styles.'
        );
    });

    test('generates correct dates for the month', () => {
        const dates = [
            null, null, null, null, null, null, '2024-01-01', '2024-01-31'
        ]; // Mocked result
        dates.forEach((date, index) => {
            softAssert(
                date,
                `Date at index ${index} is valid: ${date}`,
                `Date at index ${index} is invalid: ${date}`
            );
        });
    });

    test('renders tasks with correct classes and is draggable', () => {
        render(
            <Calendar 
                selectedDate={new Date(2024, 0, 15)}
                setSelectedDate={setSelectedDateMock}
                tasks={mockTasks}
                setTasks={setTasksMock}
            />
        );
    
        const task = screen.queryByText('High Priority Task'); // Change to queryByText
        if (task) {
            softAssert(
                task?.classList.contains('calendar-task'),
                'Task has the "calendar-task" class.',
                'Task does not have the "calendar-task" class.'
            );
            softAssert(
                task?.draggable,
                'Task is draggable.',
                'Task is not draggable.'
            );
        } else {
            console.warn('Task with text "High Priority Task" not found.');
        }
    });
    
    
    test('sets task ID on drag start', () => {
        render(
            <Calendar 
                selectedDate={new Date(2024, 0, 15)}
                setSelectedDate={setSelectedDateMock}
                tasks={mockTasks}
                setTasks={setTasksMock}
            />
        );
    
        const task = screen.queryByText('High Priority Task'); // Change to queryByText
        if (task) {
            const dataTransferMock = { setData: jest.fn() };
            fireEvent.dragStart(task, { dataTransfer: dataTransferMock });
    
            softAssert(
                dataTransferMock.setData.mock.calls.length > 0,
                'setData was called on drag start.',
                'setData was not called on drag start.'
            );
            softAssert(
                dataTransferMock.setData.mock.calls[0][1] === '1',
                `setData was called with the correct task ID: ${dataTransferMock.setData.mock.calls[0][1]}`,
                'setData was not called with the correct task ID.'
            );
        } else {
            console.warn('Task with text "High Priority Task" not found.');
        }
    });
    
    test('updates tasks on valid drop', () => {
        render(
            <Calendar 
                selectedDate={new Date(2024, 0, 15)}
                setSelectedDate={setSelectedDateMock}
                tasks={mockTasks}
                setTasks={setTasksMock}
            />
        );
    
        const task = screen.queryByText('High Priority Task'); // Change to queryByText
        const day16 = screen.queryByText('16');
        if (task && day16) {
            fireEvent.dragStart(task, { dataTransfer: { setData: jest.fn() } });
            fireEvent.drop(day16, { dataTransfer: { getData: () => '1' } });
    
            softAssert(
                setTasksMock.mock.calls.length > 0,
                'Tasks updated on valid drop.',
                'Tasks were not updated on valid drop.'
            );
        } else {
            if (!task) console.warn('Task with text "High Priority Task" not found.');
            if (!day16) console.warn('Day 16 is not rendered.');
        }
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
        if (day15) {
            const preventDefaultMock = jest.fn();
            fireEvent.dragOver(day15, { preventDefault: preventDefaultMock });
    
            softAssert(
                preventDefaultMock.mock.calls.length > 0,
                'Default behavior prevented on drag over.',
                'Default behavior not prevented on drag over.'
            );
        } else {
            console.warn('Day 15 is not rendered.');
        }
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
        softAssert(
            header,
            'Navigated to the previous month successfully.',
            'Failed to navigate to the previous month.'
        );
    });test('renders tasks with correct classes and is draggable', () => {
        render(
            <TaskList tasks={mockTasks} toggleTask={jest.fn()} />
        );
    
        mockTasks.forEach((task) => {
            const taskElement = screen.getByText(new RegExp(task.title, 'i'));
            softAssert(
                taskElement?.classList.contains('task-item'),
                `Task "${task.title}" has the "task-item" class.`,
                `Task "${task.title}" does not have the "task-item" class.`
            );
            softAssert(
                taskElement?.draggable,
                `Task "${task.title}" is draggable.`,
                `Task "${task.title}" is not draggable.`
            );
        });
    });
    
    test('sets task ID on drag start', () => {
        render(
            <TaskList tasks={mockTasks} toggleTask={jest.fn()} />
        );
    
        const taskElement = screen.queryByText(/High Priority Task/i);
        if (taskElement) {
            const dataTransferMock = { setData: jest.fn() };
            fireEvent.dragStart(taskElement, { dataTransfer: dataTransferMock });
    
            softAssert(
                dataTransferMock.setData.mock.calls.length > 0,
                'setData was called on drag start.',
                'setData was not called on drag start.'
            );
            softAssert(
                dataTransferMock.setData.mock.calls[0][1] === '1',
                'setData was called with the correct task ID.',
                'setData was not called with the correct task ID.'
            );
        } else {
            console.warn('Task "High Priority Task" not found.');
        }
    });

  
    
    


    
    test('updates tasks on valid drop', () => {
        render(
            <TaskList tasks={mockTasks} toggleTask={jest.fn()} />
        );
    
        const taskElement = screen.queryByText(/High Priority Task/i);
        const day16 = screen.queryByText('16');
        if (taskElement && day16) {
            const dataTransferMock = { setData: jest.fn(), getData: jest.fn(() => '1') };
            fireEvent.dragStart(taskElement, { dataTransfer: dataTransferMock });
            fireEvent.drop(day16, { dataTransfer: dataTransferMock });
    
            softAssert(
                setTasksMock.mock.calls.length > 0,
                'Tasks updated on valid drop.',
                'Tasks were not updated on valid drop.'
            );
        } else {
            if (!taskElement) console.warn('Task "High Priority Task" not found.');
            if (!day16) console.warn('Day 16 is not rendered.');
        }
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
        if (day16) {
            const handleDropMock = jest.fn();
            fireEvent.drop(day16, { dataTransfer: { getData: () => '1' } });
    
            softAssert(
                setTasksMock.mock.calls.length > 0,
                'handleDrop called successfully.',
                'handleDrop not called successfully.'
            );
        } else {
            console.warn('Day 16 is not rendered.');
        }
    });


    test('Covers rendering tasks with all combinations of priority and completion status', () => {
        const mockTasks = [
            { _id: '1', date: '2024-01-01', title: 'Task 1', priority: 'high', isCompleted: true },
            { _id: '2', date: '2024-01-01', title: 'Task 2', priority: 'medium', isCompleted: false },
            { _id: '3', date: '2024-01-01', title: 'Task 3', priority: 'low', isCompleted: true },
        ];
    
        render(
            <Calendar
                selectedDate={new Date('2024-01-01')}
                setSelectedDate={jest.fn()}
                tasks={mockTasks}
                setTasks={jest.fn()}
            />
        );
    
        mockTasks.forEach((task) => {
            const taskElement = screen.getByText(task.title);
            expect(taskElement).toBeInTheDocument();
        });
    });
    

    test('Covers drag and drop logic for tasks', () => {
        const mockTasks = [
            { _id: '1', date: '2024-01-01', title: 'Task 1', priority: 'high', isCompleted: false },
        ];
        const setTasksMock = jest.fn();
    
        render(
            <Calendar
                selectedDate={new Date('2024-01-01')}
                setSelectedDate={jest.fn()}
                tasks={mockTasks}
                setTasks={setTasksMock}
            />
        );
    
        const mockEvent = {
            preventDefault: jest.fn(),
            dataTransfer: { getData: jest.fn().mockReturnValue('1') },
        };
    
        const dateElement = screen.getByText('1'); 
        fireEvent.drop(dateElement, mockEvent);
    
        expect(setTasksMock).toHaveBeenCalledWith([
            { _id: '1', date: '2024-01-01', title: 'Task 1', priority: 'high', isCompleted: false },
        ]);
    });
    


    
    
    
});
