"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Image assets for icons (replace with local imports or actual SVG components)
const imgEdit1 = "https://www.figma.com/api/mcp/asset/b72fea1b-85b3-4b9b-8389-b475560cd061"; // Edit icon
const imgTrash1 = "https://www.figma.com/api/mcp/asset/fa7ecb60-b92c-4823-9396-864fba78babf"; // Trash icon

interface AdminCategoryListItemProps {
  id: number;
  name: string;
  productCount: number;
  totalSales: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
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
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      {/* Category Info */}
      <div className="flex flex-col gap-1">
        <p className="text-base font-normal text-gray-900">{name}</p>
        <p className="text-sm font-normal text-gray-600">No of Products: {productCount}</p>
        <p className="text-sm font-semibold text-gray-900">No. of Sales: {totalSales}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 items-center">
        <button
          onClick={() => onEdit(id)}
          className="relative size-5 cursor-pointer"
          aria-label={`Edit category ${name}`}
        >
          <Image src={imgEdit1} alt="Edit Icon" layout="fill" objectFit="contain" />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="relative size-6 cursor-pointer"
          aria-label={`Delete category ${name}`}
        >
          <Image src={imgTrash1} alt="Delete Icon" layout="fill" objectFit="contain" />
        </button>
      </div>
    </div>
  );
}
