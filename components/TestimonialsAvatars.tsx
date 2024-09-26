import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const avatars = [
  {
    alt: "User",
    src: "https://avatars.githubusercontent.com/u/3471265?v=4",
  },
  {
    alt: "User",
    src: "/api/placeholder/50/50",
  },
  {
    alt: "User",
    src: "/api/placeholder/50/50",
  },
  {
    alt: "User",
    src: "/api/placeholder/50/50",
  },
  {
    alt: "User",
    src: "/api/placeholder/50/50",
  },
];

const TestimonialsAvatars = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-3">
      {/* AVATARS */}
      <div className="flex -space-x-4">
        {avatars.map((image, i) => (
          <Avatar key={i} className="border-2 border-background">
            <AvatarImage src={image.src} alt={image.alt} />
            <AvatarFallback>{image.alt[0]}</AvatarFallback>
          </Avatar>
        ))}
      </div>

      {/* RATING */}
      <div className="flex flex-col justify-center items-center md:items-start gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
          ))}
        </div>
        <div className="text-base text-muted-foreground">
          <span className="font-semibold text-foreground">32</span> makers ship
          faster
        </div>
      </div>
    </div>
  );
};

export default TestimonialsAvatars;
