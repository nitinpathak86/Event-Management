import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, MapPin, Users, ArrowRight, Sparkles, SlidersHorizontal, Map as MapIcon, Grid, List as ListIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        setEvents(data.filter(ev => ev.approvalStatus === 'Approved'));
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ev.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || ev.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Other'];

  return (
    <div className="min-h-screen bg-[#030014] pb-24">
      {/* Search & Filter Header */}
      <div className="relative pt-12 pb-20 border-b border-white/5">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-8"
            >
               <Sparkles size={16} className="text-purple-400" />
               <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Discover Exclusive Experiences</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-12">Epic discovery <br/><span className="text-neutral-500">awaits you.</span></h1>

            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
               <div className="flex-1 relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search by event name, venue, or keywords..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] text-white focus:outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/20 shadow-2xl transition-all font-medium"
                  />
               </div>
               <div className="flex gap-2">
                  <button className="px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-white hover:bg-white/10 transition-all flex items-center gap-3">
                     <SlidersHorizontal size={20} className="text-purple-400" />
                     <span className="font-bold">Filters</span>
                  </button>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {/* Category Pills */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
           <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                    selectedCategory === cat 
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                    : 'bg-white/5 text-neutral-500 border-white/5 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
           
           <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-neutral-500'}`}
              >
                <Grid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-neutral-500'}`}
              >
                <ListIcon size={20} />
              </button>
           </div>
        </div>

        {/* Results Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {Array(6).fill(0).map((_, i) => (
                 <div key={i} className="aspect-[4/5] bg-white/5 rounded-[3rem] animate-pulse border border-white/5"></div>
               ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-32 text-center"
            >
               <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                  <Search size={32} className="text-neutral-700" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
               <p className="text-neutral-500 max-w-xs mx-auto">We couldn't find any events matching your criteria. Try adjusting your filters.</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}
            >
              {filteredEvents.map((event, i) => (
                <Link to={`/events/${event._id}`} key={event._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -10 }}
                    className={`group relative h-full flex flex-col bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden hover:border-purple-500/30 hover:bg-white/[0.04] transition-all ${viewMode === 'list' ? 'md:flex-row' : ''}`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'md:w-80 h-full' : 'aspect-[4/3]'} overflow-hidden shrink-0`}>
                       <img 
                        src={event.posterImage || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070'} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt={event.title} 
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                       <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                          <span className="px-4 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                             {event.category}
                          </span>
                       </div>
                       {event.price > 0 && (
                         <div className="absolute bottom-6 left-6">
                            <span className="px-4 py-1.5 bg-purple-600 text-white rounded-xl text-sm font-black shadow-2xl">
                               ${event.price}
                            </span>
                         </div>
                       )}
                    </div>

                    <div className="p-8 flex flex-col justify-between flex-grow">
                       <div>
                          <h3 className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors mb-4 line-clamp-2 leading-tight">
                            {event.title}
                          </h3>
                          <div className="space-y-3">
                             <div className="flex items-center gap-3 text-neutral-500 text-sm font-bold uppercase tracking-widest">
                                <Calendar size={16} className="text-purple-500/50" />
                                <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                             </div>
                             <div className="flex items-center gap-3 text-neutral-500 text-sm font-bold uppercase tracking-widest">
                                <MapPin size={16} className="text-purple-500/50" />
                                <span className="truncate">{event.venue}</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs font-black text-neutral-500 uppercase tracking-widest">
                             <Users size={16} className="text-purple-400" />
                             <span>{event.currentParticipants}/{event.maxParticipants} Spots</span>
                          </div>
                          <div className="p-3 bg-white/5 rounded-2xl text-white group-hover:bg-purple-600 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                             <ArrowRight size={20} />
                          </div>
                       </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Events;
