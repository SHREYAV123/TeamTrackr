import { useEffect, useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import ProjectDetail from "../components/ProjectDetail";

export default function Projects() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", members: [] });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [detailProject, setDetailProject] = useState(null);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch (_) {
    } finally {
      setFetching(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users");
      setUsers(data);
    } catch (_) {
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMembersChange = (e) => {
    const values = Array.from(e.target.selectedOptions).map((option) => option.value);
    setFormData({ ...formData, members: values });
  };

  const handleCreateProject = async () => {
    if (!formData.name.trim()) {
      alert("Please enter project name");
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post("/projects", formData);
      setProjects([data, ...projects]);
      setFormData({ name: "", description: "", members: [] });
      setShowForm(false);
      alert("✅ Project created successfully!");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Unknown error";
      alert("❌ Failed to create project: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Delete this project and all its tasks? This cannot be undone.")) return;
    try {
      await API.delete(`/projects/${projectId}`);
      setProjects(projects.filter((p) => p._id !== projectId));
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Unknown error";
      alert("❌ Failed to delete project: " + message);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">📁 Projects</h1>
            <p className="text-gray-600 mt-2">Manage and organize your projects</p>
          </div>
          {user?.role === "Admin" ? (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition shadow-lg hover:shadow-xl"
            >
              + New Project
            </button>
          ) : (
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600 border border-slate-200">
              Project creation is available only for Admin users.
            </div>
          )}
        </div>

        {/* Create Project Form (Admin only) */}
        {user?.role === "Admin" && showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-blue-600">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Create New Project</h3>
            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border-2 border-gray-200 focus:border-blue-600 p-3 mb-4 text-black rounded-lg focus:outline-none transition"
            />
            <textarea
              name="description"
              placeholder="Project Description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border-2 text-black border-gray-200 focus:border-blue-600 p-3 mb-4 rounded-lg focus:outline-none transition"
              rows="3"
            />
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-900 mb-2">Project Members</label>
              <select
                name="members"
                multiple
                value={formData.members}
                onChange={handleMembersChange}
                className="w-full h-48 border-2 border-gray-200 focus:border-blue-600 p-3 mb-2 rounded-lg focus:outline-none transition bg-white text-gray-900 font-medium overflow-y-auto"
                size={Math.min(8, Math.max(4, users.length))}
              >
                {users
                  .filter((userItem) => userItem.role !== "Admin")
                  .map((userItem) => (
                    <option key={userItem._id} value={userItem._id}>
                      {userItem.name} ({userItem.email})
                    </option>
                  ))}
              </select>
              <p className="text-xs text-gray-500">
                Hold Ctrl/Cmd to select multiple members. The project creator is added automatically.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateProject}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 shadow-md"
              >
                {loading ? "Creating..." : "Create Project"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({ name: "", description: "", members: [] });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {projects.length} Project{projects.length !== 1 ? "s" : ""} in Total
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p, index) => (
                <div
                  key={p._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border-t-4 border-blue-600 group"
                >
                  {/* Number Badge */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-3xl group-hover:scale-110 transition">📂</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{p.name}</h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {p.description || "No description provided"}
                  </p>

                  {/* Stats */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <span>👥</span>
                      <span>
                        <strong>{p.members?.length || 0}</strong>{" "}
                        member{p.members?.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-3" />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDetailProject(p)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium text-sm transition"
                    >
                      View Details
                    </button>
                    {user?.role === "Admin" && (
                      <button
                        onClick={() => handleDeleteProject(p._id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium text-sm transition"
                        title="Delete project"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-gray-500 text-xl font-medium mb-2">No projects yet</p>
            <p className="text-gray-400 mb-6">Start by creating your first project</p>
            {user?.role === "Admin" && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-medium transition shadow-lg"
              >
                Create Your First Project
              </button>
            )}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {detailProject && (
        <ProjectDetail
          project={detailProject}
          onClose={() => setDetailProject(null)}
        />
      )}
    </div>
  );
}
