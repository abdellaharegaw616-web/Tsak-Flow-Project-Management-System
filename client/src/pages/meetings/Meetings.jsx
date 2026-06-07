import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mic,
  MicOff,
  VideoOff,
  MessageSquare,
  ScreenShare,
  Hand
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // list, calendar
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false);
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    participants: ''
  });
  const { api } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    if (location?.state?.newMeeting) {
      setShowNewMeetingForm(true);
    }
  }, [location]);

  const fetchMeetings = async () => {
    try {
      // Meetings will be fetched from real API endpoints
      // For now, initialize with empty array
      setMeetings([]);
    } catch (error) {
      console.error('Failed to fetch meetings');
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-brand-100 text-brand-700',
      ongoing: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const handleNewMeeting = () => {
    setMeetingForm({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      participants: ''
    });
    setShowNewMeetingForm(true);
  };

  const handleScheduleMeeting = () => {
    // Validation
    if (!meetingForm.title.trim()) {
      toast.error('Please enter a meeting title');
      return;
    }
    if (!meetingForm.startTime) {
      toast.error('Please select a start time');
      return;
    }
    if (!meetingForm.endTime) {
      toast.error('Please select an end time');
      return;
    }
    if (new Date(meetingForm.endTime) <= new Date(meetingForm.startTime)) {
      toast.error('End time must be after start time');
      return;
    }

    // Here you would normally send the data to the API
    toast.success('Meeting scheduled successfully!');
    setShowNewMeetingForm(false);
    setMeetingForm({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      participants: ''
    });
  };

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.participants?.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-1">Meetings</h1>
          <p className="text-gray-600 mt-1">Schedule and manage your team meetings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                view === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                view === 'calendar' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
              }`}
            >
              Calendar
            </button>
          </div>
          <button onClick={handleNewMeeting} className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Meeting
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search meetings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9"
          />
        </div>
        <button className="btn-outline inline-flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Meetings List */}
      {view === 'list' ? (
        <div className="space-y-4">
          {filteredMeetings.map((meeting) => (
            <div key={meeting._id} className="card group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                    <span className={`badge ${getStatusColor(meeting.status)}`}>
                      {meeting.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(meeting.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{meeting.participants?.length || 0} participants</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">{meeting.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  {meeting.status === 'ongoing' ? (
                    <button className="btn-primary">
                      <Video className="h-4 w-4" />
                      Join
                    </button>
                  ) : (
                    <button className="btn-outline">
                      <Video className="h-4 w-4" />
                      Join
                    </button>
                  )}
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredMeetings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No meetings scheduled</h3>
              <p className="text-gray-500 mt-1">Create your first meeting to get started</p>
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Calendar View</h3>
            <p className="text-gray-500 mt-1">Calendar view coming soon</p>
          </div>
        </div>
      )}
    {/* New Meeting Form Modal */}
      {showNewMeetingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Schedule New Meeting</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title</label>
                  <input
                    type="text"
                    placeholder="Enter meeting title"
                    className="input"
                    value={meetingForm.title}
                    onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Enter meeting description"
                    rows={3}
                    className="input"
                    value={meetingForm.description}
                    onChange={(e) => setMeetingForm({ ...meetingForm, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                    <input
                      type="datetime-local"
                      className="input"
                      value={meetingForm.startTime}
                      onChange={(e) => setMeetingForm({ ...meetingForm, startTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                    <input
                      type="datetime-local"
                      className="input"
                      value={meetingForm.endTime}
                      onChange={(e) => setMeetingForm({ ...meetingForm, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                  <input
                    type="text"
                    placeholder="Add participant emails (comma separated)"
                    className="input"
                    value={meetingForm.participants}
                    onChange={(e) => setMeetingForm({ ...meetingForm, participants: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowNewMeetingForm(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleMeeting}
                className="btn-primary"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

