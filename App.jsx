import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Dashboard from './pages/Dashboard';
import QRScanner from './pages/QRScanner';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isScanner = location.pathname === '/scanner';
  const hideNavbar = isAuthPage || isDashboard || isScanner;
  const hideFooter = isAuthPage || isDashboard || isScanner;

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-300 font-sans selection:bg-purple-500/30">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }} 
      />
      {!hideNavbar && <Navbar />}
      
      <main className={`${!hideNavbar ? 'pt-20' : ''} min-h-screen`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/scanner" element={<QRScanner />} />
        </Routes>
      </main>
      
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;

