import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TestimonialsAvatars from "./TestimonialsAvatars";
import config from "@/config";

const Hero = () => {
  return (
    <Card className="max-w-7xl mx-auto bg-background">
      <CardContent className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
        <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
          <a
            href="https://www.producthunt.com/posts/shipfast-2?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-shipfast&#0045;2"
            target="_blank"
            className="-mb-4 md:-mb-6 group"
            title="Product Hunt link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 122 37"
              className="w-32 md:w-36 fill-muted-foreground group-hover:fill-foreground"
            >
              {/* SVG path data */}
            </svg>
          </a>

          <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4">
            Ship your startup in days, not weeks
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The NextJS boilerplate with all you need to build your SaaS, AI
            tool, or any other web app. From idea to production in 5 minutes.
          </p>
          <Button size="lg" className="w-full sm:w-auto">
            Get {config.appName}
          </Button>

          <TestimonialsAvatars />
        </div>
        <div className="lg:w-full">
          <Image
            src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
            alt="Product Demo"
            className="w-full"
            priority={true}
            width={500}
            height={500}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Hero;
