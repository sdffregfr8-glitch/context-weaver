import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  lines?: number;
  className?: string;
}

export function SkeletonLoader({ lines = 3, className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="skeleton-shimmer h-4 rounded"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex gap-4">
      <div className="skeleton-shimmer h-10 w-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton-shimmer h-4 w-3/4 rounded" />
        <div className="skeleton-shimmer h-4 w-1/2 rounded" />
        <div className="skeleton-shimmer h-4 w-2/3 rounded" />
      </div>
    </div>
  );
}

export function FileSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="skeleton-shimmer h-10 w-10 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton-shimmer h-4 w-32 rounded" />
        <div className="skeleton-shimmer h-3 w-16 rounded" />
      </div>
    </div>
  );
}
