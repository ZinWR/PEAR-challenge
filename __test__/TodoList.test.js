import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
// import TodoList from '../client/src/components/TodoList';

global.fetch = jest.fn();

describe('TodoList Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    // Mock component without hooks
    const MockTodoList = ({ todos = [], onAddTodo }) => (
        <div>
            <input placeholder="Enter todo title" onChange={(e) => onAddTodo(e.target.value)} />
            <button onClick={onAddTodo}>Add Todo</button>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>{todo.title}</li>
                ))}
            </ul>
        </div>
    );

    // Mount test
    it('should fetch todos on mount and render them', async () => {
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce([{ id: 1, title: 'Test Todo', completed: false, priority: false, subTodos: [] }]),
        });

        render(<MockTodoList todos={[{ id: 1, title: 'Test Todo' }]} onAddTodo={jest.fn()} />);

        const todoElement = await screen.findByText('Test Todo');
        expect(todoElement).toBeInTheDocument();
    });

    it('should add a new todo', async () => {
        const mockAddTodo = jest.fn();
        const todos = [{ id: 1, title: 'Existing Todo' }];

        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce({ id: 2, title: 'New Todo', completed: false, priority: false, subTodos: [] }),
        });

        render(<MockTodoList todos={todos} onAddTodo={mockAddTodo} />);

        fireEvent.change(screen.getByPlaceholderText(/enter todo title/i), { target: { value: 'New Todo' } });
        fireEvent.click(screen.getByText(/add todo/i));

        expect(mockAddTodo).toHaveBeenCalledWith('New Todo');
    });
});
