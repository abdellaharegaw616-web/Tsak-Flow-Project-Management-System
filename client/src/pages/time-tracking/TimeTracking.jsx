import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  Plus,
  Calendar,
  BarChart3,
  Timer,
  User,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Edit
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function TimeTracking() {
  const [timeEntries, setTimeEntries] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('today'); // today, week, month
  const { api } = useAuth();

  useEffect(() => {
    fetchTimeEntries();
  }, []);

  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          // Reset if we reach a reasonable limit (e.g., 24 hours)
          if (newTime >= 24 * 3600) {
            return prev; // Don't increment beyond 24 hours
          }
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTracking]);

  const fetchTimeEntries = async () => {
    try {
      const { data } = await api.get('/time-tracking');
      setTimeEntries(data);
    } catch (error) {
      console.error('Failed to fetch time entries');
      setTimeEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const startTracking = () => {
    if (!currentTask.trim()) {
      toast.error('Please enter a task name');
      return;
    }
    setIsTracking(true);
    setCurrentTime(0);
  };

  const stopTracking = async () => {
    setIsTracking(false);
    try {
      await api.post('/time-tracking', {
        task: currentTask,
        duration: currentTime,
        date: new Date()
      });
      toast.success('Time entry saved');
      fetchTimeEntries();
      setCurrentTask('');
      setCurrentTime(0);
    } catch (error) {
      toast.error('Failed to save time entry');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getTotalTime = (entries) => {
    return entries.reduce((total, entry) => total + entry.duration, 0);
  };

  const getFilteredEntries = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      switch (view) {
        case 'today':
          return entryDate >= today;
        case 'week':
          return entryDate >= weekStart;
        case 'month':
          return entryDate >= monthStart;
        default:
          return true;
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredEntries = getFilteredEntries();
  const totalTime = getTotalTime(filteredEntries);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-1">Time Tracking</h1>
          <p className="text-gray-600 mt-1">Track time spent on tasks and projects</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('today')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                view === 'today' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                view === 'week' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                view === 'month' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Time Tracker */}
      <div className="card">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Session</h2>
          
          <div className="text-5xl font-mono text-brand-600 mb-4">
            {formatTime(currentTime)}
          </div>

          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="What are you working on?"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              disabled={isTracking}
              className="input text-center text-lg"
            />
          </div>

          <div className="flex justify-center gap-4 mt-6">
            {!isTracking ? (
              <button
                onClick={startTracking}
                disabled={!currentTask.trim()}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Play className="h-5 w-5" />
                Start
              </button>
            ) : (
              <button
                onClick={stopTracking}
                disabled={!isTracking}
                className="btn-red inline-flex items-center gap-2"
              >
                <Square className="h-5 w-5" />
                Stop
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <Timer className="h-8 w-8 text-brand-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">{formatTime(totalTime)}</h3>
          <p className="text-sm text-gray-600">Total Time</p>
        </div>
        <div className="card text-center">
          <BarChart3 className="h-8 w-8 text-brand-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">{filteredEntries.length}</h3>
          <p className="text-sm text-gray-600">Sessions</p>
        </div>
        <div className="card text-center">
          <Clock className="h-8 w-8 text-brand-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredEntries.length > 0 ? formatTime(Math.round(totalTime / filteredEntries.length)) : '00:00:00'}
          </h3>
          <p className="text-sm text-gray-600">Average Session</p>
        </div>
      </div>

      {/* Time Entries */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Time Entries</h2>
          <button className="btn-outline inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Entry
          </button>
        </div>

        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <div key={entry._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-10 w-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{entry.task}</h3>
                  <p className="text-sm text-gray-500">{formatDate(entry.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-lg font-mono text-gray-900">
                  {formatTime(entry.duration)}
                </span>
                <button className="p-2 rounded hover:bg-gray-100">
                  <Edit className="h-4 w-4 text-gray-500" />
                </button>
                <button className="p-2 rounded hover:bg-gray-100">
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <div className="text-center py-8">
              <Timer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No time entries</h3>
              <p className="text-gray-500 mt-1">Start tracking time to see your entries here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

