import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Download,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  Search,
  FileText,
  Share,
  MoreVertical
  ,ChevronLeft, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month'); // week, month, quarter, year
  const [reportType, setReportType] = useState('overview'); // overview, projects, team, finance
  const [showNewReport, setShowNewReport] = useState(false);
  const [newReportForm, setNewReportForm] = useState({ title: '', type: 'overview', date: '' });
  const [periodOffset, setPeriodOffset] = useState(0);
  const { api } = useAuth();

  useEffect(() => {
    fetchReports();
  }, [dateRange, reportType]);

  const fetchReports = async () => {
    try {
      // Reports will be generated from real project/task data
      // For now, return empty array
      setReports([]);
    } catch (error) {
      console.error('Failed to fetch reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (reportId) => {
    // Client-side export: download JSON of report
    try {
      const rep = reports.find(r => r._id === reportId) || reports[0];
      if (!rep) {
        toast.error('No report to export');
        return;
      }
      const blob = new Blob([JSON.stringify(rep, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${rep.title.replace(/\s+/g, '_') || 'report'}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Report exported');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const exportCurrent = () => {
    // export selectedReport or first matching reportType
    const rep = selectedReport || reports.find(r => r.type === reportType) || reports[0];
    if (!rep) return toast.error('No report selected');
    exportReport(rep._id);
  };

  const prevPeriod = () => { setPeriodOffset(o => o - 1); };
  const nextPeriod = () => { setPeriodOffset(o => o + 1); };

  const mockData = {
    overview: {
      totalProjects: 24,
      completedProjects: 18,
      totalTasks: 156,
      completedTasks: 142,
      teamProductivity: 91,
      avgCompletionTime: 12,
      budgetUsed: 67000,
      budgetTotal: 85000
    },
    projects: [
      { name: 'Website Redesign', progress: 85, status: 'on-track', budget: 25000, spent: 21000 },
      { name: 'Mobile App', progress: 60, status: 'at-risk', budget: 35000, spent: 28000 },
      { name: 'Marketing Campaign', progress: 95, status: 'completed', budget: 15000, spent: 14500 },
      { name: 'Data Migration', progress: 40, status: 'delayed', budget: 20000, spent: 12000 }
    ],
    team: [
      { name: 'John Doe', tasks: 28, completed: 25, hours: 168, efficiency: 92 },
      { name: 'Jane Smith', tasks: 32, completed: 30, hours: 176, efficiency: 95 },
      { name: 'Mike Johnson', tasks: 24, completed: 22, hours: 160, efficiency: 88 },
      { name: 'Sarah Williams', tasks: 30, completed: 28, hours: 172, efficiency: 90 }
    ]
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
      {showNewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Report</h3>
              <button onClick={() => setShowNewReport(false)} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const id = Date.now();
              const report = { _id: id, title: newReportForm.title || `Report ${id}`, type: newReportForm.type, date: newReportForm.date || new Date().toISOString().slice(0,10), data: {} };
              setReports(prev => [report, ...prev]);
              setShowNewReport(false);
              setNewReportForm({ title: '', type: 'overview', date: '' });
              toast.success('Report created');
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={newReportForm.title} onChange={(e) => setNewReportForm(prev => ({ ...prev, title: e.target.value }))} className="input w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={newReportForm.type} onChange={(e) => setNewReportForm(prev => ({ ...prev, type: e.target.value }))} className="input w-full">
                  <option value="overview">Overview</option>
                  <option value="projects">Projects</option>
                  <option value="team">Team</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={newReportForm.date} onChange={(e) => setNewReportForm(prev => ({ ...prev, date: e.target.value }))} className="input w-full" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowNewReport(false)} className="btn">Cancel</button>
                <button type="submit" className="btn-primary">Create Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-1">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your business performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportCurrent} className="btn-outline inline-flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button onClick={() => setShowNewReport(true)} className="btn-primary inline-flex items-center gap-2">
            <FileText className="h-4 w-4" />
            New Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button onClick={prevPeriod} className="p-2 rounded bg-gray-100 hover:bg-gray-200">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['week', 'month', 'quarter', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => { setDateRange(range); setPeriodOffset(0); }}
                className={`px-3 py-1 rounded-md text-sm transition-colors capitalize ${
                  dateRange === range ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button onClick={nextPeriod} className="p-2 rounded bg-gray-100 hover:bg-gray-200">
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="text-sm text-gray-500 ml-3">Offset: {periodOffset}</div>
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['overview', 'projects', 'team', 'finance'].map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-3 py-1 rounded-md text-sm transition-colors capitalize ${
                reportType === type ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      {reportType === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-brand-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{mockData.overview.totalProjects}</h3>
            <p className="text-sm text-gray-600">Total Projects</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-green-600">+12%</span>
              <span className="text-xs text-gray-500">vs last {dateRange}</span>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{mockData.overview.completedTasks}</h3>
            <p className="text-sm text-gray-600">Completed Tasks</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-green-600">+8%</span>
              <span className="text-xs text-gray-500">vs last {dateRange}</span>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{mockData.overview.teamProductivity}%</h3>
            <p className="text-sm text-gray-600">Team Productivity</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-red-600">-3%</span>
              <span className="text-xs text-gray-500">vs last {dateRange}</span>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">${(mockData.overview.budgetUsed / 1000).toFixed(0)}k</h3>
            <p className="text-sm text-gray-600">Budget Used</p>
            <div className="mt-3">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${(mockData.overview.budgetUsed / mockData.overview.budgetTotal) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {Math.round((mockData.overview.budgetUsed / mockData.overview.budgetTotal) * 100)}% of total
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Projects Report */}
      {reportType === 'projects' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Project Performance</h2>
            <button className="btn-outline">
              <Download className="h-4 w-4" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Project</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Progress</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Budget</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Spent</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockData.projects.map((project, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex-1 max-w-[100px]">
                          <div 
                            className="h-full bg-brand-500 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${
                        project.status === 'on-track' ? 'bg-green-100 text-green-700' :
                        project.status === 'at-risk' ? 'bg-yellow-100 text-yellow-700' :
                        project.status === 'completed' ? 'bg-brand-100 text-brand-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {project.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">${project.budget.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">${project.spent.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <button className="p-1 rounded hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Team Report */}
      {reportType === 'team' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Team Performance</h2>
            <button className="btn-outline">
              <Download className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockData.team.map((member, index) => (
              <div key={index} className="card p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  <span className="badge bg-green-100 text-green-700">
                    {member.efficiency}% efficient
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tasks Completed</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {member.completed}/{member.tasks}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hours Logged</p>
                    <p className="text-lg font-semibold text-gray-900">{member.hours}h</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${(member.completed / member.tasks) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((member.completed / member.tasks) * 100)}% completion rate
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Finance Report */}
      {reportType === 'finance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Total Budget</span>
                  <span className="font-medium text-gray-900">${mockData.overview.budgetTotal.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-300 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Budget Used</span>
                  <span className="font-medium text-gray-900">${mockData.overview.budgetUsed.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                    style={{ width: `${(mockData.overview.budgetUsed / mockData.overview.budgetTotal) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-medium text-gray-900">
                    ${(mockData.overview.budgetTotal - mockData.overview.budgetUsed).toLocaleString()}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${((mockData.overview.budgetTotal - mockData.overview.budgetUsed) / mockData.overview.budgetTotal) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-brand-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Personnel</span>
                </div>
                <span className="text-sm font-medium text-gray-900">$45,000</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Software</span>
                </div>
                <span className="text-sm font-medium text-gray-900">$12,000</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Marketing</span>
                </div>
                <span className="text-sm font-medium text-gray-900">$8,000</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Operations</span>
                </div>
                <span className="text-sm font-medium text-gray-900">$2,000</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

