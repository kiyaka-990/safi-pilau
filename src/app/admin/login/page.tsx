"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [passkey, setPasskey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Secure Check (Replace 'SAFI_2026' with your desired secret key)
    setTimeout(() => {
      if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
  localStorage.setItem("safi_auth", "granted");
  router.push("/admin");
  } else {
        setLoading(false);
        setError(true);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050503] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card max-w-md w-full p-12 border-white/5 bg-white/2 rounded-4xl text-center"
      >
        <div className="w-20 h-20 bg-amber-600/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-600/20">
          <ShieldCheck className="text-amber-600" size={32} />
        </div>
        
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">Access <span className="text-amber-600">Denied.</span></h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-10">Authorized Personnel Only</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input 
              type="password" 
              placeholder="ENTER SYSTEM PASSKEY" 
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className={`w-full bg-black/40 border ${error ? 'border-red-500' : 'border-white/10'} p-6 rounded-2xl text-[10px] font-black tracking-[0.5em] focus:outline-none focus:border-amber-600 text-center text-white transition-all`}
            />
            {error && <p className="text-[9px] font-black text-red-500 mt-2 uppercase">Invalid System Key</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-6 bg-amber-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all shadow-2xl shadow-amber-600/20"
          >
            {loading ? <Loader2 className="animate-spin" size={18}/> : <>Initialize Session <ArrowRight size={18}/></>}
          </button>
        </form>

        <p className="mt-12 text-[9px] font-black uppercase tracking-widest opacity-20">Secure Encryption Active</p>
      </motion.div>
    </div>
  );
}