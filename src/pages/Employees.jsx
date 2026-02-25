import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineUsers, HiOutlineMail } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { employeeAPI } from '../services/api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

// Employee list page with add and delete functionality
function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Form state for adding a new employee
    const [form, setForm] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

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

    // Basic client-side validation before submission
    const validateForm = () => {
        const errors = {};
        if (!form.employee_id.trim()) errors.employee_id = 'Employee ID is required';
        if (!form.full_name.trim()) errors.full_name = 'Full name is required';
        if (!form.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.email = 'Enter a valid email address';
        }
        if (!form.department.trim()) errors.department = 'Department is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setSubmitting(true);
            await employeeAPI.create(form);
            toast.success('Employee added successfully');
            setShowAddModal(false);
            resetForm();
            fetchEmployees();
        } catch (err) {
            const msg = err.response?.data?.detail || 'Failed to add employee';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            setDeleting(true);
            await employeeAPI.delete(deleteTarget.employee_id);
            toast.success('Employee deleted');
            setDeleteTarget(null);
            fetchEmployees();
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to delete employee');
        } finally {
            setDeleting(false);
        }
    };

    const resetForm = () => {
        setForm({ employee_id: '', full_name: '', email: '', department: '' });
        setFormErrors({});
    };

    const handleOpenAdd = () => {
        resetForm();
        setShowAddModal(true);
    };

    // Department options for the dropdown
    const departments = ['Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations', 'Design', 'Support'];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="skeleton h-8 w-40 mb-2" />
                        <div className="skeleton h-4 w-56" />
                    </div>
                    <div className="skeleton h-10 w-36 rounded-xl" />
                </div>
                <LoadingSkeleton rows={6} />
            </div>
        );
    }

    if (error) {
        return <ErrorState message={error} onRetry={fetchEmployees} />;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page header with add button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-title">Employees</h1>
                    <p className="page-subtitle">Manage your team members</p>
                </div>
                <button onClick={handleOpenAdd} className="btn-primary">
                    <HiOutlinePlus className="w-4 h-4" />
                    Add Employee
                </button>
            </div>

            {/* Employee table or empty state */}
            {employees.length === 0 ? (
                <EmptyState
                    icon={HiOutlineUsers}
                    title="No employees yet"
                    message="Get started by adding your first employee to the system."
                    action={
                        <button onClick={handleOpenAdd} className="btn-primary">
                            <HiOutlinePlus className="w-4 h-4" />
                            Add Employee
                        </button>
                    }
                />
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/50">
                                    <th className="table-header">Employee ID</th>
                                    <th className="table-header">Full Name</th>
                                    <th className="table-header">Email</th>
                                    <th className="table-header">Department</th>
                                    <th className="table-header text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {employees.map((emp) => (
                                    <tr key={emp.employee_id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="table-cell">
                                            <span className="font-mono text-xs bg-slate-800 px-2.5 py-1 rounded-lg text-indigo-400">
                                                {emp.employee_id}
                                            </span>
                                        </td>
                                        <td className="table-cell font-medium text-white">{emp.full_name}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-2">
                                                <HiOutlineMail className="w-4 h-4 text-slate-500" />
                                                {emp.email}
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <span className="text-xs bg-slate-800/80 px-3 py-1 rounded-full text-slate-300 border border-slate-700">
                                                {emp.department}
                                            </span>
                                        </td>
                                        <td className="table-cell text-right">
                                            <button
                                                onClick={() => setDeleteTarget(emp)}
                                                className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                                                title="Delete employee"
                                            >
                                                <HiOutlineTrash className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Table footer with count */}
                    <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/30">
                        <p className="text-xs text-slate-500">{employees.length} employee{employees.length !== 1 ? 's' : ''} total</p>
                    </div>
                </div>
            )}

            {/* Add employee modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Employee">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">Employee ID</label>
                        <input
                            type="text"
                            className={`input-field ${formErrors.employee_id ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
                            placeholder="e.g. EMP001"
                            value={form.employee_id}
                            onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                        />
                        {formErrors.employee_id && <p className="text-xs text-red-400 mt-1">{formErrors.employee_id}</p>}
                    </div>

                    <div>
                        <label className="label">Full Name</label>
                        <input
                            type="text"
                            className={`input-field ${formErrors.full_name ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
                            placeholder="e.g. John Smith"
                            value={form.full_name}
                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        />
                        {formErrors.full_name && <p className="text-xs text-red-400 mt-1">{formErrors.full_name}</p>}
                    </div>

                    <div>
                        <label className="label">Email Address</label>
                        <input
                            type="email"
                            className={`input-field ${formErrors.email ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
                            placeholder="e.g. john@company.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        {formErrors.email && <p className="text-xs text-red-400 mt-1">{formErrors.email}</p>}
                    </div>

                    <div>
                        <label className="label">Department</label>
                        <select
                            className={`select-field ${formErrors.department ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
                            value={form.department}
                            onChange={(e) => setForm({ ...form, department: e.target.value })}
                        >
                            <option value="">Select a department</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                        {formErrors.department && <p className="text-xs text-red-400 mt-1">{formErrors.department}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Adding...' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete confirmation dialog */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete Employee"
                message={`Are you sure you want to delete ${deleteTarget?.full_name}? This will also remove all their attendance records. This action cannot be undone.`}
                loading={deleting}
            />
        </div>
    );
}

export default Employees;
