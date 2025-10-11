import React, { useRef, useEffect } from 'react';
import styles from '../../styles/StudentDashboard.module.css';


const TodoPopup = React.memo(({ todos, newTodo, setNewTodo, addTodo, editingId, editingText, setEditingText, startEdit, saveEdit, deleteTodo, toggleComplete, setShowTodoPopup }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && !editingId) {
      inputRef.current.focus();
    }
  }, [newTodo, editingId]);

  return (
    <div className={styles.profilePopupOverlay}>
      <div className={styles.todoPopup}>
        <h3>To-Do List</h3>
        <div className={styles.todoInput}>
          <input 
            ref={inputRef}
            type="text" 
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add new task..."
            className={styles.input}
          />
          <button onClick={addTodo} className={styles.addBtn}>Add</button>
        </div>
        <div className={styles.todoList}>
          {todos.map(todo => (
            <div key={todo.id} className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}>
              {editingId === todo.id ? (
                <input 
                  type="text" 
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className={styles.editInput}
                  autoFocus
                />
              ) : (
                <span onClick={() => toggleComplete(todo.id)} className={styles.todoText}>
                  {todo.text}
                </span>
              )}
              <div className={styles.todoActions}>
                {editingId === todo.id ? (
                  <button onClick={saveEdit} className={styles.saveBtn}>Save</button>
                ) : (
                  <button onClick={() => startEdit(todo.id, todo.text)} className={styles.editBtn}>Edit</button>
                )}
                <button onClick={() => deleteTodo(todo.id)} className={styles.deleteBtn}>Delete</button>
              </div>
            </div>
          ))}
          {todos.length === 0 && <p className={styles.noExams}>No tasks yet</p>}
        </div>
        <button className={styles.closeBtn} onClick={() => setShowTodoPopup(false)}>Close</button>
      </div>
    </div>
  );
});

export default TodoPopup;