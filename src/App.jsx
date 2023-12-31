import { useState, useEffect, useRef } from 'react';
import './App.css';
import './index.css';
import Sun from './assets/icon-sun.svg';
import Moon from './assets/icon-moon.svg';
import Checkmark from './assets/icon-check.svg';
import Cross from './assets/icon-cross.svg';
import axios from 'axios';

function App() {
  const [theme, setTheme] = useState('light-theme');
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef();

  const fetchData = async () => {
    try {
      const response = await axios.get('https://todo-app-react-lashasuxa.onrender.com/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
      setIsDarkTheme(newTheme === 'dark-theme');
      return newTheme;
    });
  };
  
  

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTodoText = inputRef.current.value.trim();
    
    if (newTodoText) {
      try {
        // Send a POST request to the server to add the new todo item.
        const response = await axios.post('https://todo-app-react-lashasuxa.onrender.com/api/todos', {
          todo: newTodoText,
          status: 'active'
        });
  
        // The server should respond with the new todo item that was added,
        // including the id that was generated by the server.
        const newTodo = response.data;
  
        // Add the new todo item to the state.
        setTodos((prevTodos) => [newTodo, ...prevTodos]);
  
        // Clear the input field and unfocus it.
        inputRef.current.value = '';
        inputRef.current.blur();
      } catch (error) {
        console.error('Error adding todo', error);
      }
    }
  };
  


  // const handleCircleClick = (index) => {
  //   setTodos((prevTodos) =>
  //     prevTodos.map((todo, i) =>
  //       i === index ? { ...todo, completed: !todo.completed } : todo
  //     )
  //   );
  // };


  const handleCircleClick = async (index) => {
    const updatedTodos = [...todos];
    const todo = updatedTodos[index];
    todo.status = todo.status === 'completed' ? 'active' : 'completed';
  
    try {
      // Send a PUT request to the server to update the todo item.
      await axios.put(`https://todo-app-react-lashasuxa.onrender.com/api/todos/${todo.id}`, {
        status: todo.status
      });
  
      // Update the state with the updated todo item.
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating todo', error);
    }
  };



  useEffect(() => {
    setFilteredTodos(todos);
  }, [todos]);

  const handleAllClick = () => {
    setFilteredTodos(todos);
  };

  const handleActiveClick = () => {
    setFilteredTodos(todos.filter(todo => todo.status === 'active'));
  };

  const handleCompletedClick = () => {
    setFilteredTodos(todos.filter(todo => todo.status === 'completed'));
  };

  const handleClearCompleted = async () => {
    const activeTodos = todos.filter(todo => todo.status !== 'completed');
    try {
      // Send a DELETE request to the server to remove the completed todos.
      await Promise.all(
        todos
          .filter(todo => todo.status === 'completed')
          .map(todo => axios.delete(`https://todo-app-react-lashasuxa.onrender.com/api/todos/${todo.id}`))
      );
      // Update the state to only include active todos.
      setTodos(activeTodos);
    } catch (error) {
      console.error('Error clearing completed todos', error);
    }
  };
  // const handleDeleteTodo = (index) => {
  //   setTodos((prevTodos) => prevTodos.filter((_, i) => i !== index));
  // };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`https://todo-app-react-lashasuxa.onrender.com/api/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo', error);
    }
  };
  



  return (
    <div className={`todos ${theme}`}>
      <div className="todosHeader">
        <h1>TODO</h1>
        <img
          src={theme === 'dark-theme' ? Sun : Moon}
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
            className={`input ${isFocused ? 'input-focused' : ''} ${isHovered ? 'input-hover' : ''}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
    
          />
       
        </form>
      </div>

      <div className="todos_container">
        {filteredTodos.map((todo, index) => {
        
          return (
            <div key={index} className="todo_item">
              <div className="input_container">
                <div className='btnNtext' onClick={() => handleCircleClick(index)}>
                <div
                  className={`circle ${todo.status === 'completed' ? 'completed-circle' : ''}`}
                >
                  {todo.status === 'completed' && <img src={Checkmark} alt="Checkmark" />}
                </div>
                <p className={todo.status === 'completed' ? 'completed' : ''}>{todo.todo}</p>

                </div>
                <img src={Cross} alt="Cross" className="cross" onClick={() => handleDeleteTodo(todo.id)} />


              </div>
              <hr />
            </div>
          );
        })}
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
