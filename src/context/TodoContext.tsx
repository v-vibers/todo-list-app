import { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Todo, FilterType } from '../types/todo';

interface TodoState {
  todos: Todo[];
  filter: FilterType;
}

type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'EDIT_TODO'; payload: { id: string; text: string } }
  | { type: 'SET_FILTER'; payload: FilterType }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'LOAD_TODOS'; payload: Todo[] };

interface TodoContextType {
  state: TodoState;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  setFilter: (filter: FilterType) => void;
  clearCompleted: () => void;
  filteredTodos: Todo[];
  completedCount: number;
  activeCount: number;
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined);

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: crypto.randomUUID(),
            text: action.payload,
            completed: false,
            createdAt: new Date(),
          },
        ],
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, text: action.payload.text }
            : todo
        ),
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
      };
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };
    case 'LOAD_TODOS':
      return {
        ...state,
        todos: action.payload,
      };
    default:
      return state;
  }
}

const STORAGE_KEY = 'todolist-app-todos';

function loadTodosFromStorage(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Todo[];
      return parsed.map((todo) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));
    }
  } catch (error) {
    console.error('Error loading todos from storage:', error);
  }
  return [];
}

function saveTodosToStorage(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to storage:', error);
  }
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const initialState: TodoState = {
    todos: [],
    filter: 'all',
  };

  const [state, dispatch] = useReducer(todoReducer, initialState);

  useEffect(() => {
    const storedTodos = loadTodosFromStorage();
    if (storedTodos.length > 0) {
      dispatch({ type: 'LOAD_TODOS', payload: storedTodos });
    }
  }, []);

  useEffect(() => {
    saveTodosToStorage(state.todos);
  }, [state.todos]);

  const addTodo = (text: string) => {
    if (text.trim()) {
      dispatch({ type: 'ADD_TODO', payload: text.trim() });
    }
  };

  const toggleTodo = (id: string) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const deleteTodo = (id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const editTodo = (id: string, text: string) => {
    if (text.trim()) {
      dispatch({ type: 'EDIT_TODO', payload: { id, text: text.trim() } });
    }
  };

  const setFilter = (filter: FilterType) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const clearCompleted = () => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  };

  const filteredTodos = state.todos.filter(todo => {
    switch (state.filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const completedCount = state.todos.filter(todo => todo.completed).length;
  const activeCount = state.todos.filter(todo => !todo.completed).length;

  const value: TodoContextType = {
    state,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    setFilter,
    clearCompleted,
    filteredTodos,
    completedCount,
    activeCount,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}

