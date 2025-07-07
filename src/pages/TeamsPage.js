
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTeam, setNewTeam] = useState({ name: '', country: '', logoUrl: '' });
  const teamCardsRef = useRef([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      gsap.from(teamCardsRef.current, { 
        duration: 0.5, 
        opacity: 0, 
        y: 50, 
        stagger: 0.1,
        ease: 'power3.out'
      });
    }
  }, [loading, error, teams]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/teams');
      setTeams(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching teams. Please make sure the server is running.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewTeam({ ...newTeam, [e.target.name]: e.target.value });
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/teams/add', newTeam);
      setNewTeam({ name: '', country: '', logoUrl: '' });
      fetchTeams(); // Refresh the list of teams
    } catch (err) {
      setError('Error adding team.');
    }
  };

  const handleDeleteTeam = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/teams/${id}`);
      fetchTeams(); // Refresh the list of teams
    } catch (err) {
      setError('Error deleting team.');
    }
  };

  if (loading) return <p className="text-center mt-8">Loading teams...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Manage Teams</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800">
        <h3 className="text-2xl font-bold mb-4">Add New Team</h3>
        <form onSubmit={handleAddTeam} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            name="name" 
            placeholder="Team Name" 
            value={newTeam.name} 
            onChange={handleInputChange} 
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
          <input 
            type="text" 
            name="country" 
            placeholder="Country" 
            value={newTeam.country} 
            onChange={handleInputChange} 
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
          <input 
            type="text" 
            name="logoUrl" 
            placeholder="Logo URL" 
            value={newTeam.logoUrl} 
            onChange={handleInputChange} 
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-full"
          >
            Add Team
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.map((team, index) => (
          <div 
            key={team._id} 
            ref={el => teamCardsRef.current[index] = el}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 dark:bg-gray-800"
          >
            <div className="p-6">
              <img src={team.logoUrl} alt={team.name} className="w-24 h-24 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-center dark:text-gray-100">{team.name}</h3>
              <p className="text-gray-600 text-center dark:text-gray-300">{team.country}</p>
              <div className="mt-4 flex justify-center space-x-4">
                <button 
                  onClick={() => handleDeleteTeam(team._id)} 
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
                {/* Add Edit button and functionality later */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;
