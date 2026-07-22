import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Search, Filter, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const MyEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const endpoint = user.role === 'Student' ? '/registrations/my' : '/events/my';
        const { data } = await api.get(endpoint);
        // If student, registrations are returned, need to extract event
        const processedEvents = user.role === 'Student' ? data.map(r => r.event) : data;
        setEvents(processedEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [user.role]);

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            {user.role === 'Student' ? 'Attending Events' : 'Managing Events'}
          </h1>
          <p className="text-neutral-500 mt-2 font-medium">Tracking your journey through the EventSphere.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
              <input 
                type="text" 
                placeholder="Search events..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:border-purple-500 outline-none transition-all font-bold"
              />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isLoading ? (
           Array(4).fill(0).map((_, i) => (
             <div key={i} className="h-64 bg-white/5 rounded-[2.5rem] animate-pulse border border-white/10"></div>
           ))
        ) : filteredEvents.length === 0 ? (
           <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
              <Calendar size={64} className="mx-auto text-neutral-700 mb-6" />
              <p className="text-xl font-bold text-neutral-500 mb-6">No events found in your collection.</p>
              <Link to="/events" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:shadow-2xl transition-all">Explore Marketplace</Link>
           </div>
        ) : (
          filteredEvents.map((event, i) => (
            <motion.div 
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0f0f12] rounded-[3rem] border border-white/10 overflow-hidden group hover:border-purple-500/30 transition-all flex flex-col md:flex-row shadow-2xl"
            >
              <div className="w-full md:w-56 h-56 md:h-auto overflow-hidden relative">
                <img src={event.posterImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors line-clamp-1">{event.title}</h3>
                    {user.role === 'Organizer' && (
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${event.approvalStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {event.approvalStatus}
                       </span>
                    )}
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-neutral-500">
                      <Clock size={16} className="text-purple-500" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-neutral-500">
                      <MapPin size={16} className="text-purple-500" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-lg bg-white/5 border border-[#0f0f12] flex items-center justify-center text-[10px] font-bold text-neutral-500">{i}</div>)}
                      </div>
                      <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">+{event.currentParticipants || 0} Attending</span>
                   </div>
                   <Link to={`/events/${event._id}`} className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                      <ArrowRight size={20} />
                   </Link>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyEvents;
