'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useGetCustomerProfileQuery, usePartialUpdateCustomerProfileMutation } from '@/lib/api/customerApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { debounce } from 'lodash';
import { apiError } from '@/lib/utils';

// Define result type for Nominatim API
interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  boundingbox: string[];
}

export default function DeliveryAddressPage() {
  const router = useRouter();
  
  const { data: profile, isLoading: isLoadingProfile } = useGetCustomerProfileQuery();
  const [partialUpdateProfile, { isLoading: isUpdating, isSuccess, error }] = usePartialUpdateCustomerProfileMutation();

  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Removed dynamic import of leaflet-geosearch as we will use direct fetch

  const isDirty = profile ? (
    address !== (profile.shipping_address || '') ||
    city !== (profile.city || '') ||
    postalCode !== (profile.postal_code || '') ||
    (latitude !== profile.shipping_latitude && latitude !== null) ||
    (longitude !== profile.shipping_longitude && longitude !== null)
  ) : false;

  useEffect(() => {
    if (profile) {
      setAddress(profile.shipping_address || '');
      setCity(profile.city || '');
      setPostalCode(profile.postal_code || '');
      setLatitude(profile.shipping_latitude || null);
      setLongitude(profile.shipping_longitude || null);
    }
  }, [profile]);

  // Debounced search function using direct Nominatim API
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query || query.length < 3) {
        setSuggestions([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        // Using Nominatim API directly with Nigeria (ng) restriction
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=ng`
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const results: NominatimResult[] = await response.json();
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Search failed:', err);
        // Optionally clear suggestions on error or show a specific UI state
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    
    // Trigger search
    debouncedSearch(value);
  };

  const selectAddress = (result: NominatimResult) => {
    // Format the display name or use the raw one
    // Usually Nominatim display_name is very long, so we might want to keep the user's typed input or use the first part
    // For now, let's use the display_name but maybe truncate it if needed
    setAddress(result.display_name);
    setLatitude(parseFloat(result.lat));
    setLongitude(parseFloat(result.lon));
    
    // Auto-fill City and Postcode
    const addr = result.address;
    if (addr) {
        const cityName = addr.city || addr.town || addr.village || addr.state || '';
        if (cityName) setCity(cityName);
        if (addr.postcode) setPostalCode(addr.postcode);
    }

    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('shipping_address', address);
    formData.append('city', city);
    formData.append('postal_code', postalCode);
    
    if (latitude !== null) formData.append('shipping_latitude', latitude.toString());
    if (longitude !== null) formData.append('shipping_longitude', longitude.toString());

    try {
      await partialUpdateProfile(formData).unwrap();
      // Optionally show a success message before navigating
      router.back();
    } catch (err) {
      console.error('Failed to update address:', err);
    }
  };
  
  // Close suggestions on click outside
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);


  if (isLoadingProfile) {
    return (
        <AppLayout showBottomNav={false} userRole="customer">
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={false} userRole="customer">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200 relative">
          <button onClick={() => router.back()} className="absolute left-4 p-2 -ml-2">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-system-blue-light">Delivery Address</h1>
        </div>

        <form onSubmit={handleSave} className="p-6">
          {isSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">Address updated successfully!</p>
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{apiError(error, 'Failed to update address.')}</p>
            </div>
          )}

          <div className="space-y-6">
            <div ref={wrapperRef} className="relative">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <div className="relative">
                    <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={handleAddressChange}
                        onFocus={() => {
                            if (suggestions.length > 0) setShowSuggestions(true);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
                        placeholder="Start typing to search address..."
                        autoComplete="off"
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin h-4 w-4 border-2 border-system-blue-light border-t-transparent rounded-full"></div>
                        </div>
                    )}
                </div>
                
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((result, index) => (
                            <button
                                type="button"
                                key={index}
                                onClick={() => selectAddress(result)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                            >
                                {result.display_name}
                            </button>
                        ))}
                    </div>
                )}
                
                {/* Coordinates Feedback */}
                {latitude && longitude && (
                    <p className="mt-1 text-xs text-green-600 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Location coordinates set
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
                    placeholder="e.g., Lagos"
                />
            </div>
            <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                    id="postalCode"
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-system-blue-light focus:border-transparent"
                    placeholder="e.g., 100211"
                />
            </div>
          </div>
          

          {/* Action Buttons */}
          <div className="space-y-3 mt-8">
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full py-3.5 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
            <button
                type="button"
                onClick={() => router.back()}
                className="w-full py-3.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
                Cancel
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}