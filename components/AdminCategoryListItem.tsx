"use client";

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

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
      <div className="flex gap-3 items-center">
        <button
          onClick={() => onEdit(id)}
          className="p-2 text-gray-400 hover:text-system-blue-light hover:bg-blue-50 rounded-full transition-all"
          aria-label={`Edit category ${name}`}
        >
          <Edit2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
          aria-label={`Delete category ${name}`}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
