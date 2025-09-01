import { TodoProvider } from './context/TodoContext';
import { AddTodo } from './components/AddTodo';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import './App.css';

function App() {
  return (
    <TodoProvider>
      <div className="app">
        <header className="app-header">
          <h1>Todo List</h1>
        </header>
        <main className="app-main">
          <AddTodo />
          <TodoList />
          <TodoFilter />
        </main>
      </div>
    </TodoProvider>
  );
}

export default App;
