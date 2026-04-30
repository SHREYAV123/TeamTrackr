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
      // Fetch projects
      const projectsRes = await API.get("/projects");
      const projects = projectsRes.data;
      setRecentProjects(projects.slice(0, 4));

      let totalTasks = 0;
      let completedTasks = 0;
      let pendingTasks = 0;
      let inProgressTasks = 0;
      let allTasks = [];

      // Fetch tasks for each project
      for (const project of projects) {
        try {
          const tasksRes = await API.get(`/tasks/${project._id}`);
          const tasks = tasksRes.data;
          totalTasks += tasks.length;
          completedTasks += tasks.filter((t) => t.status === "Completed").length;
          pendingTasks += tasks.filter((t) => t.status === "Pending").length;
          inProgressTasks += tasks.filter((t) => t.status === "In Progress").length;
          allTasks.push(...tasks);
        } catch (err) {
          console.error(`Failed to fetch tasks for project ${project._id}`);
        }
      }

      setRecentTasks(allTasks.slice(0, 5));

      setStats({
        projects: projects.length,
        tasks: totalTasks,
        completedTasks: completedTasks,
        pendingTasks: pendingTasks,
        inProgressTasks: inProgressTasks,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const getTaskColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completionPercentage = stats.tasks > 0 ? Math.round((stats.completedTasks / stats.tasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome back, {user?.name.split(" ")[0]}! 👋</h1>
          <p className="text-gray-600 mt-2">Here's your project management overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Projects */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90 font-medium">Total Projects</p>
                <p className="text-3xl font-bold mt-2">{stats.projects}</p>
              </div>
              <span className="text-3xl">📁</span>
            </div>
            <Link to="/projects" className="text-sm mt-3 opacity-90 hover:opacity-100 transition">
              View →
            </Link>
          </div>

          {/* Total Tasks */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90 font-medium">Total Tasks</p>
                <p className="text-3xl font-bold mt-2">{stats.tasks}</p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
            <Link to="/tasks" className="text-sm mt-3 opacity-90 hover:opacity-100 transition">
              View →
            </Link>
          </div>

          {/* Completed Tasks */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90 font-medium">Completed</p>
                <p className="text-3xl font-bold mt-2">{stats.completedTasks}</p>
              </div>
              <span className="text-3xl">🎉</span>
            </div>
            <p className="text-sm mt-3 opacity-90">{completionPercentage}% done</p>
          </div>

          {/* In Progress Tasks */}
          <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90 font-medium">In Progress</p>
                <p className="text-3xl font-bold mt-2">{stats.inProgressTasks}</p>
              </div>
              <span className="text-3xl">⚡</span>
            </div>
            <p className="text-sm mt-3 opacity-90">Active tasks</p>
          </div>

          {/* Pending Tasks */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90 font-medium">Pending</p>
                <p className="text-3xl font-bold mt-2">{stats.pendingTasks}</p>
              </div>
              <span className="text-3xl">⏳</span>
            </div>
            <p className="text-sm mt-3 opacity-90">Awaiting start</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {stats.completedTasks} of {stats.tasks} tasks completed ({completionPercentage}%)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">📁 Recent Projects</h3>
              <Link to="/projects" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>
            {recentProjects.length > 0 ? (
              <div className="space-y-3">
                {recentProjects.map((p) => (
                  <div key={p._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition">
                    <h4 className="font-semibold text-gray-900">{p.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500">👥 {p.members?.length || 0} members</span>
                      <Link to="/projects" className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                        Open →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No projects yet.{" "}
                <Link to="/projects" className="text-blue-600 hover:underline">
                  Create one
                </Link>
              </p>
            )}
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">⚡ Recent Tasks</h3>
              <Link to="/tasks" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>
            {recentTasks.length > 0 ? (
              <div className="space-y-3">
                {recentTasks.map((t) => (
                  <div key={t._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{t.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Assigned to: {t.assignedTo?.name || "Unassigned"}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getTaskColor(t.status)}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No tasks yet.{" "}
                <Link to="/tasks" className="text-blue-600 hover:underline">
                  Create one
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-md hover:shadow-lg"
            >
              + New Project
            </Link>
            <Link
              to="/tasks"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-md hover:shadow-lg"
            >
              + New Task
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
