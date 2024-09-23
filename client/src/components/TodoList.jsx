import { useEffect, useState } from 'react';
import TodoItem from './TodoItem';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    fetch('/api/todos')
      .then((res) => res.json())
      .then((data) => {
        setTodos(data || []);
      })
      .catch((error) => {
        console.error('Failed to fetch todos', error);
        setTodos([]);
      });
  }, []);

  const addTodo = () => {
    if (!newTodoTitle.trim()) {
      alert('Please enter a todo title');
      return;
    }

    const newTodo = {
      id: Date.now(),
      title: newTodoTitle,
      completed: false,
      priority: false,
      subTodos: [],
    };

    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    })
      .then((res) => res.json())
      .then((todo) => {
        setTodos([...todos, todo]);
        setNewTodoTitle('');
      });
  };

  // Helper to update todo
  const updateTodoOnServer = (updatedTodo) => {
    fetch(`/api/todos/${updatedTodo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo),
    }).catch((error) => console.error('Failed to update todo', error));
  };

  const toggleComplete = (id, subIndex) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        if (subIndex !== undefined) { // check for any sub-todo
          // Toggle sub-todo
          todo.subTodos[subIndex].completed = !todo.subTodos[subIndex].completed;

          // Mark the main todo as complete only if all sub-todos are complete
          todo.completed = todo.subTodos.every((sub) => sub.completed);
        } else {
          todo.completed = !todo.completed;

          // Check all sub-todo if main todo completed!
          todo.subTodos = todo.subTodos.map((sub) => ({
            ...sub,
            completed: todo.completed,
          }));
        }
        updateTodoOnServer(todo);
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const togglePriority = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, priority: !todo.priority } : todo
    );
    setTodos(updatedTodos);
    const updatedTodo = updatedTodos.find((todo) => todo.id === id);
    updateTodoOnServer(updatedTodo);
  };

  const addSubTodo = (id) => {
    const subTodoTitle = prompt('Enter sub-todo title');
    if (!subTodoTitle) return;

    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.subTodos.push({ title: subTodoTitle, completed: false });
        updateTodoOnServer(todo);
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="text"
          placeholder="Enter todo title"
          style={{ fontSize: '20px', padding: '5px' }}
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
        <button onClick={addTodo}>
          Add Todo
        </button>
      </div>
      <div style={{ marginTop: '10px', width: '100%' }}>
        {todos
          .sort((a, b) => (a.priority ? -1 : 1))
          .map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={toggleComplete}
              onTogglePriority={togglePriority}
              onAddSubTodo={addSubTodo}
            />
          ))}
      </div>
    </div>
  );
};

export default TodoList;
