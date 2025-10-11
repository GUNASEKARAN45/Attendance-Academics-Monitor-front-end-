import React ,{ useState, useEffect, useRef } from 'react';
import styles from '../../styles/StudentDashboard.module.css';

import TodoPopup from './TodoPopup';

const ExamSchedule = () => {
  const exams = [
    { id: 1, subject: 'Web Development', date: '2025-10-06', type: 'Semester', status: 'upcoming' },
    { id: 2, subject: 'Data Structures', date: '2025-10-03', type: 'UT', status: 'finished' },
    { id: 3, subject: 'Operating Systems', date: '2025-10-10', type: 'Model', status: 'upcoming' },
    { id: 4, subject: 'Software Engineering', date: '2025-09-20', type: 'UT', status: 'finished' },
    { id: 5, subject: 'Internet of Things', date: '2025-10-15', type: 'Semester', status: 'upcoming' }
  ];

  const [showTodoPopup, setShowTodoPopup] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const upcomingExams = exams.filter(exam => exam.status === 'upcoming');
  const finishedExams = exams.filter(exam => exam.status === 'finished');

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
      <div className={styles.examSection}>
        <h3>Upcoming Exams</h3>
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
            {upcomingExams.map(exam => (
              <tr key={exam.id} className={styles.upcoming}>
                <td>{exam.date}</td>
                <td>{exam.subject}</td>
                <td>{exam.type}</td>
                <td>
                  <span className={`${styles.status} ${styles.upcoming}`}> 
                    {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </span>
                  </td>
                </tr>
            ))}
            {upcomingExams.length === 0 && (
              <tr>
                <td colSpan="4" className={styles.noExams}>No upcoming exams</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className={styles.examSection}>
        <h3>Finished Exams</h3>
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
            {finishedExams.map(exam => (
              <tr key={exam.id} className={styles.finished}>
                <td>{exam.date}</td>
                <td>{exam.subject}</td>
                <td>{exam.type}</td>
                <td>
                  <span className={`${styles.status} ${styles.finished}`}> 
                    {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </span>
                  </td>
                </tr>
            ))}
            {finishedExams.length === 0 && (
              <tr>
                <td colSpan="4" className={styles.noExams}>No finished exams</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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