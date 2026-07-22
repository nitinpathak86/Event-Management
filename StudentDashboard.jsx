import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Calendar as CalendarIcon, Clock, MapPin, Download, Share2, ExternalLink, QrCode, Search, Filter, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

const StudentDashboard = ({ user }) => {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const { data } = await api.get('/registrations/my');
        setRegistrations(data);
      } catch (error) {
        console.error('Failed to fetch registrations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const downloadTicket = (reg) => {
    const doc = new jsPDF();
    
    // Aesthetic Ticket Design in PDF
    doc.setFillColor(3, 0, 20); // Dark background
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('EVENTSPHERE TICKET', 105, 40, { align: 'center' });
    
    doc.setDrawColor(168, 85, 247);
    doc.setLineWidth(1);
    doc.line(20, 50, 190, 50);

    doc.setFontSize(18);
    doc.text(reg.event.title, 20, 70);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 200);
    doc.text(`Attendee: ${user.name}`, 20, 85);
    doc.text(`Date: ${new Date(reg.event.date).toLocaleString()}`, 20, 95);
    doc.text(`Venue: ${reg.event.venue}`, 20, 105);
    doc.text(`Booking ID: ${reg._id}`, 20, 115);

    // QR Code Placeholder or Actual (using image if available)
    if (reg.qrCodeUrl) {
      doc.addImage(reg.qrCodeUrl, 'PNG', 75, 130, 60, 60);
    }
    
    doc.setFontSize(10);
    doc.text('Please present this QR code at the entrance.', 105, 200, { align: 'center' });
    
    doc.save(`Ticket-${reg.event.title.replace(/\s+/g, '-')}.pdf`);
    toast.success('Your ticket has been generated!');
  };

  const handleShare = async (event) => {
    const shareData = {
      title: event.title,
      text: `Check out this amazing event: ${event.title}`,
      url: `${window.location.origin}/events/${event._id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Your Universe</h1>
          <p className="text-neutral-500 mt-2 font-medium">Managing your journey through ${registrations.length} epic experiences.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
              <input 
                type="text" 
                placeholder="Find a ticket..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:border-purple-500 transition-all outline-none w-64"
              />
           </div>
           <Link to="/events" className="p-3.5 bg-white text-black rounded-2xl hover:scale-105 transition-all shadow-xl">
              <CalendarIcon size={20} />
           </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/5 p-8 rounded-[2.5rem] border border-white/10 flex items-center gap-6 group hover:border-purple-500/30 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
               <Ticket size={28} />
            </div>
            <div>
               <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Active Tickets</p>
               <p className="text-4xl font-black text-white">{registrations.length}</p>
            </div>
         </div>
         <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-8 rounded-[2.5rem] border border-white/10 flex items-center gap-6 group hover:border-emerald-500/30 transition-all text-neutral-500">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 opacity-50">
               <CheckCircle size={28} />
            </div>
            <div>
               <p className="text-sm font-bold uppercase tracking-widest">Attended</p>
               <p className="text-4xl font-black text-white opacity-50">0</p>
            </div>
         </div>
      </div>

      {/* Tickets Gallery */}
      <div>
        <div className="flex items-center gap-4 mb-8">
           <h2 className="text-2xl font-black text-white">My Active Tickets</h2>
           <div className="h-px flex-1 bg-white/5"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {isLoading ? (
            Array(2).fill(0).map((_, i) => (
               <div key={i} className="h-64 bg-white/5 rounded-[2.5rem] animate-pulse border border-white/10"></div>
            ))
          ) : filteredRegistrations.length === 0 ? (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
               <QrCode size={64} className="mx-auto text-neutral-700 mb-6" />
               <p className="text-xl font-bold text-neutral-500 mb-6">No matching registrations found.</p>
               <Link to="/events" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:shadow-2xl transition-all">Explore Events</Link>
            </div>
          ) : filteredRegistrations.map((reg) => (
            <motion.div 
              key={reg._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0f0f12] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col sm:flex-row group hover:border-purple-500/30 transition-all"
            >
              <div className="w-full sm:w-56 h-56 sm:h-auto overflow-hidden relative">
                <img src={reg.event.posterImage} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                   <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                      {reg.event.category}
                   </span>
                </div>
              </div>

              <div className="p-8 flex-grow flex flex-col justify-between relative">
                {/* Decorative cut-out for ticket effect */}
                <div className="hidden sm:block absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#09090b] rounded-full border border-white/10 shadow-inner"></div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-black text-white group-hover:text-purple-400 transition-colors line-clamp-2 leading-tight">{reg.event.title}</h3>
                    <div className="flex gap-2">
                       <button onClick={() => handleShare(reg.event)} className="p-2 bg-white/5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-all"><Share2 size={16}/></button>
                       <Link to={`/events/${reg.event._id}`} className="p-2 bg-white/5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-all"><ExternalLink size={16}/></Link>
                    </div>
                  </div>
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-sm font-medium text-neutral-400">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><CalendarIcon size={14} className="text-purple-400" /></div>
                      <span>{new Date(reg.event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-neutral-400">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><MapPin size={14} className="text-purple-400" /></div>
                      <span className="truncate">{reg.event.venue}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between items-center bg-white/[0.03] p-4 rounded-3xl border border-white/5">
                  <button 
                    onClick={() => downloadTicket(reg)}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white hover:text-purple-400 transition-colors"
                  >
                    <Download size={16} />
                    Download PDF
                  </button>
                  <div className="bg-white p-1.5 rounded-xl shadow-2xl transform group-hover:rotate-6 transition-transform">
                    <img src={reg.qrCodeUrl} alt="QR" className="w-12 h-12 grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
