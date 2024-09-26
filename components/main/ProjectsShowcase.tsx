"use client";
import React from "react";
import Image from "next/image";
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import { motion, useInView } from "framer-motion";

const ProjectCard = ({ src, alt, title }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="relative w-full h-0 pb-[100%] rounded-lg shadow-lg overflow-hidden"
      initial={{ rotate: 0, opacity: 0 }}
      animate={isInView ? { rotate: Math.random() * 10 - 5, opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, rotate: 0 }}
    >
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
      />
      <div className="absolute bottom-0 left-0 bg-white p-2 rounded-tr-lg">
        <p className="text-sm font-semibold">{title}</p>
      </div>
    </motion.div>
  );
};

const ProjectsShowcase = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative w-full p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ProjectCard src="/jibble.png" alt="Jibble" title="Jibble Project" />
        <ProjectCard src="/sensand.png" alt="Sensand" title="Sensand Project" />
        <ProjectCard
          src="/motorola.png"
          alt="Motorola"
          title="Motorola Project"
        />
      </div>

      <RoughNotationGroup show={isInView}>
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        ></motion.div>
      </RoughNotationGroup>
    </div>
  );
};

export default ProjectsShowcase;
