import { useEffect, useState } from "react";
import API from "../utils/api";

const statusColors = {
  Completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "In Progress": "bg-blue-100 text-blue-700 border border-blue-200",
  Pending: "bg-orange-100 text-orange-700 border border-orange-200",
};

const statusEmoji = {
  Completed: "✅",
  "In Progress": "⚡",
  Pending: "⏳",
};

export default function ProjectDetail({ project, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await API.get(`/tasks/${project._id}`);
        setTasks(data);
      } catch (_) {
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [project._id]);

  const adminMembers = project.members?.filter((m) => m.role === "Admin") || [];
  const regularMembers = project.members?.filter((m) => m.role === "Member") || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white">{project.name}</h2>
            <p className="text-blue-100 text-sm mt-1">Project Details</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">

          {/* Project Info */}
          <div>
           
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Project Name</span>
                <p className="text-gray-500 font-semibold mt-1">{project.name}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Description</span>
                <p className="text-gray-500 mt-1">{project.description || "No description provided."}</p>
              </div>
            </div>
          </div>

          {/* Members */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Members ({project.members?.length || 0})
            </h3>
            {project.members?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {[...adminMembers, ...regularMembers].map((m) => (
                  <div
                    key={m._id}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {m.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{m.name}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                        m.role === "Admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No members yet.</p>
            )}
          </div>

          {/* Tasks */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Tasks List {!loading && `(${tasks.length})`}
            </h3>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.map((t) => (
                  <div
                    key={t._id}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{t.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Assigned to: {t.assignedTo?.name || "Unassigned"}
                      </p>
                    </div>
                    <span
                      className={`ml-3 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        statusColors[t.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {statusEmoji[t.status]} {t.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-400 text-sm">No tasks for this project yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
