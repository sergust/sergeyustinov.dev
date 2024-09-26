import Link from "next/link";
import HeaderComponent from "@/components/main/HeaderComponent";
import HeroComponent from "@/components/main/HeroComponent";
import ProjectsComponent from "@/components/main/ProjectsComponent";
import SkillsComponent from "@/components/main/SkillsComponent";
import CTAComponent from "@/components/main/CTAComponent";
import Testimonial1Small from "@/components/Testimonial1Small";
import Testimonials3 from "@/components/Testimonials3";

export default function Page() {
  return (
    <>
      <HeaderComponent />
      <main className="bg-slate-900 text-slate-200">
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            <HeroComponent />
            <ProjectsComponent />
            {/* <Testimonial1Small /> */}
            <Testimonials3 />
            <SkillsComponent />
            <CTAComponent />
          </main>
          <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-slate-800">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              © 2024 Sergey Ustinov. All rights reserved.
            </p>
            <nav className="flex gap-4 sm:gap-6 sm:ml-auto justify-center sm:justify-start mt-2 sm:mt-0">
              <Link
                className="text-xs text-slate-400 hover:text-emerald-300 hover:underline underline-offset-4"
                href="https://x.com/brokkoli_borsch"
              >
                Twitter
              </Link>
              <Link
                className="text-xs text-slate-400 hover:text-emerald-300 hover:underline underline-offset-4"
                href="https://github.com/sergust"
              >
                GitHub
              </Link>
            </nav>
          </footer>
        </div>
      </main>
    </>
  );
}
