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

        <section className="py-16 px-4" id="our-work">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
              Why Founders Choose to Work With Me
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Clock,
                  title: "2-Week Delivery",
                  description:
                    "Get your MVP launched while your competition is still planning. No endless meetings or bureaucracy.",
                },
                {
                  icon: FileText,
                  title: "Full-Stack Solution",
                  description:
                    "From backend architecture to conversion-optimized landing pages - everything you need to start selling.",
                },
                {
                  icon: Code,
                  title: "Future-Proof Tech",
                  description:
                    "Built with Next.js, React, and other modern tools that scale. No technical debt to slow you down later.",
                },
                {
                  icon: Users,
                  title: "Direct Communication",
                  description:
                    "Work directly with me - no account managers or junior developers. Clear, fast communication at every step.",
                },
                {
                  icon: Search,
                  title: "Launch-Ready Package",
                  description:
                    "SEO optimization, analytics, and performance tuning included. Ready to attract customers from day one.",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white hover:bg-slate-50"
                >
                  <CardHeader>
                    <feature.icon className="w-10 h-10 text-blue-700 mb-4" />
                    <CardTitle className="text-xl text-gray-800">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-white" id="process">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
              Simple, Swift, Successful Launch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Day 1: Strategy",
                  description:
                    "We'll map out your MVP's core features and create a focused development plan that targets your market needs.",
                },
                {
                  title: "Days 2-13: Build",
                  description:
                    "Daily progress updates as your product takes shape, with continuous feedback and adjustments.",
                },
                {
                  title: "Day 14: Launch",
                  description:
                    "Full deployment, technical training, and handover of your market-ready product.",
                },
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-white" id="pricing">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
              Clear, No-Surprise Pricing
            </h2>
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

        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
              Why Start With an MVP?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                "Test your market with minimal investment",
                "Start generating revenue while others are still planning",
                "Adapt quickly based on real user feedback",
              ].map((point, index) => (
                <div key={index} className="flex items-start">
                  <Rocket className="w-6 h-6 text-blue-700 mr-4 flex-shrink-0" />
                  <p className="text-gray-600">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-100">
          <div className="container mx-auto">
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
