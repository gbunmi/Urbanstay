import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Building2, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  MapPin, 
  MessageSquare, 
  Share2, 
  ShieldCheck, 
  Star, 
  Zap, 
  Wifi, 
  Car, 
  Waves,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { motion } from "motion/react";
import { toast } from "sonner";

const AMENITY_ICONS: Record<string, any> = {
  "24/7 Power": Zap,
  "Gated Security": ShieldCheck,
  "Pool": Waves,
  "Fibre Internet": Wifi,
  "Parking Space": Car,
  "Gym": Building2,
};

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      // Simulate fetch
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockProperty = {
        propertyId: id,
        title: "Luxury Duplex in Banana Island",
        description: "Experience unparalleled luxury in this stunning 5-bedroom duplex located in the heart of Banana Island, Lagos. This property features premium architectural finishes, high ceilings, and state-of-the-art home automation. Enjoy breathtaking views of the lagoon and access to world-class amenities within the estate.",
        price: 15000000,
        location: { address: "Plot 12, Ocean View Drive", city: "Ikoyi", state: "Lagos", lat: 6.45, lng: 3.42 },
        images: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1600607687940-c52af0369996?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200"
        ],
        rating: 4.8,
        category: "duplex",
        status: "AVAILABLE",
        amenities: ["24/7 Power", "Gated Security", "Pool", "Fibre Internet", "Gym", "Parking Space"],
        landlord: {
            fullName: "Alhaji Kunle Williams",
            avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
            joinedAt: "2023",
            verified: true,
            role: "LANDLORD"
        }
      };
      
      setProperty(mockProperty);
      setIsLoading(false);
    }
    fetchProperty();
  }, [id]);

  if (isLoading) {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="h-10 w-10 animate-spin text-slate-400 mb-4" />
            <p className="text-slate-500 font-medium">Fine-tuning your property view...</p>
        </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div className="space-y-4">
                <Link to="/properties" className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                    <ChevronLeft className="h-4 w-4" /> Back to search
                </Link>
                <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 uppercase text-[10px] tracking-widest font-black">Verified Listing</Badge>
                    <div className="flex items-center gap-1 text-sm font-bold text-yellow-500">
                        <Star className="h-4 w-4 fill-yellow-500" />
                        <span>{property.rating}</span>
                        <span className="text-slate-400 font-normal ml-1">(42 Reviews)</span>
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                    {property.title}
                </h1>
                <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location.address}, {property.location.city}, {property.location.state}</span>
                </div>
            </div>

            <div className="flex gap-2">
                <Button variant="outline" className="rounded-full gap-2 border-slate-200">
                    <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button variant="outline" className="rounded-full gap-2 border-slate-200">
                    <Heart className="h-4 w-4" /> Wishlist
                </Button>
            </div>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-12">
            <div className="lg:col-span-3 relative aspect-[16/9] overflow-hidden rounded-[2rem] shadow-lg">
                <motion.img 
                   key={activeImage}
                   initial={{ opacity: 0.8, scale: 1.05 }}
                   animate={{ opacity: 1, scale: 1 }}
                   src={property.images[activeImage]} 
                   className="h-full w-full object-cover"
                   alt="Main View"
                />
                <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3">
                    {property.images.map((_: any, i: number) => (
                        <button 
                            key={i} 
                            onClick={() => setActiveImage(i)}
                            className={`h-2 transition-all rounded-full ${i === activeImage ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'}`}
                        />
                    ))}
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white hover:bg-white/40 rounded-full"
                    onClick={() => setActiveImage(prev => (prev === 0 ? property.images.length - 1 : prev - 1))}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white hover:bg-white/40 rounded-full"
                    onClick={() => setActiveImage(prev => (prev === property.images.length - 1 ? 0 : prev + 1))}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
            <div className="hidden lg:flex flex-col gap-4 overflow-y-auto max-h-[500px] no-scrollbar">
                {property.images.map((img: string, i: number) => (
                    <button 
                        key={i} 
                        onClick={() => setActiveImage(i)}
                        className={`aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all ${i === activeImage ? 'border-slate-900 shadow-md scale-95' : 'border-transparent opacity-80 hover:opacity-100'}`}
                    >
                        <img src={img} className="h-full w-full object-cover" />
                    </button>
                ))}
            </div>
        </div>

        {/* Content & Booking Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
                <div>
                   <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-6">Property Overview</h2>
                   <p className="text-slate-600 leading-relaxed text-lg font-medium italic">
                       "{property.description}"
                   </p>
                </div>

                <Separator />

                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-6">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {property.amenities.map((amenity: string) => {
                            const Icon = AMENITY_ICONS[amenity] || Building2;
                            return (
                                <div key={amenity} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-slate-900 transition-all cursor-default">
                                    <Icon className="h-5 w-5 text-slate-900 group-hover:text-blue-400" />
                                    <span className="text-sm font-bold text-slate-700 group-hover:text-white uppercase tracking-tight">{amenity}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Separator />

                <div className="flex items-center gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                        <AvatarImage src={property.landlord.avatarUrl} />
                        <AvatarFallback>{property.landlord.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-black text-slate-900 text-lg">{property.landlord.fullName}</h3>
                            {property.landlord.verified && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
                        </div>
                        <p className="text-sm text-slate-500 font-medium">Verified Property Owner • Member since {property.landlord.joinedAt}</p>
                    </div>
                    <Button variant="outline" className="rounded-full gap-2 border-slate-300">
                        <MessageSquare className="h-4 w-4" /> Message Landlord
                    </Button>
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-32">
                    <Card className="border-slate-200/60 shadow-2xl p-2 rounded-[2rem] overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(property.price)}</span>
                                <span className="text-slate-400 font-medium tracking-tight">/year</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Inspection Date</Label>
                                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                                        <Calendar className="h-4 w-4 text-blue-500" />
                                        <span>Select a date...</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Duration</Label>
                                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                                        <Building2 className="h-4 w-4 text-blue-500" />
                                        <span>12 Months (Minimum)</span>
                                    </div>
                                </div>
                            </div>

                            <Button 
                                className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200"
                                onClick={() => toast.success("Inspection request sent to landlord!")}
                            >
                                Schedule Inspection
                            </Button>

                            <p className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">
                                You won't be charged yet
                            </p>

                            <Separator className="my-6" />

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm font-medium text-slate-600">
                                    <span>Rent (1 Year)</span>
                                    <span>{formatCurrency(property.price)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-slate-600">
                                    <span>Legal & Agency (10%)</span>
                                    <span>{formatCurrency(property.price * 0.1)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-slate-600">
                                    <span>Caution Deposit</span>
                                    <span>{formatCurrency(500000)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between text-lg font-black text-slate-900 tracking-tight">
                                    <span>Total Move-in</span>
                                    <span>{formatCurrency(property.price * 1.1 + 500000)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-8 flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <ShieldCheck className="h-10 w-10 text-blue-600 flex-shrink-0" />
                        <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider leading-relaxed">
                            UrbanStay Protection <br />
                            <span className="text-blue-600 font-medium lowercase">Secure your move with our verified payment escrow system.</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
