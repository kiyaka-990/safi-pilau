"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { 
  ArrowRight, Loader2, CheckCircle2, ChefHat, 
  Flame, Quote, Instagram, MessageSquare, Star, Camera, 
  Sun, Moon, Facebook, Twitter, Mail, Globe, ExternalLink, Send, ShoppingCart, 
  MapPin, UtensilsCrossed, Radio, X
} from 'lucide-react';
import { SAFI_PILAU } from '@/lib/brand';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const HERO_CONTENT = [
  { title: "CRAFTED", highlight: "PERFECTION.", image: "/pilau-hero.png", tag: "Original Recipe" },
  { title: "COASTAL", highlight: "SOUL.", image: "/pilau-hero-1.png", tag: "Authentic Spices" },
  { title: "ELITE", highlight: "DINING.", image: "/pilau-hero.png", tag: "Premium Service" }
];

const REVIEWS = [
  { name: "Ahmed O.", text: "Best Mutton Pilau in Nairobi. Period.", rating: 5 },
  { name: "Sarah W.", text: "The buffet was the highlight of our corporate event.", rating: 5 },
  { name: "Kevin K.", text: "Authentic coastal taste delivered to my door.", rating: 5 },
  { name: "Joy M.", text: "The mutton is so tender, it melts in your mouth!", rating: 5 },
  { name: "Brian L.", text: "Professional catering team and amazing spices.", rating: 5 },
];

const DYNAMIC_STATS = [
  { label: "Daily Orders", value: "200+", icon: <ShoppingCart size={14}/>, color: "bg-amber-500" },
  { label: "Active Chefs", value: "12", icon: <ChefHat size={14}/>, color: "bg-orange-500" },
  { label: "Spices Used", value: "18", icon: <Flame size={14}/>, color: "bg-red-500" },
  { label: "Nairobi HQ", value: "24/7", icon: <MapPin size={14}/>, color: "bg-amber-600" },
];

const SINGLE_PORTIONS = [
  { name: "Mutton Pilau", price: 650, desc: "Slow-cooked goat with basmati rice.", img: "/mutton-pilau.png" },
  { name: "Beef Pilau", price: 550, desc: "Coastal spices with tender beef.", img: "/pilau-hero.png" },
  { name: "Chicken Pilau", price: 600, desc: "Classic Swahili chicken blend.", img: "/pilau-hero-3.png" },
];

const BUFFET_DATA = {
  price: 2500,
  availableJuices: ["Mango", "Apple", "Passion", "Pineapple", "Orange"],
  menus: [
    { id: "menu-1", title: "Menu 1", items: ["Mutton Pilau", "Beef Curry", "Chapati", "Salad", "Chilli", "Fruits"], img: "/mutton-pilau.png" },
    { id: "menu-2", title: "Menu 2", items: ["Mutton Pilau", "Butter Chicken", "Naan", "Spinach", "Salad", "Fruits"], img: "/mutton-pilau.png" }
  ]
};

export default function LandingPage() {
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [showJuicePicker, setShowJuicePicker] = useState<string | null>(null);
  const [selectedJuices, setSelectedJuices] = useState<string[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [heroIndex, setHeroIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setHeroIndex((prev) => (prev + 1) % HERO_CONTENT.length), 6000);
    return () => clearInterval(interval);
  }, []);

  const triggerOrder = async (itemName: string, juices: string[] = []) => {
    setIsOrdering(true);
    const isBuffet = itemName.includes("Menu") || itemName === "Header CTA";
    const prefix = isBuffet ? "BUF" : "SP";
    const price = isBuffet ? 2500 : 600;
    const newId = `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setOrderId(newId);

    const { error } = await supabase.from('orders').insert([
      { id: newId, customer_name: "Web Customer", items: `${itemName}${juices.length ? ` (+ ${juices.join(", ")})` : ""}`, total_price: price, status: 'Pending' }
    ]);

    if (!error) {
        const message = `Safi Pilau Admin, I'm ordering ${itemName}${juices.length ? ` with ${juices.join(", ")}` : ""}. (ID: ${newId})`;
        window.open(`https://wa.me/${SAFI_PILAU.phone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
    }
    setShowJuicePicker(null);
    setTimeout(() => setIsOrdering(false), 2000);
  };

  return (
    <main className={`min-h-screen transition-colors duration-700 ${theme === 'dark' ? 'bg-[#050503] text-white' : 'bg-[#fcfcf9] text-black'} overflow-x-hidden`}>
      {/* 1. NAVIGATION */}
      <nav className="fixed top-6 inset-x-0 z-50 flex justify-center px-6">
        <motion.div className={`glass-card px-6 py-4 flex items-center gap-8 border-white/5 backdrop-blur-3xl rounded-full ${theme === 'dark' ? 'bg-black/40 shadow-2xl' : 'bg-white/40 shadow-xl'}`}>
          <span className="text-xl font-black italic tracking-tighter uppercase cursor-pointer">SAFI <span className="text-amber-600">PILAU.</span></span>
          <div className="hidden md:flex items-center gap-6 text-[9px] font-black uppercase tracking-widest opacity-40">
            <button onClick={() => document.getElementById('buffet')?.scrollIntoView({behavior:'smooth'})} className="hover:text-amber-600">Buffet</button>
            <button onClick={() => document.getElementById('portions')?.scrollIntoView({behavior:'smooth'})} className="hover:text-amber-600">Portions</button>
            <button onClick={() => document.getElementById('location')?.scrollIntoView({behavior:'smooth'})} className="hover:text-amber-600">Location</button>
          </div>
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-amber-600/10">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => triggerOrder('Header CTA')} className="bg-amber-600 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-amber-600/20">
              <ShoppingCart size={12}/> Order
            </button>
          </div>
        </motion.div>
      </nav>

      {/* 2. HERO */}
      <section className="relative min-h-screen flex items-center pt-20 px-6">
        <div className="container mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div key={heroIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-600/10 border border-amber-600/20 text-amber-500 text-[9px] font-black uppercase tracking-widest">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span></span>
                  {HERO_CONTENT[heroIndex].tag}
                </div>
                <h1 className="text-[clamp(3.5rem,7vw,9rem)] font-black italic uppercase tracking-tighter leading-[0.85]">
                  {HERO_CONTENT[heroIndex].title} <br/> 
                  <span className="text-amber-600">{HERO_CONTENT[heroIndex].highlight}</span>
                </h1>
              </motion.div>
            </AnimatePresence>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => document.getElementById('buffet')?.scrollIntoView({behavior:'smooth'})} className="bg-amber-600 text-white px-10 py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 group shadow-2xl shadow-amber-600/20">
              Explore Our Menu <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform"/>
            </motion.button>
          </div>
          <div className="relative aspect-square w-full max-w-150 mx-auto flex items-center justify-center">
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 4, repeat: Infinity }} className="absolute inset-0 bg-amber-600/30 blur-[120px] rounded-full" />
            <AnimatePresence mode="wait">
              <motion.div key={heroIndex} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ type: "spring", damping: 15 }} className="relative w-full h-full flex items-center justify-center z-20">
                <Image src={HERO_CONTENT[heroIndex].image} width={600} height={600} alt="Safi Dish" className="object-contain drop-shadow-[0_35px_50px_rgba(0,0,0,0.5)]" priority />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC STATS */}
      <section className="py-20 border-y border-white/5 bg-amber-600/5 backdrop-blur-sm">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {DYNAMIC_STATS.map((stat, i) => (
            <motion.div whileHover={{ y: -5 }} key={i} className="text-center group">
              <div className={`inline-flex p-4 rounded-2xl ${stat.color}/10 text-amber-600 mb-4 group-hover:scale-110 transition-transform`}>{stat.icon}</div>
              <p className="text-4xl font-black italic tracking-tighter mb-2">{stat.value}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. MARQUEE REVIEWS */}
      <section className="py-20 overflow-hidden relative">
        <div className="flex gap-10 whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
          {[...REVIEWS, ...REVIEWS].map((rev, i) => (
            <div key={i} className="glass-card p-8 min-w-87.5 space-y-4 bg-white/5 border-white/5 rounded-3xl backdrop-blur-md">
              <div className="flex gap-1 text-amber-500">
                {[...Array(rev.rating)].map((_, s) => <Star key={s} size={12} fill="currentColor" />)}
              </div>
              <Quote className="text-white/10" size={20} />
              <p className="text-sm font-bold italic tracking-tight opacity-80 whitespace-normal">“{rev.text}”</p>
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-600">— {rev.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PREMIUM BUFFET */}
      <section id="buffet" className="py-40 px-6">
        <div className="container mx-auto">
          <h2 className="text-6xl font-black italic uppercase tracking-tighter text-center mb-24">Premium <span className="text-amber-600">Buffet.</span></h2>
          <div className="grid lg:grid-cols-2 gap-10">
            {BUFFET_DATA.menus.map((menu) => (
              <motion.div whileHover={{ y: -10 }} key={menu.id} className="glass-card overflow-hidden border-white/5 bg-black/40 rounded-4xl">
                <div className="h-64 relative">
                  <Image src={menu.img} fill alt={menu.title} className="object-cover opacity-50" />
                  <div className="absolute bottom-8 left-10"><h3 className="text-4xl font-black italic uppercase tracking-tighter">{menu.title}</h3></div>
                </div>
                <div className="p-12 pt-6">
                  <div className="grid grid-cols-2 gap-4 mb-10">
                    {menu.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-[10px] font-black uppercase opacity-40"><CheckCircle2 size={14} className="text-amber-600" /> {item}</div>
                    ))}
                  </div>
                  <button onClick={() => setShowJuicePicker(menu.title)} className="w-full py-6 bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-xl">Customize & Order</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SINGLE PORTIONS */}
      <section id="portions" className="py-40 px-6 bg-white/2">
        <div className="container mx-auto max-w-4xl text-center">
          <UtensilsCrossed className="text-amber-600 mx-auto mb-4" size={32} />
          <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-16">Single <span className="text-amber-600">Portions.</span></h2>
          <div className="space-y-6 text-left">
            {SINGLE_PORTIONS.map((item, i) => (
              <motion.div whileHover={{ x: 15 }} key={i} className="glass-card p-4 md:p-8 flex flex-col md:flex-row gap-8 items-center group cursor-pointer border-white/5 rounded-2xl">
                <div className="relative w-32 h-32 shrink-0">
                  <div className="absolute inset-0 bg-amber-600 rounded-full scale-90 group-hover:scale-105 transition-transform duration-500 opacity-20" />
                  <Image src={item.img} fill alt={item.name} className="object-cover rounded-full z-10 group-hover:rotate-12 transition-transform duration-500 shadow-2xl" />
                </div>
                <div className="flex-1 text-center md:text-left"><h4 className="text-2xl font-black italic uppercase">{item.name}</h4><p className="text-[10px] font-bold uppercase opacity-30 mt-2 tracking-widest">{item.desc}</p></div>
                <div className="text-center md:text-right"><p className="text-2xl font-black italic text-amber-600 mb-4">KES {item.price}</p><button onClick={() => triggerOrder(item.name)} className="px-10 py-3 bg-amber-600 text-white text-[9px] font-black uppercase rounded-full hover:bg-white hover:text-black transition-colors">Add Order</button></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LOCATION */}
      <section id="location" className="py-40 px-6">
        <div className="container mx-auto">
          <div className="glass-card overflow-hidden border-white/5 bg-black/40 rounded-[3rem] grid lg:grid-cols-2">
            <div className="p-16 space-y-8">
              <h2 className="text-5xl font-black italic uppercase tracking-tighter">Nairobi <span className="text-amber-600">HQ.</span></h2>
              <p className="text-[11px] font-bold uppercase opacity-40 leading-loose">Along Ngong Road, right next to Uchumi Hyper Supermarket.</p>
              <div className="flex gap-4">
                <div className="p-6 glass-card border-white/5 text-center flex-1 rounded-2xl"><Radio size={20} className="mx-auto mb-2 text-amber-600 animate-pulse" /><p className="text-[9px] font-black uppercase tracking-widest">Active Now</p></div>
                <div className="p-6 glass-card border-white/5 text-center flex-1 rounded-2xl"><MapPin size={20} className="mx-auto mb-2 text-amber-600" /><p className="text-[9px] font-black uppercase tracking-widest">Kilimani Area</p></div>
              </div>
            </div>
            <div className="relative min-h-112.5">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.814324269153!2d36.786522575841675!3d-1.2917711986959952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10a307079201%3A0xb36294a61324706!2sUchumi%20Hyper%20%2F%20Ngong%20Hyper!5e0!3m2!1sen!2ske!4v1707901234567!5m2!1sen!2ske" 
                className="absolute inset-0 w-full h-full border-0 grayscale invert brightness-75 hover:grayscale-0 transition-all duration-700" 
                allowFullScreen loading="lazy" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. RESTORED FOOTER (Uses all icons) */}
      <footer id="footer" className="pt-32 pb-12 border-t border-white/5 px-6 bg-[#080805]">
        <div className="container mx-auto">
          <div className="mb-24 p-12 glass-card rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-12 bg-amber-600/5">
            <div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Join the <span className="text-amber-600">Safi Elite.</span></h3>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mt-2 flex items-center gap-2"><MapPin size={10}/> Nairobi, Kenya</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); setTimeout(() => setSubscribed(false), 3000); }} className="flex-1 max-w-lg w-full relative">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="EMAIL ADDRESS" className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-[10px] font-black tracking-widest focus:outline-none focus:border-amber-600 text-white" />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-amber-600 text-white rounded-xl hover:scale-110 transition-transform">
                {subscribed ? <CheckCircle2 size={18} /> : <Send size={18} />}
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 text-white">
            <div className="col-span-2 space-y-8">
              <span className="text-3xl font-black italic tracking-tighter">SAFI <span className="text-amber-600">PILAU.</span></span>
              <div className="flex gap-6 opacity-40">
                <Instagram size={24} className="hover:text-amber-600 cursor-pointer transition-colors" /> 
                <Facebook size={24} className="hover:text-amber-600 cursor-pointer transition-colors" /> 
                <Twitter size={24} className="hover:text-amber-600 cursor-pointer transition-colors" /> 
                <MessageSquare size={24} className="hover:text-amber-600 cursor-pointer transition-colors" /> 
                <Camera size={24} className="hover:text-amber-600 cursor-pointer transition-colors" />
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-[11px] font-black uppercase text-amber-600 tracking-widest">Support</h4>
              <ul className="space-y-4 text-[10px] font-black uppercase opacity-40">
                <li className="flex items-center gap-2 hover:opacity-100 cursor-pointer"><Mail size={12}/> Contact Admin</li>
                <li className="flex items-center gap-2 hover:opacity-100 cursor-pointer"><Globe size={12}/> Swahili Culture</li>
                <li className="flex items-center gap-2 hover:opacity-100 cursor-pointer"><ExternalLink size={12}/> Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">© 2026 SAFI PILAU™ — ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>

      {/* 9. MODALS (Fixed z-index shorthand) */}
      <AnimatePresence>
        {isOrdering && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="text-center">
              <Loader2 className="animate-spin text-amber-500 mx-auto mb-8" size={60} />
              <p className="text-[10px] font-black uppercase opacity-40 text-white italic tracking-tighter">Syncing Order {orderId}...</p>
            </div>
          </motion.div>
        )}
        {showJuicePicker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
             <div className="glass-card max-w-sm w-full p-10 text-center border-amber-500/20 relative rounded-[3rem]">
                <button onClick={() => setShowJuicePicker(null)} className="absolute top-8 right-8 text-white/40 hover:text-white"><X size={24}/></button>
                <ChefHat className="text-amber-500 mx-auto mb-6" size={40} />
                <h2 className="text-3xl font-black italic uppercase mb-10 text-white tracking-tighter">Juice Bar</h2>
                <div className="grid grid-cols-1 gap-2 mb-10">
                  {BUFFET_DATA.availableJuices.map(j => (
                    <button key={j} onClick={() => setSelectedJuices(p => p.includes(j) ? p.filter(x => x!==j) : [...p, j])} className={`py-4 border text-[10px] font-black uppercase transition-all rounded-xl ${selectedJuices.includes(j) ? 'bg-amber-600 border-amber-600 text-white' : 'border-white/10 opacity-40 text-white'}`}>{j}</button>
                  ))}
                </div>
                <button onClick={() => triggerOrder(showJuicePicker, selectedJuices)} className="w-full py-5 bg-amber-600 text-white text-[9px] font-black uppercase rounded-xl shadow-lg shadow-amber-600/20">Complete Sync & Order</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}