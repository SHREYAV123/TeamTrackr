import { useEffect, useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Tasks() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "Admin";
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedTo: "",
  });

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProject || !isAdmin) return;
    const project = projects.find((p) => p._id === selectedProject);
    const firstMember = project?.members?.find((m) => m.role === "Member");
    if (firstMember) {
      setFormData((prev) => ({ ...prev, assignedTo: firstMember._id || "" }));
    }
  }, [selectedProject, projects, isAdmin]);

  // Fetch tasks when project is selected
  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
      if (data.length > 0) {
        setSelectedProject(data[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setFetching(false);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const { data } = await API.get(`/tasks/${projectId}`);
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateTask = async () => {
    if (!formData.title.trim()) {
      alert("Please enter task title");
      return;
    }

    const project = projects.find((p) => p._id === selectedProject);
    const projectMembers = project?.members?.filter((m) => m.role === "Member") || [];
    if (projectMembers.length > 0 && !formData.assignedTo) {
      alert("Please assign the task to a project member.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        projectId: selectedProject,
      };
      if (formData.assignedTo) payload.assignedTo = formData.assignedTo;

      const { data } = await API.post("/tasks", payload);
      setTasks([data, ...tasks]);
      setFormData({ title: "", description: "", dueDate: "", assignedTo: "" });
      setShowForm(false);
      alert("✅ Task created successfully!");
    } catch (err) {
      alert("❌ Failed to create task: " + err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (user?.role !== "Admin") {
      alert("⚠️ Only admins can delete tasks");
      return;
    }

    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await API.delete(`/tasks/${taskId}`);
        setTasks(tasks.filter((t) => t._id !== taskId));
        alert("✅ Task deleted successfully!");
      } catch (err) {
        alert("❌ Failed to delete task: " + err.response?.data?.message);
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
      alert("✅ Task status updated!");
    } catch (err) {
      alert("❌ Failed to update task: " + err.response?.data?.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-300",
          badge: "bg-emerald-200 text-emerald-700",
        };
      case "In Progress":
        return {
          bg: "bg-blue-50",
          border: "border-blue-300",
          badge: "bg-blue-200 text-blue-700",
        };
      case "Pending":
        return {
          bg: "bg-orange-50",
          border: "border-orange-300",
          badge: "bg-orange-200 text-orange-700",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-300",
          badge: "bg-gray-200 text-gray-700",
        };
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case "Completed":
        return "✅";
      case "In Progress":
        return "⚡";
      case "Pending":
        return "⏳";
      default:
        return "📝";
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusOptions = ["Pending", "In Progress", "Completed"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">✅ Tasks</h1>
            <p className="text-gray-600 mt-2">Track and manage your work items</p>
          </div>
          {isAdmin ? (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-emerald-800 font-medium transition shadow-lg hover:shadow-xl"
            >
              + New Task
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              Members only see tasks assigned to them. Update status when work is complete.
            </p>
          )}
        </div>

        {/* Project Selector */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
          <label className="block text-sm font-bold text-gray-900 mb-2">📁 Select Project:</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full border-2 border-gray-200 focus:border-blue-600 p-3 rounded-lg focus:outline-none transition bg-white text-gray-900 font-medium"
          >
            <option value="">-- No project selected --</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Create Task Form */}
        {isAdmin && showForm && selectedProject && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-emerald-600">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Create New Task</h3>
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border-2 border-gray-200 focus:border-emerald-600 p-3 mb-4 rounded-lg focus:outline-none transition"
            />
            <textarea
              name="description"
              placeholder="Task Description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border-2 border-gray-200 focus:border-emerald-600 p-3 mb-4 rounded-lg focus:outline-none transition"
              rows="3"
            />
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="w-full border-2 border-gray-200 focus:border-emerald-600 p-3 mb-4 rounded-lg focus:outline-none transition"
            />
            <label className="block text-sm font-bold text-gray-900 mb-2">Assign to Member</label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              className="w-full border-2 border-gray-200 focus:border-emerald-600 p-3 mb-4 rounded-lg focus:outline-none transition bg-white text-gray-900 font-medium"
            >
              <option value="">Select a member</option>
              {projects
                .find((p) => p._id === selectedProject)
                ?.members?.filter((member) => member.role === "Member")
                ?.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.email})
                  </option>
                ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={handleCreateTask}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 shadow-md"
              >
                {loading ? "Creating..." : "Create Task"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({ title: "", description: "", dueDate: "", assignedTo: "" });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!selectedProject && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
            <p className="text-yellow-700 font-medium">⚠️ Please select a project first</p>
          </div>
        )}

        {/* Tasks List */}
        {selectedProject && (
          <div className="space-y-4">
            {tasks.length > 0 ? (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {tasks.length} Task{tasks.length !== 1 ? "s" : ""} in Total
                </h2>
                {tasks.map((t, index) => {
                  const colors = getStatusColor(t.status);
                  return (
                    <div
                      key={t._id}
                      className={`border-l-4 rounded-lg p-6 bg-white shadow-md hover:shadow-xl transition ${colors.border} ${colors.bg}`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          {/* Task Number and Title */}
                          <div className="flex items-start gap-3 mb-2">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-900">{t.title}</h3>
                              <p className="text-gray-700 text-sm mt-1">{t.description || "No description"}</p>
                            </div>
                          </div>

                          {/* Task Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ml-11">
                            {/* Assigned To */}
                            <div className="bg-white/50 rounded p-3">
                              <span className="text-gray-600 text-xs font-semibold">👤 ASSIGNED TO</span>
                              <p className="font-medium text-gray-900 mt-1">
                                {t.assignedTo?.name || "Unassigned"}
                              </p>
                            </div>

                            {/* Due Date */}
                            {t.dueDate && (
                              <div className="bg-white/50 rounded p-3">
                                <span className="text-gray-600 text-xs font-semibold">📅 DUE DATE</span>
                                <p className="font-medium text-gray-900 mt-1">
                                  {new Date(t.dueDate).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            )}

                            {/* Completed At */}
                            {t.status === "Completed" && t.completedAt && (
                              <div className="bg-white/50 rounded p-3">
                                <span className="text-gray-600 text-xs font-semibold">✅ COMPLETED AT</span>
                                <p className="font-medium text-gray-900 mt-1">
                                  {new Date(t.completedAt).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            )}

                            {/* Status Selector */}
                            <div className="bg-white/50 rounded p-3">
                              <span className="text-gray-600 text-xs font-semibold">📊 STATUS</span>
                              <select
                                value={t.status}
                                onChange={(e) => handleStatusChange(t._id, e.target.value)}
                                className={`mt-1 w-full p-2 rounded text-sm font-medium border-none focus:outline-none cursor-pointer ${colors.badge}`}
                              >
                                {statusOptions.map((status) => (
                                  <option key={status} value={status}>
                                    {getStatusEmoji(status)} {status}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleDeleteTask(t._id)}
                            disabled={user?.role !== "Admin"}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition"
                            title={user?.role !== "Admin" ? "Only admins can delete" : "Delete task"}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-gray-500 text-lg mb-4">No tasks yet</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
                >
                  Create your first task
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
