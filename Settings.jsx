import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Shield, Bell, Save, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Settings = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.put('/auth/profile', {
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      login(data);
      toast.success('Profile updated successfully!');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Account Settings</h1>
          <p className="text-neutral-500 mt-2 font-medium">Manage your digital identity and security protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 text-center overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-purple-600/20 to-indigo-600/20"></div>
            <div className="relative mt-4">
              <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-purple-500 to-indigo-500 mx-auto border-4 border-[#09090b] shadow-2xl flex items-center justify-center text-4xl font-black text-white group cursor-pointer relative">
                {user?.name?.charAt(0)}
                <div className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={24} />
                </div>
              </div>
              <h2 className="mt-6 text-2xl font-black text-white">{user?.name}</h2>
              <p className="text-purple-400 font-bold uppercase tracking-widest text-[10px] mt-1">{user?.role}</p>
            </div>
            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
               <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  <Shield size={14} className="text-purple-500" />
                  Verified Citizen
               </div>
            </div>
          </div>
        </div>

        {/* Main Forms */}
        <div className="lg:col-span-2 space-y-8">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl"
           >
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                 <User className="text-purple-500" />
                 Personal Information
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Full Name</label>
                       <input 
                         type="text" 
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-purple-500 outline-none font-bold"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Email Address</label>
                       <input 
                         type="email" 
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-purple-500 outline-none font-bold"
                       />
                    </div>
                 </div>

                 <div className="h-px w-full bg-white/5 my-4"></div>

                 <h3 className="text-xl font-bold text-white pt-4 mb-8 flex items-center gap-3">
                    <Lock className="text-indigo-500" />
                    Security Update
                 </h3>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Current Password</label>
                       <input 
                         type="password" 
                         placeholder="Enter current password to verify"
                         value={formData.currentPassword}
                         onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                         className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-purple-500 outline-none font-bold"
                       />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">New Password</label>
                          <input 
                            type="password" 
                            value={formData.newPassword}
                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-purple-500 outline-none font-bold"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                          <input 
                            type="password" 
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-purple-500 outline-none font-bold"
                          />
                       </div>
                    </div>
                 </div>

                 <button 
                   type="submit" 
                   disabled={isLoading}
                   className="mt-10 w-full py-5 bg-white text-black rounded-[2rem] font-black text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                    <Save size={20} />
                    {isLoading ? 'Synchronizing...' : 'Save Changes'}
                 </button>
              </form>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
