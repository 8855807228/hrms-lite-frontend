// Reusable loading skeleton for tables and cards
function LoadingSkeleton({ rows = 5, type = 'table' }) {
    if (type === 'cards') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="card p-6 space-y-3">
                        <div className="skeleton h-4 w-20" />
                        <div className="skeleton h-8 w-16" />
                        <div className="skeleton h-3 w-32" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
                <div className="skeleton h-5 w-40" />
            </div>
            <div className="divide-y divide-slate-800/50">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="px-5 py-4 flex items-center gap-6">
                        <div className="skeleton h-4 w-24" />
                        <div className="skeleton h-4 w-40 flex-1" />
                        <div className="skeleton h-4 w-32" />
                        <div className="skeleton h-4 w-20" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LoadingSkeleton;
