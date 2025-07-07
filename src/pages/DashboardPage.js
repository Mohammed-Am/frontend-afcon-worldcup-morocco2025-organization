
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login');
    }
  }, [loading, isLoggedIn, navigate]);

  if (loading) return <p className="text-center mt-8">Loading user data...</p>;
  if (!user) return null; // Should not happen if loading and isLoggedIn are handled

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-white rounded-lg shadow-md dark:bg-gray-800  ">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-gray-100">Welcome, {user.username}!</h2>
      <p className="text-gray-700 dark:text-gray-300">Email: {user.email}</p>
      <p className="text-gray-700 dark:text-gray-300">Password: ***********</p>
      <p className="text-gray-700 dark:text-gray-300 mt-4">This is your dashboard. More content will be added here.</p>
    </div>
  );
};

export default DashboardPage;
