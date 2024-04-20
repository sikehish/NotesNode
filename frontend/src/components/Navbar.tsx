import React from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  to: string;
  children: React.ReactNode;
}

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-white text-2xl font-bold mr-4">NotesNode</Link>
          <ul className="flex items-start justify-center space-x-4">
            <NavItem to="/second-year">2nd Year</NavItem>
            <NavItem to="/third-year">3rd Year</NavItem>
            <NavItem to="/fourth-year">4th Year</NavItem>
            <NavItem to="/admin-login">Login</NavItem>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const NavItem: React.FC<NavItemProps> = ({ to, children }) => {
  return (
    <li>
      <Link to={to} className="text-white hover:text-gray-300">{children}</Link>
    </li>
  );
};

export default Navbar;
