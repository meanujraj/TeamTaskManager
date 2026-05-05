import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FolderKanban, Plus, MoreVertical, Users, Calendar, ArrowUpRight } from 'lucide-react';
import api from '../api/axios';
import ProjectModal from '../components/ProjectModal';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Loading projects...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and organize your team projects.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-indigo-600/25 dark:shadow-indigo-600/15 self-start"
          >
            <Plus className="w-5 h-5" /> New Project
          </button>
        )}
      </header>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProjectCreated={() => {
          setIsModalOpen(false);
          fetchProjects();
        }} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <div key={project._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 group overflow-hidden">
            {/* Color bar */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-xl group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 transition-colors duration-200">
                  <FolderKanban className="text-indigo-600 dark:text-indigo-400 w-5 h-5 group-hover:text-white transition-colors duration-200" />
                </div>
                <button className="p-1.5 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1">
                {project.name}
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{Array.isArray(project.members) ? project.members.length : 0}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {projects.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FolderKanban className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No projects yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Create your first project to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
