import type { Metadata } from "next";
import { Bricolage_Grotesque, Source_Serif_4 } from "next/font/google";
import { DemoBar } from "@/components/demo/DemoBar";
import { cafe, isSample } from "@/data/cafe";

/* The café's own voice, loaded only on this route. */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: cafe.identity.metaTitle,
  description: cafe.identity.metaDescription,
};

export default function CafeDemoLayout({
  children,
}: LayoutProps<"/concepts/cafe-burger">) {
  return (
    <div
      className={`cafe-root ${bricolage.variable} ${sourceSerif.variable} min-h-dvh bg-cafe-paper text-cafe-char`}
    >
      <DemoBar sample={isSample} />
      {children}
    </div>
  );
}
