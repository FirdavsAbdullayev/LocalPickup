import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Package,
  title,
  description,
  actionLabel,
  actionTo,
  actionHref,
}) => (
  <div className="card mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
      <Icon className="h-8 w-8" strokeWidth={1.6} />
    </div>
    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    {description && <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">{description}</p>}
    {actionLabel && actionTo && (
      <Link to={actionTo} className="btn btn-primary mt-6">
        {actionLabel}
      </Link>
    )}
    {actionLabel && actionHref && (
      <a href={actionHref} className="btn btn-primary mt-6" target="_blank" rel="noreferrer">
        {actionLabel}
      </a>
    )}
  </div>
);

export default EmptyState;
