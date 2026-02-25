import { HiOutlineInbox } from 'react-icons/hi';

// Shown when a list or table has no data
function EmptyState({ title = 'No data found', message = '', icon: Icon = HiOutlineInbox, action }) {
    return (
        <div className="card py-16 px-8 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-1">{title}</h3>
            {message && <p className="text-sm text-slate-500 max-w-sm">{message}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}

export default EmptyState;
