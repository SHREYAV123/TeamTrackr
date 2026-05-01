import { useEffect, useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const projectsRes = await API.get("/projects");
      const projects = projectsRes.data;
      setRecentProjects(projects.slice(0, 4));

      let totalTasks = 0,
        completedTasks = 0,
        pendingTasks = 0,
        inProgressTasks = 0;
      let allTasks = [];

      for (const project of projects) {
        try {
          const tasksRes = await API.get(`/tasks/${project._id}`);
          const tasks = tasksRes.data;
          totalTasks += tasks.length;
          completedTasks += tasks.filter((t) => t.status === "Completed").length;
          pendingTasks += tasks.filter((t) => t.status === "Pending").length;
          inProgressTasks += tasks.filter((t) => t.status === "In Progress").length;
          allTasks.push(...tasks);
        } catch (_) {
        }
      }

      setRecentTasks(allTasks.slice(0, 5));
      setStats({
        projects: projects.length,
        tasks: totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
      });
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  const getTaskColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Pending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  const completionPercentage =
    stats.tasks > 0 ? Math.round((stats.completedTasks / stats.tasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
       <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 shadow-xl text-white">
  <h1 className="text-4xl font-bold mb-2">
    Welcome back, {user?.name.split(" ")[0]} 👋
  </h1>
  <p className="text-white/80 text-lg">
    Here's your project management overview
  </p>
</div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">📁 Projects</h3>
            <p className="text-3xl font-bold text-indigo-600">{stats.projects}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">✅ Tasks</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.tasks}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">🎉 Completed</h3>
            <p className="text-3xl font-bold text-emerald-600">
              {stats.completedTasks}
            </p>
            <p className="text-sm text-gray-500">
              {completionPercentage}% completion
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">⚡ In Progress</h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.inProgressTasks}
            </p>
          </div>
        </div>

   

        {/* Recent Projects & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📁 Recent Projects
            </h3>
            {recentProjects.length > 0 ? (
              <ul className="space-y-3">
                {recentProjects.map((p) => (
                  <li key={p._id} className="border-b pb-2">
                    <h4 className="font-semibold text-green-300">{p.name}</h4>
                    <p className="text-sm text-gray-500">{p.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No projects yet</p>
            )}
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">⚡ Recent Tasks</h3>
             
            </div>
            {recentTasks.length > 0 ? (
              <ul className="space-y-3">
                {recentTasks.map((t) => (
                  <li
                    key={t._id}
                    className="border-b pb-2 flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{t.title}</p>
                      <p className="text-sm text-gray-500">{t.description}</p>
                      {t.dueDate && (
                        <p className="text-xs text-gray-400 mt-1">
                          📅 Due: {new Date(t.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs border ${getTaskColor(
                        t.status
                      )}`}
                    >
                      {t.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No tasks yet</p>
            )}
          </div>
        </div>

        {user?.role === "Admin" && (
          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🚀 Quick Actions
            </h3>
            <div className="flex gap-4 mt-6">
              <Link
                to="/projects"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
              >
                + New Project
              </Link>
              <Link
                to="/tasks"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-md"
              >
                + New Task
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
