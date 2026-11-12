import type { ReactNode } from "react";
import { notFound } from "next/navigation";

/**
 * Keeps every /brand-lab route out of production. The lab is a local design
 * playground: outside `next dev` each route under it renders the 404 page.
 *
 * @param children - The lab page.
 * @returns The page in development.
 * @throws The Next.js not-found error outside development.
 */
export default function BrandLabLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV !== "development") notFound();
  return children;
}
