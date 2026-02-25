import { useState, useEffect } from 'react';
import { HiOutlineClipboardCheck, HiOutlineCalendar, HiOutlineFilter, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { employeeAPI, attendanceAPI } from '../services/api';
import Modal from '../components/Modal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

// Attendance management page - mark and view attendance records
function Attendance() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [records, setRecords] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recordsLoading, setRecordsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showMarkModal, setShowMarkModal] = useState(false);

    // Filter state for date range
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // Form state for marking attendance
    const [markForm, setMarkForm] = useState({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Load employees on mount
    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await employeeAPI.getAll();
            setEmployees(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Fetch attendance records when an employee is selected
    const fetchRecords = async (empId, from = '', to = '') => {
        if (!empId) {
            setRecords([]);
            setSummary(null);
            return;
        }
        try {
            setRecordsLoading(true);
            const params = {};
            if (from) params.date_from = from;
            if (to) params.date_to = to;
            const [recordsRes, summaryRes] = await Promise.all([
                attendanceAPI.getByEmployee(empId, params),
                attendanceAPI.getSummary(empId),
            ]);
            setRecords(recordsRes.data);
            setSummary(summaryRes.data);
        } catch (err) {
            toast.error('Failed to load attendance records');
        } finally {
            setRecordsLoading(false);
        }
    };

    // Handle employee selection change
    const handleEmployeeChange = (empId) => {
        setSelectedEmployee(empId);
        setDateFrom('');
        setDateTo('');
        fetchRecords(empId);
    };

    // Apply date filters
    const handleFilter = () => {
        if (selectedEmployee) {
            fetchRecords(selectedEmployee, dateFrom, dateTo);
        }
    };

    // Clear date filters
    const handleClearFilter = () => {
        setDateFrom('');
        setDateTo('');
        if (selectedEmployee) {
            fetchRecords(selectedEmployee);
        }
    };

    // Validate mark attendance form
    const validateMarkForm = () => {
        const errors = {};
        if (!markForm.employee_id) errors.employee_id = 'Select an employee';
        if (!markForm.date) errors.date = 'Date is required';
        if (!markForm.status) errors.status = 'Status is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Submit attendance marking
    const handleMarkSubmit = async (e) => {
        e.preventDefault();
        if (!validateMarkForm()) return;

        try {
            setSubmitting(true);
            await attendanceAPI.mark(markForm.employee_id, {
                date: markForm.date,
                status: markForm.status,
            });
            toast.success('Attendance marked successfully');
            setShowMarkModal(false);
            // Refresh records if viewing this employee
            if (selectedEmployee === markForm.employee_id) {
                fetchRecords(selectedEmployee, dateFrom, dateTo);
            }
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to mark attendance');
        } finally {
            setSubmitting(false);
        }
    };

    const openMarkModal = () => {
        setMarkForm({
            employee_id: selectedEmployee || '',
            date: new Date().toISOString().split('T')[0],
            status: 'Present',
        });
        setFormErrors({});
        setShowMarkModal(true);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <div className="skeleton h-8 w-40 mb-2" />
                    <div className="skeleton h-4 w-56" />
                </div>
                <LoadingSkeleton rows={5} />
            </div>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={fetchEmployees} />;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-title">Attendance</h1>
                    <p className="page-subtitle">Track daily employee attendance</p>
                </div>
                <button
                    onClick={openMarkModal}
                    className="btn-primary"
                    disabled={employees.length === 0}
                >
                    <HiOutlineClipboardCheck className="w-4 h-4" />
                    Mark Attendance
                </button>
            </div>

            {employees.length === 0 ? (
                <EmptyState
                    icon={HiOutlineClipboardCheck}
                    title="No employees available"
                    message="Add employees first before managing attendance records."
                />
            ) : (
                <>
                    {/* Employee selector and filters */}
                    <div className="card p-5">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="md:col-span-1">
                                <label className="label">Select Employee</label>
                                <select
                                    className="select-field"
                                    value={selectedEmployee}
                                    onChange={(e) => handleEmployeeChange(e.target.value)}
                                >
                                    <option value="">Choose an employee</option>
                                    {employees.map((emp) => (
                                        <option key={emp.employee_id} value={emp.employee_id}>
                                            {emp.full_name} ({emp.employee_id})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label">From Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    disabled={!selectedEmployee}
                                />
                            </div>

                            <div>
                                <label className="label">To Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    disabled={!selectedEmployee}
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleFilter}
                                    className="btn-secondary flex-1"
                                    disabled={!selectedEmployee}
                                >
                                    <HiOutlineFilter className="w-4 h-4" />
                                    Filter
                                </button>
                                {(dateFrom || dateTo) && (
                                    <button onClick={handleClearFilter} className="btn-secondary">
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Summary cards - shown when employee is selected */}
                    {selectedEmployee && summary && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="stat-card border border-indigo-500/20">
                                <span className="stat-label">Total Records</span>
                                <span className="stat-value">{summary.total_records}</span>
                            </div>
                            <div className="stat-card border border-emerald-500/20">
                                <div className="flex items-center gap-2">
                                    <HiOutlineCheckCircle className="w-4 h-4 text-emerald-400" />
                                    <span className="stat-label">Present Days</span>
                                </div>
                                <span className="stat-value text-emerald-400">{summary.present_days}</span>
                            </div>
                            <div className="stat-card border border-red-500/20">
                                <div className="flex items-center gap-2">
                                    <HiOutlineXCircle className="w-4 h-4 text-red-400" />
                                    <span className="stat-label">Absent Days</span>
                                </div>
                                <span className="stat-value text-red-400">{summary.absent_days}</span>
                            </div>
                        </div>
                    )}

                    {/* Attendance records table */}
                    {!selectedEmployee ? (
                        <EmptyState
                            icon={HiOutlineCalendar}
                            title="Select an employee"
                            message="Choose an employee from the dropdown above to view their attendance records."
                        />
                    ) : recordsLoading ? (
                        <LoadingSkeleton rows={5} />
                    ) : records.length === 0 ? (
                        <EmptyState
                            icon={HiOutlineClipboardCheck}
                            title="No attendance records"
                            message="No attendance records found for this employee. Start by marking their attendance."
                            action={
                                <button onClick={openMarkModal} className="btn-primary">
                                    <HiOutlineClipboardCheck className="w-4 h-4" />
                                    Mark Attendance
                                </button>
                            }
                        />
                    ) : (
                        <div className="card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-800 bg-slate-900/50">
                                            <th className="table-header">Date</th>
                                            <th className="table-header">Day</th>
                                            <th className="table-header">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {records.map((rec) => {
                                            const dateObj = new Date(rec.date + 'T00:00:00');
                                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                                            const formattedDate = dateObj.toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            });

                                            return (
                                                <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                                                    <td className="table-cell font-medium text-white">{formattedDate}</td>
                                                    <td className="table-cell text-slate-400">{dayName}</td>
                                                    <td className="table-cell">
                                                        {rec.status === 'Present' ? (
                                                            <span className="badge-present">
                                                                <HiOutlineCheckCircle className="w-3.5 h-3.5 mr-1" />
                                                                Present
                                                            </span>
                                                        ) : (
                                                            <span className="badge-absent">
                                                                <HiOutlineXCircle className="w-3.5 h-3.5 mr-1" />
                                                                Absent
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/30">
                                <p className="text-xs text-slate-500">{records.length} record{records.length !== 1 ? 's' : ''} found</p>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Mark attendance modal */}
            <Modal isOpen={showMarkModal} onClose={() => setShowMarkModal(false)} title="Mark Attendance">
                <form onSubmit={handleMarkSubmit} className="space-y-4">
                    <div>
                        <label className="label">Employee</label>
                        <select
                            className={`select-field ${formErrors.employee_id ? 'border-red-500/50' : ''}`}
                            value={markForm.employee_id}
                            onChange={(e) => setMarkForm({ ...markForm, employee_id: e.target.value })}
                        >
                            <option value="">Select an employee</option>
                            {employees.map((emp) => (
                                <option key={emp.employee_id} value={emp.employee_id}>
                                    {emp.full_name} ({emp.employee_id})
                                </option>
                            ))}
                        </select>
                        {formErrors.employee_id && <p className="text-xs text-red-400 mt-1">{formErrors.employee_id}</p>}
                    </div>

                    <div>
                        <label className="label">Date</label>
                        <input
                            type="date"
                            className={`input-field ${formErrors.date ? 'border-red-500/50' : ''}`}
                            value={markForm.date}
                            onChange={(e) => setMarkForm({ ...markForm, date: e.target.value })}
                        />
                        {formErrors.date && <p className="text-xs text-red-400 mt-1">{formErrors.date}</p>}
                    </div>

                    <div>
                        <label className="label">Status</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setMarkForm({ ...markForm, status: 'Present' })}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${markForm.status === 'Present'
                                        ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400'
                                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                <HiOutlineCheckCircle className="w-5 h-5" />
                                Present
                            </button>
                            <button
                                type="button"
                                onClick={() => setMarkForm({ ...markForm, status: 'Absent' })}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${markForm.status === 'Absent'
                                        ? 'bg-red-600/20 border-red-500/40 text-red-400'
                                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                <HiOutlineXCircle className="w-5 h-5" />
                                Absent
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setShowMarkModal(false)} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Mark Attendance'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Attendance;
