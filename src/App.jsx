import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

// Root application layout with sidebar and main content area
function App() {
  return (
    <Router>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid #334155',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#34d399', secondary: '#1e293b' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#1e293b' },
          },
        }}
      />

      <div className="flex min-h-screen">
        <Sidebar />

        {/* Main content with left margin for sidebar */}
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/attendance" element={<Attendance />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
