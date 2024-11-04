import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Rocket,
  CheckCircle,
  Clock,
  Users,
  Search,
  FileText,
  Code,
  GitBranch,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import Image from "next/image";
import AnimatedHero from "@/components/redesign/animated-hero";
import Link from "next/link";
import { Logo } from "@/components/redesign/logo";
import { HeaderComponent } from "@/components/redesign/header-component";

function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HeaderComponent />

      <main className="flex-grow">
        <AnimatedHero />

        <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
          <div className="container mx-auto relative">
            <div className="max-w-3xl mx-auto text-center mb-16 opacity-0 translate-y-6 animate-[fade-in-up_0.6s_ease-out_forwards]">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Founders Choose to Work With Me
              </h2>
              <p className="text-lg text-gray-600">
                Delivering exceptional value through expertise, efficiency, and
                dedication to your success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Clock,
                  title: "2-Week Delivery",
                  description:
                    "Get your MVP launched while your competition is still planning. No endless meetings or bureaucracy.",
                  delay: "delay-[0ms]",
                },
                {
                  icon: FileText,
                  title: "Full-Stack Solution",
                  description:
                    "From backend architecture to conversion-optimized landing pages - everything you need to start selling.",
                  delay: "delay-[100ms]",
                },
                {
                  icon: Code,
                  title: "Future-Proof Tech",
                  description:
                    "Built with Next.js, React, and other modern tools that scale. No technical debt to slow you down later.",
                  delay: "delay-[200ms]",
                },
                {
                  icon: Users,
                  title: "Direct Communication",
                  description:
                    "Work directly with me - no account managers or junior developers. Clear, fast communication at every step.",
                  delay: "delay-[300ms]",
                },
                {
                  icon: Search,
                  title: "Launch-Ready Package",
                  description:
                    "SEO optimization, analytics, and performance tuning included. Ready to attract customers from day one.",
                  delay: "delay-[400ms]",
                },
                {
                  icon: GitBranch,
                  title: "Clean, Maintainable Code",
                  description:
                    "Enterprise-grade code quality with comprehensive documentation. Easy handover to your future tech team.",
                  delay: "delay-[500ms]",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`opacity-0 translate-y-8 animate-[fade-in-up_0.5s_ease-out_forwards] ${feature.delay} h-full`}
                >
                  <div
                    className="group h-full bg-white/70 backdrop-blur-lg rounded-2xl p-8 
                    hover:bg-white transition-all duration-500 border border-gray-100 
                    shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.07)]
                    relative overflow-hidden"
                  >
                    {/* Hover gradient effect */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 
                      group-hover:opacity-100 transition-opacity duration-500"
                    />

                    {/* Content wrapper */}
                    <div className="relative">
                      {/* Icon */}
                      <div
                        className="inline-flex p-3 rounded-xl bg-blue-600/10 text-blue-600 mb-5
                        group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                      >
                        <feature.icon className="w-6 h-6" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Bottom decorative line */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 
                      transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 bg-white" id="process">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16 opacity-0 translate-y-6 animate-[fade-in-up_0.6s_ease-out_forwards]">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Simple, Swift, Successful Launch
              </h2>
              <p className="text-lg text-gray-600">
                Your journey from idea to market in just 14 days
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Timeline connector */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 transform -translate-y-1/2" />

              {[
                {
                  phase: "Phase 1",
                  title: "Strategy & Planning",
                  duration: "Day 1",
                  description:
                    "We'll map out your MVP's core features and create a focused development plan that targets your market needs.",
                  features: [
                    "Market analysis",
                    "Feature prioritization",
                    "Technical planning",
                    "Development roadmap",
                  ],
                  icon: Target,
                  delay: "delay-[0ms]",
                },
                {
                  phase: "Phase 2",
                  title: "Development Sprint",
                  duration: "Days 2-13",
                  description:
                    "Daily progress updates as your product takes shape, with continuous feedback and adjustments.",
                  features: [
                    "Rapid development",
                    "Daily updates",
                    "Progress tracking",
                    "Feedback integration",
                  ],
                  icon: Code,
                  delay: "delay-[200ms]",
                },
                {
                  phase: "Phase 3",
                  title: "Launch & Handover",
                  duration: "Day 14",
                  description:
                    "Full deployment, technical training, and handover of your market-ready product.",
                  features: [
                    "Final testing",
                    "Deployment",
                    "Documentation",
                    "Training session",
                  ],
                  icon: Rocket,
                  delay: "delay-[400ms]",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className={`opacity-0 translate-y-8 animate-[fade-in-up_0.5s_ease-out_forwards] ${step.delay} h-full`}
                >
                  <div className="relative group h-full">
                    {/* Number indicator */}
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full border-2 border-blue-600 
                      flex items-center justify-center text-blue-600 font-bold text-lg z-10 group-hover:bg-blue-600 
                      group-hover:text-white transition-all duration-300"
                    >
                      {index + 1}
                    </div>

                    <div className="pt-8 h-full">
                      <div
                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 
                        border border-gray-100 h-full flex flex-col relative overflow-hidden group"
                      >
                        {/* Decorative gradient background */}
                        <div
                          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 
                          group-hover:opacity-100 transition-opacity duration-500"
                        />

                        {/* Content wrapper */}
                        <div className="relative flex flex-col h-full">
                          {/* Phase label */}
                          <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-2 w-fit">
                            {step.phase}
                          </div>

                          {/* Duration */}
                          <div className="text-purple-600 font-semibold mb-3">
                            {step.duration}
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {step.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 mb-6">
                            {step.description}
                          </p>

                          {/* Features list - pushed to bottom with margin-top auto */}
                          <ul className="space-y-2 mt-auto">
                            {step.features.map((feature, i) => (
                              <li
                                key={i}
                                className="flex items-center text-gray-700"
                              >
                                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 bg-white" id="pricing">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16 opacity-0 translate-y-6 animate-[fade-in-up_0.6s_ease-out_forwards]">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Clear, No-Surprise Pricing
              </h2>
              <p className="text-lg text-gray-600">
                Transparent pricing packages designed for startup success
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border border-blue-100 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    <span className="line-through text-gray-400">$6,999</span>{" "}
                    <span className="text-blue-700">$3,999</span> / MVP Package
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    (Early-bird pricing - 1 spot left)
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0" />
                      Full-stack web app with admin dashboard
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0" />
                      High-converting landing page
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0" />
                      Payment processing, auth & analytics setup
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0" />
                      SEO optimization & performance tuning
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0" />
                      2 weeks of post-launch support
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border border-blue-100 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    <span className="line-through text-gray-400">$1,299</span>{" "}
                    <span className="text-blue-700">$899</span> / Landing Page
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    (48-hour delivery - 2 spots left)
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0" />
                      Conversion-optimized design & copy
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0" />
                      Mobile-first responsive development
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0" />
                      Analytics & form handling setup
                    </li>
                    <li className="flex items-center text-gray-600">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0" />
                      SEO optimization included
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16 opacity-0 translate-y-6 animate-[fade-in-up_0.6s_ease-out_forwards]">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Start With an MVP?
              </h2>
              <p className="text-lg text-gray-600">
                Launch faster, learn faster, and succeed faster with a strategic
                MVP approach
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: "Validate Your Market",
                  description:
                    "Test your business hypothesis with minimal investment. Get real market validation before committing significant resources.",
                  stats: "Save up to 60% on initial development costs",
                  color: "blue",
                  delay: "delay-[0ms]",
                },
                {
                  icon: TrendingUp,
                  title: "Generate Early Revenue",
                  description:
                    "Start monetizing while your competition is still in the planning phase. Begin building your customer base immediately.",
                  stats: "Launch in 14 days vs. 3-6 months",
                  color: "green",
                  delay: "delay-[200ms]",
                },
                {
                  icon: Zap,
                  title: "Rapid Iteration",
                  description:
                    "Gather real user feedback and adapt quickly. Let your customers guide your product evolution.",
                  stats: "Implement changes 5x faster",
                  color: "purple",
                  delay: "delay-[400ms]",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className={`opacity-0 translate-y-8 animate-[fade-in-up_0.5s_ease-out_forwards] ${benefit.delay} h-full`}
                >
                  <div
                    className="relative group bg-white rounded-xl p-6 shadow-lg transition-all duration-300 border border-gray-100 
                    hover:shadow-xl hover:-translate-y-1 h-full flex flex-col"
                  >
                    {/* Decorative background element */}
                    <div
                      className={`absolute top-0 right-0 w-24 h-24 bg-${benefit.color}-100 rounded-bl-full opacity-20 
                      transition-opacity duration-300 group-hover:opacity-40`}
                    />

                    {/* Icon */}
                    <div
                      className={`relative inline-flex p-3 rounded-lg bg-${benefit.color}-100 text-${benefit.color}-600 mb-4 
                      transform transition-transform duration-300 group-hover:scale-110 w-fit`}
                    >
                      <benefit.icon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                      {benefit.description}
                    </p>

                    {/* Stats */}
                    <div
                      className={`flex items-center text-${benefit.color}-600 font-semibold text-sm 
                      opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 mt-auto`}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {benefit.stats}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to action */}
            <div className="text-center mt-12 opacity-0 translate-y-6 animate-[fade-in-up_0.6s_ease-out_0.6s_forwards]">
              <Link
                href="https://cal.com/sergustinov/15-minutes-chat"
                target="_blank"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold
                  transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5
                  active:translate-y-0 active:shadow-md"
              >
                <Rocket className="w-5 h-5" />
                Start Your MVP Journey
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 bg-gray-100">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16 opacity-0 translate-y-6 animate-[fade-in-up_0.6s_ease-out_forwards]">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Meet Your Developer
              </h2>
              <p className="text-lg text-gray-600">
                Senior full-stack expertise with a passion for startup success
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Image
                src="https://avatars.githubusercontent.com/u/3471265?v=4"
                alt="Sergei's photo"
                width={300}
                height={300}
                className="rounded-full shadow-lg"
              />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
                  Hi, I&apos;m Sergei 👋
                </h2>
                <h3 className="text-xl text-gray-600 mb-4">
                  Your Senior Full-Stack Developer
                </h3>
                <p className="mb-4 text-gray-600">
                  With over 7 years of experience spanning both startups and
                  industry giants like Motorola Solutions, I specialize in
                  turning complex ideas into clean, scalable applications.
                </p>
                <p className="text-gray-600">
                  What sets me apart is my full-stack expertise combined with a
                  keen eye for user experience. I don&apos;t just write code – I
                  build products that are fast, reliable, and ready for real
                  users. Whether it&apos;s implementing payment systems, setting
                  up analytics, or optimizing for mobile, I handle all technical
                  aspects so you can focus on growing your business.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "React.js",
                    "Next.js",
                    "Angular",
                    "Tailwind CSS",
                    "AWS",
                    "Node.js",
                    "TypeScript",
                    "Vue.js",
                    "REST APIs",
                    "UI/UX Design",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-indigo-700 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              Ready to Launch Your Startup?
            </h2>
            <Link
              href="https://cal.com/sergustinov/15-minutes-chat"
              target="_blank"
            >
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-blue-800 hover:text-blue-800 hover:bg-blue-100 transition-colors"
              >
                Book Your Free Strategy Call
              </Button>
            </Link>
            <p className="mt-4 text-sm max-w-2xl mx-auto">
              Let&apos;s discuss your idea and see if we&apos;re a good fit. I
              only take on projects where I&apos;m confident I can deliver
              exceptional results within the promised timeframe.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo />
          </div>
          <p className="text-center md:text-left text-sm">
            Turning visionary ideas into market-ready products in 14 days or
            less.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Page;
