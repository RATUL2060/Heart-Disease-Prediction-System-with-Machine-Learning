import { useState, useCallback } from 'react';
import { getNearbyFacilities } from '../services/api';
import toast from 'react-hot-toast';

// Helper to calculate distance between two coordinates in km (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
};

export const useNearbyFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const fetchNearby = useCallback(async (lat, lon, isHighRisk = null) => {
    setIsLoading(true);
    try {
      const data = await getNearbyFacilities(lat, lon, 10000); // 10km radius
      if (data && data.facilities) {
        let fetchedFacilities = data.facilities.map(fac => ({
          ...fac,
          distance: calculateDistance(lat, lon, fac.lat, fac.lon)
        }));

        // Sort by distance first
        fetchedFacilities.sort((a, b) => a.distance - b.distance);

        // If risk level is provided, prioritize based on risk
        if (isHighRisk !== null) {
          if (isHighRisk) {
            // High risk: prioritize Cardiologists, then Hospitals, then Clinics
            const getPriority = (type) => {
              const t = type.toLowerCase();
              if (t.includes('cardiologist')) return 1;
              if (t.includes('hospital')) return 2;
              return 3;
            };
            fetchedFacilities.sort((a, b) => {
              const pA = getPriority(a.type);
              const pB = getPriority(b.type);
              if (pA !== pB) return pA - pB;
              return a.distance - b.distance; // Fallback to distance
            });
          } else {
            // Low risk: prioritize general Clinics/Hospitals, or just rely on distance
            // We leave the distance sort as the primary factor for low risk.
          }
        }

        setFacilities(fetchedFacilities);
        return fetchedFacilities;
      }
      return [];
    } catch (error) {
      toast.error('Failed to load nearby facilities.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestLocation = useCallback((isHighRisk = null, onSuccess = null) => {
    setIsLocating(true);
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserLocation([lat, lon]);
          fetchNearby(lat, lon, isHighRisk).then(facs => {
            if (onSuccess) onSuccess(lat, lon, facs);
          });
          setIsLocating(false);
        },
        (error) => {
          console.error(error);
          const errMsg = 'We couldn\'t access your location. Search for a location manually or enable location access.';
          setLocationError(errMsg);
          toast.error('Could not get your location.');
          setIsLocating(false);
        },
        { timeout: 8000, maximumAge: 60000, enableHighAccuracy: true }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      toast.error('Geolocation is not supported by your browser.');
      setIsLocating(false);
    }
  }, [fetchNearby]);

  return {
    facilities,
    setFacilities,
    isLoading,
    isLocating,
    locationError,
    userLocation,
    setUserLocation,
    fetchNearby,
    requestLocation
  };
};
