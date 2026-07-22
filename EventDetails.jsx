import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Share2, Info, ArrowLeft, ShieldCheck, Zap, Star, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (error) {
        toast.error('Event not found');
        navigate('/events');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleBooking = async () => {
    setIsBooking(true);
    try {
      await api.post('/registrations', { eventId: id, tickets: 1 });
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#6366f1', '#ffffff']
      });
      toast.success('Registration Successful! Check your dashboard for the ticket.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#030014]">
      <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030014]">
      {/* Hero Header */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img src={event.posterImage} className="w-full h-full object-cover scale-105 blur-[2px] opacity-40" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/60 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/events')}
              className="mb-8 flex items-center gap-2 text-neutral-400 hover:text-white font-bold transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Back to Events
            </motion.button>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-8"
            >
              <div>
                <span className="px-4 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-black uppercase tracking-widest rounded-full mb-4 inline-block">
                  {event.category}
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">{event.title}</h1>
                <div className="flex flex-wrap gap-6 text-neutral-400 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-purple-500" />
                    <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-purple-500" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                 <button onClick={handleShare} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all flex items-center gap-2">
                    <Share2 size={20} />
                 </button>
                 <button 
                  onClick={handleBooking}
                  disabled={isBooking || event.currentParticipants >= event.maxParticipants}
                  className="px-10 py-4 bg-white text-black rounded-2xl font-black text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-all disabled:opacity-50"
                 >
                   {isBooking ? 'Processing...' : event.currentParticipants >= event.maxParticipants ? 'Fully Booked' : 'Reserve Spot Now'}
                 </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-12">
            <div>
               <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                 <Info className="text-purple-500" />
                 About the Event
               </h3>
               <p className="text-lg text-neutral-400 leading-relaxed font-light">
                 {event.description}
               </p>
            </div>

            {event.guidelines && event.guidelines.length > 0 && (
              <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] backdrop-blur-3xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <ShieldCheck className="text-emerald-400" />
                  Experience Guidelines
                </h3>
                <ul className="space-y-4">
                  {event.guidelines.map((g, i) => (
                    <li key={i} className="flex items-start gap-4 text-neutral-400 font-medium">
                       <CheckCircle size={18} className="text-emerald-500/50 mt-1 shrink-0" />
                       <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar cards */}
          <div className="space-y-8">
             <div className="p-8 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl">
                <h4 className="text-sm font-black text-neutral-500 uppercase tracking-widest mb-6">Attendance Status</h4>
                <div className="space-y-6">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-3xl font-black text-white">{event.currentParticipants}</p>
                         <p className="text-xs font-bold text-neutral-500 uppercase">Confirmed</p>
                      </div>
                      <div className="text-right">
                         <p className="text-3xl font-black text-neutral-700">{event.maxParticipants}</p>
                         <p className="text-[10px] font-bold text-neutral-600 uppercase">Capacity</p>
                      </div>
                   </div>
                   <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      />
                   </div>
                   <p className="text-xs text-neutral-500 font-medium italic">
                      Only {event.maxParticipants - event.currentParticipants} spots remaining in this category.
                   </p>
                </div>
             </div>

             <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem]">
                <h4 className="text-sm font-black text-neutral-500 uppercase tracking-widest mb-6">Organizer Info</h4>
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
                      {event.organizerInfo?.name?.charAt(0) || 'O'}
                   </div>
                   <div>
                      <p className="text-white font-bold">{event.organizerInfo?.name || 'System Organizer'}</p>
                      <p className="text-xs text-neutral-500">{event.organizerInfo?.email || 'contact@eventsphere.com'}</p>
                   </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs text-neutral-400 leading-relaxed font-medium">
                  Professional organization committed to delivering premium event experiences with zero friction.
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
