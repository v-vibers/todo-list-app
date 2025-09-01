import type { FilterType } from '../types/todo';
import { useTodos } from '../hooks/useTodos';

export function TodoFilter() {
  const { state, setFilter, clearCompleted, activeCount, completedCount } = useTodos();

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className="todo-footer">
      <span className="todo-count">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>
      <div className="todo-filters">
        {filters.map(filter => (
          <button
            key={filter.key}
            className={`filter-button ${state.filter === filter.key ? 'selected' : ''}`}
            onClick={() => setFilter(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      )}
    </div>
  );
}