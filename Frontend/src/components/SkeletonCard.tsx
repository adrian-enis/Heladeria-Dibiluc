// src/components/SkeletonCard.tsx
export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image" />
      <div className="skeleton-info">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-desc" />
        <div className="skeleton skeleton-price" />
      </div>
      <div className="skeleton skeleton-btn" />
    </div>
  )
}