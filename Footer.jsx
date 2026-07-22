import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#030014] border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-purple-500 to-indigo-500 p-2 rounded-lg text-white">
                <Calendar size={20} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">EventSphere</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Empowering college students and organizers to orchestrate unforgettable moments with seamless management and premium discovery.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><a href="/" className="text-neutral-400 hover:text-purple-400 text-sm transition-colors">Home</a></li>
              <li><a href="/events" className="text-neutral-400 hover:text-purple-400 text-sm transition-colors">Explore Events</a></li>
              <li><a href="/login" className="text-neutral-400 hover:text-purple-400 text-sm transition-colors">Host an Event</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-purple-400 text-sm transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-6">Resources</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-neutral-400 hover:text-purple-400 text-sm transition-colors">About Us</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-purple-400 text-sm transition-colors">Contact Support</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-purple-400 text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-purple-400 text-sm transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-neutral-400 text-sm">
                <MapPin size={18} className="text-purple-400 shrink-0" />
                <span>123 University Ave, Silicon Valley, CA 94025</span>
              </li>
              <li className="flex items-center gap-3 text-neutral-400 text-sm">
                <Phone size={18} className="text-purple-400 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-neutral-400 text-sm">
                <Mail size={18} className="text-purple-400 shrink-0" />
                <span>hello@eventsphere.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>© 2026 EventSphere Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
