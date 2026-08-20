'use client';

import React from 'react';
import { Store, Filter } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { useGetAllVendorsQuery, Vendor } from '@/lib/api/adminApi';
import { useInfiniteList, useInfiniteScrollTrigger, selectStandardEnvelope } from '@/lib/hooks/use-infinite-list';
import UserListItemSkeleton from '@/components/UserListItemSkeleton';
import Skeleton from '@/components/ui/Skeleton';

export default function VendorManagement() {
  const router = useRouter();

  // Was a single unpaginated useGetAllVendorsQuery() - every vendor on the
  // platform, in one response, growing with signups.
  const {
    items: vendors,
    isInitialLoading: isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    error,
  } = useInfiniteList(useGetAllVendorsQuery, {}, selectStandardEnvelope<Vendor>);
  const sentinelRef = useInfiniteScrollTrigger(loadMore, hasMore && !isFetchingMore);

  // Total/Active/Suspended used to be computed from vendors array
  // .length/.filter() - correct only while every vendor was fetched at
  // once. Now sourced from the backend's count field instead.
  const { data: totalResp } = useGetAllVendorsQuery({ page_size: 1 });
  const { data: activeResp } = useGetAllVendorsQuery({ is_active: true, page_size: 1 });
  const totalVendors = totalResp?.data?.count ?? 0;
  const activeVendors = activeResp?.data?.count ?? 0;
  const suspendedVendors = Math.max(totalVendors - activeVendors, 0);

  const handleVendorClick = (vendorId: string) => {
    router.push(`/admin/vendor/${vendorId}`);
  };

  if (error) {
    return (
      <AppLayout showBottomNav={true} userRole="admin">
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load vendors</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-system-blue-light text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={true} userRole="admin">
      <div className="min-h-screen bg-white pb-20">
        <div className="p-4 border-b border-gray-200 text-center">
          <h1 className="text-lg font-semibold text-gray-900">Vendor</h1>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">Approve, suspend and deactivate your vendors</p>
          
          {/* Total Vendors Card */}
          <div className="bg-system-blue-light text-white rounded-lg p-4 mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Vendors</p>
              {isLoading ? (
                <Skeleton className="h-10 w-16 bg-white/20" />
              ) : (
                <p className="text-3xl font-bold">{totalVendors}</p>
              )}
            </div>
            <Store className="w-12 h-12 opacity-80" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-1">Active Vendors</p>
              {isLoading ? (
                <Skeleton className="h-8 w-12 bg-green-200" />
              ) : (
                <p className="text-2xl font-bold text-gray-900">{activeVendors}</p>
              )}
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-1">Suspended Vendors</p>
              {isLoading ? (
                <Skeleton className="h-8 w-12 bg-red-200" />
              ) : (
                <p className="text-2xl font-bold text-gray-900">{suspendedVendors}</p>
              )}
            </div>
          </div>

          {/* Vendors List Header */}
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">All Vendors</h2>
            <button><Filter className="w-5 h-5 text-gray-600" /></button>
          </div>

          {/* Vendors List */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <UserListItemSkeleton key={i} />
              ))}
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-12">
              <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No vendors found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {vendors.map((vendor: Vendor) => (
                <button 
                  key={vendor.user_uuid}
                  onClick={() => handleVendorClick(vendor.user_uuid)}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                    {vendor.store_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{vendor.store_name}</p>
                    <p className="text-xs text-gray-600 truncate">{vendor.email}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    vendor.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {vendor.is_active ? 'Active' : 'Suspended'}
                  </span>
                </button>
              ))}
            </div>
          )}
          <div ref={sentinelRef} className="h-1" />
          {isFetchingMore && (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-system-blue-light border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}