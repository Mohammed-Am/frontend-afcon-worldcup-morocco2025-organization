
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMatch, setNewMatch] = useState({
    teamA: '',
    teamB: '',
    date: '',
    venue: ''
  });
  const matchCardsRef = useRef([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      gsap.from(matchCardsRef.current, { 
        duration: 0.5, 
        opacity: 0, 
        y: 50, 
        stagger: 0.1,
        ease: 'power3.out'
      });
    }
  }, [loading, error, matches]);

  const fetchData = async () => {
    try {
      const [matchesResponse, teamsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/matches`),
        axios.get(`${process.env.REACT_APP_API_URL}/teams`)
      ]);
      setMatches(matchesResponse.data);
      setTeams(teamsResponse.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching data. Please make sure the server is running.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMatch({ ...newMatch, [e.target.name]: e.target.value });
  };

  const handleAddMatch = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/matches/add`, newMatch);
      setNewMatch({ teamA: '', teamB: '', date: '', venue: '' });
      fetchData(); // Refresh the list of matches and teams
    } catch (err) {
      setError('Error adding match.');
    }
  };

  const handleDeleteMatch = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/matches/${id}`);
      fetchData(); // Refresh the list of matches and teams
    } catch (err) {
      setError('Error deleting match.');
    }
  };

  if (loading) return <p className="text-center mt-8">Loading matches...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Manage Matches</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800">
        <h3 className="text-2xl font-bold mb-4">Add New Match</h3>
        <form onSubmit={handleAddMatch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <select 
            name="teamA" 
            value={newMatch.teamA} 
            onChange={handleInputChange} 
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          >
            <option value="">Select Team A</option>
            {teams.map(team => (
              <option key={team._id} value={team._id}>{team.name}</option>
            ))}
          </select>
          <select 
            name="teamB" 
            value={newMatch.teamB} 
            onChange={handleInputChange} 
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          >
            <option value="">Select Team B</option>
            {teams.map(team => (
              <option key={team._id} value={team._id}>{team.name}</option>
            ))}
          </select>
          <input 
            type="datetime-local" 
            name="date" 
            value={newMatch.date} 
            onChange={handleInputChange} 
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
          <input 
            type="text" 
            name="venue" 
            placeholder="Venue" 
            value={newMatch.venue} 
            onChange={handleInputChange} 
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-full"
          >
            Add Match
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {matches.map((match, index) => (
          <div 
            key={match._id} 
            ref={el => matchCardsRef.current[index] = el}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 dark:bg-gray-800"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 dark:text-gray-100">{match.teamA.name} vs {match.teamB.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{new Date(match.date).toLocaleString()}</p>
              <p className="text-gray-500 dark:text-gray-400">{match.venue}</p>
              <div className="mt-4 flex justify-center space-x-4">
                <button 
                  onClick={() => handleDeleteMatch(match._id)} 
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

export default MatchesPage;
