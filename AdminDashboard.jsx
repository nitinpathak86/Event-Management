import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Users, Calendar as CalendarIcon, ShieldCheck, AlertCircle, CheckCircle2, XCircle, ArrowUpRight, TrendingUp, UserCheck, Activity, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = ({ user }) => {
  const [pending, setPending] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalOrganizers: 0,
    pendingApprovals: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, pendingRes] = await Promise.all([
        api.get('/events/stats/admin'),
        api.get('/events/pending')
      ]);
      
      const data = statsRes.data;
      setPending(pendingRes.data);
      setRecentUsers(data.recentUsers);
      
      setStats({
        totalUsers: data.totalUsers,
        totalEvents: data.totalEvents,
        totalOrganizers: data.recentUsers.filter(u => u.role === 'Organizer').length, // This is a fallback
        pendingApprovals: data.pendingEvents
      });

      // Prepare Chart Data
      const labels = data.categoryStats.map(s => s._id);
      const counts = data.categoryStats.map(s => s.count);
      
      setChartData({
        labels: labels.length > 0 ? labels : ['No Data'],
        datasets: [{
          label: 'Events',
          data: counts.length > 0 ? counts : [0],
          backgroundColor: [
            'rgba(168, 85, 247, 0.6)',
            'rgba(99, 102, 241, 0.6)',
            'rgba(16, 185, 129, 0.6)',
            'rgba(245, 158, 11, 0.6)'
          ],
          borderRadius: 12,
          borderSkipped: false,
        }]
      });

    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    try {
      await api.put(`/events/${eventId}`, { approvalStatus: 'Approved' });
      toast.success('Event approved successfully!');
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve event');
    }
  };

  const handleReject = async (eventId) => {
    try {
      await api.put(`/events/${eventId}`, { approvalStatus: 'Rejected' });
      toast.success('Event rejected.');
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject event');
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#000',
        padding: 12,
        borderRadius: 12,
        displayColors: false
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#71717a', font: { weight: 'bold' } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a' } }
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">System Control</h1>
          <p className="text-neutral-500 mt-2 font-medium">Monitoring platform health and orchestrating growth.</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-white tracking-widest uppercase">Live Node</span>
           </div>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Reach", value: stats.totalUsers, icon: Users, color: "bg-indigo-500/10 text-indigo-400" },
          { label: "Active Nodes", value: stats.totalEvents, icon: Activity, color: "bg-blue-500/10 text-blue-400" },
          { label: "Organizers", value: stats.totalOrganizers, icon: UserCheck, color: "bg-emerald-500/10 text-emerald-400" },
          { label: "Waitlist", value: pending.length, icon: AlertCircle, color: "bg-amber-500/10 text-amber-400" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl"
          >
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-6`}>
              <stat.icon size={24} />
            </div>
            <p className="text-xs font-black text-neutral-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Moderation Queue */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8">
           <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-white">Approval Queue</h2>
              <span className="px-4 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                Moderation Required
              </span>
           </div>

           <div className="space-y-4">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse"></div>)
              ) : pending.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                   <CheckCircle2 size={48} className="mx-auto text-neutral-700 mb-4" />
                   <p className="text-neutral-500 font-bold">Queue is empty. Everything is perfect.</p>
                </div>
              ) : (
                pending.map((event) => (
                  <motion.div 
                    layout
                    key={event._id} 
                    className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 group hover:bg-white/[0.05] transition-all"
                  >
                    <div className="flex items-center gap-6 w-full md:w-auto">
                       <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                          <img src={event.posterImage} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div>
                          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors uppercase tracking-tight">{event.title}</h3>
                          <div className="flex gap-4 text-xs font-bold text-neutral-500">
                             <span className="flex items-center gap-1"><CalendarIcon size={12}/> {new Date(event.date).toLocaleDateString()}</span>
                             <span className="flex items-center gap-1 text-purple-400"><TrendingUp size={12}/> {event.category}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                       <button onClick={() => handleApprove(event._id)} className="flex-1 md:flex-none px-6 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all">Approve</button>
                       <button onClick={() => handleReject(event._id)} className="flex-1 md:flex-none px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all">Reject</button>
                    </div>
                  </motion.div>
                ))
              )}
           </div>
        </div>

        {/* Analytics Summary */}
        <div className="space-y-8">
           <div className="bg-black/40 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl h-[400px] flex flex-col">
              <h2 className="text-xl font-bold text-white mb-8">Category Pulse</h2>
              <div className="flex-1 w-full">
                 <Bar data={chartData} options={chartOptions} />
              </div>
           </div>

           <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8">
              <h2 className="text-xl font-bold text-white mb-6">Recent Citizens</h2>
              <div className="space-y-4">
                 {recentUsers.map((u, i) => (
                    <div key={i} className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold">
                          {u.name.charAt(0)}
                       </div>
                       <div className="flex-1">
                          <p className="text-sm font-bold text-white">{u.name}</p>
                          <p className={`text-[10px] font-black uppercase tracking-tighter ${u.role === 'Organizer' ? 'text-purple-400' : 'text-neutral-500'}`}>{u.role}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
