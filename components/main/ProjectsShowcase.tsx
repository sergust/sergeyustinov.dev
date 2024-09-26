"use client";
import React from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const ProjectCard = ({
  src,
  alt,
  rotation,
  width,
  height,
  title,
  link,
}: {
  src: string;
  alt: string;
  title: string;
  rotation: number;
  width: number;
  height: number;
  link: string;
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <Link href={link} target="_blank" rel="noopener noreferrer">
      <motion.div
        ref={ref}
        className="relative w-full h-0 pb-[100%] rounded-lg shadow-lg overflow-hidden"
        initial={{ rotate: 0, opacity: 0 }}
        animate={isInView ? { rotate: rotation, opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.1, rotate: 0 }}
      >
        <Image
          src={src}
          alt={alt}
          className="rounded-lg"
          width={width}
          height={height}
        />
      </motion.div>
    </Link>
  );
};

const ProjectsShowcase = () => {
  const ref = React.useRef(null);

  const projects = [
    {
      src: "/jibble.png",
      alt: "Jibble",
      title: "Jibble",
      rotation: -4,
      height: "600",
      width: "600",
      link: "https://jibble.com",
    },
    {
      src: "/sensand.png",
      alt: "Sensand",
      title: "Sensand",
      rotation: 1,
      height: "600",
      width: "660",
      link: "https://sensand.com",
    },
    {
      src: "/motorola.png",
      alt: "Motorola",
      title: "Motorola",
      rotation: 5,
      height: "600",
      width: "600",
      link: "https://motorola.com",
    },
  ];

  return (
    <div ref={ref} className="relative w-full p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:items-center">
        {projects.map((project, index) => (
          <div
            key={project.src}
            className={`${index === 1 ? "md:mb-32" : "md:mt-0"} w-[${
              project.width
            }] h-fit`}
          >
            <ProjectCard
              {...project}
              width={parseInt(project.width)}
              height={parseInt(project.height)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsShowcase;
