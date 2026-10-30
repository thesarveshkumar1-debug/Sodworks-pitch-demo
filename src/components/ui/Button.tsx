import Link from "next/link";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
};

const base =
  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-300 ease-sod";

const variants = {
  primary: "bg-laterite-500 text-bone-50 hover:bg-laterite-300 hover:text-ink-900",
  ghost: "border border-ink-600 text-bone-50 hover:border-laterite-500 hover:text-laterite-300",
} as const;

export function Button({ href, children, variant = "primary" }: ButtonProps) {
  const className = `${base} ${variants[variant]}`;

  // Same-page anchors do not need the router.
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
