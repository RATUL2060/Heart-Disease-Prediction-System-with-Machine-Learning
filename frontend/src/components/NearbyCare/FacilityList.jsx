import React from 'react';
import { MapPin, Navigation, Phone, Globe } from 'lucide-react';

const FacilityList = ({ facilities, isLoading, selectedFacility, onSelectFacility }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!facilities || facilities.length === 0) {
    return (
      <div className="text-center p-8 bg-white dark:bg-dark-900 rounded-lg border border-slate-200 dark:border-dark-800">
        <MapPin className="h-12 w-12 text-slate-300 dark:text-dark-700 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No facilities found</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search location or radius.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {facilities.map((facility) => (
        <div 
          key={facility.id}
          onClick={() => onSelectFacility(facility)}
          className={`p-4 rounded-lg border transition-all cursor-pointer ${
            selectedFacility?.id === facility.id 
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-md' 
              : 'border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 hover:border-brand-300 hover:shadow-sm'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{facility.name}</h3>
              <span className="inline-block px-2 py-1 bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-300 text-xs rounded-full mt-1">
                {facility.type}
              </span>
            </div>
          </div>
          
          <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {facility.address && (
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-slate-400 shrink-0" />
                <span>{facility.address}</span>
              </div>
            )}
            
            {facility.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-slate-400 shrink-0" />
                <a href={`tel:${facility.phone}`} className="hover:text-brand-600">{facility.phone}</a>
              </div>
            )}
            
            {facility.website && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-slate-400 shrink-0" />
                <a href={facility.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 truncate">
                  {facility.website}
                </a>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-dark-800 flex justify-end">
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
              onClick={(e) => e.stopPropagation()}
            >
              <Navigation className="h-4 w-4 mr-1" />
              Get Directions
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FacilityList;
