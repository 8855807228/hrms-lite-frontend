import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineUsers, HiOutlineClipboardCheck, HiOutlineOfficeBuilding, HiOutlineCalendar } from 'react-icons/hi';
import { dashboardAPI } from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';

// Main dashboard with summary stats and recent activity
function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await dashboardAPI.getSummary();
            setData(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <div className="skeleton h-8 w-48 mb-2" />
                    <div className="skeleton h-4 w-72" />
                </div>
                <LoadingSkeleton type="cards" />
                <LoadingSkeleton rows={5} />
            </div>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={fetchDashboard} />;
    }

    const stats = [
        {
            label: 'Total Employees',
            value: data?.total_employees || 0,
            icon: HiOutlineUsers,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            borderColor: 'border-indigo-500/20',
        },
        {
            label: 'Departments',
            value: data?.total_departments || 0,
            icon: HiOutlineOfficeBuilding,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
            borderColor: 'border-cyan-500/20',
        },
        {
            label: 'Present Today',
            value: data?.present_today || 0,
            icon: HiOutlineClipboardCheck,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20',
        },
        {
            label: 'Absent Today',
            value: data?.absent_today || 0,
            icon: HiOutlineCalendar,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            borderColor: 'border-amber-500/20',
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Page header */}
            <div>
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Overview of your organization</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className={`stat-card border ${stat.borderColor} group hover:border-opacity-50 transition-all duration-300`}>
                        <div className="flex items-center justify-between">
                            <span className="stat-label">{stat.label}</span>
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                        <span className="stat-value">{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Quick links and recent employees */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent employees */}
                <div className="card overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-white">Recent Employees</h2>
                        <Link to="/employees" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                            View all
                        </Link>
                    </div>
                    {data?.recent_employees?.length > 0 ? (
                        <div className="divide-y divide-slate-800/50">
                            {data.recent_employees.map((emp) => (
                                <div key={emp.employee_id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">{emp.full_name}</p>
                                        <p className="text-xs text-slate-500">{emp.email}</p>
                                    </div>
                                    <span className="text-xs text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-lg">{emp.department}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-6 py-10 text-center text-sm text-slate-500">
                            No employees added yet
                        </div>
                    )}
                </div>

                {/* Department breakdown */}
                <div className="card overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-800">
                        <h2 className="text-base font-semibold text-white">Department Breakdown</h2>
                    </div>
                    {data?.department_counts && Object.keys(data.department_counts).length > 0 ? (
                        <div className="divide-y divide-slate-800/50">
                            {Object.entries(data.department_counts).map(([dept, count]) => (
                                <div key={dept} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                                    <span className="text-sm text-slate-300">{dept}</span>
                                    <span className="text-sm font-semibold text-white bg-slate-800 px-3 py-1 rounded-lg">{count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-6 py-10 text-center text-sm text-slate-500">
                            No departments yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
