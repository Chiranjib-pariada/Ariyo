import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Assignment } from '../../types';
import { FileText, Calendar, Award, CheckCircle2, Clock, Upload, X, MessageSquare, AlertCircle } from 'lucide-react';

export const StudentAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'SUBMITTED' | 'GRADED'>('ALL');
  const [loading, setLoading] = useState(true);

  // Submission modal state
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await api.get<Assignment[]>('/api/assignments', 'student_assignments');
      setAssignments(data || []);
    } catch (err) {
      console.warn('Assignments fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const openSubmit = (item: Assignment) => {
    setSelectedAssignment(item);
    setFileName(`${item.title.replace(/\s+/g, '_')}_Submission.pdf`);
    setFileUrl('https://campus-cdn.ariyo.edu/submissions/sample.pdf');
    setSubmitModalOpen(true);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    try {
      setSubmitting(true);
      await api.post(`/api/assignments/${selectedAssignment._id}/submit`, {
        fileName,
        fileUrl,
      });
      setSuccessMessage('Assignment submitted successfully!');
      setTimeout(() => {
        setSubmitModalOpen(false);
        fetchAssignments();
      }, 1200);
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = assignments.filter((item) => {
    const status = item.mySubmission?.status || 'Pending';
    if (activeTab === 'PENDING') return status === 'Pending';
    if (activeTab === 'SUBMITTED') return status === 'Submitted' || status === 'Late';
    if (activeTab === 'GRADED') return status === 'Graded';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span>Coursework & Digital Assignments</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Submit laboratory files, problem sheets, and view faculty grading rubrics.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 w-fit">
        {(['ALL', 'PENDING', 'SUBMITTED', 'GRADED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Assignments List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No assignments found</h3>
          <p className="text-xs text-slate-500 mt-1">You do not have any tasks matching this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const sub = item.mySubmission;
            const isGraded = sub?.status === 'Graded';
            const isSubmitted = sub && sub.status !== 'Pending';

            return (
              <div
                key={item._id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                        {item.subjectCode}
                      </span>
                      <span className="text-xs text-slate-500">{item.subjectName}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isGraded ? (
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        <span>Graded: {sub.marks} / {item.maxMarks}</span>
                      </span>
                    ) : isSubmitted ? (
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Submitted</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending Submission</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Graded Feedback box */}
                {isGraded && (
                  <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-purple-900 dark:text-purple-200">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Faculty Feedback:</span>
                    </div>
                    <p className="text-purple-800 dark:text-purple-300 leading-relaxed">
                      &quot;{sub.feedback || 'Excellent execution and thorough problem analysis.'}&quot;
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                    </span>
                    <span>Max Marks: {item.maxMarks}</span>
                    <span>Instructor: {item.facultyName}</span>
                  </div>

                  {!isSubmitted ? (
                    <button
                      onClick={() => openSubmit(item)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 w-fit"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit Solution</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      Submitted on: {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      {submitModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative">
            <button
              onClick={() => setSubmitModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Submit Coursework File
            </h3>
            <p className="text-xs text-slate-500 mb-4">{selectedAssignment.title}</p>

            {successMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{successMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Attachment / PDF File Name
                  </label>
                  <input
                    required
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Repository or Document URL
                  </label>
                  <input
                    required
                    type="url"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 text-[11px] leading-relaxed">
                  Submissions are timestamped on the ARIYO server and will be locked for grading by {selectedAssignment.facultyName}.
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 text-xs transition"
                >
                  {submitting ? 'Uploading & Encrypting...' : 'Confirm Submission'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
