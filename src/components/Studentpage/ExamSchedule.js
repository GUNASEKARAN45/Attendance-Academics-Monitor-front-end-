// src/components/Studentpage/ExamSchedule.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/StudentDashboard.module.css';
import TodoPopup from './TodoPopup';
import { api } from '../../Api'; // Make sure this path is correct

const ExamSchedule = () => {
  const [exams, setExams] = useState({ upcoming: [], finished: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Todo List State
  const [showTodoPopup, setShowTodoPopup] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Fetch exams from backend
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.get('/api/student/exam-schedule');
        setExams(response.data); // { upcoming: [...], finished: [...] }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch exams:', err);
        setError('Failed to load exam schedule');
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  // Todo Functions
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = () => {
    setTodos(todos.map(todo =>
      todo.id === editingId ? { ...todo, text: editingText } : todo
    ));
    setEditingId(null);
    setEditingText('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }); // e.g., 06 Oct 2025
  };

  if (loading) {
    return <div className={styles.examSchedule}><p>Loading exams...</p></div>;
  }

  if (error) {
    return <div className={styles.examSchedule}><p style={{color: '#e74c3c'}}>{error}</p></div>;
  }

  return (
    <div className={styles.examSchedule}>
      <div className={styles.contentHeader}>
        <h2>Exam Schedule</h2>
        <button
          className={styles.todoBtn}
          onClick={() => setShowTodoPopup(true)}
          title="Manage To-Do List"
        >
          <span className={styles.todoIcon}>&#128203;</span>
          <p>your works here</p>
        </button>
      </div>

      {/* Upcoming Exams */}
      <div className={styles.examSection}>
        <h3>Upcoming Exams</h3>
        {exams.upcoming.length === 0 ? (
          <p className={styles.noExams}>No upcoming exams</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {exams.upcoming.map((exam) => (
                <tr key={exam.id}>
                  <td>{formatDate(exam.date)}</td>
                  <td>{exam.subject}</td>
                  <td>{exam.type}</td>
                  <td>
                    <span className={`${styles.status} ${styles.upcoming}`}>
                      Upcoming
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Finished Exams */}
      <div className={styles.examSection}>
        <h3>Finished Exams</h3>
        {exams.finished.length === 0 ? (
          <p className={styles.noExams}>No finished exams</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {exams.finished.map((exam) => (
                <tr key={exam.id}>
                  <td>{formatDate(exam.date)}</td>
                  <td>{exam.subject}</td>
                  <td>{exam.type}</td>
                  <td>
                    <span className={`${styles.status} ${styles.finished}`}>
                      Finished
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Todo Popup */}
      {showTodoPopup && (
        <TodoPopup
          todos={todos}
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          addTodo={addTodo}
          editingId={editingId}
          editingText={editingText}
          setEditingText={setEditingText}
          startEdit={startEdit}
          saveEdit={saveEdit}
          deleteTodo={deleteTodo}
          toggleComplete={toggleComplete}
          setShowTodoPopup={setShowTodoPopup}
        />
      )}
    </div>
  );
};

export default ExamSchedule;