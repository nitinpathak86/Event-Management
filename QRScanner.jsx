import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, ShieldCheck, User, Calendar, Clock, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    });

    scanner.render(onScanSuccess, onScanError);

    async function onScanSuccess(result) {
      if (isVerifying) return;
      
      // Stop scanner after success to process
      scanner.clear();
      setIsVerifying(true);
      
      try {
        const { data } = await api.post('/registrations/verify', { ticketData: result });
        setScanResult(data);
        toast.success('Ticket Verified!');
      } catch (err) {
        setError(err.response?.data?.message || 'Verification failed');
        toast.error('Invalid Ticket');
      } finally {
        setIsVerifying(false);
      }
    }

    function onScanError(err) {
      // console.warn(err);
    }

    return () => {
      scanner.clear();
    };
  }, []);

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    window.location.reload(); // Quick reset for the scanner library
  };

  return (
    <div className="min-h-screen bg-[#030014] p-6 lg:p-12 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-3 bg-white/5 text-neutral-400 hover:text-white rounded-2xl border border-white/10 transition-all flex items-center gap-2 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm">Return to Dash</span>
        </button>
        <div className="text-right">
           <h1 className="text-2xl font-black text-white leading-none">Security Scanner</h1>
           <p className="text-xs text-purple-400 font-bold tracking-widest uppercase mt-1">Verification Node 01</p>
        </div>
      </div>

      <div className="w-full max-w-xl">
        <AnimatePresence mode="wait">
          {!scanResult && !error ? (
            <motion.div 
              key="scanner"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl overflow-hidden shadow-2xl"
            >
              <div id="reader" className="overflow-hidden rounded-2xl border-4 border-purple-500/20 shadow-inner"></div>
              
              <div className="mt-10 space-y-6">
                 <div className="flex items-center gap-4 p-6 bg-purple-500/10 border border-purple-500/20 rounded-3xl">
                    <ShieldCheck className="text-purple-400 shrink-0" size={32} />
                    <p className="text-sm font-medium text-neutral-300 leading-relaxed">
                       Point your camera at the attendee's ticket QR code. Our system will automatically verify credentials.
                    </p>
                 </div>
                 <div className="flex justify-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
                 </div>
              </div>
            </motion.div>
          ) : scanResult ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-emerald-500/30 rounded-[3rem] p-12 text-center shadow-[0_0_50px_rgba(16,185,129,0.1)]"
            >
               <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-emerald-500/10">
                  <CheckCircle2 size={48} className="text-emerald-400" />
               </div>
               <h2 className="text-3xl font-black text-white mb-2">Access Granted</h2>
               <p className="text-emerald-400/80 font-bold uppercase tracking-widest text-sm mb-12">Ticket Verified Successfully</p>
               
               <div className="space-y-4 max-w-xs mx-auto mb-12">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 text-left">
                     <User className="text-purple-400" size={20} />
                     <div>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Attendee</p>
                        <p className="text-white font-bold">{scanResult.attendee}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 text-left">
                     <Calendar className="text-purple-400" size={20} />
                     <div>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Event</p>
                        <p className="text-white font-bold">{scanResult.event}</p>
                     </div>
                  </div>
               </div>

               <button 
                 onClick={resetScanner}
                 className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-xl hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-3"
               >
                 <RefreshCw size={24} />
                 Next Attendee
               </button>
            </motion.div>
          ) : (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-red-500/30 rounded-[3rem] p-12 text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]"
            >
               <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-red-500/10">
                  <XCircle size={48} className="text-red-400" />
               </div>
               <h2 className="text-3xl font-black text-white mb-2">Verification Error</h2>
               <p className="text-red-400 font-bold mb-12 uppercase tracking-widest text-xs">{error}</p>
               
               <button 
                 onClick={resetScanner}
                 className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-xl transition-all"
               >
                 Try Again
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-12 text-center">
         <div className="flex items-center gap-2 text-neutral-500 font-bold text-xs uppercase tracking-widest">
            <ShieldCheck size={16} />
            Secure Node Encryption Enabled
         </div>
      </div>
    </div>
  );
};

export default QRScanner;
