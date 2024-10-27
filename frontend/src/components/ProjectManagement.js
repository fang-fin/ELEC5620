import React, { useState, useEffect } from 'react';

function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState({
    name: '',
    description: '',
    deadline: '',
    employees: ''  // Changed to string for comma-separated input
  });

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
                employees: ''
            });
        }
    } catch (error) {
        console.error('Error fetching project details:', error);
        setProjectDetails({
            name: '',
            description: '',
            deadline: '',
            employees: ''
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
    if (!projectDetails.name?.trim()) {
        alert('Project name is required');
        return;
    }

    try {
        const payload = {
            name: projectDetails.name?.trim() || '',
            description: projectDetails.description?.trim() || '',
            deadline: projectDetails.deadline,
            employees: projectDetails.employees?.trim() || ''
        };

        console.log('Submitting project data:', payload);

        const response = await fetch(selectedProject ? `/api/projects/${selectedProject}` : '/api/projects', {
            method: selectedProject ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Server response:', data);

        if (data.success) {
            console.log('Operation successful:', data);
            alert(selectedProject ? 'Project updated successfully' : 'Project created successfully');
            fetchProjects();
            setSelectedProject(null);
            setProjectDetails({
                name: '',
                description: '',
                deadline: '',
                employees: ''
            });
        } else {
            console.error('Operation failed:', data);
            alert(data.message || 'Operation failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Operation failed');
    }
  };

  const handleNewProject = () => {
    setSelectedProject(null);
    // Initialize empty project details instead of empty object
    setProjectDetails({
      name: '',
      description: '',
      deadline: '',
      employees: ''
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

      {/* Project Form */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">
          {selectedProject ? 'Edit Project' : 'New Project'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={projectDetails.name}
              onChange={(e) => setProjectDetails({...projectDetails, name: e.target.value})}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={projectDetails.description}
              onChange={(e) => setProjectDetails({...projectDetails, description: e.target.value})}
              className="mt-1 block w-full rounded-md border p-2"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              value={projectDetails.deadline}
              onChange={(e) => setProjectDetails({...projectDetails, deadline: e.target.value})}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employees (comma-separated IDs)
            </label>
            <input
              type="text"
              value={projectDetails.employees}
              onChange={(e) => setProjectDetails({...projectDetails, employees: e.target.value})}
              className="mt-1 block w-full rounded-md border p-2"
              placeholder="e.g., emp1,emp2,emp3"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            {selectedProject ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectManagement;
