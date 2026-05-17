import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { PROPERTY_CATEGORIES, AMENITIES, NIGERIAN_CITIES } from "@/lib/constants";

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const propertyData = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: Number(formData.get('price')),
        category: formData.get('category'),
        location: {
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            lat: 6.5244, // Default placeholder for Lagos
            lng: 3.3792
        },
        amenities: selectedAmenities,
        images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1600585154340-be6199f74709?auto=format&fit=crop&q=80&w=1200"],
        landlordId: auth.currentUser?.uid,
        status: 'AVAILABLE',
        rating: 5.0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "properties"), propertyData);
      toast.success("Property listed successfully!");
      navigate("/dashboard/listings");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addImage = () => {
      const url = prompt("Enter image URL");
      if (url) setImages([...images, url]);
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">List Your Property</h1>
          <p className="text-slate-500 font-medium italic">Share your high-quality space with our premium tenant network.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
          <Card className="rounded-[2rem] border-slate-200/60 shadow-xl overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                  <CardTitle className="text-xl font-black uppercase tracking-tight">Basic Information</CardTitle>
                  <CardDescription>Tell us about your property's main features.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                      <Label htmlFor="title">Listing Title</Label>
                      <Input id="title" name="title" placeholder="e.g. 5 Bedroom Smart Duplex" required className="h-12 rounded-xl" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select name="category" required>
                              <SelectTrigger className="h-12 rounded-xl">
                                  <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                  {PROPERTY_CATEGORIES.map(cat => (
                                      <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="price">Annual Rent (NGN)</Label>
                          <Input id="price" name="price" type="number" placeholder="5000000" required className="h-12 rounded-xl" />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="description">Detailed Description</Label>
                      <Textarea id="description" name="description" placeholder="Describe the ambiance, finishes, and neighborhood..." className="min-h-[150px] rounded-2xl p-4" required />
                  </div>
              </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-200/60 shadow-xl overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                  <CardTitle className="text-xl font-black uppercase tracking-tight">Location & Visuals</CardTitle>
                  <CardDescription>Where is it located? Show it off with high-quality photos.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" name="address" placeholder="123 Luxury Ave, Estate Name" required className="h-12 rounded-xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" name="city" placeholder="Lagos" required className="h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" name="state" placeholder="Lagos" required className="h-12 rounded-xl" />
                      </div>
                  </div>
                  
                  <div className="pt-4">
                      <Label className="mb-4 block text-lg font-bold">Property Photos</Label>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          {images.map((img, i) => (
                              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border">
                                  <img src={img} className="h-full w-full object-cover" />
                                  <button 
                                    type="button" 
                                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                  >
                                      <X className="h-3 w-3" />
                                  </button>
                              </div>
                          ))}
                          <button 
                            type="button" 
                            onClick={addImage}
                            className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all"
                          >
                              <Plus className="h-8 w-8 mb-2" />
                              <span className="text-xs font-bold uppercase tracking-widest">Add Photo</span>
                          </button>
                      </div>
                  </div>
              </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-200/60 shadow-xl overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                  <CardTitle className="text-xl font-black uppercase tracking-tight">Amenities</CardTitle>
                  <CardDescription>Check everything that applies.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {AMENITIES.map(amenity => (
                          <div key={amenity} className="flex items-center space-x-2">
                              <Checkbox 
                                id={amenity} 
                                onCheckedChange={(checked) => {
                                    if (checked) setSelectedAmenities([...selectedAmenities, amenity]);
                                    else setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                                }}
                              />
                              <label htmlFor={amenity} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  {amenity}
                              </label>
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
              <Button type="button" variant="ghost" className="h-14 px-8 font-bold" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" className="h-14 px-12 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl" disabled={isLoading}>
                  {isLoading && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                  Verify & Publish Listing
              </Button>
          </div>
      </form>
    </div>
  );
}
