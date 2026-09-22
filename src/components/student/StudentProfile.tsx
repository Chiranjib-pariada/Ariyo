import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { StudentProfile as IStudentProfile } from '../../types';
import { User, Phone, Mail, MapPin, Shield, Check, Save, Sparkles } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { user, profileRecord, updateUserContext } = useAuth();
  const student = profileRecord as IStudentProfile | null;
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-8901');
  const [address, setAddress] = useState(student?.address || 'Campus Hall 4, Room 302, Knowledge Corridor');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put<any>('/api/students/profile/me', {
        phone,
        address,
      });
      if (res && res.user) {
        updateUserContext(res.user, res.profile);
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <span>Student Academic Dossier & Profile</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Verified university enrollment records and editable personal contact credentials.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        {/* Avatar and Primary Tag */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
          <img
            src={user?.profileImage}
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/20 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user?.name}</h3>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
                Active Student
              </span>
            </div>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <p className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">
              ID: {student?.studentId || 'STU-2024-001'} • Roll No: {student?.studentId?.replace('STU-', 'CS-')}
            </p>
          </div>
        </div>

        {/* Read-Only Academic Attributes */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Department</span>
            <strong className="text-slate-900 dark:text-white">
              {student?.departmentName || 'Computer Science & Engineering'}
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Academic Semester</span>
            <strong className="text-slate-900 dark:text-white">Semester {student?.semester || 6}</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Enrollment Batch</span>
            <strong className="text-slate-900 dark:text-white">{student?.batch || '2023-2027'}</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Cumulative CGPA</span>
            <strong className="text-blue-600 dark:text-blue-400 font-mono font-bold text-sm">
              {student?.cgpa?.toFixed(2) || '8.85'}
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Emergency / Guardian Contact</span>
            <strong className="text-slate-900 dark:text-white">
              {student?.guardianName || 'Vikram Sharma'} ({student?.guardianPhone || '+1-555-901-2345'})
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Date of Birth & Gender</span>
            <strong className="text-slate-900 dark:text-white">
              {student?.dateOfBirth || '2004-05-14'} • {student?.gender || 'Male'}
            </strong>
          </div>
        </div>

        {/* Editable Personal Contact Details */}
        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Personal Contact Details</h4>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Personal Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hostel / Residential Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Updating Dossier...' : 'Save Profile Changes'}</span>
            </button>

            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Saved successfully!</span>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
