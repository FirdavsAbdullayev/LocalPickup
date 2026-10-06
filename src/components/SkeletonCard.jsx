import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-5 bg-gray-200 rounded w-1/3" />
    </div>
    <div className="px-4 pb-4">
      <div className="h-10 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

export const SkeletonShopCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    <div className="h-40 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-4/5" />
      <div className="h-10 bg-gray-200 rounded-xl mt-2" />
    </div>
  </div>
);

export default SkeletonCard;
