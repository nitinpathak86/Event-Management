import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Users, MapPin, Star, Sparkles, Zap, Shield, CheckCircle, Quote, Play, Mail } from 'lucide-react';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030014] overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 inline-flex items-center gap-2"
        >
          <Sparkles size={16} className="text-purple-400" />
          <span className="text-sm font-medium tracking-wide text-neutral-300">Transforming Event Management</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 text-white leading-tight"
        >
          Discover & Manage <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
            Epic Moments
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-3xl font-light"
        >
          A premium ecosystem designed for seamless orchestration and discovery of world-class events, from tech summits to underground concerts.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-6"
        >
          <Link to="/events" className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-2 group">
            Explore Events
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/register" className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/40 backdrop-blur-md transition-all flex items-center justify-center gap-2">
            Host an Event
          </Link>
        </motion.div>
      </section>

      {/* Experience Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Built for Every Experience</h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">From intimate workshops to global conferences and high-energy music festivals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[300px]">
          {[
            { img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070", title: "Concerts", span: "lg:col-span-2 lg:row-span-2" },
            { img: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070", title: "Conferences", span: "lg:col-span-1 lg:row-span-1" },
            { img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069", title: "Socials", span: "lg:col-span-1 lg:row-span-2" },
            { img: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069", title: "Sports", span: "lg:col-span-1 lg:row-span-1" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`relative rounded-3xl overflow-hidden group border border-white/10 ${item.span}`}
            >
              <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-purple-500/10 transition-colors"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                  <span>Explore category</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works (Features) Section */}
      <section id="features" className="relative z-10 py-32 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Seamless <span className="text-purple-400">Flow</span></h2>
              <div className="space-y-8">
                {[
                  { title: "Find & Reserve", desc: "Discover exclusive events curated for your interests and book tickets in seconds.", icon: Sparkles },
                  { title: "Instant Access", desc: "Receive unique QR code tickets instantly on your dashboard and email.", icon: Zap },
                  { title: "Smart Check-in", desc: "Scan and enter. No paper, no lines, no friction.", icon: Shield }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-all">
                      <step.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-neutral-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.15)]"
            >
              <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070" className="w-full h-full object-cover opacity-60" alt="Work" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  <Play size={24} fill="black" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Designed for Every Scale</h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">Choose the perfect plan to fuel your event ambitions.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Student", price: "0", features: ["Access all events", "QR Ticket wallet", "Share with friends", "Community access"], color: "emerald" },
            { name: "Organizer", price: "49", features: ["Host unlimited events", "Real-time analytics", "QR verification app", "Priority support"], color: "purple", popular: true },
            { name: "Enterprise", price: "Personalized", features: ["Dedicated servers", "Custom branding", "API access", "White-glove support"], color: "blue" }
          ].map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-[3rem] border ${tier.popular ? 'bg-white/[0.04] border-purple-500/50 scale-105 z-10 shadow-[0_0_50px_rgba(168,85,247,0.15)]' : 'bg-white/[0.02] border-white/10'}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-white">{tier.price === "Personalized" ? "" : "$"}</span>
                <span className="text-5xl font-black text-white">{tier.price}</span>
                {tier.price !== "Personalized" && <span className="text-neutral-500 font-bold">/mo</span>}
              </div>
              <ul className="space-y-4 mb-10">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-neutral-400 font-medium">
                    <CheckCircle size={18} className="text-purple-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`w-full py-4 rounded-2xl font-black text-center transition-all ${tier.popular ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-xl shadow-purple-900/20' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}>
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-32 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Let's craft your <br /><span className="text-purple-400">Next Masterpiece</span></h2>
                <p className="text-xl text-neutral-400 mb-12 font-light leading-relaxed">Our team of architectural event designers is standing by to help you orchestrate world-class experiences.</p>
                
                <div className="space-y-8">
                   {[
                      { icon: Mail, label: "Digital Mail", value: "hello@eventsphere.com" },
                      { icon: MapPin, label: "Global HQ", value: "Innovation District, SF" },
                      { icon: Users, label: "Community", value: "Join our discord" }
                   ].map((item, i) => (
                      <div key={i} className="flex items-center gap-6 group">
                         <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                            <item.icon size={24} />
                         </div>
                         <div>
                            <p className="text-xs font-black text-neutral-500 uppercase tracking-widest">{item.label}</p>
                            <p className="text-white font-bold">{item.value}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl">
                <form className="space-y-6">
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Identity</label>
                         <input type="text" placeholder="Your Name" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-all font-bold" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Digital Mail</label>
                         <input type="email" placeholder="email@address.com" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-all font-bold" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Message</label>
                      <textarea rows="4" placeholder="How can we help?" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-3xl text-white outline-none focus:border-purple-500 transition-all font-medium"></textarea>
                   </div>
                   <button type="submit" className="w-full py-5 bg-white text-black rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all">
                      Transmit Message
                   </button>
                </form>
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Trusted by Organizers</h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">Leading teams rely on EventSphere to deliver world-class experiences.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { quote: "The most intuitive platform we've ever used. Our ticket sales increased by 40% in just one month.", author: "Alex Rivera", role: "Festival Producer", img: "https://i.pravatar.cc/150?u=1" },
            { quote: "The real-time analytics changed the way we handle logistics. Simply unparalleled.", author: "Sarah Chen", role: "Tech Summit Organizer", img: "https://i.pravatar.cc/150?u=2" },
            { quote: "Finally, a system that looks as premium as our high-end gala events. 10/10 experience.", author: "Marcus Thorne", role: "Social Club Director", img: "https://i.pravatar.cc/150?u=3" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-lg flex flex-col justify-between"
            >
              <div>
                <Quote size={40} className="text-purple-500/20 mb-6" />
                <p className="text-lg text-white mb-8 italic leading-relaxed">"{item.quote}"</p>
              </div>
              <div className="flex items-center gap-4">
                <img src={item.img} className="w-12 h-12 rounded-full ring-2 ring-purple-500/30" alt={item.author} />
                <div>
                  <p className="font-bold text-white">{item.author}</p>
                  <p className="text-xs text-neutral-500">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-24 mb-32 max-w-5xl mx-auto px-4 w-full">
        <div className="relative rounded-[3rem] p-12 md:p-20 overflow-hidden text-center border border-white/10 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-3xl">
          <div className="absolute top-0 right-0 p-8">
            <Sparkles className="text-purple-400 opacity-20" size={100} />
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">Ready to orchestrate?</h2>
          <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto font-light">Join thousands of organizers creating the future of experiences on EventSphere.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Link to="/register" className="px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold text-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all">
               Start Hosting
             </Link>
             <Link to="/login" className="px-10 py-5 bg-white text-black rounded-full font-bold text-xl hover:bg-neutral-200 transition-all">
               Sign In
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
