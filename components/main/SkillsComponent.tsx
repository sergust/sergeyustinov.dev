import React from "react";

function SkillsComponent() {
  return (
    <section id="skills" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-5xl text-center mb-8 text-slate-200">
          My Skills
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            "React",
            "TypeScript",
            "Next.js",
            "Tailwind CSS",
            "Node.js",
            "GraphQL",
            "Jest",
            "Webpack",
          ].map((skill) => (
            <div
              key={skill}
              className="flex items-center justify-center p-4 rounded-lg bg-slate-800 text-slate-200"
            >
              <span className="text-sm font-medium">{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillsComponent;
