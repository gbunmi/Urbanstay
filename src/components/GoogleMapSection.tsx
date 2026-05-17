import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { formatCurrency, cn } from '@/lib/utils';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface PropertyMapProps {
  center: { lat: number, lng: number };
  properties?: any[];
  zoom?: number;
}

export default function GoogleMapSection({ center, properties = [], zoom = 12 }: PropertyMapProps) {
  if (!hasValidKey) {
    return (
      <div className="h-[400px] w-full rounded-[2rem] bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200">
        <div className="text-center p-8 max-w-sm">
          <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-tighter">Maps Unavailable</h3>
          <p className="text-xs text-slate-500 font-medium">Please add your `GOOGLE_MAPS_PLATFORM_KEY` to AI Studio Secrets to enable the interactive map view.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          mapId="URBAN_STAY_MAP"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          disableDefaultUI={true}
        >
          {properties.map((prop) => (
            <MapMarker key={prop.propertyId || Math.random()} property={prop} />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}

function MapMarker({ property }: { property: any }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={property.location}
        onClick={() => setOpen(true)}
      >
        <div className="bg-slate-900 text-white px-3 py-1.5 rounded-full font-black text-xs shadow-xl border-2 border-white hover:scale-110 transition-transform">
            {formatCurrency(property.price / 1000000)}M
        </div>
      </AdvancedMarker>
      {open && (
        <InfoWindow anchor={marker} onCloseClick={() => setOpen(false)}>
          <div className="p-2 max-w-[200px]">
            <img src={property.images?.[0]} className="w-full h-24 object-cover rounded-lg mb-2" />
            <h4 className="font-bold text-sm truncate">{property.title}</h4>
            <p className="text-[10px] text-slate-500">{property.location.city}</p>
            <a 
                href={`/properties/${property.propertyId}`}
                className={cn(buttonVariants({ size: "sm" }), "w-full h-8 mt-2 text-[10px] uppercase font-black flex items-center justify-center")}
            >
                View
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
