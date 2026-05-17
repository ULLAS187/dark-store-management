/**
 * Loading Spinner Component
 */

export default function Loader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-primary-500/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-2 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
