import React, { useState, useEffect } from 'react';
import { getPatients, createPatient, updatePatient, deletePatient } from '../services/api';
import { Users, Plus, Pencil, Trash2, X, AlertCircle, User, RefreshCw } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md card p-6 animate-bounce-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {patient ? 'Edit Patient' : 'Add New Patient'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="input-label">Full Name *</label>
            <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="John Smith" disabled={isLoading} />
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
            <label className="input-label">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} className="input-field resize-none" rows={3} placeholder="Clinical notes..." disabled={isLoading} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1" disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={isLoading}>
              {isLoading ? 'Saving...' : patient ? 'Save Changes' : 'Add Patient'}
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
      toast.success('Patient updated!');
    } else {
      const created = await createPatient(payload);
      setPatients(prev => [created, ...prev]);
      toast.success('Patient added!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient and all their predictions?')) return;
    setDeletingId(id);
    try {
      await deletePatient(id);
      setPatients(prev => prev.filter(p => p.id !== id));
      toast.success('Patient deleted.');
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
    <div className="flex-1 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="section-label">Management</p>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Patients</h1>
          </div>
          <div className="flex gap-2 self-start sm:self-auto">
            <button onClick={loadPatients} className="btn-secondary gap-2"><RefreshCw className="w-4 h-4" />Refresh</button>
            <button onClick={openAdd} id="add-patient" className="btn-primary gap-2"><Plus className="w-4 h-4" />Add Patient</button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <div key={i} className="card h-20 skeleton" />)}
          </div>
        ) : error ? (
          <div className="card p-8 text-center">
            <AlertCircle className="w-10 h-10 text-cardiac-500 mx-auto mb-3" />
            <p className="font-medium text-slate-700 dark:text-slate-300">{error}</p>
            <button onClick={loadPatients} className="btn-primary mt-4">Retry</button>
          </div>
        ) : patients.length === 0 ? (
          <div className="card p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No patients yet.</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Click "Add Patient" to create your first patient record.</p>
            <button onClick={openAdd} className="btn-primary mt-6 gap-2"><Plus className="w-4 h-4" />Add Patient</button>
          </div>
        ) : (
          <div className="space-y-3">
            {patients.map((patient, i) => (
              <div
                key={patient.id}
                className="card-hover p-5 flex items-center gap-4 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-medical-500 to-medical-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {patient.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">{patient.name}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {[patient.age && `Age ${patient.age}`, patient.sex].filter(Boolean).join(' • ') || 'No details provided'}
                  </div>
                  {patient.notes && (
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">{patient.notes}</div>
                  )}
                </div>

                {/* Date */}
                <div className="hidden sm:block text-xs text-slate-400 dark:text-slate-500 text-right">
                  {new Date(patient.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(patient)}
                    className="p-2 rounded-lg hover:bg-medical-50 dark:hover:bg-medical-900/20 text-slate-400 hover:text-medical-600 dark:hover:text-medical-400 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(patient.id)}
                    disabled={deletingId === patient.id}
                    className="p-2 rounded-lg hover:bg-cardiac-50 dark:hover:bg-cardiac-900/20 text-slate-400 hover:text-cardiac-600 dark:hover:text-cardiac-400 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
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
