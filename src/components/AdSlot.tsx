interface AdSlotProps {
  label?: string;
  className?: string;
}

/**
 * Reserved ad space. Keep ads disabled until the site has been approved by the
 * chosen ad network and the required consent/privacy setup is complete.
 */
export function AdSlot({ label = 'Advertisement', className = '' }: AdSlotProps) {
  return (
    <div
      className={`min-h-20 w-full rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-center ${className}`}
      aria-label={label}
    >
      <span className="text-[10px] uppercase tracking-widest text-slate-300">{label}</span>
    </div>
  );
}
