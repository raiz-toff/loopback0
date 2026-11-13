import About from "@/components/about";
import Certifications from "@/components/certifications";
import Experiences from "@/components/experiences";
import FeaturedPosts from "@/components/featured-posts";
import LabLog from "@/components/lab-log";
import Overview from "@/components/overview";
import { Separator } from "@/components/panel";
import ProfileHeader from "@/components/profile-header";
import Projects from "@/components/projects";
import SectionNav from "@/components/section-nav";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import SocialLinks from "@/components/social-links";
import TechStack from "@/components/tech-stack";
import { PublishBottomNav } from "@/components/bottom-nav/context";
import { HOME_SECTIONS } from "@/components/bottom-nav/home-sections";
import type { Metadata } from "next";
import { personNode, websiteNode, jsonLd } from "@/lib/person-schema";
import { siteOpenGraph } from "@/lib/site-metadata";
import { ConductorStripe } from "@/components/conductor-stripe";

// Person + WebSite for the front page, from the shared entity in
// lib/person-schema.ts (no jobTitle there, on purpose: see that file).
const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [personNode, websiteNode],
};

// The home page's own canonical and og:url. A page's openGraph replaces the
// layout's, so it spreads the shared defaults and adds the url.
export const metadata: Metadata = {
  alternates: { canonical: "/", types: { "application/rss+xml": "/rss.xml" } },
  openGraph: { ...siteOpenGraph, url: "/" },
};

export default function Home() {
  return (
    <div id="top" className="relative isolate flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(homeJsonLd) }}
      />
      <SiteHeader />
      <SectionNav />
      <PublishBottomNav sections={{ label: "Sections", spy: true, items: HOME_SECTIONS }} />
      <main className="max-w-screen overflow-x-clip px-2">
        <div className="mx-auto md:max-w-3xl">
          <ProfileHeader />
          <Separator />

          <SocialLinks />
          <Overview />
          <Separator />

          <About />
          <Separator />


          <TechStack />
          <Separator />

          <Experiences />
          <Separator />

          <Certifications />
          <Separator />

          {/* Renders (with its own trailing divider) only when posts are featured */}
          <FeaturedPosts />

          <LabLog />
          <Separator />

          <Projects />
        </div>
      </main>
      {/* Brand signature: the T568B conductor stripe above the footer.
          Homepage-only for now; moves into SiteFooter to show site-wide. */}
      <div className="max-w-screen overflow-x-clip px-2">
        <div className="mx-auto border-x border-line md:max-w-3xl">
          <ConductorStripe />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
