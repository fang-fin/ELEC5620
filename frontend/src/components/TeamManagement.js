import React, { useState, useEffect } from 'react';

function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamDetails, setTeamDetails] = useState({});

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      const data = await response.json();
      setTeams(data.teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
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
    try {
      await fetch(`/api/teams/${selectedTeam}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamDetails),
      });
      alert('Team updated successfully');
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const handleNewTeam = () => {
    setSelectedTeam(null);
    setTeamDetails({});
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
          onClick={handleNewTeam}
          className="px-4 py-2 rounded bg-green-500 text-white"
        >
          New Team
        </button>
      </div>

      {/* Team Details */}
      {selectedTeam && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Team Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={teamDetails.name || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={teamDetails.description || ''}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Employees</label>
              <input
                type="text"
                name="employees"
                value={teamDetails.employees ? teamDetails.employees.join(', ') : ''}
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
                value={teamDetails.totalEarning || ''}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Duration (hours)</label>
              <input
                type="number"
                name="totalDuration"
                value={teamDetails.totalDuration || ''}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Team Efficiency (earning/hour)</label>
              <input
                type="number"
                name="teamEfficiency"
                value={teamDetails.teamEfficiency || ''}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-100"
              />
            </div>
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamManagement;
