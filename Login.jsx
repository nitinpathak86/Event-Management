import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Calendar, Sparkles, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      toast.success('Welcome back to EventSphere!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#030014] overflow-hidden">
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070" 
          className="w-full h-full object-cover opacity-40 scale-105"
          alt="Login Background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#030014] via-[#030014]/80 to-purple-900/40"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="bg-gradient-to-tr from-purple-500 to-indigo-500 p-2 rounded-xl text-white group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all">
                <Calendar size={28} />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">EventSphere</span>
            </Link>
            <h2 className="text-4xl font-extrabold text-white mb-2">Welcome Back</h2>
            <p className="text-neutral-400 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-neutral-400">Password</label>
                <a href="#" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors">Forgot Password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-white text-black rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? 'Authenticating...' : (
                <>
                  Sign In
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center flex flex-col gap-4">
             <p className="text-neutral-400 font-medium">
               Don't have an account? <Link to="/register" className="text-white font-bold hover:underline underline-offset-4">Create Account</Link>
             </p>
             <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-neutral-500 uppercase tracking-widest font-bold">
               <Shield size={12} className="text-purple-500" />
               SECURE SSL ENCRYPTION
             </div>
          </div>
        </div>
      </motion.div>

      {/* Modern floating elements */}
      <div className="absolute bottom-10 right-10 flex items-center gap-4 py-3 px-6 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 animate-vertical-float">
         <Sparkles className="text-purple-400" size={20} />
         <span className="text-sm font-bold text-white tracking-wide">Enterprise Grade Security</span>
      </div>
    </div>
  );
};

export default Login;
