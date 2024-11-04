import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/redesign/footer";
import { HeaderComponent } from "@/components/redesign/header-component";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Portfolio | Sergey Ustinov - Full Stack Developer",
  description:
    "Explore my portfolio of successful projects including work with Motorola Solutions, Jibble, and other innovative startups.",
  canonicalUrlRelative: "/portfolio",
});

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  achievements: string[];
  github?: string;
  color: string;
  delay: string;
}

function PortfolioPage() {
  const projects: Project[] = [
    {
      title: "Jibble - Time Tracking Platform",
      description:
        "Led the development of a comprehensive time tracking and attendance management platform, focusing on remote team productivity and operational efficiency.",
      image: "/jibble.png",
      tags: ["Vue.js", "TypeScript", "Figma", "ASP.NET"],
      link: "https://www.jibble.io/",
      achievements: [
        "Improved system performance by 40%",
        "Implemented real-time tracking features",
        "Reduced deployment time by 60%",
        "Enhanced UI/UX for 50k+ daily users",
      ],
      color: "blue",
      delay: "delay-[0ms]",
    },
    {
      title: "Sensand - AgriTech Innovation",
      description:
        "Architected an IoT-powered agricultural management platform that revolutionizes land monitoring and sustainable farming practices.",
      image: "/sensand.png",
      tags: ["Vue.js", "Angular", "TypeScript", "Google Cloud"],
      link: "https://sensand.com/",
      achievements: [
        "Integrated IoT sensor networks",
        "Built real-time analytics dashboard",
        "Implemented satellite imagery analysis",
        "Automated compliance reporting",
      ],
      color: "green",
      delay: "delay-[200ms]",
    },
    {
      title: "Motorola Solutions - Command Center",
      description:
        "Developed mission-critical software for emergency services, handling real-time event processing and response coordination.",
      image: "/motorola.png",
      tags: ["Angular", "AWS", "TypeScript"],
      achievements: [
        "Processed 1M+ daily events",
        "Reduced response time by 30%",
        "99.99% system uptime",
        "Enhanced emergency coordination",
      ],
      color: "purple",
      delay: "delay-[400ms]",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <HeaderComponent />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-24 px-4 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply blur-3xl animate-blob" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000" />
          </div>

          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-16 opacity-0 translate-y-6 animate-[fade-in-up_0.6s_ease-out_forwards]">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Featured Projects
              </h1>
              <p className="text-lg text-gray-600">
                Delivering exceptional results through innovative solutions and
                technical excellence
              </p>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="space-y-24">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className={`opacity-0 translate-y-8 animate-[fade-in-up_0.5s_ease-out_forwards] ${project.delay}`}
                >
                  <div
                    className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl 
                    transition-all duration-300 border border-gray-100"
                  >
                    {/* Project Grid */}
                    <div className="grid md:grid-cols-2 gap-12">
                      {/* Image Side */}
                      <div className="relative">
                        {/* Background decoration */}
                        <div
                          className={`absolute inset-0 bg-${project.color}-600/5 rounded-xl 
    transform group-hover:scale-105 transition-transform duration-500`}
                        />
                        <Image
                          src={project.image}
                          alt={project.title}
                          width={600}
                          height={400}
                          className="rounded-xl shadow-md w-full h-[300px] object-cover object-top 
      transform group-hover:scale-[1.02] transition-transform duration-500"
                        />
                      </div>

                      {/* Content Side */}
                      <div className="flex flex-col h-full">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm 
                                font-medium hover:bg-blue-100 transition-colors duration-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Title & Description */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          {project.title}
                        </h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Achievements */}
                        <div className="space-y-3 mb-8">
                          {project.achievements.map((achievement, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="p-0.5 rounded-full bg-green-500">
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <span className="text-gray-600">
                                {achievement}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* CTA */}
                        {project.link && (
                          <Link
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            referrerPolicy="no-referrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 
    font-semibold group/link mt-auto"
                          >
                            View Project
                            <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay blur-3xl animate-blob" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay blur-3xl animate-blob animation-delay-2000" />
          </div>

          <div className="container mx-auto relative">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Build Your Next Success Story?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Let&apos;s discuss how we can achieve similar results for your
                project
              </p>
              <Link
                href="https://cal.com/sergustinov/15-minutes-chat"
                target="_blank"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 
                  rounded-full font-semibold hover:bg-blue-50 transition-all duration-300
                  hover:shadow-lg hover:shadow-white/20 hover:-translate-y-0.5"
              >
                Book Your Free Strategy Call
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default PortfolioPage;
