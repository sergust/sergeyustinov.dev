import Image from 'next/image';
import { Glass } from '@/components/Glass';
import { GlassCard } from '@/components/GlassCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container-blog space-y-8 py-8">
        <div className="text-center">
          <h1 className="blog-title text-responsive-3xl mb-4">
            Glass Blog Components
          </h1>
          <p className="blog-body text-responsive-lg text-blog-text-secondary">
            Demonstrating responsive glass-morphism design with mobile-first
            approach and optimized typography
          </p>
        </div>

        <div className="grid-mobile-1 gap-4 sm:grid-cols-2">
          <Glass variant="enhanced" hover className="touch-friendly">
            <h2 className="blog-heading text-responsive-xl mb-3 font-semibold">
              Enhanced Glass
            </h2>
            <p className="blog-text-secondary text-responsive-base">
              This is the enhanced variant with hover effects. It includes
              smooth transitions and elevation on hover.
            </p>
          </Glass>

          <Glass variant="light" hover className="touch-friendly">
            <h2 className="blog-heading text-responsive-xl mb-3 font-semibold">
              Light Glass
            </h2>
            <p className="blog-text-secondary text-responsive-base">
              A lighter glass effect that&apos;s perfect for content areas that
              need subtle transparency.
            </p>
          </Glass>

          <Glass variant="dark" hover className="touch-friendly">
            <h2 className="blog-heading text-responsive-xl mb-3 font-semibold">
              Dark Glass
            </h2>
            <p className="blog-text-secondary text-responsive-base">
              Dark variant glass effect with stronger contrast and depth.
            </p>
          </Glass>

          <Glass variant="subtle" hover className="touch-friendly">
            <h2 className="blog-heading text-responsive-xl mb-3 font-semibold">
              Subtle Glass
            </h2>
            <p className="blog-text-secondary text-responsive-base">
              Minimal glass effect for areas where you want just a hint of
              depth.
            </p>
          </Glass>
        </div>

        <Glass
          variant="enhanced"
          hover
          className="touch-friendly p-4 md:p-8"
          as="article"
        >
          <div className="blog-content">
            <h2 className="blog-subtitle text-responsive-2xl mb-4">
              Typography & Font Optimization
            </h2>
            <p className="blog-body text-responsive-base mb-4">
              This blog uses carefully selected fonts for optimal readability:{' '}
              <strong className="font-geist">Geist Sans</strong> for headings
              and UI elements, <strong className="font-inter">Inter</strong> for
              body text, and{' '}
              <code className="blog-code-inline">Geist Mono</code> for code
              blocks.
            </p>
            <h3 className="text-responsive-lg mb-2 font-semibold">
              Font Performance Features
            </h3>
            <ul className="mb-4 space-y-1">
              <li className="blog-body">
                ✨ Next.js font optimization with{' '}
                <code className="blog-code-inline">font-display: swap</code>
              </li>
              <li className="blog-body">
                🚀 Preloaded fonts for instant rendering
              </li>
              <li className="blog-body">
                📱 Multiple font weights for design flexibility
              </li>
              <li className="blog-body">
                🌍 Extended character sets for international content
              </li>
            </ul>
            <blockquote>
              &ldquo;Typography is the craft of endowing human language with a
              durable visual form.&rdquo;
            </blockquote>
          </div>
        </Glass>

        <div className="space-y-6">
          <h2 className="blog-title text-responsive-2xl text-center">
            Typography Showcase
          </h2>
          <div className="grid-mobile-1 gap-4 md:grid-cols-3">
            <Glass variant="enhanced" hover className="touch-friendly">
              <h3 className="blog-subtitle text-responsive-lg mb-3">
                Geist Sans
              </h3>
              <p className="blog-caption font-geist mb-2">
                Perfect for headings and UI
              </p>
              <div className="font-geist space-y-2">
                <p className="text-responsive-3xl font-bold">Heading 1</p>
                <p className="text-responsive-2xl font-semibold">Heading 2</p>
                <p className="text-responsive-xl font-medium">Heading 3</p>
              </div>
            </Glass>

            <Glass variant="enhanced" hover className="touch-friendly">
              <h3 className="blog-subtitle text-responsive-lg mb-3">Inter</h3>
              <p className="blog-caption font-inter mb-2">
                Optimized for body text
              </p>
              <div className="font-inter space-y-2">
                <p className="blog-body text-responsive-base">
                  Perfect readability for long-form content with excellent
                  character spacing.
                </p>
                <p className="blog-caption">
                  Caption text with balanced proportions
                </p>
              </div>
            </Glass>

            <Glass variant="enhanced" hover className="touch-friendly">
              <h3 className="blog-subtitle text-responsive-lg mb-3">
                Geist Mono
              </h3>
              <p className="blog-caption mb-2 font-mono">Ideal for code</p>
              <div className="space-y-2">
                <pre className="blog-code-block text-sm">
                  {`const fonts = {
  heading: "Geist Sans",
  body: "Inter", 
  code: "Geist Mono"
};`}
                </pre>
              </div>
            </Glass>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="blog-title text-responsive-2xl text-center">
            Responsive Blog Post Cards
          </h2>
          <p className="blog-text-secondary text-responsive-base text-center">
            These cards demonstrate mobile-first responsive design with adaptive
            layouts
          </p>

          <div className="grid-mobile-auto">
            <GlassCard
              variant="featured"
              title="Building Modern Web Apps with Glass-Morphism"
              excerpt="Learn how to create stunning glass-morphism effects in your web applications using modern CSS techniques and design principles that enhance user experience."
              author="Sergey Ustinov"
              date="2024-01-15"
              readTime="5 min read"
              tags={['CSS', 'Design', 'Web Development']}
              heroImage="https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=400&fit=crop"
              heroAlt="Modern glass architecture"
              href="https://example.com/blog/glass-morphism"
            />

            <GlassCard
              variant="default"
              title="TypeScript Best Practices for React"
              excerpt="Discover essential TypeScript patterns and practices that will make your React applications more maintainable and type-safe."
              author="Jane Smith"
              date="2024-01-10"
              readTime="8 min read"
              tags={['TypeScript', 'React', 'Best Practices']}
              heroImage="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop"
              heroAlt="TypeScript code on screen"
              href="https://example.com/blog/typescript-best-practices"
            />

            <GlassCard
              variant="minimal"
              title="The Future of Web Development"
              excerpt="Exploring emerging technologies and trends that will shape the future of web development in the next decade."
              author="Alex Johnson"
              date="2024-01-05"
              readTime="6 min read"
              tags={['Future', 'Technology', 'Trends', 'Innovation', 'Web3']}
              heroImage="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop"
              heroAlt="Futuristic digital interface"
            />
          </div>

          <div className="grid-mobile-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
            <GlassCard
              variant="default"
              title="Card Without Image"
              excerpt="This is an example of a blog post card that doesn't have a hero image. It still looks great with just the content and maintains the glass-morphism aesthetic."
              author="David Chen"
              date="2024-01-12"
              readTime="4 min read"
              tags={['Design', 'UI/UX']}
            />

            <GlassCard
              variant="featured"
              title="Custom Content Card"
              author="Sarah Wilson"
              date="2024-01-08"
              readTime="7 min read"
              tags={['Custom', 'Content']}
            >
              <div className="mb-4">
                <p className="text-blog-text-secondary mb-2">
                  This card demonstrates custom content using the children prop.
                </p>
                <div className="bg-blog-code-bg rounded-lg p-4">
                  <code className="text-blog-code-text text-sm">
                    &lt;GlassCard&gt;Custom content here&lt;/GlassCard&gt;
                  </code>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="blog-heading text-responsive-2xl text-center font-bold">
            Responsive Features
          </h2>
          <div className="grid-mobile-1 gap-4 lg:grid-cols-3">
            <Glass
              variant="enhanced"
              hover
              className="glass-mobile glass-mobile-hover touch-friendly"
            >
              <h3 className="blog-heading text-responsive-lg mb-2 font-semibold">
                📱 Mobile-First
              </h3>
              <p className="blog-text-secondary text-responsive-sm">
                Designed for mobile devices first, then enhanced for larger
                screens. Touch-friendly targets with proper spacing.
              </p>
            </Glass>

            <Glass
              variant="enhanced"
              hover
              className="glass-mobile glass-mobile-hover touch-friendly"
            >
              <h3 className="blog-heading text-responsive-lg mb-2 font-semibold">
                🎨 Adaptive Glass
              </h3>
              <p className="blog-text-secondary text-responsive-sm">
                Glass effects adapt to screen size and resolution for optimal
                performance and visual quality.
              </p>
            </Glass>

            <Glass
              variant="enhanced"
              hover
              className="glass-mobile glass-mobile-hover touch-friendly"
            >
              <h3 className="blog-heading text-responsive-lg mb-2 font-semibold">
                ♿ Accessibility
              </h3>
              <p className="blog-text-secondary text-responsive-sm">
                Respects user preferences for reduced motion, high contrast, and
                dark mode.
              </p>
            </Glass>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <a
            className="bg-foreground text-background flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:bg-[#383838] sm:h-12 sm:w-auto sm:px-5 sm:text-base dark:hover:bg-[#ccc]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:w-auto sm:px-5 sm:text-base md:w-[158px] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
