/* eslint-disable react/prop-types */
import React from 'react';

const TodoItem = ({ todo, onToggleComplete, onTogglePriority, onAddSubTodo }) => {
  return (
    <div className={`todo-item ${todo.priority ? 'priority' : ''}`}>
      <div className="todo-header">
        <h3 className="todo-title" style={{ color: todo.completed ? 'green' : 'white' }}>
          {todo.title}
        </h3>
        <div className="todo-actions">
          <button onClick={() => onToggleComplete(todo.id)}>
            {todo.completed ? 'Undo' : 'Complete'}
          </button>
          <button onClick={() => onTogglePriority(todo.id)}>
            {todo.priority ? 'Remove Priority' : 'Mark Priority'}
          </button>
          <button onClick={() => onAddSubTodo(todo.id)}>Add Sub-Todo</button>
        </div>
      </div>

      {/* Sub-todos list */}
      {todo.subTodos && todo.subTodos.length > 0 && (
        <ul className="sub-todos">
          {todo.subTodos.map((subTodo, index) => (
            <li key={index} className="sub-todo-item">
              <input
                type="checkbox"
                checked={subTodo.completed}
                onChange={() => onToggleComplete(todo.id, index)}
              />
              {subTodo.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoItem;
