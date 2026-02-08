"use client";

import React from 'react';

interface AdminCategoryListItemProps {
  id: number;
  name: string;
  productCount: number;
  totalSales: number;
  onEdit: (id: number | string) => void;
  onDelete: (id: number | string) => void;
}

export default function AdminCategoryListItem({
  id,
  name,
  productCount,
  totalSales,
  onEdit,
  onDelete,
}: AdminCategoryListItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
      {/* Category Info */}
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium text-gray-900">{name}</p>
        <div className="flex gap-3">
          <p className="text-xs text-gray-500">Products: <span className="text-gray-900 font-medium">{productCount}</span></p>
          <p className="text-xs text-gray-500">Sales: <span className="text-gray-900 font-medium">{totalSales}</span></p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 items-center">
        <button
          onClick={() => onEdit(id)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label={`Edit category ${name}`}
        >
          <svg className="w-5 h-5 text-system-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          aria-label={`Delete category ${name}`}
        >
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
