import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Zap, 
  Plus, 
  Search, 
  Filter,
  Play,
  Pause,
  Edit,
  Trash2,
  Copy,
  ArrowRight,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreVertical,
  Code2,
  Mail,
  Bell,
  Calendar,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Automations() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, paused, error
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { api } = useAuth();

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      // Automations will be fetched from real API endpoints
      // For now, initialize with empty array
      setAutomations([]);
    } catch (error) {
      console.error('Failed to fetch automations');
      setAutomations([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = async (automationId, status) => {
    try {
      await api.put(`/automations/${automationId}`, { status });
      toast.success(`Automation ${status === 'active' ? 'activated' : 'paused'}`);
      fetchAutomations();
    } catch (error) {
      toast.error('Failed to update automation');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      paused: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700',
      draft: 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getTriggerIcon = (trigger) => {
    const icons = {
      'webhook': Code2,
      'schedule': Calendar,
      'email': Mail,
      'manual': Settings
    };
    return icons[trigger] || Settings;
  };

  const getActionIcon = (action) => {
    const icons = {
      'send-email': Mail,
      'create-task': FileText,
      'notify': Bell,
      'update-status': CheckCircle
    };
    return icons[action] || Settings;
  };

  const mockAutomations = [
    {
      id: 1,
      name: 'Welcome Email Series',
      description: 'Send welcome emails to new team members',
      trigger: 'user.created',
      triggerType: 'webhook',
      actions: ['send-email', 'create-task'],
      status: 'active',
      runs: 156,
      lastRun: '2024-01-15T10:30:00Z',
      successRate: 98.5
    },
    {
      id: 2,
      name: 'Daily Report Generator',
      description: 'Generate and send daily project reports',
      trigger: 'schedule',
      triggerType: 'schedule',
      actions: ['generate-report', 'send-email'],
      status: 'active',
      runs: 30,
      lastRun: '2024-01-15T09:00:00Z',
      successRate: 100
    },
    {
      id: 3,
      name: 'Task Deadline Reminder',
      description: 'Notify team members about upcoming deadlines',
      trigger: 'schedule',
      triggerType: 'schedule',
      actions: ['notify', 'send-email'],
      status: 'paused',
      runs: 45,
      lastRun: '2024-01-14T14:00:00Z',
      successRate: 95.5
    },
    {
      id: 4,
      name: 'Project Status Update',
      description: 'Update project status when all tasks are completed',
      trigger: 'task.completed',
      triggerType: 'webhook',
      actions: ['update-status', 'notify'],
      status: 'error',
      runs: 12,
      lastRun: '2024-01-13T16:45:00Z',
      successRate: 75.0
    }
  ];

  const filteredAutomations = mockAutomations.filter(automation => {
    const matchesSearch = automation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         automation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || automation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="heading-1">Automations</h1>
          <p className="text-gray-600 mt-1">Streamline workflows with intelligent automation</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Automation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <Zap className="h-8 w-8 text-brand-600 mx-auto mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900">{mockAutomations.length}</h3>
          <p className="text-sm text-gray-600">Total Automations</p>
        </div>
        <div className="card p-4 text-center">
          <Play className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900">
            {mockAutomations.filter(a => a.status === 'active').length}
          </h3>
          <p className="text-sm text-gray-600">Active</p>
        </div>
        <div className="card p-4 text-center">
          <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900">
            {mockAutomations.reduce((total, a) => total + a.runs, 0)}
          </h3>
          <p className="text-sm text-gray-600">Total Runs</p>
        </div>
        <div className="card p-4 text-center">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-2xl font-semibold text-gray-900">
            {Math.round(mockAutomations.reduce((total, a) => total + a.successRate, 0) / mockAutomations.length)}%
          </h3>
          <p className="text-sm text-gray-600">Avg Success Rate</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search automations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['all', 'active', 'paused', 'error'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-md text-sm transition-colors capitalize ${
                  statusFilter === status ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <button className="btn-outline">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Automations List */}
      <div className="space-y-4">
        {filteredAutomations.map((automation) => (
          <div key={automation.id} className="card group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{automation.name}</h3>
                    <p className="text-sm text-gray-500">{automation.description}</p>
                  </div>
                  <span className={`badge ${getStatusColor(automation.status)}`}>
                    {automation.status}
                  </span>
                </div>

                {/* Workflow */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      {React.createElement(getTriggerIcon(automation.triggerType), { className: 'h-4 w-4 text-gray-600' })}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Trigger</p>
                      <p className="text-sm font-medium text-gray-900">{automation.trigger}</p>
                    </div>
                  </div>
                  
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      {React.createElement(getActionIcon(automation.actions[0]), { className: 'h-4 w-4 text-gray-600' })}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Action</p>
                      <p className="text-sm font-medium text-gray-900">{automation.actions[0]}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{automation.runs} runs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>{automation.successRate}% success rate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Last run: {new Date(automation.lastRun).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => toggleAutomation(automation.id, automation.status === 'active' ? 'paused' : 'active')}
                  className={`p-2 rounded-lg transition-colors ${
                    automation.status === 'active' 
                      ? 'hover:bg-yellow-100 text-yellow-600' 
                      : 'hover:bg-green-100 text-green-600'
                  }`}
                >
                  {automation.status === 'active' ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <Copy className="h-4 w-4 text-gray-500" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <Edit className="h-4 w-4 text-gray-500" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredAutomations.length === 0 && (
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No automations found</h3>
            <p className="text-gray-500 mt-1">
              {searchTerm ? 'Try adjusting your search' : 'Create your first automation to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Create Automation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Automation</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter automation name"
                  className="input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Describe what this automation does"
                  className="input"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
                  <select className="input">
                    <option>When user is created</option>
                    <option>When task is completed</option>
                    <option>On schedule (daily)</option>
                    <option>On schedule (weekly)</option>
                    <option>Manual trigger</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                  <select className="input">
                    <option>Send email</option>
                    <option>Create task</option>
                    <option>Send notification</option>
                    <option>Update status</option>
                    <option>Generate report</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  toast.success('Automation created successfully');
                }}
                className="btn-primary"
              >
                Create Automation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

