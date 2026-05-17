import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Grid, List as ListIcon, Search, SlidersHorizontal } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import PropertyCard from "@/components/PropertyCard";
import { PROPERTY_CATEGORIES, NIGERIAN_CITIES } from "@/lib/constants";
import { motion, AnimatePresence } from "motion/react";
import { collection, query, getDocs, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);

  const categoryFilter = searchParams.get("category") || "all";
  const searchFilter = searchParams.get("q") || "";

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        // In a real app, we'd use Firestore. For now, let's use mock data to ensure something displays beautifully.
        // We simulate a fetch delay.
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockData = [
            {
                propertyId: "1",
                title: "Luxury Duplex in Banana Island",
                price: 15000000,
                location: { city: "Ikoyi", state: "Lagos" },
                images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800"],
                rating: 4.8,
                category: "duplex",
                status: "AVAILABLE",
                amenities: ["24/7 Power", "Gated Security", "Pool"]
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
                amenities: ["Gated Security", "Parking Space"]
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
                amenities: ["Fibre Internet", "Gym"]
              },
              {
                propertyId: "4",
                title: "Executive Penthouse Lekki",
                price: 25000000,
                location: { city: "Lekki", state: "Lagos" },
                images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"],
                rating: 5.0,
                category: "apartment",
                status: "AVAILABLE",
                amenities: ["Solar Power", "Smart Home"]
              },
              {
                propertyId: "5",
                title: "Port Harcourt Garden Estate",
                price: 5500000,
                location: { city: "Port Harcourt", state: "Rivers" },
                images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"],
                rating: 4.3,
                category: "house",
                status: "AVAILABLE",
                amenities: ["Borehole", "Security"]
              },
              {
                propertyId: "6",
                title: "Affordable Flat in Ibadan",
                price: 1200000,
                location: { city: "Ibadan", state: "Oyo" },
                images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800"],
                rating: 4.0,
                category: "apartment",
                status: "AVAILABLE",
                amenities: ["Gated Security"]
              }
        ];

        let filtered = mockData;
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(p => p.category === categoryFilter);
        }
        if (searchFilter) {
            filtered = filtered.filter(p => p.title.toLowerCase().includes(searchFilter.toLowerCase()) || p.location.city.toLowerCase().includes(searchFilter.toLowerCase()));
        }

        setProperties(filtered);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [categoryFilter, searchFilter]);

  return (
    <div className="bg-[#FDFDFD] min-h-screen pb-20">
      <div className="bg-white border-b border-slate-100 sticky top-20 z-40 px-6 py-6 shadow-sm">
        <div className="container mx-auto flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="relative w-full lg:w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by city, title or neighborhood..." 
              className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              value={searchFilter}
              onChange={(e) => setSearchParams({ q: e.target.value, category: categoryFilter })}
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
             <Button 
                variant="ghost" 
                className={cn(
                    "rounded-lg h-10 px-6 text-[11px] font-black uppercase tracking-widest transition-all",
                    categoryFilter === 'all' ? "bg-primary/10 text-primary shadow-none" : "text-slate-500 hover:bg-slate-100"
                )}
                onClick={() => setSearchParams({ q: searchFilter, category: 'all' })}
             >
                 All
             </Button>
             {PROPERTY_CATEGORIES.map(cat => (
                 <Button 
                    key={cat.id}
                    variant="ghost" 
                    className={cn(
                        "rounded-lg h-10 px-6 text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        categoryFilter === cat.id ? "bg-primary/10 text-primary shadow-none" : "text-slate-500 hover:bg-slate-100"
                    )}
                    onClick={() => setSearchParams({ q: searchFilter, category: cat.id })}
                 >
                     {cat.label}
                 </Button>
             ))}
          </div>

          <div className="hidden xl:flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
             <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-9 w-9 rounded-md transition-all", viewMode === 'grid' ? "bg-white shadow-sm text-primary" : "text-slate-400")}
                onClick={() => setViewMode('grid')}
             >
                 <Grid className="h-4 w-4" />
             </Button>
             <Button 
                variant="ghost" 
                size="icon"
                className={cn("h-9 w-9 rounded-md transition-all", viewMode === 'list' ? "bg-white shadow-sm text-primary" : "text-slate-400")}
                onClick={() => setViewMode('list')}
             >
                 <ListIcon className="h-4 w-4" />
             </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12">
        <div className="flex justify-between items-end mb-10 border-b border-slate-100 pb-8">
            <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Real-time Inventory</h4>
                <h2 className="text-4xl font-serif font-medium text-slate-900 tracking-tight">
                    {properties.length} <span className="text-slate-400">matching results</span>
                </h2>
            </div>
            
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="outline" className="gap-2 rounded-lg h-11 px-8 border-slate-200 font-bold uppercase tracking-widest text-[10px] shadow-sm hover:shadow-md transition-all">
                      <SlidersHorizontal className="h-4 w-4" /> Preferences
                  </Button>
                }
              />
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Advanced Filters</SheetTitle>
                  <SheetDescription>Narrow down your property search.</SheetDescription>
                </SheetHeader>
                <div className="mt-8 space-y-6">
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-tight">Price Range (NGN)</h4>
                        <div className="grid grid-cols-2 gap-2">
                             <Input placeholder="Min" type="number" />
                             <Input placeholder="Max" type="number" />
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-tight">Cities</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {NIGERIAN_CITIES.map(city => (
                                <div key={city} className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span className="text-sm">{city}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button className="w-full bg-slate-900 mt-8 h-12 rounded-xl">Apply Filters</Button>
                </div>
              </SheetContent>
            </Sheet>
        </div>

        <AnimatePresence mode="wait">
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-60 w-full rounded-2xl" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                    ))}
                </div>
            ) : properties.length > 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "flex flex-col gap-6"}
                >
                    {properties.map((prop) => (
                        <PropertyCard key={prop.propertyId} property={prop} />
                    ))}
                </motion.div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-40 text-center"
                >
                    <Search className="h-16 w-16 text-slate-200 mb-6" />
                    <h3 className="text-2xl font-bold text-slate-400">No properties found</h3>
                    <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
                    <Button 
                        variant="link" 
                        className="mt-4 text-blue-600 font-bold underline"
                        onClick={() => setSearchParams({ category: 'all' })}
                    >
                        Reset search
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
