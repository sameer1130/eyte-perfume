export function Stars({ rating, className }: { rating: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className={className} role="img" aria-label={`Rated ${rating} out of 5`}>
      <span className="relative inline-block text-[13px] leading-none tracking-[0.15em]">
        <span className="text-paper-3">★★★★★</span>
        <span className="absolute inset-0 overflow-hidden whitespace-nowrap text-gold" style={{ width: `${pct}%` }}>
          ★★★★★
        </span>
      </span>
    </span>
  );
}
