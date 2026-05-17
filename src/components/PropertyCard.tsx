import { Heart, MapPin, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: {
    propertyId: string;
    title: string;
    price: number;
    location: { city: string; state: string };
    images: string[];
    rating: number;
    category: string;
    status: string;
    amenities: string[];
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Card className="overflow-hidden border-none shadow-none bg-transparent h-full flex flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg mb-3">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
          <div className="absolute top-4 left-4 z-20">
            <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none px-2 py-1 text-[10px] uppercase font-black tracking-widest hover:bg-white shadow-sm">
              {property.category}
            </Badge>
          </div>
          <motion.img
            src={property.images[0] || `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800`}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute bottom-4 left-4 z-20 text-white">
            <div className="flex items-center gap-1 text-[11px] font-medium opacity-90">
              <MapPin className="h-3 w-3" />
              {property.location.city}, {property.location.state}
            </div>
          </div>
        </div>
        <CardContent className="px-0 py-0 flex-grow flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-lg leading-tight truncate group-hover:text-primary transition-colors">{property.title}</h3>
                <p className="text-sm text-slate-500 font-medium">
                    {property.amenities.slice(0, 2).join(" • ")}
                </p>
                <div className="flex items-center gap-1 mt-1 text-[10px] uppercase font-bold text-slate-400">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span>{property.rating} Verified Agent</span>
                </div>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="text-2xl font-serif text-primary font-bold">{formatCurrency(property.price)}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Per Annum</p>
            </div>
        </CardContent>
        <CardFooter className="px-0 py-4 flex items-center justify-between border-t border-slate-100 mt-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">US</div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">UrbanStay Certified</span>
            </div>
            <Link 
                to={`/properties/${property.propertyId}`}
                className={cn(buttonVariants({ size: "sm" }), "bg-slate-900 px-6 rounded-lg text-[11px] font-black uppercase tracking-wider h-9")}
            >
                View
            </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
