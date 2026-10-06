import Spinner from './Spinner';

export const SkeletonCard = () => (
  <div className="card overflow-hidden">
    <div className="skeleton h-44 rounded-none" />
    <div className="space-y-3 p-4">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
      <div className="skeleton h-6 w-1/3" />
      <div className="skeleton h-10 w-full rounded-xl" />
    </div>
  </div>
);

export const SkeletonShopCard = () => (
  <div className="card overflow-hidden">
    <div className="skeleton h-36 rounded-none" />
    <div className="space-y-3 p-5">
      <div className="skeleton h-5 w-2/3" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-4/5" />
      <div className="skeleton h-10 w-full rounded-xl" />
    </div>
  </div>
);

export const PageLoader = () => (
  <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-sm text-slate-500">
    <Spinner size="lg" />
    Yuklanmoqda...
  </div>
);

export default SkeletonCard;
