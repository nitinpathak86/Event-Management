import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Plus, Users, Calendar as CalendarIcon, TrendingUp, Edit, Trash2, DollarSign, PlusCircle, X, ShieldCheck, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const OrganizerDashboard = ({ user, openModalAutomatically }) => {
  const [showCreateModal, setShowCreateModal] = useState(openModalAutomatically || false);
  const [myEvents, setMyEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical',
    description: '',
    date: '',
    venue: '',
    maxParticipants: '',
    price: '0',
    guidelines: [],
    currentGuideline: ''
  });
  const [file, setFile] = useState(null);

  const fetchOrganizerData = async () => {
    try {
      setIsLoading(true);
      const [eventsRes, statsRes] = await Promise.all([
        api.get('/events/my'),
        api.get('/events/stats/organizer')
      ]);
      
      setMyEvents(eventsRes.data);
      const stats = statsRes.data;
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const labels = stats.registrationTrend.map(t => monthNames[t._id - 1]);
      const data = stats.registrationTrend.map(t => t.count);

      setChartData({
        labels: labels.length > 0 ? labels : ['No Data'],
        datasets: [{
          label: 'Participants',
          data: data.length > 0 ? data : [0],
          fill: true,
          borderColor: '#a855f7',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          tension: 0.4,
          pointBackgroundColor: '#a855f7',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }]
      });

      setSummaryStats({
        totalEvents: stats.totalEvents,
        totalParticipants: stats.totalParticipants,
        totalRevenue: stats.totalRevenue,
        avgEngagement: '92%' // Placeholder for now
      });

    } catch (error) {
      console.error('Failed to fetch organizer data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerData();
  }, []);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const [summaryStats, setSummaryStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    totalRevenue: 0,
    avgEngagement: '0%'
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#000',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        displayColors: false
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#71717a' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a' } }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'guidelines') {
        data.append(key, JSON.stringify(formData[key]));
      } else if (key !== 'currentGuideline') {
        data.append(key, formData[key]);
      }
    });
    
    if (file) data.append('posterImage', file);

    try {
      await api.post('/events', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Event submitted for approval!');
      setShowCreateModal(false);
      fetchOrganizerData(); // Refresh data
      setFormData({ title: '', category: 'Technical', description: '', date: '', venue: '', maxParticipants: '', price: '0', guidelines: [], currentGuideline: '' });
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addGuideline = () => {
    if (formData.currentGuideline.trim()) {
      setFormData({
        ...formData,
        guidelines: [...formData.guidelines, formData.currentGuideline.trim()],
        currentGuideline: ''
      });
    }
  };

  const removeGuideline = (index) => {
    setFormData({
      ...formData,
      guidelines: formData.guidelines.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Organizer Dashboard</h1>
          <p className="text-neutral-500 mt-2 font-medium">Empowering your vision with real-time intelligence.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3.5 bg-white text-black rounded-2xl font-bold hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] flex items-center gap-2 transition-all"
        >
          <PlusCircle size={20} />
          Create New Event
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Events", value: summaryStats.totalEvents, icon: CalendarIcon, color: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20" },
          { label: "Participants", value: summaryStats.totalParticipants, icon: Users, color: "from-purple-500 to-indigo-500", shadow: "shadow-purple-500/20" },
          { label: "Total Revenue", value: `$${summaryStats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20" },
          { label: "Avg Engagement", value: summaryStats.avgEngagement, icon: TrendingUp, color: "from-orange-500 to-amber-500", shadow: "shadow-orange-500/20" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] backdrop-blur-3xl group hover:border-white/20 transition-all ${stat.shadow}`}
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${stat.color} p-3.5 text-white mb-6 group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon size={28} />
            </div>
            <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-black/40 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">Performance Analytics</h2>
            <select className="bg-white/5 border border-white/10 text-xs font-bold text-white px-4 py-2 rounded-xl outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Live Feed / Active Events */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-8">Active Events</h2>
          <div className="space-y-4 flex-1">
             {isLoading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse"></div>)
             ) : myEvents.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/5 rounded-3xl">
                   <p className="text-neutral-500 text-sm font-medium">No active campaigns.</p>
                </div>
             ) : myEvents.slice(0, 4).map(event => (
                <div key={event._id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex items-center gap-4 group">
                   <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                      <img src={event.posterImage} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{event.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-[10px] text-neutral-500 flex items-center gap-1 font-bold">
                            <Users size={10} className="text-purple-500" />
                            {event.currentParticipants}/{event.maxParticipants}
                         </span>
                         <span className={`text-[10px] font-black uppercase tracking-tighter ${event.approvalStatus === 'Approved' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {event.approvalStatus}
                         </span>
                      </div>
                   </div>
                   <button className="p-2 text-neutral-500 hover:text-white transition-colors"><Edit size={16}/></button>
                </div>
             ))}
          </div>
          <button className="w-full py-4 mt-8 border border-white/10 rounded-2xl text-sm font-bold text-neutral-400 font-bold hover:bg-white/5 transition-all">
            View All Events
          </button>
        </div>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-[#09090b] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-2xl font-black text-white">Create New Masterpiece</h2>
                  <p className="text-neutral-500 text-sm font-medium">Orchestrate your next legendary event.</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-3 bg-white/5 text-neutral-400 hover:text-white rounded-2xl transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto">
                <form onSubmit={handleCreate} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Event Essence (Title)</label>
                       <div className="relative">
                          <PlusCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/50" size={18} />
                          <input type="text" value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} required className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-purple-500 transition-all outline-none font-bold" placeholder="E.g. Neon Nights Summer Festival" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Genre (Category)</label>
                       <select value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-purple-500 transition-all outline-none font-bold [&>option]:bg-[#09090b]">
                          <option>Technical</option>
                          <option>Cultural</option>
                          <option>Sports</option>
                          <option>Other</option>
                       </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">The Narrative (Description)</label>
                    <textarea rows="4" value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} required className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-3xl text-white focus:border-purple-500 transition-all outline-none font-medium leading-relaxed" placeholder="Tell the story of your event..."></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Moment (Date & Time)</label>
                       <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                          <input type="datetime-local" value={formData.date} onChange={(e)=>setFormData({...formData, date: e.target.value})} required className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-purple-500 [color-scheme:dark] outline-none font-bold" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Destination (Venue)</label>
                       <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                          <input type="text" value={formData.venue} onChange={(e)=>setFormData({...formData, venue: e.target.value})} required className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-purple-500 transition-all outline-none font-bold" placeholder="Grand Ballroom, Hall C..." />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Capacity</label>
                       <input type="number" value={formData.maxParticipants} onChange={(e)=>setFormData({...formData, maxParticipants: e.target.value})} required className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-purple-500 transition-all outline-none font-bold" placeholder="500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Entry Fee ($)</label>
                       <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                          <input type="number" value={formData.price} onChange={(e)=>setFormData({...formData, price: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-purple-500 font-bold" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Visual Identity (Poster)</label>
                       <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files[0])} className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-neutral-500 file:mr-4 file:py-1 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer" />
                    </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Guidelines & Protocols</label>
                     <div className="flex gap-4">
                        <input type="text" value={formData.currentGuideline} onChange={(e)=>setFormData({...formData, currentGuideline: e.target.value})} className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-purple-500 font-medium" placeholder="Add an attendee requirement..." onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGuideline())} />
                        <button type="button" onClick={addGuideline} className="px-6 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all">Add</button>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {formData.guidelines.map((g, i) => (
                           <span key={i} className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl text-xs font-bold flex items-center gap-2">
                              {g}
                              <X size={14} className="cursor-pointer hover:text-white" onClick={() => removeGuideline(i)} />
                           </span>
                        ))}
                     </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-xl hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-[1.01] transition-all disabled:opacity-50">
                    {isSubmitting ? 'Architecting your event...' : 'Orchestrate Now'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrganizerDashboard;
