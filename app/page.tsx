import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 px-4 lg:px-6 h-auto py-4 lg:py-8 flex flex-col sm:flex-row sm:h-14 items-center">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <Image
            src="https://avatars.githubusercontent.com/u/3471265?v=4"
            alt="Sergey"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-medium">Sergey Developer</span>
            <div className="inline-flex items-center justify-between rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-light text-green-800">
              <div>Available now</div>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
          </div>
        </div>
        <nav className="flex gap-4 sm:gap-6 sm:ml-auto">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#projects"
          >
            Projects
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#skills"
          >
            Skills
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#contact"
          >
            Contact
          </Link>
        </nav>
      </header>
      <main>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                      I&apos;m Sergey <br className="hidden sm:inline" /> a
                      Front End Developer <br className="hidden sm:inline" />{" "}
                      for startups
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      I help startups build their products and bring them to
                      market on a one-time or retainer basis.
                    </p>
                  </div>
                  <div className="space-x-4">
                    <Button>Book a call</Button>
                  </div>
                </div>
              </div>
            </section>
            <section
              id="projects"
              className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
            >
              <div className="container px-4 md:px-6">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-5xl text-center mb-8">
                  My Projects
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-lg border bg-card text-card-foreground shadow-sm"
                    >
                      <Image
                        alt={`Project ${i}`}
                        className="rounded-t-lg object-cover w-full h-48"
                        height="200"
                        src={`/placeholder.svg?height=200&width=400`}
                        style={{
                          aspectRatio: "400/200",
                          objectFit: "cover",
                        }}
                        width="400"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-bold">Project {i}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          A brief description of the project and technologies
                          used.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section id="skills" className="w-full py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-5xl text-center mb-8">
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
                      className="flex items-center justify-center p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
                    >
                      <span className="text-sm font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      Let&apos;s build a website or app
                    </h2>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      Feel free to book a call with me to discuss your project
                      or ideas.
                    </p>
                  </div>
                  <div className="w-full max-w-sm space-y-2">
                    <form id="contact" className="flex flex-col space-y-4">
                      <Input
                        className="max-w-lg flex-1"
                        placeholder="Your email"
                        type="email"
                      />
                      <Button type="submit">Get in Touch</Button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
              © 2024 Sergey Ustinov. All rights reserved.
            </p>
            <nav className="flex gap-4 sm:gap-6 sm:ml-auto justify-center sm:justify-start mt-2 sm:mt-0">
              <Link
                className="text-xs hover:underline underline-offset-4"
                href="https://x.com/brokkoli_borsch"
              >
                Twitter
              </Link>
              <Link
                className="text-xs hover:underline underline-offset-4"
                href="https://github.com/sergust"
              >
                GitHub
              </Link>
            </nav>
          </footer>
        </div>
      </main>
    </>
  );
}
