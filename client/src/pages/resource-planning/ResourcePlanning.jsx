import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Clock,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Edit,
  User,
  Briefcase,
  Target,
  PieChart,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import CreateResourceModal from '../../components/resources/CreateResourceModal';
import { useNavigate } from 'react-router-dom';

export default function ResourcePlanning() {
  const [resources, setResources] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('overview'); // overview, resources, allocations, timeline
  const [timeRange, setTimeRange] = useState('month'); // week, month, quarter, year
  const { api } = useAuth();
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchResourceData();
  }, []);

  useEffect(() => {
    fetchResourceData();
  }, [view, timeRange]);

  const fetchResourceData = async () => {
    try {
      // Fetch real resources from API
      const { data: resourcesData } = await api.get('/resources');
      setResources(resourcesData || []);
      
      // Fetch real allocations from API
      const { data: allocationsData } = await api.get('/allocations');
      setAllocations(allocationsData || []);
    } catch (error) {
      console.error('Failed to fetch resource data');
      setResources([]);
      setAllocations([]);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (availability) => {
    const colors = {
      'available': 'bg-green-100 text-green-700',
      'busy': 'bg-yellow-100 text-yellow-700',
      'overloaded': 'bg-red-100 text-red-700',
      'unavailable': 'bg-gray-100 text-gray-700'
    };
    return colors[availability] || 'bg-gray-100 text-gray-700';
  };

  const getSkillLevelColor = (level) => {
    const colors = {
      'expert': 'bg-purple-100 text-purple-700',
      'senior': 'bg-brand-100 text-brand-700',
      'intermediate': 'bg-green-100 text-green-700',
      'junior': 'bg-yellow-100 text-yellow-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const getUtilizationColor = (utilization) => {
    if (utilization >= 90) return 'bg-red-500';
    if (utilization >= 75) return 'bg-yellow-500';
    if (utilization >= 50) return 'bg-green-500';
    return 'bg-gray-300';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const sourceResources = resources || [];

  const resourceStats = {
    totalResources: sourceResources.length,
    availableResources: sourceResources.filter(r => r.availability === 'available').length,
    avgUtilization: sourceResources.length ? Math.round(sourceResources.reduce((sum, r) => sum + (r.utilization || 0), 0) / sourceResources.length) : 0,
    totalCapacity: sourceResources.reduce((sum, r) => sum + (r.capacity || 0), 0),
    totalAllocated: sourceResources.reduce((sum, r) => sum + (r.allocated || 0), 0),
    overloadedResources: sourceResources.filter(r => (r.utilization || 0) >= 90).length
  };

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
          <h1 className="heading-1">Resource Planning</h1>
          <p className="text-gray-600 mt-1">Optimize resource allocation and utilization</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/meetings', { state: { newMeeting: true } })} className="btn-outline inline-flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </button>
          <button onClick={() => setIsCreateOpen(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Resource
          </button>
        </div>
      </div>
      <CreateResourceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={(newRes) => {
          setResources(prev => [newRes, ...prev]);
          toast.success('Resource added');
        }}
      />

      {/* Navigation Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        {['overview', 'resources', 'allocations', 'timeline'].map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              view === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {view === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-brand-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{resourceStats.totalResources}</h3>
              <p className="text-sm text-gray-600">Total Resources</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-green-600">{resourceStats.availableResources} available</span>
                <span className="text-xs text-gray-500">â€¢</span>
                <span className="text-xs text-gray-500">{resourceStats.overloadedResources} overloaded</span>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{resourceStats.avgUtilization}%</h3>
              <p className="text-sm text-gray-600">Avg Utilization</p>
              <div className="mt-3">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getUtilizationColor(resourceStats.avgUtilization)}`}
                    style={{ width: `${resourceStats.avgUtilization}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <BarChart3 className="h-5 w-5 text-brand-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{resourceStats.totalCapacity}h</h3>
              <p className="text-sm text-gray-600">Total Capacity</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-600">{resourceStats.totalAllocated}h allocated</span>
                <span className="text-xs text-gray-500">
                  ({Math.round((resourceStats.totalAllocated / resourceStats.totalCapacity) * 100)}%)
                </span>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{resourceStats.overloadedResources}</h3>
              <p className="text-sm text-gray-600">Overloaded Resources</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-red-600">Needs attention</span>
                <span className="text-xs text-gray-500">â€¢</span>
                <span className="text-xs text-gray-500">Reallocate tasks</span>
              </div>
            </div>
          </div>

          {/* Department Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Utilization by Department</h2>
              <div className="space-y-4">
                {['Engineering', 'Design', 'Management', 'Analytics'].map((dept, index) => {
                  const deptResources = mockResources.filter(r => r.department === dept);
                  const avgUtilization = deptResources.length > 0 
                    ? Math.round(deptResources.reduce((sum, r) => sum + r.utilization, 0) / deptResources.length)
                    : 0;
                  
                  return (
                    <div key={dept}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-900">{dept}</span>
                        <span className="text-gray-600">{avgUtilization}% â€¢ {deptResources.length} resources</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${getUtilizationColor(avgUtilization)}`}
                          style={{ width: `${avgUtilization}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Availability</h2>
              <div className="space-y-3">
                {['available', 'busy', 'overloaded', 'unavailable'].map((status) => {
                  const count = mockResources.filter(r => r.availability === status).length;
                  const percentage = Math.round((count / mockResources.length) * 100);
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`badge ${getAvailabilityColor(status)}`}>
                          {status}
                        </span>
                        <span className="text-sm text-gray-600">{count} resources</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Resources */}
      {view === 'resources' && (
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">All Resources</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="input pl-9"
                />
              </div>
              <button className="btn-outline">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Resource</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Skills</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Availability</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Utilization</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Projects</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockResources.map((resource) => (
                  <tr key={resource.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {resource.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{resource.name}</p>
                          <p className="text-sm text-gray-500">{resource.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{resource.role}</p>
                        <span className={`badge ${getSkillLevelColor(resource.skillLevel)}`}>
                          {resource.skillLevel}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {resource.skills.slice(0, 2).map((skill, index) => (
                          <span key={index} className="badge bg-gray-100 text-gray-700 text-xs">
                            {skill}
                          </span>
                        ))}
                        {resource.skills.length > 2 && (
                          <span className="badge bg-gray-100 text-gray-700 text-xs">
                            +{resource.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${getAvailabilityColor(resource.availability)}`}>
                        {resource.availability}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex-1 max-w-[60px]">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getUtilizationColor(resource.utilization)}`}
                            style={{ width: `${resource.utilization}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{resource.utilization}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {resource.projects.map((project, index) => (
                          <span key={index} className="badge bg-brand-100 text-brand-700 text-xs">
                            {project}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1 rounded hover:bg-gray-100">
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-100">
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Allocations */}
      {view === 'allocations' && (
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Resource Allocations</h2>
            <button className="btn-primary inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Allocation
            </button>
          </div>

          <div className="space-y-4">
            {mockAllocations.map((allocation) => (
              <div key={allocation.id} className="card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-gray-900">{allocation.project}</h3>
                      <span className={`badge ${
                        allocation.status === 'active' ? 'bg-green-100 text-green-700' :
                        allocation.status === 'planned' ? 'bg-brand-100 text-brand-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {allocation.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Resource:</span>
                          <span className="text-sm font-medium text-gray-900">{allocation.resource}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Role:</span>
                          <span className="text-sm font-medium text-gray-900">{allocation.role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Allocation:</span>
                          <span className="text-sm font-medium text-gray-900">{allocation.allocation}h/week</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Period:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(allocation.startDate)} - {formatDate(allocation.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Budget:</span>
                          <span className="text-sm font-medium text-gray-900">
                            ${allocation.spent.toLocaleString()} / ${allocation.budget.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 rounded hover:bg-gray-100">
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-2 rounded hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      {view === 'timeline' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Resource Timeline</h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['week', 'month', 'quarter', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors capitalize ${
                    timeRange === range ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Timeline View</h3>
            <p className="text-gray-500 mt-1">Interactive resource timeline coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
}

