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
import { identity, links } from "@/data/profile";
import { author, siteDescription, siteUrl } from "@/lib/shared";

// Person schema for the front page: name, role, location and the profiles
// that corroborate it. Blog posts carry their own Article JSON-LD.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  url: siteUrl.toString(),
  image: new URL("/img/portrait.jpg", siteUrl).toString(),
  jobTitle: identity.role,
  description: siteDescription,
  address: { "@type": "PostalAddress", addressLocality: "Toronto", addressRegion: "ON", addressCountry: "CA" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Canadore College" },
  knowsAbout: ["Cisco IOS", "Routing and switching", "Network troubleshooting", "Proxmox VE", "Windows Server"],
  sameAs: [links.github, author.linkedin, links.credly],
};

export default function Home() {
  return (
    <div id="top" className="relative isolate flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <SiteHeader hasSectionNav />
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
      <SiteFooter />
    </div>
  );
}
