import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../../Api';
import styles from '../../styles/AdminDashboard.module.css';

const StudentSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const searchStudents = useCallback(async (term) => {
    const trimmed = term.trim();
    if (!trimmed) {
      setResults([]);
      setError('');
      setLoading(false);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({ q: trimmed });
      const res = await api.get(`/api/admin/students/search?${params}`);
      setResults(res.data || []);
      setHasSearched(true);
    } catch (err) {
      console.error('Student search failed:', err);
      setResults([]);
      setError(err?.response?.data?.error || 'Could not search students.');
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      searchStudents(query);
    }, 350);

    return () => clearTimeout(searchTimer);
  }, [query, searchStudents]);

  const submitSearch = (event) => {
    event.preventDefault();
    searchStudents(query);
  };

  return (
    <div className={styles.studentSearch}>
      <h3>Student Search</h3>
      <form className={styles.studentSearchForm} onSubmit={submitSearch}>
        <input
          className={styles.searchInput}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or registration number"
        />
        <button className={styles.searchButton} type="submit" disabled={loading}>
          Search
        </button>
      </form>

      {loading && <p className={styles.searchStatus}>Searching students...</p>}
      {error && <p className={styles.errorText}>{error}</p>}
      {!loading && !error && query.trim() && hasSearched && results.length === 0 && (
        <p className={styles.searchStatus}>No students found.</p>
      )}
      {!query.trim() && (
        <p className={styles.searchStatus}>Enter a student name or registration number to search.</p>
      )}

      {results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {results.map((student) => (
              <tr key={student.id || student.regNo}>
                <td>{student.regNo}</td>
                <td>{student.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentSearch;
