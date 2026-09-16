import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Phone, 
  Mail, 
  Clock, 
  Filter, 
  Store as StoreIcon,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import L from 'leaflet';
import { Store } from '../types';
import { useBrand } from '../context/BrandContext';
import { useStoreData } from '../context/StoreDataContext';

export const StoreLocator: React.FC = () => {
  const { brandName } = useBrand();
  const { store } = useStoreData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store>(store);

  useEffect(() => {
    setSelectedStore(store);
  }, [store]);

  const stores = [store];

  // Filtered stores
  const filteredStores = stores.filter(s => {
    const query = searchQuery.toLowerCase().trim();
    return !query || 
      s.name.toLowerCase().includes(query) ||
      s.city.toLowerCase().includes(query) ||
      s.address.toLowerCase().includes(query);
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create custom red pin icon
      const redIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color: #E30613; color: white; border: 2px solid white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-weight: bold; font-size: 14px;">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const map = L.map(mapContainerRef.current).setView([store.lat || 15.6322, store.lng || 77.2728], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add markers for all stores
      stores.forEach(s => {
        const marker = L.marker([s.lat, s.lng], { icon: redIcon }).addTo(map);
        
        const popupContent = `
          <div style="font-family: Inter, sans-serif; min-width: 180px; padding: 4px;">
            <strong style="color: #E30613; font-size: 13px; display: block; margin-bottom: 4px;">${s.name}</strong>
            <p style="font-size: 11px; color: #4B5563; margin: 0 0 6px 0;">${s.address}</p>
            <p style="font-size: 11px; margin: 0 0 8px 0;"><strong>Phone:</strong> ${s.phone}</p>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}" 
              target="_blank" 
              style="display: inline-block; background-color: #0796D2; color: white; font-size: 11px; font-weight: bold; text-decoration: none; padding: 4px 10px; border-radius: 4px;"
            >
              Get Directions ↗
            </a>
          </div>
        `;
        marker.bindPopup(popupContent);

        marker.on('click', () => {
          setSelectedStore(s);
        });

        markersRef.current[s.id] = marker;
      });
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([store.lat, store.lng], 13, { duration: 1.2 });
      const marker = markersRef.current[store.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar (Recreates reference search bar "Search for Outlets here..") */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-5">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Outlets input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for Outlets here by city, area or street name..."
              className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-4 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E30613] placeholder-gray-400"
            />
          </div>


        </div>

        {/* Count display */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <StoreIcon className="w-4 h-4 text-[#0796D2]" />
            <span>Showing <strong>{filteredStores.length}</strong> outlet</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
            Store open today
          </span>
        </div>
      </div>

      {/* Main Layout: Map + Store Cards Grid / Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Store Cards List */}
        <div className="lg:col-span-5 space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
          {filteredStores.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border text-gray-500">
              <StoreIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="font-bold text-sm">No outlets match your search.</p>
              <p className="text-xs mt-1">Try selecting a different city or clearing filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                }}
                className="mt-3 text-xs text-[#E30613] font-bold hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredStores.map(store => {
              const isSelected = selectedStore?.id === store.id;
              const directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;

              return (
                <div
                  key={store.id}
                  onClick={() => handleSelectStore(store)}
                  className={`bg-white rounded-xl p-4 border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                    isSelected
                      ? 'border-[#E30613] ring-2 ring-red-100 bg-red-50/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-sm text-gray-900 leading-tight">
                      {store.name}
                    </h3>
                    <a
                      href={directionUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-1 bg-[#0796D2] hover:bg-[#067ea8] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 transition-colors"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Get Directions</span>
                    </a>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 mt-2 text-xs text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-[#E30613] shrink-0 mt-0.5" />
                    <span>{store.address}</span>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-gray-100 text-[11px] text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <a href={`tel:${store.phone}`} className="hover:text-[#E30613] font-mono">
                        {store.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{store.hours}</span>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{store.email}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Interactive Leaflet Map */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md h-[400px] lg:h-[600px] relative">
          <div ref={mapContainerRef} className="w-full h-full" />
          
          {/* Map floating card for active store */}
          {selectedStore && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-3.5 rounded-xl shadow-xl border border-gray-200 z-20 flex items-center justify-between gap-3 animate-fade-in">
              <div>
                <span className="text-[10px] font-bold text-[#E30613] uppercase tracking-wider block">
                  Selected Store
                </span>
                <h4 className="text-xs sm:text-sm font-black text-gray-900 leading-tight">
                  {selectedStore.name}
                </h4>
                <p className="text-[11px] text-gray-600 line-clamp-1 mt-0.5">
                  {selectedStore.address}
                </p>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.lat},${selectedStore.lng}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#E30613] hover:bg-[#c40510] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1 shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
