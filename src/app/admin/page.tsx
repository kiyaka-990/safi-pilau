"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { 
  LayoutDashboard, ShoppingBag, Users, TrendingUp, CheckCircle, 
  Clock, Search, MoreVertical, Download, Bell, Settings, LogOut, 
  X, ChefHat, Printer, Activity, Timer, Flame, Utensils
} from 'lucide-react';

// --- COUNTDOWN LOGIC ---
const CountdownTimer = ({ createdAt }: { createdAt: string }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const start = new Date(createdAt).getTime();
      const deadline = start + (45 * 60 * 1000); 
      const now = new Date().getTime();
      const diff = deadline - now;
      if (diff <= 0) { setTimeLeft("LATE"); } 
      else {
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${mins}m ${secs}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [createdAt]);

  return (
    <span className={`font-black tracking-tighter ${timeLeft === "LATE" ? "text-red-500 animate-pulse" : "text-amber-500"}`}>
      {timeLeft}
    </span>
  );
};

interface Order {
  id: string;
  customer_name: string;
  items: string;
  total_price: number;
  status: 'Pending' | 'Preparing' | 'Delivered';
  created_at: string;
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null);

  const DAILY_GOAL = 50000; 

  useEffect(() => {
    const auth = localStorage.getItem("safi_auth");
    if (auth !== "granted") router.push("/admin/login");
  }, [router]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (data) setOrders(data as Order[]);
      setLoading(false);
    };
    fetchOrders();

    const channel = supabase.channel('realtime-orders').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const newOrder = payload.new as Order;
        setOrders(prev => [newOrder, ...prev]);
        setNewOrderAlert(newOrder.id);
        new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3').play().catch(() => {});
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateOrderStatus = async (id: string, newStatus: Order['status']) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  const completeAllPending = async () => {
    const pendingIds = orders.filter(o => o.status !== 'Delivered').map(o => o.id);
    if (pendingIds.length === 0) return;
    const { error } = await supabase.from('orders').update({ status: 'Delivered' }).in('id', pendingIds);
    if (!error) { setOrders(prev => prev.map(o => ({ ...o, status: 'Delivered' }))); }
  };

  const handlePrint = (order: Order) => {
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`<html><body style="font-family: monospace; padding: 20px;"><h2>SAFI PILAU HQ</h2><hr/><p>ORDER ID: ${order.id}</p><p>CUSTOMER: ${order.customer_name}</p><p>ITEMS: ${order.items}</p></body></html>`);
    printWindow?.document.close();
    printWindow?.print();
  };

  const bufCount = orders.filter(o => o.id.startsWith('BUF')).length;
  const spCount = orders.filter(o => o.id.startsWith('SP')).length;
  const currentRevenue = orders.reduce((sum, o) => sum + o.total_price, 0);
  const goalPercentage = Math.min((currentRevenue / DAILY_GOAL) * 100, 100);

  const chartData = orders.slice(0, 10).map(o => ({
    time: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    amount: o.total_price
  })).reverse();

  if (loading) return (
    <div className="min-h-screen bg-[#050503] flex flex-col items-center justify-center gap-4 text-amber-600">
      <Activity className="animate-pulse" size={48} />
      <span className="font-black italic uppercase tracking-widest text-xs text-center">Syncing Safi Terminal...<br/>Polymorphic ID Logic Active</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050503] text-white flex font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 border-r border-white/5 p-8 flex flex-col gap-10 bg-black/20 backdrop-blur-xl">
        <div className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-2">
          <ChefHat className="text-amber-600" /> Safi <span className="text-amber-600">Admin.</span>
        </div>
        <nav className="flex flex-col gap-2">
          <button className="flex items-center gap-4 p-4 rounded-2xl bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-600/20"><LayoutDashboard size={18}/> Overview</button>
          <button className="flex items-center gap-4 p-4 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"><ShoppingBag size={18}/> Orders</button>
          <button className="flex items-center gap-4 p-4 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"><Users size={18}/> Customers</button>
          <button className="flex items-center gap-4 p-4 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"><TrendingUp size={18}/> Analytics</button>
        </nav>
        <div className="mt-auto pt-8 border-t border-white/5">
          <button className="flex items-center gap-4 p-4 text-white/20 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"><Settings size={18}/> Settings</button>
          <button onClick={() => { localStorage.removeItem("safi_auth"); router.push("/admin/login"); }} className="flex items-center gap-4 p-4 text-red-500/40 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-all"><LogOut size={18}/> Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-12 overflow-y-auto relative bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-amber-600/5 via-transparent to-transparent">
        
        <AnimatePresence>
          {newOrderAlert && (
            <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }} className="fixed top-10 left-1/2 -translate-x-1/2 z-100 glass-card bg-amber-600 px-8 py-5 rounded-3xl flex items-center gap-5 shadow-2xl border border-white/20">
              <Flame size={20} className="animate-pulse" />
              <div><p className="text-[9px] font-black uppercase opacity-80">New Incoming ID</p><p className="text-sm font-black italic">{newOrderAlert}</p></div>
              <button onClick={() => setNewOrderAlert(null)}><X size={18}/></button>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="flex justify-between items-end mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">Kitchen <span className="text-amber-600">Control.</span></h1>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Polymorphic ID Engine v1.02</p>
          </div>
          <div className="flex gap-4">
            <button className="p-3 bg-white/5 rounded-2xl border border-white/5"><Download size={20} className="text-white/40"/></button>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 relative"><Bell size={20} className="text-white/40"/><span className="absolute top-3 right-3 w-2 h-2 bg-amber-600 rounded-full"></span></div>
          </div>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="glass-card p-10 bg-white/5 border-white/5 rounded-4xl col-span-2">
            <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-black uppercase opacity-30 tracking-[0.3em]">Daily Revenue Goal</p>
                <span className="text-[10px] font-black text-amber-600 tracking-widest">KES {currentRevenue.toLocaleString()} / {DAILY_GOAL.toLocaleString()}</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${goalPercentage}%` }} className="h-full bg-linear-to-r from-amber-600 to-amber-400" />
            </div>
          </div>
          <div className="glass-card p-10 bg-white/5 border-white/5 rounded-4xl flex flex-col justify-center text-center">
            <p className="text-[10px] font-black uppercase opacity-30 mb-2 tracking-widest">ID Type Split</p>
            <div className="flex justify-between items-center px-4">
              <div><p className="text-2xl font-black italic text-amber-600">{bufCount}</p><p className="text-[8px] font-bold opacity-20 uppercase">Buffet</p></div>
              <div className="h-8 w-px bg-white/10" />
              <div><p className="text-2xl font-black italic text-blue-500">{spCount}</p><p className="text-[8px] font-bold opacity-20 uppercase">Portion</p></div>
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className="glass-card p-10 bg-white/5 border-white/5 rounded-4xl mb-12 h-64 shadow-2xl">
          <p className="text-[10px] font-black uppercase opacity-30 tracking-[0.3em] mb-4 flex items-center gap-2"><Activity size={14} className="text-amber-600"/> Revenue Velocity</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
              <XAxis dataKey="time" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ backgroundColor: '#050503', border: 'none', borderRadius: '15px' }} />
              <Line type="monotone" dataKey="amount" stroke="#d97706" strokeWidth={4} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ENHANCED ORDER TABLE */}
        <section className="glass-card bg-white/2 border-white/5 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="p-10 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-4 bg-black/40 px-8 py-4 rounded-2xl border border-white/10 w-fit">
              <Search size={18} className="opacity-30"/><input type="text" placeholder="SEARCH SYSTEM ID..." className="bg-transparent text-[10px] font-black outline-none w-80 uppercase placeholder:opacity-20" onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <button onClick={completeAllPending} className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest transition-all">
              <CheckCircle size={16}/> Clear All Pending
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="text-[10px] font-black uppercase opacity-30">
              <tr><th className="p-10">System ID</th><th>Customer</th><th>Details</th><th>Deadline</th><th>Status</th><th className="p-10 text-right">Control</th></tr>
            </thead>
            <tbody className="text-[12px] font-bold uppercase tracking-wide">
              <AnimatePresence>
                {orders.filter(o => o.id.includes(searchQuery.toUpperCase())).map((order) => (
                  <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                    <td className="p-10 font-black text-amber-600 italic flex items-center gap-3">
                      {order.id.startsWith('BUF') ? <Flame size={14} className="text-orange-500"/> : <Utensils size={14} className="text-blue-500"/>}
                      {order.id}
                    </td>
                    <td className="font-black tracking-tighter">{order.customer_name}</td>
                    <td className="opacity-40 text-[10px]">{order.items}</td>
                    <td><div className="flex items-center gap-2"><Timer size={14} className="opacity-40"/><CountdownTimer createdAt={order.created_at}/></div></td>
                    <td>
                      <button 
                        onClick={() => {
                          const states: Order['status'][] = ['Pending', 'Preparing', 'Delivered'];
                          const next = states[(states.indexOf(order.status) + 1) % 3];
                          updateOrderStatus(order.id, next);
                        }}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black transition-all ${
                        order.status === 'Delivered' ? 'border-green-500/30 text-green-500 bg-green-500/5' : 
                        order.status === 'Preparing' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5 animate-pulse' : 
                        'border-blue-400/30 text-blue-400 bg-blue-400/5'
                      }`}>
                        {order.status === 'Delivered' ? <CheckCircle size={10}/> : <Clock size={10}/>} 
                        {order.status}
                      </button>
                    </td>
                    <td className="p-10 text-right">
                      <div className="flex justify-end gap-4 opacity-20 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handlePrint(order)}><Printer size={18}/></button>
                        <button className="hover:text-white"><MoreVertical size={18}/></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}