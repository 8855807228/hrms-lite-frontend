import { NavLink } from 'react-router-dom';
import { HiOutlineViewGrid, HiOutlineUsers, HiOutlineClipboardCheck } from 'react-icons/hi';

// Main sidebar navigation for the app
function Sidebar() {
    const links = [
        { to: '/', label: 'Dashboard', icon: HiOutlineViewGrid },
        { to: '/employees', label: 'Employees', icon: HiOutlineUsers },
        { to: '/attendance', label: 'Attendance', icon: HiOutlineClipboardCheck },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 z-40 flex flex-col">
            {/* Brand header */}
            <div className="px-6 py-6 border-b border-slate-800">
                <h1 className="text-xl font-bold tracking-tight">
                    <span className="text-indigo-400">HRMS</span>
                    <span className="text-slate-400 font-normal ml-1.5">Lite</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">Human Resource Management</p>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`
                        }
                    >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer info */}
            <div className="px-6 py-4 border-t border-slate-800">
                <p className="text-xs text-slate-600">Admin Panel</p>
            </div>
        </aside>
    );
}

export default Sidebar;
