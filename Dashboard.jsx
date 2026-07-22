import React from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, LayoutDashboard, Settings as SettingsIcon, User as UserIcon, LogOut, Search, Ticket, PlusCircle, Bell, ScanLine } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import OrganizerDashboard from '../components/dashboards/OrganizerDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import MyEvents from './MyEvents';
import Tickets from './Tickets';
import Settings from './Settings';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    return location.pathname.includes(path) && path !== '/dashboard';
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Events', path: '/dashboard/my-events', icon: Calendar },
    ...(user.role === 'Organizer' ? [{ name: 'Create Event', path: '/dashboard/create', icon: PlusCircle }] : []),
    ...(user.role === 'Organizer' ? [{ name: 'QR Scanner', path: '/scanner', icon: ScanLine }] : []),
    { name: 'Tickets', path: '/dashboard/tickets', icon: Ticket },
    { name: 'Settings', path: '/dashboard/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-[#030014]/80 border-r border-white/10 backdrop-blur-2xl shrink-0 h-screen sticky top-0 z-20">
        <div className="p-8 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-tr from-purple-500 to-indigo-500 p-2.5 rounded-xl text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:scale-110 transition-transform">
              <Calendar size={24} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">EventSphere</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          <p className="px-4 text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-4 opacity-50">Main Menu</p>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-white border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon size={20} className={isActive(item.path) ? 'text-purple-400' : 'group-hover:scale-110 transition-transform'} />
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-white ring-2 ring-purple-500/20">
              <UserIcon size={20} className="text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">{user.role}</p>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-500/10 rounded-lg text-neutral-500 hover:text-red-400 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-24 px-8 flex items-center justify-between sticky top-0 z-10 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5">
          <div className="relative w-96 hidden md:block group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-purple-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search analytics, events, or users..." 
              className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/20 text-sm text-white placeholder-neutral-600 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-6">
             <button className="relative p-2.5 text-neutral-400 hover:text-white bg-white/5 rounded-xl border border-white/10 transition-all hover:scale-105">
               <Bell size={20} />
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#09090b]"></span>
             </button>
             <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-white">Current Session</p>
               <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">System Online</p>
             </div>
          </div>
        </header>

        <div className="p-8 pb-32 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {user.role === 'Student' && <StudentDashboard user={user} />}
                    {user.role === 'Organizer' && <OrganizerDashboard user={user} />}
                    {user.role === 'Admin' && <AdminDashboard user={user} />}
                 </motion.div>
              } />
              <Route path="/my-events" element={<MyEvents />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/create" element={user.role === 'Organizer' ? <OrganizerDashboard user={user} openModalAutomatically={true} /> : <div className="text-white">Unauthorized</div>} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

