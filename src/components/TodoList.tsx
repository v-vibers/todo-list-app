import { TodoItem } from './TodoItem';
import { useTodos } from '../hooks/useTodos';

export function TodoList() {
  const { filteredTodos } = useTodos();

  if (filteredTodos.length === 0) {
    return (
      <div className="empty-state">
        <p>No todos found</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}