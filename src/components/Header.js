
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const MainNavLinks = ({ onLinkClick }) => (
    <ul className="flex space-x-4 gap-5">
      <li><Link to="/" onClick={onLinkClick}>Home</Link></li>
      <li><Link to="/teams" onClick={onLinkClick}>Teams</Link></li>
      <li><Link to="/matches" onClick={onLinkClick}>Matches</Link></li>
      <li><Link to="/tickets" onClick={onLinkClick}>Tickets</Link></li>
    </ul>
  );

  const UserActions = ({ onLinkClick }) => (
    <ul className="flex items-center space-x-4">
      {isLoggedIn ? (
        <li className="relative" ref={dropdownRef}> 
          <button onClick={toggleDropdown} className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <img src='/user.png' alt='Profile' className="w-8 h-8 rounded-full" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20">
              <Link to="/dashboard" onClick={() => { setIsDropdownOpen(false); onLinkClick(); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</Link>
              <Link to="/change-password" onClick={() => { setIsDropdownOpen(false); onLinkClick(); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Change Password</Link>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
            </div>
          )}
        </li>
      ) : (
        <>
          <li><Link to="/login" onClick={onLinkClick} className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors duration-200">Login</Link></li>
          <li><Link to="/register" onClick={onLinkClick} className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded-md transition-colors duration-200">Register</Link></li>
        </>
      )}
      <li>
        <button onClick={() => { toggleTheme(); onLinkClick(); }} className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
          {theme === 'light' ? (
            <img src='/dark.png' alt='Dark Mode' className="w-6 h-6" />
          ) : (
            <img src='/light.png' alt='Light Mode' className="w-6 h-6" />
          )}
        </button>
      </li>
    </ul>
  );

  return (
    <header className="bg-gray-800 text-white p-4 dark:bg-gray-900">
      <div className="container mx-auto flex justify-between items-center relative"> {/* Added relative here */}
        {/* Left Section: Mobile Menu Button and Logo */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button (only on mobile) */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              {/* Hamburger Icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
          {/* Logo (always visible, on the left) */}
          <h1 className="text-2xl font-bold">
            <Link to="/"><img src='/AFCON_Morocco_2025_Official_Logo_29-removebg-preview.png' alt='' className="w-12 h-12"/></Link>
          </h1>
        </div>

        {/* Center Section: Desktop Main Navigation */}
        <nav className="hidden md:block md:absolute md:left-1/2 md:transform md:-translate-x-1/2"> {/* Centered for desktop */}
          <MainNavLinks onLinkClick={() => {}} />
        </nav>

        {/* Right Section: Desktop User Actions */}
        <nav className="hidden md:block">
          <UserActions onLinkClick={() => {}} />
        </nav>
      </div>

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="fixed inset-0 bg-gray-800 bg-opacity-95 z-40 md:hidden">
          <div className="flex justify-end p-4">
            <button onClick={toggleMobileMenu} className="text-white p-2 focus:outline-none">
              {/* Close Icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <ul className="flex flex-col items-center space-y-4 text-xl">
            <MainNavLinks onLinkClick={() => setIsMobileMenuOpen(false)} />
            <UserActions onLinkClick={() => setIsMobileMenuOpen(false)} />
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
