import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import SecondYear from './pages/SecondYear.tsx';
import ThirdYear from './pages/ThirdYear.tsx';
import FourthYear from './pages/FourthYear.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import { ToastContainer } from 'react-toastify';
import { useAuthContext } from './context/AuthContext.tsx';

const App: React.FC = () => {
  const {state}=useAuthContext()
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {state?.user && <Route path="/second-year" element={<SecondYear />} />}
          {state?.user && <Route path="/third-year" element={<ThirdYear />} />}
          {state?.user && <Route path="/fourth-year" element={<FourthYear />} />}
          {!state?.user && <Route path="/admin-login" element={<AdminLogin />} />}
        </Routes>
      </div>
      <ToastContainer position="top-right" />
    </Router>
  );
};

export default App;
