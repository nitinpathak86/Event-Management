import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Menu, X, Rocket, Sparkles, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToAnchor = (anchor) => {
    const id = anchor.replace('/#', '');
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavClick = (e, link) => {
    if (link.path.includes('#')) {
      e.preventDefault();
      setIsOpen(false);
      
      if (location.pathname === '/') {
        scrollToAnchor(link.path);
      } else {
        navigate('/');
        setTimeout(() => scrollToAnchor(link.path), 100);
      }
    } else {
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Discover', path: '/events' },
    { name: 'Features', path: '/#features' },
    { name: 'Pricing', path: '/#pricing' },
    { name: 'Contact', path: '/#contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#030014]/40 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-3 flex items-center justify-between shadow-2xl relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-tr from-purple-500 to-indigo-500 p-2 rounded-xl text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:scale-110 transition-transform">
              <Calendar size={20} />
            </div>
            <span className="text-xl font-bold text-white tracking-tighter">EventSphere</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => handleNavClick(e, link)}
                className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-purple-400 ${
                  isActive(link.path) ? 'text-white underline underline-offset-8 decoration-purple-500 decoration-2' : 'text-neutral-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link 
                to="/dashboard" 
                className="flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-white font-bold text-sm hover:bg-white/10 transition-all group"
              >
                <LayoutDashboard size={18} className="text-purple-400" />
                <span>Dashboard</span>
                <Sparkles size={14} className="text-amber-400 group-hover:rotate-12 transition-transform" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-neutral-400 hover:text-white transition-colors">Sign In</Link>
                <Link 
                  to="/register" 
                  className="px-8 py-2.5 bg-white text-black rounded-full font-bold text-sm hover:bg-neutral-200 transition-all flex items-center gap-2 group"
                >
                  Join Now
                  <Rocket size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu (Expanded) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-28 left-4 right-4 bg-[#030014]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 md:hidden shadow-2xl z-40"
            >
              <div className="flex flex-col items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-xl font-black text-white uppercase tracking-widest hover:text-purple-400 transition-colors"
                    onClick={(e) => handleNavClick(e, link)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="h-px w-full bg-white/5"></div>
                {user ? (
                   <Link 
                    to="/dashboard" 
                    className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black text-center"
                    onClick={() => setIsOpen(false)}
                   >
                     My Dashboard
                   </Link>
                ) : (
                  <div className="flex flex-col gap-4 w-full">
                    <Link 
                      to="/login"
                      className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register"
                      className="w-full py-5 bg-white text-black rounded-2xl font-black text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
