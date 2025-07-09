import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const samplePosts = [
  {
    title: 'Getting Started with Next.js 15',
    slug: 'getting-started-nextjs-15',
    excerpt:
      'Learn the fundamentals of Next.js 15 and build your first modern web application with the latest features.',
    content: `# Getting Started with Next.js 15

Next.js 15 brings exciting new features and improvements that make building React applications even more powerful and developer-friendly.

## Key Features

### 1. App Router Improvements
The App Router has been enhanced with better performance and more intuitive routing patterns.

### 2. Server Components
Take advantage of React Server Components for better performance and SEO.

### 3. Improved Developer Experience
- Better error messages
- Enhanced debugging tools
- Faster compilation times

## Quick Start

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Conclusion

Next.js 15 is a game-changer for modern web development. Start building today!`,
    heroImage:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    published: true,
    publishedAt: new Date('2024-01-15'),
    authorId: 'user_2abc123def456',
    views: 1250,
  },
  {
    title: 'Mastering TypeScript: Advanced Patterns',
    slug: 'mastering-typescript-advanced-patterns',
    excerpt:
      'Deep dive into advanced TypeScript patterns and techniques to write more maintainable and type-safe code.',
    content: `# Mastering TypeScript: Advanced Patterns

TypeScript has evolved significantly, and mastering advanced patterns is crucial for building robust applications.

## Advanced Type Patterns

### 1. Conditional Types
\`\`\`typescript
type IsArray<T> = T extends readonly unknown[] ? true : false;
\`\`\`

### 2. Template Literal Types
\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
\`\`\`

### 3. Mapped Types
\`\`\`typescript
type Optional<T> = {
  [K in keyof T]?: T[K];
};
\`\`\`

## Utility Types

Learn about built-in utility types that make your code more expressive and maintainable.

## Best Practices

1. Use strict mode
2. Prefer interfaces over types for object shapes
3. Leverage type guards effectively

Start implementing these patterns in your projects today!`,
    heroImage:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    published: true,
    publishedAt: new Date('2024-01-20'),
    authorId: 'user_2abc123def456',
    views: 980,
  },
  {
    title: 'Building Scalable React Applications',
    slug: 'building-scalable-react-applications',
    excerpt:
      'Learn architectural patterns and best practices for building large-scale React applications that are maintainable and performant.',
    content: `# Building Scalable React Applications

As your React application grows, maintaining code quality and performance becomes increasingly challenging.

## Architecture Patterns

### 1. Component Composition
Break down complex components into smaller, reusable pieces.

### 2. Custom Hooks
Extract logic into custom hooks for better reusability.

### 3. Context API vs State Management
Choose the right tool for the job.

## Performance Optimization

- Use React.memo strategically
- Implement code splitting
- Optimize bundle size

## Testing Strategy

A comprehensive testing strategy is essential for large applications.

## Conclusion

Building scalable React applications requires careful planning and adherence to best practices.`,
    heroImage:
      'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=400&fit=crop',
    published: true,
    publishedAt: new Date('2024-01-25'),
    authorId: 'user_2abc123def456',
    views: 756,
  },
  {
    title: 'The Future of Web Development',
    slug: 'future-of-web-development',
    excerpt:
      'Exploring upcoming trends and technologies that will shape the future of web development in 2024 and beyond.',
    content: `# The Future of Web Development

The web development landscape is constantly evolving. Let's explore what's coming next.

## Emerging Technologies

### 1. WebAssembly
Performance-critical applications will increasingly leverage WebAssembly.

### 2. Edge Computing
Bringing computation closer to users for better performance.

### 3. AI Integration
AI-powered development tools and user experiences.

## Framework Evolution

- React Server Components
- Solid.js innovations
- Svelte's growing popularity

## Development Trends

1. Micro-frontends
2. Jamstack architecture
3. Progressive Web Apps

The future is bright for web developers willing to adapt and learn.`,
    heroImage:
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop',
    published: true,
    publishedAt: new Date('2024-02-01'),
    authorId: 'user_2abc123def456',
    views: 1100,
  },
  {
    title: 'CSS Grid vs Flexbox: When to Use What',
    slug: 'css-grid-vs-flexbox-guide',
    excerpt:
      'A comprehensive guide to understanding the differences between CSS Grid and Flexbox, and when to use each layout method.',
    content: `# CSS Grid vs Flexbox: When to Use What

Both CSS Grid and Flexbox are powerful layout tools, but they serve different purposes.

## Flexbox: One-Dimensional Layout

### Best For:
- Navigation bars
- Card layouts
- Centering content
- Distributing space

### Example:
\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## CSS Grid: Two-Dimensional Layout

### Best For:
- Page layouts
- Complex grid systems
- Overlapping elements
- Responsive design

### Example:
\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
\`\`\`

## Decision Matrix

Choose Flexbox for component-level layouts and Grid for page-level layouts.

## Conclusion

Understanding when to use each tool will make you a more effective developer.`,
    heroImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    published: true,
    publishedAt: new Date('2024-02-05'),
    authorId: 'user_2abc123def456',
    views: 890,
  },
  {
    title: 'Modern JavaScript Testing Strategies',
    slug: 'modern-javascript-testing-strategies',
    excerpt:
      'Comprehensive guide to testing JavaScript applications with modern tools and best practices.',
    content: `# Modern JavaScript Testing Strategies

Testing is crucial for maintaining code quality and preventing regressions.

## Testing Pyramid

### 1. Unit Tests
Test individual functions and components in isolation.

### 2. Integration Tests
Test how different parts work together.

### 3. End-to-End Tests
Test complete user workflows.

## Testing Tools

- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Cypress**: End-to-end testing
- **Playwright**: Cross-browser testing

## Best Practices

1. Write tests before fixing bugs
2. Test behavior, not implementation
3. Keep tests simple and focused
4. Use descriptive test names

## Mocking Strategies

Learn when and how to mock dependencies effectively.

Building a robust testing strategy takes time but pays dividends in code quality.`,
    heroImage:
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop',
    published: false,
    publishedAt: null,
    authorId: 'user_2abc123def456',
    views: 0,
  },
  {
    title: 'Optimizing Web Performance: A Complete Guide',
    slug: 'optimizing-web-performance-guide',
    excerpt:
      'Learn how to optimize your web applications for better performance, user experience, and SEO rankings.',
    content: `# Optimizing Web Performance: A Complete Guide

Web performance directly impacts user experience and business metrics.

## Core Web Vitals

### 1. Largest Contentful Paint (LCP)
Measures loading performance.

### 2. First Input Delay (FID)
Measures interactivity.

### 3. Cumulative Layout Shift (CLS)
Measures visual stability.

## Optimization Techniques

### Images
- Use modern formats (WebP, AVIF)
- Implement lazy loading
- Optimize dimensions

### JavaScript
- Code splitting
- Tree shaking
- Minification

### CSS
- Critical CSS inlining
- Remove unused styles
- Optimize fonts

## Performance Monitoring

Use tools like Lighthouse, WebPageTest, and Chrome DevTools.

## Conclusion

Performance optimization is an ongoing process that requires continuous monitoring and improvement.`,
    heroImage:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    published: false,
    publishedAt: null,
    authorId: 'user_2abc123def456',
    views: 0,
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.analytics.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.subscriber.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create posts
  const createdPosts = [];
  for (const postData of samplePosts) {
    const post = await prisma.post.create({
      data: postData,
    });
    createdPosts.push(post);
    console.log(`📝 Created post: ${post.title}`);
  }

  // Create some comments
  const sampleComments = [
    {
      content:
        'Great article! This really helped me understand Next.js 15 better.',
      authorName: 'John Doe',
      authorEmail: 'john@example.com',
      authorId: 'user_comment1',
      postId: createdPosts[0]!.id,
    },
    {
      content:
        'Thanks for the detailed explanation. Looking forward to trying these features.',
      authorName: 'Jane Smith',
      authorEmail: 'jane@example.com',
      authorId: 'user_comment2',
      postId: createdPosts[0]!.id,
    },
    {
      content:
        "The TypeScript patterns you showed are really useful. I'll definitely use these in my next project.",
      authorName: 'Mike Johnson',
      authorEmail: 'mike@example.com',
      authorId: 'user_comment3',
      postId: createdPosts[1]!.id,
    },
    {
      content: 'Excellent breakdown of advanced TypeScript concepts!',
      authorName: 'Sarah Wilson',
      authorEmail: 'sarah@example.com',
      authorId: 'user_comment4',
      postId: createdPosts[1]!.id,
    },
    {
      content:
        'This is exactly what I was looking for. The React patterns are spot on.',
      authorName: 'David Brown',
      authorEmail: 'david@example.com',
      authorId: 'user_comment5',
      postId: createdPosts[2]!.id,
    },
  ];

  const createdComments = [];
  for (const commentData of sampleComments) {
    const comment = await prisma.comment.create({
      data: commentData,
    });
    createdComments.push(comment);
  }

  // Create a nested comment (reply)
  await prisma.comment.create({
    data: {
      content: 'I completely agree! The examples make it so much clearer.',
      authorName: 'Alice Johnson',
      authorEmail: 'alice@example.com',
      authorId: 'user_comment_reply1',
      postId: createdPosts[0]!.id,
      parentId: createdComments[0]!.id,
    },
  });

  console.log('💬 Created sample comments');

  // Create some likes
  const sampleLikes = [
    { userId: 'user_like1', postId: createdPosts[0]!.id },
    { userId: 'user_like2', postId: createdPosts[0]!.id },
    { userId: 'user_like3', postId: createdPosts[0]!.id },
    { userId: 'user_like4', postId: createdPosts[0]!.id },
    { userId: 'user_like5', postId: createdPosts[0]!.id },
    { userId: 'user_like1', postId: createdPosts[1]!.id },
    { userId: 'user_like2', postId: createdPosts[1]!.id },
    { userId: 'user_like3', postId: createdPosts[1]!.id },
    { userId: 'user_like1', postId: createdPosts[2]!.id },
    { userId: 'user_like4', postId: createdPosts[2]!.id },
    { userId: 'user_like2', postId: createdPosts[3]!.id },
    { userId: 'user_like3', postId: createdPosts[4]!.id },
  ];

  for (const likeData of sampleLikes) {
    await prisma.like.create({
      data: likeData,
    });
  }

  console.log('❤️  Created sample likes');

  // Create some subscribers
  const sampleSubscribers = [
    {
      email: 'subscriber1@example.com',
      name: 'Tech Enthusiast',
      source: 'footer',
    },
    {
      email: 'subscriber2@example.com',
      name: 'Developer Pro',
      source: 'post',
    },
    {
      email: 'subscriber3@example.com',
      name: 'Code Learner',
      source: 'footer',
    },
  ];

  for (const subscriberData of sampleSubscribers) {
    await prisma.subscriber.create({
      data: subscriberData,
    });
  }

  console.log('📧 Created sample subscribers');

  // Create some analytics events
  const sampleAnalytics = [
    {
      event: 'page_view',
      postId: createdPosts[0]!.id,
      userId: 'user_analytics1',
      metadata: { path: '/post/getting-started-nextjs-15' },
    },
    {
      event: 'page_view',
      postId: createdPosts[1]!.id,
      userId: 'user_analytics2',
      metadata: { path: '/post/mastering-typescript-advanced-patterns' },
    },
    {
      event: 'like',
      postId: createdPosts[0]!.id,
      userId: 'user_analytics1',
      metadata: { action: 'like' },
    },
    {
      event: 'comment',
      postId: createdPosts[0]!.id,
      userId: 'user_analytics2',
      metadata: { action: 'comment' },
    },
    {
      event: 'subscribe',
      userId: 'user_analytics3',
      metadata: { source: 'footer' },
    },
  ];

  for (const analyticsData of sampleAnalytics) {
    await prisma.analytics.create({
      data: analyticsData,
    });
  }

  console.log('📊 Created sample analytics');

  const stats = await prisma.post.aggregate({
    _count: { id: true },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`📈 Created ${stats._count.id} posts`);
  console.log(`💬 Created ${createdComments.length + 1} comments`);
  console.log(`❤️  Created ${sampleLikes.length} likes`);
  console.log(`📧 Created ${sampleSubscribers.length} subscribers`);
  console.log(`📊 Created ${sampleAnalytics.length} analytics events`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
