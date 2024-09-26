import Image from "next/image";
import { StaticImageData } from "next/image";
import config from "@/config";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

// The list of your testimonials. It needs 3 items to fill the row.
const list: {
  username?: string;
  name: string;
  text: string;
  img?: string | StaticImageData;
  link?: string;
}[] = [
  {
    // Optional, use for social media like Twitter. Does not link anywhere but cool to display
    username: "jibble",
    // REQUIRED
    name: "Jibble Team",
    // REQUIRED
    text: "Sergey did a great job and communicated well with the team, he's a valuable addition to our front-end team and we'd love to continue working with him!",
    // Optional, a statically imported image (usually from your public folder—recommended) or a link to the person's avatar. Shows a fallback letter if not provided
    img: "https://media.licdn.com/dms/image/v2/C560BAQG2wEnxqUbXCg/company-logo_200_200/company-logo_200_200/0/1630661539338/jibble_logo?e=1735171200&v=beta&t=7MFcyQR55NKe4P1FXFIinEw94CbueMvBbePR3cvGtSY",
    link: "https://jibble.com",
  },
  {
    username: "upwork",
    name: "Upwork Client",
    text: "Sergey is very reliable and fast. And the quality of work is terrific. I will definitely rehire Sergey in the future. Thank you so much, you made my life so much easier.",
    link: "https://www.upwork.com/ab/g/pub/wom/prx/eyJwZXJzb25VaWQiOiI0MzU4NjE3MDk5MzY3NzEwNzIiLCJjb250cmFjdFJpZCI6IjE0MDAyMTkwIiwiYmFubmVyVHlwZSI6ImNvbnRyYWN0IiwiYmFubmVyVmFyaWFudCI6ImRlZmF1bHQiLCJ3b20iOiJmbHYyIiwicmVkaXJlY3QiOiJmbF9wcm9maWxlX3Byb21vIn0=?network=twitter ",
    img: "https://pbs.twimg.com/profile_images/1838235907016568832/ZTH0zZnG_400x400.jpg",
  },
  {
    username: "daledesilva",
    name: "Dale de Silva",
    text: "I had the privilege of working with Sergey at Sensand. Sergey is friendly and adaptable, and always a strong aid when working with the design team as technical representation. He’s a great addition to any team.",
    link: "https://sensand.com",
    img: "https://pbs.twimg.com/profile_images/953461142965272576/MX_dcyFT_400x400.jpg",
  },
];

// A single testimonial, to be rendered in a list
const Testimonial = ({ i }: { i: number }) => {
  const testimonial = list[i];

  if (!testimonial) return null;

  return (
    <Card key={i} className="h-full bg-slate-200 text-slate-800">
      {" "}
      {/* Added bg-white class */}
      <CardContent className="pt-6">
        <blockquote className="relative">
          <p className="text-base-content/80 leading-relaxed">
            {testimonial.text}
          </p>
        </blockquote>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4">
        {" "}
        {/* Removed border-t and border-base-content/5 classes */}
        <div>
          <div className="font-medium text-base-content">
            {testimonial.name}
          </div>
          {testimonial.username && (
            <div className="mt-0.5 text-sm text-base-content/80">
              @{testimonial.username}
            </div>
          )}
        </div>
        <div className="overflow-hidden rounded-full bg-base-300 shrink-0">
          {testimonial.img ? (
            <Image
              className="w-10 h-10 rounded-full object-cover"
              src={list[i].img}
              alt={`${list[i].name}'s testimonial for ${config.appName}`}
              width={40}
              height={40}
            />
          ) : (
            <span className="w-10 h-10 rounded-full flex justify-center items-center text-lg font-medium bg-base-300">
              {testimonial.name.charAt(0)}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

const Testimonials3 = () => {
  return (
    <section id="testimonials" className="py-24 px-8 bg-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-base-content mb-8">
            People I&apos;ve worked with ✌️
          </h2>
          <p className="text-base text-base-content/80 max-w-2xl mx-auto">
            Don&apos;t take my word for it. Here&apos;s what they have to say
            about my work.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {list.map((_, i) => (
            <Link
              href={_.link}
              key={i}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Testimonial key={i} i={i} />
            </Link>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Testimonials3;
