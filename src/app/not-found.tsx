import type { Metadata } from "next";
import Link from "next/link";
import { CableTester } from "@/components/cable-tester";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      {/* `group`: hovering the home link plugs the cable into the tester. */}
      <div className="group flex w-full max-w-xl flex-col items-center gap-6 text-center">
        <CableTester />
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">404</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">This page isn&apos;t connected.</h1>
          <p className="mt-2 text-muted-foreground">The link you followed doesn&apos;t lead anywhere on this site.</p>
          <Link href="/" className="mt-4 inline-block font-medium underline underline-offset-4">
            Back to the homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
