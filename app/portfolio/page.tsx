import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/redesign/footer";
import { HeaderComponent } from "@/components/redesign/header-component";

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  results?: string;
  github?: string;
}

function PortfolioPage() {
  const projects: Project[] = [
    {
      title: "Jibble",
      description:
        "Jibble.io is a cloud-based time tracking and attendance management software designed to streamline the process of monitoring employee hours and project progress. It is particularly popular among businesses with remote teams and those requiring field services, offering features that enhance productivity and operational efficiency.",
      image: "/jibble.png",
      tags: ["Vue.js", "TypeScript", "Figma", "ASP.NET"],
      link: "https://www.jibble.io/",
      // github: "https://github.com/yourusername/project",
      // results: "Developed a re-designed UI/UX for the product",
    },
    {
      title: "Sensand",
      description:
        "Built an innovative agritech platform that unifies IoT sensors, satellite imagery, and AI for comprehensive land management. The platform enables sustainable agriculture and carbon credit trading through real-time analytics and compliance tools.",
      image: "/sensand.png",
      tags: ["Vue.js", "Angular", "TypeScript", "Google Cloud Platform"],
      link: "https://sensand.com/",
      // github: "https://github.com/yourusername/project",
      // results: "Increased client revenue by 40% through data-driven insights",
    },
    {
      title: "Motorola Solutions",
      description:
        "Working full-time on mission-critical command centre software used by government organizations and emergency services. Building real-time analytics and monitoring systems that process millions of events daily to support critical decision-making and emergency response operations.",
      image: "/motorola.png",
      tags: ["Angular", "AWS", "TypeScript"],
      link: "https://example.com",
      // github: "https://github.com/yourusername/project",
      // results: "Increased client revenue by 40% through data-driven insights",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HeaderComponent />

      <main className="flex-grow">
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
              Proven Results, Not Just Promises
            </h1>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Every project below was delivered in 14 days or less, generating
              real business impact for founders.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <Card
                  key={index}
                  className="border border-blue-100 shadow-lg hover:shadow-xl transition-shadow bg-white hover:bg-slate-50 overflow-hidden"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={600}
                    height={600}
                    className="w-full object-cover"
                  />
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-800">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project?.results && (
                      <p className="text-emerald-600 font-semibold mb-4">
                        {project.results}
                      </p>
                    )}
                    <div className="flex gap-4">
                      {project.link && (
                        <Link
                          href={project.link}
                          target="_blank"
                          rel="nofollow"
                        >
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 bg-white hover:bg-blue-100 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Live Demo
                          </Button>
                        </Link>
                      )}
                      {project?.github && (
                        <Link
                          href={project?.github}
                          target="_blank"
                          rel="nofollow"
                        >
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 bg-white hover:bg-blue-100 transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            Code
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-indigo-700 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Want Similar Results for Your Business?
            </h2>
            <p className="mb-8 text-lg max-w-2xl mx-auto">
              Let&apos;s discuss how we can build your MVP in 14 days or less.
            </p>
            <Link
              href="https://cal.com/sergustinov/15-minutes-chat"
              target="_blank"
              rel="nofollow"
            >
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-blue-800 hover:text-blue-800 hover:bg-blue-100 transition-colors"
              >
                Book Your Free Strategy Call
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default PortfolioPage;
