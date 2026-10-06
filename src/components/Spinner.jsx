const SIZES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

const Spinner = ({ size = 'md', className = '' }) => (
  <span
    role="status"
    aria-label="Yuklanmoqda"
    className={`inline-block animate-spin rounded-full border-brand-200 border-t-brand-600 ${SIZES[size]} ${className}`}
  />
);

export default Spinner;
