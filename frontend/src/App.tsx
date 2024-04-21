import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Home from './pages/Home.tsx';
import SecondYear from './pages/SecondYear.tsx';
import ThirdYear from './pages/ThirdYear.tsx';
import FourthYear from './pages/FourthYear.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import { useAuthContext } from './context/AuthContext.tsx';
import FirstYear from "./pages/FirstYear.tsx";
import Notifications from "./pages/Notifications.tsx";

const App: React.FC = () => {
  const {state}=useAuthContext()
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/first-year" element={<FirstYear />} />
          <Route path="/second-year" element={<SecondYear />} />
          <Route path="/third-year" element={<ThirdYear />} />
          <Route path="/fourth-year" element={<FourthYear />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin-login" element={!state?.user ? <AdminLogin /> : <Navigate to="/" /> }  />
        </Routes>
      </div>
      <ToastContainer position="top-right" />
    </Router>
  );
};

export default App;
