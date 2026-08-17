import React, { useState, useEffect } from 'react';
import { api } from '../../Api';
import styles from '../../styles/StaffDashboard.module.css';

const NotesSection = ({ selectedDepartment, selectedYear, selectedSection, selectedSubject }) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [noteId, setNoteId] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!selectedDepartment || !selectedYear || !selectedSection || !selectedSubject) {
        setNotes('');
        setNoteId(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/api/notes/get', {
          params: {
            department: selectedDepartment,
            year: selectedYear,
            section: selectedSection,
            subject: selectedSubject,
          },
        });

        if (response.data && response.data.length > 0) {
          setNotes(response.data[0].content || '');
          setNoteId(response.data[0]._id);
        } else {
          setNotes('');
          setNoteId(null);
        }
        setHasChanges(false);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
        setError('Failed to load notes.');
        setNotes('');
        setNoteId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [selectedDepartment, selectedYear, selectedSection, selectedSubject]);

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    setHasChanges(true);
    setError(null);
    setSuccess(null);
  };

  const handleSaveNotes = async () => {
    if (!selectedDepartment || !selectedYear || !selectedSection || !selectedSubject) {
      setError('Please select all filters before saving notes.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (noteId) {
        // Update existing note
        await api.put(`/api/notes/${noteId}`, {
          content: notes,
        });
        setSuccess('Notes updated successfully.');
      } else {
        // Create new note
        const response = await api.post('/api/notes/create', {
          content: notes,
          department: selectedDepartment,
          year: selectedYear,
          section: selectedSection,
          subject: selectedSubject,
        });
        setNoteId(response.data._id);
        setSuccess('Notes created successfully.');
      }
      setHasChanges(false);
    } catch (err) {
      console.error('Failed to save notes:', err);
      setError('Failed to save notes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBlur = () => {
    if (hasChanges) {
      handleSaveNotes();
    }
  };

  return (
    <div className={styles.notesSection}>
      <h3>Daily Notes</h3>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      <textarea
        className={styles.notesTextarea}
        value={notes}
        onChange={handleNotesChange}
        onBlur={handleBlur}
        placeholder="Enter your daily notes here..."
        disabled={loading || saving}
      />

      <div className={styles.notesSaveSection}>
        <button
          className={styles.saveNotesBtn}
          onClick={handleSaveNotes}
          disabled={!hasChanges || loading || saving}
        >
          {saving ? 'Saving...' : 'Save Notes'}
        </button>
        {hasChanges && <span className={styles.unsavedIndicator}>Unsaved changes</span>}
      </div>
    </div>
  );
};

export default NotesSection;
