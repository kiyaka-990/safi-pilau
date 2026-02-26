"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle2, Clock, Bell } from 'lucide-react';

interface Order {
  id: string;
  items: string;
  status: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function KitchenFeed() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel('kitchen-mini-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, 
        (payload) => setOrders((prev) => [payload.new as Order, ...prev].slice(0, 3))
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 opacity-40 text-[9px] font-black uppercase tracking-widest">
        <Bell size={12} className="text-amber-600 animate-bounce" /> Live Kitchen Signal
      </div>
      <AnimatePresence>
        {orders.map((order) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            key={order.id} 
            className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {order.id.startsWith('BUF') ? <Flame size={12} className="text-orange-500"/> : <Clock size={12}/>}
              <span className="text-[10px] font-bold">{order.id}</span>
            </div>
            <CheckCircle2 size={12} className="text-green-500 opacity-50" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}