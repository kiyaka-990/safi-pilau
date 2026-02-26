"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { ChefHat, ArrowRight, CheckCircle2 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function OrderPage() {
  const [name, setName] = useState("");
  const [orderType, setOrderType] = useState<"SP" | "BUF">("SP");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const generatePolymorphicId = (type: "SP" | "BUF") => {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${type}-${randomStr}`;
  };

  const sendToWhatsApp = (id: string, customer: string, item: string) => {
    const phone = "2547XXXXXXXX"; // Replace with your number
    const msg = `*NEW SAFI ORDER* ✅%0A%0A*ID:* ${id}%0A*Customer:* ${customer}%0A*Package:* ${item}%0A%0APlease confirm my order!`;
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const orderId = generatePolymorphicId(orderType);
    const price = orderType === "BUF" ? 2500 : 600;
    const item = orderType === "BUF" ? "Elite Buffet" : "Single Pilau";

    const { error } = await supabase.from('orders').insert([
      { id: orderId, customer_name: name, items: item, total_price: price, status: 'Pending' }
    ]);

    if (!error) {
      setSubmittedId(orderId);
      sendToWhatsApp(orderId, name, item);
    }
    setIsSubmitting(false);
  };

  if (submittedId) return (
    <div className="min-h-screen bg-[#050503] flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card p-12 rounded-[3rem] bg-white/5 border-white/10 text-center max-w-md w-full">
        <CheckCircle2 size={60} className="text-emerald-500 mx-auto mb-6" />
        <h2 className="text-3xl font-black italic text-white mb-2 uppercase tracking-tighter">Order Placed!</h2>
        <div className="bg-white/5 p-4 rounded-2xl border border-amber-600/30 text-amber-500 font-black text-2xl italic mb-8">{submittedId}</div>
        <button onClick={() => window.location.reload()} className="w-full py-4 bg-white/5 text-white font-black uppercase tracking-widest rounded-2xl border border-white/5">Order Again</button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050503] text-white p-6 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-amber-600/10 blur-[120px] rounded-full" />
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card w-full max-w-xl bg-white/5 border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-amber-600 rounded-2xl text-white shadow-lg shadow-amber-600/20"><ChefHat size={24} /></div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Safi <span className="text-amber-600">Order.</span></h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="ENTER YOUR NAME" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-amber-600/50 font-bold uppercase tracking-widest text-sm" />
          <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={() => setOrderType("SP")} className={`p-6 rounded-3xl border transition-all text-left ${orderType === "SP" ? "bg-amber-600 border-amber-600 shadow-xl shadow-amber-600/20" : "bg-white/5 border-white/5 opacity-40"}`}>
              <p className="font-black italic text-lg uppercase mb-1">Single Pilau</p>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">KES 600</p>
            </button>
            <button type="button" onClick={() => setOrderType("BUF")} className={`p-6 rounded-3xl border transition-all text-left ${orderType === "BUF" ? "bg-amber-600 border-amber-600 shadow-xl shadow-amber-600/20" : "bg-white/5 border-white/5 opacity-40"}`}>
              <p className="font-black italic text-lg uppercase mb-1">Elite Buffet</p>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">KES 2,500</p>
            </button>
          </div>
          <button disabled={isSubmitting} type="submit" className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] rounded-3xl hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center gap-3">
            {isSubmitting ? "Syncing..." : "Confirm Order"} <ArrowRight size={20} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}