
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTicket, setNewTicket] = useState({
    user: '',
    match: '',
    seatNumber: ''
  });
  const ticketCardsRef = useRef([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      gsap.from(ticketCardsRef.current, { 
        duration: 0.5, 
        opacity: 0, 
        y: 50, 
        stagger: 0.1,
        ease: 'power3.out'
      });
    }
  }, [loading, error, tickets]);

  const fetchData = async () => {
    try {
      const [ticketsResponse, usersResponse, matchesResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/tickets`),
        axios.get(`${process.env.REACT_APP_API_URL}/users`),
        axios.get(`${process.env.REACT_APP_API_URL}/matches`)
      ]);
      setTickets(ticketsResponse.data);
      setUsers(usersResponse.data);
      setMatches(matchesResponse.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching data. Please make sure the server is running.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewTicket({ ...newTicket, [e.target.name]: e.target.value });
  };

  const handleAddTicket = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/tickets/add`, newTicket);
      setNewTicket({ user: '', match: '', seatNumber: '' });
      fetchData(); // Refresh the list of tickets
    } catch (err) {
      setError('Error adding ticket.');
    }
  };

  const handleDeleteTicket = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tickets/${id}`);
      fetchData(); // Refresh the list of tickets
    } catch (err) {
      setError('Error deleting ticket.');
    }
  };

  if (loading) return <p className="text-center mt-8">Loading tickets...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Manage Tickets</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 dark:bg-gray-800">
        <h3 className="text-2xl font-bold mb-4">Add New Ticket</h3>
        <form onSubmit={handleAddTicket} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select 
            name="user" 
            value={newTicket.user} 
            onChange={handleInputChange} 
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          >
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.username}</option>
            ))}
          </select>
          <select 
            name="match" 
            value={newTicket.match} 
            onChange={handleInputChange} 
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          >
            <option value="">Select Match</option>
            {matches.map(match => (
              <option key={match._id} value={match._id}>{match.teamA.name} vs {match.teamB.name}</option>
            ))}
          </select>
          <input 
            type="text" 
            name="seatNumber" 
            placeholder="Seat Number" 
            value={newTicket.seatNumber} 
            onChange={handleInputChange} 
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-full"
          >
            Add Ticket
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tickets.map((ticket, index) => (
          <div 
            key={ticket._id} 
            ref={el => ticketCardsRef.current[index] = el}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 dark:bg-gray-800"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 dark:text-gray-100">Ticket for {ticket.match.teamA.name} vs {ticket.match.teamB.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">User: {ticket.user.username}</p>
              <p className="text-gray-500 dark:text-gray-400">Seat: {ticket.seatNumber}</p>
              <p className="text-gray-500 dark:text-gray-400">Status: {ticket.status}</p>
              <div className="mt-4 flex justify-center space-x-4">
                <button 
                  onClick={() => handleDeleteTicket(ticket._id)} 
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

export default TicketsPage;
