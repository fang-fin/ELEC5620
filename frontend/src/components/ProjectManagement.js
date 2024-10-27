import React, { useState, useEffect } from 'react';

function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      // Debug: Log raw response
      console.log("Raw API response:", response);
      
      const data = await response.json();
      // Debug: Log parsed data
      console.log("Parsed API response data:", data);
      
      if (data.success && Array.isArray(data.projects)) {
        // Debug: Log projects array
        console.log("Projects array:", data.projects);
        
        // Verify each project has required properties
        const validProjects = data.projects.filter(project => {
          const isValid = project && project.id && project.name;
          if (!isValid) {
            console.warn("Invalid project data:", project);
          }
          return isValid;
        });
        
        console.log("Validated projects:", validProjects);
        setProjects(validProjects);
      } else {
        console.error('Projects data is not in expected format:', data);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  const handleProjectSelect = async (projectId) => {
    try {
        // Add debug log
        console.log("Fetching details for project:", projectId);
        
        const response = await fetch(`/api/projects/${projectId}`);
        // Log raw response
        console.log("Raw project details response:", response);
        
        const data = await response.json();
        console.log("Project details data:", data);
        
        if (data.success && data.projectDetails) {
            setSelectedProject(projectId);
            setProjectDetails(data.projectDetails);
        } else {
            console.error('Failed to fetch project details:', data);
            // Initialize with empty values instead of empty object
            setProjectDetails({
                name: '',
                description: '',
                deadline: '',
                employees: [],
                totalEarning: 0,
                totalDuration: 0
            });
        }
    } catch (error) {
        console.error('Error fetching project details:', error);
        setProjectDetails({
            name: '',
            description: '',
            deadline: '',
            employees: [],
            totalEarning: 0,
            totalDuration: 0
        });
    }
  };

  const handleInputChange = (e) => {
    setProjectDetails({
      ...projectDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      await fetch(`/api/projects/${selectedProject}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectDetails),
      });
      alert('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleNewProject = () => {
    setSelectedProject(null);
    // Initialize empty project details instead of empty object
    setProjectDetails({
      name: '',
      description: '',
      deadline: '',
      employees: [],
      totalEarning: 0,
      totalDuration: 0
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Project Management</h2>
      
      {/* Project List */}
      <div className="flex flex-wrap gap-2 mb-4">
        {projects.map((project, index) => (
          <button
            key={`project-${project.id}-${index}`}
            onClick={() => handleProjectSelect(project.id)}
            className={`px-4 py-2 rounded ${
              selectedProject === project.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {project.name}
          </button>
        ))}
        <button
          onClick={handleNewProject}
          className="px-4 py-2 rounded bg-green-500 text-white"
        >
          New Project
        </button>
      </div>

      {/* Project Details - Modified condition */}
      {(selectedProject !== null || projectDetails.name !== undefined) && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">
            {selectedProject ? 'Project Details' : 'New Project'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={projectDetails.name || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={projectDetails.description || ''}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={projectDetails.deadline || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Employees</label>
              <input
                type="text"
                name="employees"
                value={projectDetails.employees ? projectDetails.employees.join(', ') : ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter employee IDs separated by commas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Earning</label>
              <input
                type="number"
                name="totalEarning"
                value={projectDetails.totalEarning || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Duration (hours)</label>
              <input
                type="number"
                name="totalDuration"
                value={projectDetails.totalDuration || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                readOnly
              />
            </div>
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {selectedProject ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectManagement;
