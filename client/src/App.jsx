import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Projects from './pages/projects/Projects';
import ProjectDetails from './pages/projects/ProjectDetails';
import KanbanBoard from './pages/tasks/KanbanBoard';
import Team from './pages/team/Team';
import Calendar from './pages/calendar/Calendar';
import Messages from './pages/messages/Messages';
import Settings from './pages/settings/Settings';
import Meetings from './pages/meetings/Meetings';
import Documents from './pages/documents/Documents';
import TimeTracking from './pages/time-tracking/TimeTracking';
import Goals from './pages/goals/Goals';
import Reports from './pages/reports/Reports';
import Finance from './pages/finance/Finance';
import Automations from './pages/automations/Automations';
import Portfolio from './pages/portfolio/Portfolio';
import ResourcePlanning from './pages/resource-planning/ResourcePlanning';
import Help from './pages/help/Help';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      </Route>
      
      <Route path="/" element={<Navigate to="/dashboard" />} />
      
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/tasks" element={<KanbanBoard />} />
        <Route path="/team" element={<Team />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/time-tracking" element={<TimeTracking />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/automations" element={<Automations />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/resource-planning" element={<ResourcePlanning />} />
        <Route path="/help" element={<Help />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

