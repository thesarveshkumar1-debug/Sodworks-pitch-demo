export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-ink-700 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-bone-300 uppercase">
      {children}
    </span>
  );
}
