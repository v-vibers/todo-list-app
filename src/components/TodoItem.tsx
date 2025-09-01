import { useState } from 'react';
import type { Todo } from '../types/todo';
import { useTodos } from '../hooks/useTodos';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo, editTodo } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editText.trim()) {
      editTodo(todo.id, editText);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-item-content">
        <input
          type="checkbox"
          className="todo-toggle"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todo-edit"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </form>
        ) : (
          <span
            className="todo-text"
            onDoubleClick={handleDoubleClick}
          >
            {todo.text}
          </span>
        )}
        <button
          className="todo-delete"
          onClick={() => deleteTodo(todo.id)}
          aria-label="Delete todo"
        >
          ×
        </button>
      </div>
    </li>
  );
}