import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      alert('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/todos`, {
        text: inputValue
      });
      setTodos([...todos, response.data]);
      setInputValue('');
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Failed to add todo');
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, {
        completed: !todo.completed
      });
      setTodos(todos.map(t => t.id === id ? response.data : t));
    } catch (error) {
      console.error('Error toggling todo:', error);
      alert('Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo');
    }
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = async (id) => {
    if (!editValue.trim()) return;

    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, {
        text: editValue
      });
      setTodos(todos.map(t => t.id === id ? response.data : t));
      setEditingId(null);
      setEditValue('');
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  if (loading) {
    return <div className="loading">Loading todos...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo App</h1>
        
        <form onSubmit={addTodo} className="add-todo-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new todo..."
            className="todo-input"
          />
          <button type="submit" className="add-btn">Add Todo</button>
        </form>

        <div className="todos-container">
          {todos.length === 0 ? (
            <p className="no-todos">No todos yet. Add one above!</p>
          ) : (
            <ul className="todos-list">
              {todos.map(todo => (
                <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="todo-checkbox"
                    />
                    
                    {editingId === todo.id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="edit-input"
                          autoFocus
                        />
                        <button onClick={() => saveEdit(todo.id)} className="save-btn">Save</button>
                        <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                      </div>
                    ) : (
                      <div className="todo-text-container">
                        <span className="todo-text">{todo.text}</span>
                        <div className="todo-actions">
                          <button 
                            onClick={() => startEditing(todo.id, todo.text)}
                            className="edit-btn"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteTodo(todo.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="stats">
          <p>Total: {todos.length} | Completed: {todos.filter(t => t.completed).length} | Remaining: {todos.filter(t => !t.completed).length}</p>
        </div>
      </header>
    </div>
  );
}

export default App;

