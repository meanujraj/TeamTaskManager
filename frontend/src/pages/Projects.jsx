import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FolderKanban, Plus, MoreVertical, Users, Calendar } from 'lucide-react';
import api from '../api/axios';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
      } catch (err) {
        console.error('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading Projects...</div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500">Manage and organize your team projects.</p>
        </div>
        {user?.role === 'admin' && (
          <button className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm shadow-indigo-200">
            <Plus className="w-5 h-5" /> Create Project
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-indigo-50 p-3 rounded-xl group-hover:bg-indigo-600 transition-colors">
                <FolderKanban className="text-indigo-600 w-6 h-6 group-hover:text-white transition-colors" />
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h3>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" /> {Array.isArray(project.members) ? project.members.length : 0} Members
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No projects found. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
