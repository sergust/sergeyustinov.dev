// import Link from "next/link";
import HeaderComponent from "@/components/main/HeaderComponent";
// import HeroComponent from "@/components/main/HeroComponent";
import ProjectsComponent from "@/components/main/ProjectsComponent";
// import SkillsComponent from "@/components/main/SkillsComponent";
import CTAComponent from "@/components/main/CTAComponent";
// import Testimonial1Small from "@/components/Testimonial1Small";
import Testimonials3 from "@/components/Testimonials3";
// import CTA from "@/components/CTA";
import PlausibleProvider from "next-plausible";
// import Hero from "@/components/Hero";
import FooterComponent from "@/components/main/FooterComponent";
import HeroContent from "@/components/main/HeroContent";

export default function Page() {
  return (
    <PlausibleProvider domain="sergeyustinov.dev">
      <HeaderComponent />
      <main className="bg-slate-900 text-slate-200">
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            <HeroContent />
            <ProjectsComponent />
            {/* <Testimonial1Small /> */}
            <Testimonials3 />
            {/* <SkillsComponent /> */}
            <CTAComponent />
          </main>
          <FooterComponent />
        </div>
      </main>
    </PlausibleProvider>
  );
}
