import { useState, useEffect, useRef } from 'react';
import './App.css';
import './index.css';
import Sun from './assets/icon-sun.svg';
import Moon from './assets/icon-moon.svg';
import Checkmark from './assets/icon-check.svg'
import Cross from './assets/icon-cross.svg';

function App() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const inputRef = useRef();

  const toggleTheme = () => {
    setIsDarkTheme((prevIsDarkTheme) => !prevIsDarkTheme);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTodo = inputRef.current.value.trim();
  
    if (newTodo) {
      setTodos((prevTodos) => [      { text: newTodo, completed: false },      ...prevTodos,    ]);
      inputRef.current.value = '';
      inputRef.current.blur();
    }
  };

  const handleCircleClick = (index) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkTheme]);

  useEffect(() => {
    setFilteredTodos(todos);
  }, [todos]);

  const handleAllClick = () => {
    setFilteredTodos(todos);
  };

  const handleActiveClick = () => {
    setFilteredTodos(todos.filter(todo => !todo.completed));
  };

  const handleCompletedClick = () => {
    setFilteredTodos(todos.filter(todo => todo.completed));
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };
  const handleDeleteTodo = (index) => {
    setTodos((prevTodos) => prevTodos.filter((_, i) => i !== index));
  };

  return (
    <div className="todos">
      <div className="todosHeader">
        <h1>TODO</h1>
        <img
          src={isDarkTheme ? Sun : Moon}
          alt="Theme Toggle"
          onClick={toggleTheme}
        />
      </div>
      <div className="input_container">
        <div className="circle"></div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            ref={inputRef}
            placeholder="Create a new todo.."
            className="input"
            onFocus={() => inputRef.current.classList.add('input-focused')}
            onBlur={() => inputRef.current.classList.remove('input-focused')}
            onMouseEnter={() => inputRef.current.classList.add('input-hover')}
            onMouseLeave={() => inputRef.current.classList.remove('input-hover')}
    
          />
       
        </form>
      </div>

      <div className="todos_container">
        {filteredTodos.map((todo, index) => (
          <div key={index} className="todo_item">
            <div className="input_container">
              <div className='btnNtext' onClick={() => handleCircleClick(index)}>
              <div
                className={`circle ${todo.completed ? 'completed-circle' : ''}`}
                
              >
                {todo.completed && <img src={Checkmark} alt="Checkmark" />}
              </div>
              <p className={todo.completed ? 'completed' : ''}>{todo.text}</p>
              </div>
              <img src={Cross} alt="Cross" className="cross" onClick={() => handleDeleteTodo(index)} />

            </div>
            <hr />
          </div>
        ))}
        <div className="todos_footer">
          <p className='count'>{todos.filter(todo => !todo.completed).length} items left</p>
          <div className="types">
            <p  onClick={handleAllClick}>All</p>
            <p  onClick={handleActiveClick}>Active</p>
            <p  onClick={() => handleCompletedClick('completed')}>Completed</p>

          </div>
          <p className="clear" onClick={handleClearCompleted}>Clear Completed</p>
        </div>
      </div>
    </div>
  );
}

export default App;
