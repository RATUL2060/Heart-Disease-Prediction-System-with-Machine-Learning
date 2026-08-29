import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, AlertCircle } from 'lucide-react';
import MapViewer from '../components/NearbyCare/MapViewer';
import FacilityList from '../components/NearbyCare/FacilityList';
import { searchLocation } from '../services/api';
import { useNearbyFacilities } from '../hooks/useNearbyFacilities';
import toast from 'react-hot-toast';

const NearbyCarePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [center, setCenter] = useState(null); // [lat, lng]
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const hasManuallySearched = useRef(false);

  const { facilities, isLoading, isLocating, locationError, fetchNearby, requestLocation } = useNearbyFacilities();

  // Default to a generic center if none provided (e.g., New York City)
  const defaultCenter = [40.7128, -74.0060];
  const displayCenter = center || defaultCenter;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    hasManuallySearched.current = true;
    setIsSearching(true);
    try {
      // 1. Geocode the query
      const geocodeResults = await searchLocation(searchQuery);
      if (geocodeResults && geocodeResults.length > 0) {
        const topResult = geocodeResults[0];
        const lat = parseFloat(topResult.lat);
        const lon = parseFloat(topResult.lon);
        setCenter([lat, lon]);
        
        // 2. Fetch facilities
        fetchNearby(lat, lon);
      } else {
        toast.error('Location not found. Please try a different search.');
      }
    } catch (error) {
      toast.error('Failed to search location.');
    } finally {
      setIsSearching(false);
    }
  };

  const getUserLocation = () => {
    hasManuallySearched.current = false;
    requestLocation(null, (lat, lon) => {
      if (!hasManuallySearched.current) {
        setCenter([lat, lon]);
        setSearchQuery('My Current Location');
      }
    });
  };

  // On mount, try to get user location
  useEffect(() => {
    getUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fallback: load default facilities if geolocation fails
  useEffect(() => {
    if (locationError && !hasManuallySearched.current && facilities.length === 0) {
      fetchNearby(defaultCenter[0], defaultCenter[1]);
      setSearchQuery('New York City (Default)');
      toast('Showing default location. Please search manually.', { icon: 'ℹ️' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationError]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full h-full flex flex-col flex-grow">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <MapPin className="mr-3 h-8 w-8 text-brand-600" />
            Nearby Care
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Find hospitals, clinics, and cardiologists near you.
          </p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <button
            onClick={getUserLocation}
            disabled={isLocating}
            className="px-4 py-2 bg-brand-100 hover:bg-brand-200 text-brand-700 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 dark:text-brand-300 font-medium rounded-lg transition-colors flex items-center justify-center whitespace-nowrap"
          >
            {isLocating ? (
              <span className="flex items-center">
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-brand-500 border-t-transparent rounded-full"></div>
                Locating...
              </span>
            ) : (
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Use My Location
              </span>
            )}
          </button>
          
          <form onSubmit={handleSearch} className="flex relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, zip code..."
              className="pl-4 pr-10 py-2 w-full sm:w-64 border border-slate-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-dark-900 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-3 flex items-center text-slate-400 hover:text-brand-600 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6 w-full lg:h-[calc(100vh-240px)] min-h-[600px]">
        
        {/* Sidebar List */}
        <div className="w-full lg:w-1/3 flex flex-col bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-slate-200 dark:border-dark-700 overflow-hidden h-[400px] lg:h-full flex-shrink-0">
          <div className="p-4 border-b border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-900 shrink-0">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200">
              {facilities.length} {facilities.length === 1 ? 'Facility' : 'Facilities'} Found
            </h2>
          </div>
          <div className="p-4 overflow-y-auto flex-grow custom-scrollbar">
            <FacilityList 
              facilities={facilities} 
              isLoading={isLoading} 
              selectedFacility={selectedFacility}
              onSelectFacility={(fac) => setSelectedFacility(fac)}
            />
          </div>
        </div>

        {/* Map */}
        <div className="w-full lg:w-2/3 h-[500px] lg:h-full rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-dark-700 relative z-0">
          <MapViewer 
            center={displayCenter} 
            facilities={facilities}
            selectedFacility={selectedFacility}
            onSelectFacility={(fac) => setSelectedFacility(fac)}
          />
        </div>
        
      </div>
    </div>
  );
};

export default NearbyCarePage;
