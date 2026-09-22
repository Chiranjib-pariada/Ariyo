import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Assignment, Submission, Subject } from '../../types';
import { FileText, Plus, Calendar, Award, CheckCircle2, Clock, X, MessageSquare, ExternalLink } from 'lucide-react';

export const FacultyAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Assignment Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSubId, setNewSubId] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newMaxMarks, setNewMaxMarks] = useState(20);
  const [creating, setCreating] = useState(false);

  // Submissions Modal
  const [viewSubmissionsOpen, setViewSubmissionsOpen] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
  const [gradeMarks, setGradeMarks] = useState<number>(18);
  const [gradeFeedback, setGradeFeedback] = useState<string>('Well implemented solution.');

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const [assignList, subList] = await Promise.all([
        api.get<Assignment[]>('/api/assignments'),
        api.get<Subject[]>('/api/subjects'),
      ]);
      setAssignments(assignList || []);
      setSubjects(subList || []);
      if (subList && subList.length > 0) {
        setNewSubId(subList[0]._id);
      }
    } catch (err) {
      console.warn('Assignments fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      const selectedSub = subjects.find((s) => s._id === newSubId);
      await api.post('/api/assignments', {
        title: newTitle,
        description: newDesc,
        subjectId: newSubId,
        courseId: selectedSub?.courseId || 'crs_btech_cse',
        dueDate: newDueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
        maxMarks: Number(newMaxMarks),
      });

      setCreateModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      loadAssignments();
    } catch (err: any) {
      alert(err.message || 'Creation failed');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenSubmissions = async (item: Assignment) => {
    setActiveAssignment(item);
    setViewSubmissionsOpen(true);
    try {
      const data = await api.get<Submission[]>(`/api/assignments/${item._id}/submissions`);
      setSubmissions(data || []);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSaveGrade = async (subId: string) => {
    try {
      await api.put(`/api/assignments/submissions/${subId}/grade`, {
        marks: Number(gradeMarks),
        feedback: gradeFeedback,
      });

      setSubmissions((prev) =>
        prev.map((s) =>
          s._id === subId ? { ...s, marks: Number(gradeMarks), feedback: gradeFeedback, status: 'Graded' } : s
        )
      );
      setGradingSubmissionId(null);
    } catch (err: any) {
      alert(err.message || 'Grading failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Coursework Management & Grading</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Publish academic problem sets, monitor submissions, and issue evaluative feedback.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Assignment</span>
        </button>
      </div>

      {/* Assignments List */}
      <div className="grid md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-10 text-slate-400 text-xs">Loading course tasks...</div>
        ) : assignments.length === 0 ? (
          <div className="col-span-2 text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
            No coursework tasks published yet. Click &quot;Publish New Assignment&quot; to begin.
          </div>
        ) : (
          assignments.map((item) => (
            <div
              key={item._id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-900">
                    {item.subjectCode}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">Max Marks: {item.maxMarks}</span>
                <button
                  onClick={() => handleOpenSubmissions(item)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold transition flex items-center gap-1"
                >
                  <span>Inspect Submissions</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Create New Academic Assignment
            </h3>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={newSubId}
                  onChange={(e) => setNewSubId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assignment Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Distributed Consensus Algorithms Implementation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Instructions & Rubric
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail problem objectives, format, and grading benchmarks..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    required
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Marks
                  </label>
                  <input
                    required
                    type="number"
                    min={5}
                    max={100}
                    value={newMaxMarks}
                    onChange={(e) => setNewMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 text-xs transition"
              >
                {creating ? 'Publishing to Course...' : 'Publish to Students'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Submissions Drawer / Modal */}
      {viewSubmissionsOpen && activeAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative">
            <button
              onClick={() => setViewSubmissionsOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Submissions Roster: {activeAssignment.title}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Max Marks: {activeAssignment.maxMarks}</p>

            <div className="space-y-3">
              {submissions.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No submissions received yet from enrolled students.
                </div>
              ) : (
                submissions.map((sub) => (
                  <div
                    key={sub._id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {sub.studentName}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          Submitted on {new Date(sub.submittedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {sub.status === 'Graded' ? (
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                            Score: {sub.marks} / {activeAssignment.maxMarks}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
                            Ungraded
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="underline truncate">
                        {sub.fileName}
                      </a>
                    </div>

                    {gradingSubmissionId === sub._id ? (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500">Marks (/{activeAssignment.maxMarks})</label>
                            <input
                              type="number"
                              min={0}
                              max={activeAssignment.maxMarks}
                              value={gradeMarks}
                              onChange={(e) => setGradeMarks(Number(e.target.value))}
                              className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs text-slate-900 dark:text-white"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-slate-500">Qualitative Feedback</label>
                            <input
                              type="text"
                              value={gradeFeedback}
                              onChange={(e) => setGradeFeedback(e.target.value)}
                              className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-xs text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setGradingSubmissionId(null)}
                            className="px-3 py-1 rounded-lg text-xs text-slate-500 hover:bg-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveGrade(sub._id)}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            Submit Grade
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                        <span className="text-slate-500 italic text-[11px]">
                          {sub.feedback ? `"${sub.feedback}"` : 'No feedback entered'}
                        </span>
                        <button
                          onClick={() => {
                            setGradingSubmissionId(sub._id);
                            setGradeMarks(sub.marks || 18);
                            setGradeFeedback(sub.feedback || 'Well prepared submission.');
                          }}
                          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          {sub.status === 'Graded' ? 'Edit Grade' : 'Grade Submission'}
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
