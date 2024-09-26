import React from "react";
import ProjectsShowcase from "./ProjectsShowcase";

function ProjectsComponent() {
  return (
    <section
      id="projects"
      className="w-full py-12 md:py-24 lg:py-32 bg-slate-800"
    >
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-5xl text-center mb-8 text-slate-200">
        My Projects
      </h2>
      <ProjectsShowcase />
    </section>
  );
}

export default ProjectsComponent;
