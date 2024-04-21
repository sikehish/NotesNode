import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

interface NavItemProps {
  to: string;
  children: React.ReactNode;
}

const Navbar: React.FC = () => {
  const { state, dispatch } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-white text-2xl font-bold mr-4">
            NotesNode
          </Link>

          {/* Hamburger Icon */}
          <button
            className="text-white block md:hidden focus:outline-none"
            onClick={toggleMenu}
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>

          {/* Nav Items */}
          <ul className={`md:flex items-center space-x-4 ${isOpen ? 'block' : 'hidden'}`}>
            <NavItem to="/">Home</NavItem>
            <NavItem to="/first-year">1st Year</NavItem>
            <NavItem to="/second-year">2nd Year</NavItem>
            <NavItem to="/third-year">3rd Year</NavItem>
            <NavItem to="/fourth-year">4th Year</NavItem>
            <NavItem to="/notifications">Notifications</NavItem>
            {state?.user ? (
              <button
                className="text-white hover:text-gray-300"
                onClick={() => {
                  toast.success('Logged out!');
                  dispatch({ type: 'LOGOUT' });
                  localStorage.removeItem('user');
                }}
              >
                Logout
              </button>
            ) : (
              <NavItem to="/admin-login">Login</NavItem>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

const NavItem: React.FC<NavItemProps> = ({ to, children }) => {
  return (
    <li>
      <Link to={to} className="text-white hover:text-gray-300">
        {children}
      </Link>
    </li>
  );
};

export default Navbar;
