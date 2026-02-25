import { HiOutlineExclamationCircle } from 'react-icons/hi';

// Shown when an API call or page load fails
function ErrorState({ message = 'Something went wrong', onRetry }) {
    return (
        <div className="card py-16 px-8 flex flex-col items-center justify-center text-center border-red-900/30 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-red-900/20 flex items-center justify-center mb-4">
                <HiOutlineExclamationCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-red-300 mb-1">Error</h3>
            <p className="text-sm text-slate-400 max-w-sm">{message}</p>
            {onRetry && (
                <button onClick={onRetry} className="btn-secondary mt-5">
                    Try Again
                </button>
            )}
        </div>
    );
}

export default ErrorState;
