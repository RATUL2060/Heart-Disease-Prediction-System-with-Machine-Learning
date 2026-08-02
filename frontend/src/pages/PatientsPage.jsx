import React, { useState, useEffect } from 'react';
import { getPatients, createPatient, updatePatient, deletePatient } from '../services/api';
import { Users, Plus, Pencil, Trash2, X, AlertCircle, User, RefreshCw, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', age: '', sex: '', notes: '' };

const PatientModal = ({ patient, onClose, onSave }) => {
  const [form, setForm] = useState(patient ? { name: patient.name, age: patient.age ?? '', sex: patient.sex ?? '', notes: patient.notes ?? '' } : { ...EMPTY_FORM });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Patient name is required.'); return; }
    setIsLoading(true);
    try {
      const payload = { name: form.name, age: form.age ? Number(form.age) : null, sex: form.sex || null, notes: form.notes || null };
      if (patient) {
        await onSave(patient.id, payload);
      } else {
        await onSave(null, payload);
      }
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md card p-6 sm:p-8 animate-bounce-in shadow-2xl border border-slate-100 dark:border-dark-700">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-dark-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
            <User className="w-5 h-5 text-medical-500" />
            {patient ? 'Edit Patient Details' : 'Register New Patient'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-700 transition-all duration-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="input-label">Full Name *</label>
            <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="John Smith" disabled={isLoading} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Age</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} className="input-field" placeholder="e.g. 55" disabled={isLoading} />
            </div>
            <div>
              <label className="input-label">Sex</label>
              <select name="sex" value={form.sex} onChange={handleChange} className="input-field" disabled={isLoading}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="input-label flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" />Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} className="input-field resize-none min-h-[100px]" rows={3} placeholder="Clinical notes, history, or remarks..." disabled={isLoading} />
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-dark-700">
            <button type="button" onClick={onClose} className="btn-secondary flex-1" disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={isLoading}>
              {isLoading ? 'Saving...' : patient ? 'Save Changes' : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadPatients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadPatients(); }, []);

  const handleSave = async (id, payload) => {
    if (id) {
      const updated = await updatePatient(id, payload);
      setPatients(prev => prev.map(p => p.id === id ? updated : p));
      toast.success('Patient updated successfully!');
    } else {
      const created = await createPatient(payload);
      setPatients(prev => [created, ...prev]);
      toast.success('Patient registered successfully!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient and all their predictions?')) return;
    setDeletingId(id);
    try {
      await deletePatient(id);
      setPatients(prev => prev.filter(p => p.id !== id));
      toast.success('Patient record deleted.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (patient) => { setEditingPatient(patient); setModalOpen(true); };
  const openAdd = () => { setEditingPatient(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingPatient(null); };

  return (
    <div className="flex-1 py-10 bg-slate-50 dark:bg-dark-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <p className="section-label">Management</p>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">Patients</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and track patient diagnostic records</p>
          </div>
          <div className="flex gap-3 self-start sm:self-auto">
            <button onClick={loadPatients} className="btn-secondary gap-2"><RefreshCw className="w-4 h-4" />Refresh</button>
            <button onClick={openAdd} id="add-patient" className="btn-primary gap-2"><Plus className="w-4.5 h-4.5" />Add Patient</button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
          </div>
        ) : error ? (
          <div className="card p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-cardiac-100 dark:bg-cardiac-900/30 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-cardiac-500" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Couldn't load patients</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{error}</p>
            <button onClick={loadPatients} className="btn-primary gap-2"><RefreshCw className="w-4 h-4" />Retry</button>
          </div>
        ) : patients.length === 0 ? (
          <div className="card p-14 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-dark-700 flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
              <Users className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">No patients registered yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Start by registering your first patient to run cardiac predictions and keep diagnostic logs.
            </p>
            <button onClick={openAdd} className="btn-primary gap-2 mx-auto"><Plus className="w-4.5 h-4.5" />Register Patient</button>
          </div>
        ) : (
          <div className="space-y-3">
            {patients.map((patient, i) => {
              const initials = patient.name
                .split(' ')
                .map(n => n.charAt(0))
                .slice(0, 2)
                .join('')
                .toUpperCase() || '?';
              return (
                <div
                  key={patient.id}
                  className="card-hover p-5 flex items-center gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-medical-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 dark:text-white truncate text-base">{patient.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      {[patient.age && `Age ${patient.age}`, patient.sex].filter(Boolean).join(' • ') || 'No details provided'}
                    </div>
                    {patient.notes && (
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate bg-slate-50 dark:bg-dark-700/50 p-2 rounded-lg border border-slate-100 dark:border-dark-700 max-w-lg">
                        {patient.notes}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="hidden md:block text-xs text-slate-400 dark:text-slate-500 text-right font-medium mr-4">
                    Registered on
                    <div className="text-slate-600 dark:text-slate-300 font-bold mt-0.5">
                      {new Date(patient.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(patient)}
                      className="p-2.5 rounded-xl hover:bg-medical-50 dark:hover:bg-medical-900/30 text-slate-400 hover:text-medical-600 dark:hover:text-medical-400 transition-all duration-200"
                      title="Edit"
                    >
                      <Pencil className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      disabled={deletingId === patient.id}
                      className="p-2.5 rounded-xl hover:bg-cardiac-50 dark:hover:bg-cardiac-900/30 text-slate-400 hover:text-cardiac-600 dark:hover:text-cardiac-400 transition-all duration-200 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <PatientModal patient={editingPatient} onClose={closeModal} onSave={handleSave} />
      )}
    </div>
  );
};

export default PatientsPage;
