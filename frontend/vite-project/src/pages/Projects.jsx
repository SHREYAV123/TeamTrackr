import { useEffect, useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Projects() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setFetching(false);
    }
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Create new project
  const handleCreateProject = async () => {
    if (!formData.name.trim()) {
      alert("Please enter project name");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/projects", formData);
      setProjects([data, ...projects]);
      setFormData({ name: "", description: "" });
      setShowForm(false);
      alert("✅ Project created successfully!");
    } catch (err) {
      alert("❌ Failed to create project: " + err.response?.data?.message);
    } finally {
      setLoading(false);
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

        {/* Create Project Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-blue-600">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Create New Project</h3>
            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border-2 border-gray-200 focus:border-blue-600 p-3 mb-4 rounded-lg focus:outline-none transition"
            />
            <textarea
              name="description"
              placeholder="Project Description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border-2 border-gray-200 focus:border-blue-600 p-3 mb-4 rounded-lg focus:outline-none transition"
              rows="3"
            />
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
                  setFormData({ name: "", description: "" });
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
                  {/* Project Number Badge */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-3xl group-hover:scale-110 transition">📂</span>
                  </div>

                  {/* Project Title */}
                  <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{p.name}</h3>

                  {/* Project Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{p.description || "No description provided"}</p>

                  {/* Stats Section */}
                  <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <span>👥</span>
                      <span>
                        <strong>{p.members?.length || 0}</strong> member{p.members?.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <span>📅</span>
                      <span>Created recently</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-3"></div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium text-sm transition">
                      View Details
                    </button>
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium text-sm transition">
                      Settings
                    </button>
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
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-medium transition shadow-lg"
            >
              Create Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
