import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket as TicketIcon, Calendar, Clock, MapPin, Download, Share2, Search, QrCode, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

const Tickets = () => {
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
    doc.text(`Date: ${new Date(reg.event.date).toLocaleString()}`, 20, 95);
    doc.text(`Venue: ${reg.event.venue}`, 20, 105);
    if (reg.qrCodeUrl) {
      doc.addImage(reg.qrCodeUrl, 'PNG', 75, 130, 60, 60);
    }
    doc.save(`Ticket-${reg.event.title.replace(/\s+/g, '-')}.pdf`);
    toast.success('Your ticket has been generated!');
  };

  const filtered = registrations.filter(reg => 
    reg.event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Digital Wallet</h1>
          <p className="text-neutral-500 mt-2 font-medium">Access your golden tickets and secure entry protocols.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input 
            type="text" 
            placeholder="Search tickets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:border-purple-500 outline-none transition-all font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isLoading ? (
           Array(2).fill(0).map((_, i) => <div key={i} className="h-64 bg-white/5 rounded-[3rem] animate-pulse border border-white/10"></div>)
        ) : filtered.length === 0 ? (
           <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
              <QrCode size={64} className="mx-auto text-neutral-700 mb-6" />
              <p className="text-xl font-bold text-neutral-500 mb-6">Your wallet is currently empty.</p>
              <Link to="/events" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:shadow-2xl transition-all">Explore Events</Link>
           </div>
        ) : (
          filtered.map((reg) => (
            <motion.div 
               key={reg._id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-[#0f0f12] rounded-[3rem] border border-white/10 overflow-hidden flex flex-col sm:flex-row group hover:border-purple-500/30 transition-all shadow-2xl relative"
            >
               {/* Ticket Cutout Effect */}
               <div className="hidden sm:block absolute left-[35%] top-1/2 -translate-y-1/2 w-8 h-8 bg-[#09090b] rounded-full -ml-4 z-10 border border-white/10 shadow-inner"></div>
               
               <div className="w-full sm:w-[35%] h-48 sm:h-auto bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex flex-col items-center justify-center p-6 border-r border-dashed border-white/10">
                  <div className="bg-white p-3 rounded-2xl shadow-2xl group-hover:rotate-6 transition-transform">
                     <img src={reg.qrCodeUrl} className="w-24 h-24 grayscale group-hover:grayscale-0 transition-all" alt="QR" />
                  </div>
                  <p className="mt-4 text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Scan at Entry</p>
               </div>

               <div className="p-8 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                     <div className="flex justify-between items-start">
                        <h3 className="text-xl font-black text-white group-hover:text-purple-400 transition-colors line-clamp-2 leading-tight uppercase tracking-tight">{reg.event.title}</h3>
                        <Link to={`/events/${reg.event._id}`} className="p-2 bg-white/5 rounded-xl text-neutral-400 hover:text-white transition-all"><ExternalLink size={16}/></Link>
                     </div>
                     
                     <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-3 text-sm font-bold text-neutral-500">
                           <Calendar size={14} className="text-purple-500" />
                           <span>{new Date(reg.event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-neutral-500">
                           <MapPin size={14} className="text-purple-500" />
                           <span className="truncate">{reg.event.venue}</span>
                        </div>
                     </div>
                  </div>

                  <button 
                     onClick={() => downloadTicket(reg)}
                     className="mt-8 w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
                  >
                     <Download size={16} />
                     Generate PDF
                  </button>
               </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tickets;
