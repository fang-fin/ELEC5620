import React, { useState, useEffect } from 'react';

function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamDetails, setTeamDetails] = useState({
    name: '',
    description: '',
    employees: '',  // Changed to string for comma-separated input
    totalEarning: 0,
    totalDuration: 0,
    teamEfficiency: 0
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams'); 
      const data = await response.json();
      
      if (data.success && data.teams && Array.isArray(data.teams.teams)) {
        setTeams(data.teams.teams);  
      } else {
        console.error('Teams data is not an array or request failed', data);
        setTeams([]);  
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeams([]);  
    }
  };

  const handleTeamSelect = async (teamId) => {
    try {
      const response = await fetch(`/api/teams/${teamId}`);
      const data = await response.json();
      setSelectedTeam(teamId);
      setTeamDetails(data.teamDetails);
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };

  const handleInputChange = (e) => {
    setTeamDetails({
      ...teamDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!teamDetails.name?.trim()) {
        alert('Team name is required');
        return;
    }

    try {
        // Ensure all fields are defined with default values
        const payload = {
            name: teamDetails.name?.trim() || '',
            description: teamDetails.description?.trim() || '',
            employees: teamDetails.employees?.trim() || ''
        };

        console.log('Submitting team data:', payload);

        const response = await fetch(selectedTeam ? `/api/teams/${selectedTeam}` : '/api/teams', {
            method: selectedTeam ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (data.success) {
            alert(selectedTeam ? 'Team updated successfully' : 'Team created successfully');
            fetchTeams();
            setSelectedTeam(null);
            setTeamDetails({
                name: '',
                description: '',
                employees: '',
                totalEarning: 0,
                totalDuration: 0,
                teamEfficiency: 0
            });
        } else {
            alert(data.message || 'Operation failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Operation failed');
    }
  };

  const handleNewTeam = () => {
    setSelectedTeam(null);
    setTeamDetails({
      name: '',
      description: '',
      employees: '',
      totalEarning: 0,
      totalDuration: 0,
      teamEfficiency: 0
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Team Management</h2>
      
      {/* Team List */}
      <div className="flex flex-wrap gap-2 mb-4">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => handleTeamSelect(team.id)}
            className={`px-4 py-2 rounded ${
              selectedTeam === team.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {team.name}
          </button>
        ))}
        <button
          onClick={() => {
            setSelectedTeam(null);
            setTeamDetails({
              name: '',
              description: '',
              employees: '',
              totalEarning: 0,
              totalDuration: 0,
              teamEfficiency: 0
            });
          }}
          className="px-4 py-2 rounded bg-green-500 text-white"
        >
          New Team
        </button>
      </div>

      {/* Team Form */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">
          {selectedTeam ? 'Edit Team' : 'New Team'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={teamDetails.name}
              onChange={(e) => setTeamDetails({...teamDetails, name: e.target.value})}
              className="mt-1 block w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={teamDetails.description}
              onChange={(e) => setTeamDetails({...teamDetails, description: e.target.value})}
              className="mt-1 block w-full rounded-md border p-2"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employees (comma-separated IDs)
            </label>
            <input
              type="text"
              value={teamDetails.employees}
              onChange={(e) => setTeamDetails({...teamDetails, employees: e.target.value})}
              className="mt-1 block w-full rounded-md border p-2"
              placeholder="e.g., emp1,emp2,emp3"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            {selectedTeam ? 'Update Team' : 'Create Team'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeamManagement;
