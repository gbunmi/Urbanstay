import React from "react";
import { Building2, ChevronRight, Home, MapIcon, Search, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PropertyCard from "@/components/PropertyCard";
import { PROPERTY_CATEGORIES, NIGERIAN_CITIES } from "@/lib/constants";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const MOCK_PROPERTIES = [
  {
    propertyId: "1",
    title: "Luxury Duplex in Banana Island",
    price: 15000000,
    location: { city: "Ikoyi", state: "Lagos" },
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
    category: "duplex",
    status: "AVAILABLE",
    amenities: ["24/7 Power", "Gated Security", "Pool", "Fibre Internet"]
  },
  {
    propertyId: "2",
    title: "Modern Apartment in Maitama",
    price: 8500000,
    location: { city: "Maitama", state: "Abuja" },
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"],
    rating: 4.5,
    category: "apartment",
    status: "AVAILABLE",
    amenities: ["Gated Security", "Parking Space", "Borehole"]
  },
  {
    propertyId: "3",
    title: "Ocean View Studio",
    price: 3500000,
    location: { city: "Victoria Island", state: "Lagos" },
    images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
    category: "studio",
    status: "AVAILABLE",
    amenities: ["Fibre Internet", "Gym", "Ocean View"]
  },
  {
    propertyId: "4",
    title: "Executive Penthouse",
    price: 25000000,
    location: { city: "Lekki Phase 1", state: "Lagos" },
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"],
    rating: 5.0,
    category: "apartment",
    status: "AVAILABLE",
    amenities: ["Solar Power", "Elevator", "Security", "Smart Home"]
  }
];

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6199f74709?auto=format&fit=crop&q=80&w=2000" 
            className="h-full w-full object-cover transform scale-105"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
        </div>

        <div className="container relative z-10 px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-white/20 backdrop-blur-md text-white mb-6 border-white/30 px-3 py-1 text-[10px] uppercase font-black tracking-widest hover:bg-white/30 transition-colors">
              Premium Property Network
            </Badge>
            <h1 className="text-5xl md:text-7xl font-serif font-medium mb-6 tracking-tight leading-[1.1]">
                Premium Rental Spaces <br /><span className="text-primary italic">for Urban Professionals</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 mb-10 font-medium font-sans">
                Discover curated luxury living spaces in Nigeria's most vibrant cities. Experience transparency and professionalism in every listing.
            </p>

            {/* Smart Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-2 shadow-2xl flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-slate-100 px-4 py-2">
                    <Search className="h-5 w-5 text-slate-400 mr-2" />
                    <Input 
                        placeholder="Location (e.g. Ikoyi, Lagos)" 
                        className="border-none shadow-none focus-visible:ring-0 text-slate-900 placeholder:text-slate-400 h-10 font-sans"
                    />
                </div>
                <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-slate-100 px-4 py-2">
                    <Home className="h-5 w-5 text-slate-400 mr-2" />
                    <select className="w-full bg-transparent border-none outline-none text-slate-900 text-sm h-10 font-sans">
                        <option value="">Property Type</option>
                        {PROPERTY_CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                    </select>
                </div>
                <div className="p-1">
                    <Button size="lg" className="w-full md:w-auto h-12 bg-primary hover:bg-primary/90 text-white px-8 rounded-lg font-bold uppercase tracking-wider text-xs">
                        Search Now
                    </Button>
                </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 border-b border-slate-100">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
                { icon: ShieldCheck, label: "Verified Listings", value: "2,500+" },
                { icon: MapIcon, label: "Cities covered", value: "12 Cities" },
                { icon: Sparkles, label: "Premium Selection", value: "Exclusive" },
                { icon: TrendingUp, label: "Market Growth", value: "18% p.a." }
            ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                        <stat.icon className="h-6 w-6" />
                    </div>
                    <span className="text-slate-900 font-serif font-bold text-3xl mb-1">{stat.value}</span>
                    <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest">{stat.label}</span>
                </div>
            ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">Categories</h4>
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-slate-900">
                Tailored for your lifestyle
              </h2>
            </div>
            <Link to="/properties" className={cn(buttonVariants({ variant: "outline" }), "rounded-lg gap-2 hidden md:flex border-slate-200")}>
                View All Listings <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PROPERTY_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                className="group p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-slate-900 transition-all cursor-pointer text-center"
              >
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-800 transition-colors shadow-sm">
                      <cat.icon className="h-6 w-6 text-slate-900 group-hover:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-white transition-colors">{cat.label}</h3>
                  <span className="text-xs text-slate-400 group-hover:text-slate-500">120+ Listings</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mb-16 flex justify-between items-end">
             <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">Curated Selection</h4>
                <h2 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 leading-tight">
                    Featured residences
                </h2>
             </div>
             <Link 
                to="/properties" 
                className={cn(buttonVariants({ variant: "link" }), "text-primary font-bold group flex items-center p-0 h-auto")}
             >
                 Explore all listings <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {MOCK_PROPERTIES.map((prop) => (
              <motion.div key={prop.propertyId} variants={itemVariants}>
                <PropertyCard property={prop} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="absolute -right-20 top-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="relative">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="pt-12">
                            <img 
                                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=400" 
                                className="rounded-3xl shadow-2xl h-80 object-cover w-full mb-4"
                                alt="Modern Interior"
                            />
                            <div className="bg-slate-900 p-8 rounded-3xl text-white">
                                <h3 className="text-4xl font-black text-blue-400">100%</h3>
                                <p className="text-sm font-medium text-slate-400">Verified Listings</p>
                            </div>
                        </div>
                        <div>
                            <div className="bg-blue-600 p-8 rounded-3xl text-white mb-4">
                                <Building2 className="h-10 w-10 mb-4" />
                                <h4 className="text-xl font-bold">Trusted Network</h4>
                            </div>
                            <img 
                                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400" 
                                className="rounded-3xl shadow-2xl h-80 object-cover w-full"
                                alt="Facade"
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-xl">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">The UrbanStay Difference</h4>
                    <h2 className="text-5xl font-serif font-medium text-slate-900 leading-[1.1] mb-8">
                        Experience the gold standard of rentals
                    </h2>
                    <ul className="space-y-8">
                        {[
                            { title: "Meticulously Verified", text: "Every listing undergoes a 40-point verification process by our in-house inspectors." },
                            { title: "Direct Transparency", text: "Communicate directly with verified landlords. No ghosting, no hidden fees, no stress." },
                            { title: "Secure Modern Payments", text: "Integrated digital payments with institutional-grade security for your peace of mind." }
                        ].map((feat, i) => (
                            <li key={i} className="flex gap-4">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-black text-xs uppercase italic">
                                    0{i+1}
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-1">{feat.title}</h4>
                                    <p className="text-slate-500 leading-relaxed font-medium text-sm">{feat.text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Button className="mt-12 group bg-slate-900 h-14 px-8 rounded-lg font-bold uppercase tracking-widest text-xs">
                        Learn More <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden group">
            <div className="absolute inset-0 z-0 opacity-20 transition-opacity group-hover:opacity-30">
                <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Luxury Home" />
            </div>
            <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-serif font-medium leading-tight mb-8">
                    Landlords: Scale your <br /> <span className="text-primary italic">Rental Portfolio</span>
                </h2>
                <p className="max-w-xl mx-auto text-slate-400 mb-10 text-lg font-sans">
                    Join Nigeria's most professional property network. Reach thousands of verified high-intent tenants with ease.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white h-14 px-10 rounded-lg font-black uppercase tracking-widest text-xs">
                        List Your Space
                    </Button>
                    <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-white h-14 px-10 rounded-lg font-black uppercase tracking-widest text-xs">
                        Market Report
                    </Button>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
