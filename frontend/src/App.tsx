import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import SecondYear from './pages/SecondYear.tsx';
import ThirdYear from './pages/ThirdYear.tsx';
import FourthYear from './pages/FourthYear.tsx';
import AdminLogin from './pages/AdminLogin.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/second-year" element={<SecondYear />} />
          <Route path="/third-year" element={<ThirdYear />} />
          <Route path="/fourth-year" element={<FourthYear />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
