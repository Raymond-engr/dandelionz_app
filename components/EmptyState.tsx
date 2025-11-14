import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const ActionButton = actionHref ? (
    <Link
      href={actionHref}
      className="px-6 py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
    >
      {actionLabel}
    </Link>
  ) : onAction ? (
    <button
      onClick={onAction}
      className="px-6 py-3 bg-system-blue-light text-white rounded-lg font-medium hover:bg-[#020360] transition-colors"
    >
      {actionLabel}
    </button>
  ) : null;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-600 mb-6 text-center max-w-xs">
        {description}
      </p>
      {ActionButton}
    </div>
  );
}