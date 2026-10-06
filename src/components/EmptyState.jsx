import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

const EmptyState = ({ icon: Icon = Package, title, description, actionLabel, actionTo }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="h-20 w-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
        {typeof Icon === 'function' || typeof Icon === 'object' ? (
          <Icon className="h-10 w-10 text-indigo-600 stroke-[1.5]" />
        ) : (
          <span className="text-3xl">{Icon}</span>
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-6 max-w-sm text-sm leading-relaxed">{description}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-sm text-sm"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
