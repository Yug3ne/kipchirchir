/**
 * Blog Hooks - Data layer abstraction
 * 
 * Currently uses localStorage for development.
 * When integrating Convex, replace these hooks with:
 * 
 * import { useQuery, useMutation } from "convex/react";
 * import { api } from "../../convex/_generated/api";
 * 
 * Example replacements:
 * - useBlogPosts() → useQuery(api.blogs.listPublished)
 * - useAllBlogPosts() → useQuery(api.blogs.listAll)
 * - useBlogPost(id) → useQuery(api.blogs.getById, { id })
 * - useCreatePost() → useMutation(api.blogs.create)
 * - useUpdatePost() → useMutation(api.blogs.update)
 * - useDeletePost() → useMutation(api.blogs.remove)
 */

import { useState, useEffect, useCallback } from "react";
import {
  type BlogPost,
  type CreateBlogPostInput,
  type UpdateBlogPostInput,
  calculateReadingTime,
  generateSlug,
} from "@/lib/blog-types";

const STORAGE_KEY = "kipchirchir_blogs";

// Sample data for development
const samplePosts: BlogPost[] = [
  {
    _id: "1",
    title: "Building Scalable Mobile Apps with React Native & Expo",
    slug: "building-scalable-mobile-apps-react-native-expo",
    excerpt:
      "A deep dive into architectural patterns and best practices I've learned while building production-ready mobile applications.",
    content: `# Building Scalable Mobile Apps with React Native & Expo

When I started building **Planrr**, I knew we needed an architecture that could scale. Here's what I learned along the way.

## The Challenge

Building a mobile app that handles group contributions, savings goals, tasks, and expenses requires careful planning. The app needed to:

- Work offline with seamless sync
- Handle real-time updates
- Support multiple currencies
- Generate PDF reports

## Architecture Decisions

### 1. State Management with Zustand

Instead of Redux, we chose **Zustand** for its simplicity:

\`\`\`typescript
import { create } from 'zustand';

interface ContributionStore {
  contributions: Contribution[];
  addContribution: (contribution: Contribution) => void;
  syncWithServer: () => Promise<void>;
}

export const useContributionStore = create<ContributionStore>((set) => ({
  contributions: [],
  addContribution: (contribution) =>
    set((state) => ({
      contributions: [...state.contributions, contribution],
    })),
  syncWithServer: async () => {
    // Sync logic here
  },
}));
\`\`\`

### 2. GraphQL with Laravel Lighthouse

For the backend, we used Laravel with Lighthouse for GraphQL:

\`\`\`graphql
type Contribution {
  id: ID!
  amount: Float!
  currency: String!
  contributor: User!
  group: Group!
  createdAt: DateTime!
}

type Query {
  contributions(groupId: ID!): [Contribution!]!
}

type Mutation {
  createContribution(input: CreateContributionInput!): Contribution!
}
\`\`\`

## Lessons Learned

1. **Start with TypeScript** - The type safety saved us countless hours
2. **Invest in offline-first** - Users expect apps to work without internet
3. **Test on real devices** - Emulators don't catch everything

## Conclusion

Building Planrr taught me that the best architecture is one that serves your users' needs while remaining maintainable. Don't over-engineer, but don't cut corners either.

---

*What architectural patterns have you found useful in your mobile apps? Let's connect and discuss!*`,
    coverImage: "/blog/react-native-expo.jpg",
    tags: ["React Native", "Expo", "Mobile Development", "Architecture"],
    publishedAt: new Date("2025-01-03T10:00:00Z").getTime(),
    createdAt: new Date("2025-01-03T10:00:00Z").getTime(),
    updatedAt: new Date("2025-01-03T10:00:00Z").getTime(),
    readingTime: 8,
    status: "published",
  },
  {
    _id: "2",
    title: "From Moringa to Production: My Developer Journey",
    slug: "from-moringa-to-production-developer-journey",
    excerpt:
      "Reflections on transitioning from bootcamp learning to shipping real products at startups.",
    content: `# From Moringa to Production: My Developer Journey

It's been an incredible journey from my first lines of code at Moringa School to shipping production applications used by thousands.

## The Beginning

When I enrolled at **Moringa School** in December 2023, I had a background in tech but limited practical coding experience. The intensive 9-month program changed everything.

### What Bootcamps Get Right

- **Project-based learning** - Building real things sticks
- **Collaboration** - Pair programming and code reviews
- **Time pressure** - Deadlines teach prioritization

### What You Still Need to Learn

The real learning happens when you:

1. Debug production issues at 2 AM
2. Navigate unclear requirements
3. Balance technical debt vs. shipping

## First Professional Role

Landing my role at **Cybasoft** was surreal. Suddenly, my code would affect real users. The stakes felt higher.

### Key Learnings

> "The code you write isn't just for computers—it's for the humans who will maintain it."

\`\`\`typescript
// Bad: Clever but unclear
const r = d.filter(x => x.s === 'a' && new Date(x.d) > Date.now());

// Good: Self-documenting
const activeDeadlines = deadlines.filter(deadline => {
  const isActive = deadline.status === 'active';
  const isFuture = new Date(deadline.dueDate) > Date.now();
  return isActive && isFuture;
});
\`\`\`

## Advice for New Developers

1. **Ship early, iterate often** - Perfection is the enemy of progress
2. **Read other people's code** - Open source is your free education
3. **Build in public** - Share your work, even if it's imperfect
4. **Find mentors** - Learn from those ahead of you

## What's Next

Currently pursuing my BSc at **African Leadership University** while working on exciting projects. The learning never stops.

---

*Are you transitioning from bootcamp to professional development? I'd love to hear your story.*`,
    coverImage: "/blog/developer-journey.jpg",
    tags: ["Career", "Learning", "Bootcamp", "Personal"],
    publishedAt: new Date("2025-01-01T14:30:00Z").getTime(),
    createdAt: new Date("2025-01-01T14:30:00Z").getTime(),
    updatedAt: new Date("2025-01-01T14:30:00Z").getTime(),
    readingTime: 6,
    status: "published",
  },
  {
    _id: "3",
    title: "Integrating AI into Full-Stack Applications",
    slug: "integrating-ai-full-stack-applications",
    excerpt:
      "How I used Google Gemini AI to build intelligent features in Green Ledger's investment platform.",
    content: `# Integrating AI into Full-Stack Applications

Building **Green Ledger**, an AI-powered investment platform, taught me how to effectively integrate LLMs into production applications.

## The Vision

Green Ledger connects energy innovators with investors. But how do you evaluate hundreds of project submissions objectively? **AI-powered assessment**.

## Implementation

### 1. Structured Prompts

The key to reliable AI outputs is structured prompting:

\`\`\`typescript
const evaluationPrompt = \`
You are an expert energy investment analyst. Evaluate this project based on:

1. Technical Feasibility (0-25)
2. Market Potential (0-25)
3. Team Capability (0-25)
4. Environmental Impact (0-25)

Project Details:
{projectData}

Respond in JSON format:
{
  "scores": { "technical": number, "market": number, "team": number, "impact": number },
  "summary": "2-3 sentence assessment",
  "risks": ["risk1", "risk2"],
  "recommendations": ["rec1", "rec2"]
}
\`;
\`\`\`

### 2. Validation Layer

Never trust AI outputs blindly:

\`\`\`typescript
import { z } from 'zod';

const EvaluationSchema = z.object({
  scores: z.object({
    technical: z.number().min(0).max(25),
    market: z.number().min(0).max(25),
    team: z.number().min(0).max(25),
    impact: z.number().min(0).max(25),
  }),
  summary: z.string().min(50).max(500),
  risks: z.array(z.string()).max(5),
  recommendations: z.array(z.string()).max(5),
});

function validateAIResponse(response: string) {
  const parsed = JSON.parse(response);
  return EvaluationSchema.parse(parsed);
}
\`\`\`

### 3. Graceful Degradation

Always have fallbacks:

\`\`\`typescript
async function evaluateProject(project: Project) {
  try {
    const aiEvaluation = await gemini.evaluate(project);
    return validateAIResponse(aiEvaluation);
  } catch (error) {
    // Fall back to rule-based scoring
    return calculateBasicScore(project);
  }
}
\`\`\`

## Lessons Learned

- **AI is a tool, not magic** - Set realistic expectations
- **Validate everything** - LLMs can hallucinate
- **Cache responses** - API calls are expensive
- **Show your work** - Let users see how scores were calculated

## Results

The AI evaluation system reduced manual review time by 70% while maintaining accuracy. Investors could now quickly filter through projects matching their criteria.

---

*Building something with AI? I'd love to hear about your experience!*`,
    coverImage: "/blog/ai-integration.jpg",
    tags: ["AI", "Next.js", "TypeScript", "Full-Stack"],
    publishedAt: new Date("2024-12-28T09:00:00Z").getTime(),
    createdAt: new Date("2024-12-28T09:00:00Z").getTime(),
    updatedAt: new Date("2024-12-28T09:00:00Z").getTime(),
    readingTime: 7,
    status: "published",
  },
];

// Migrate old blog post format to new format
function migratePost(post: Record<string, unknown>): BlogPost {
  const id = (post._id ?? post.id ?? crypto.randomUUID()) as string;
  const title = (post.title ?? "Untitled") as string;
  const createdAt = post.createdAt
    ? typeof post.createdAt === "string"
      ? new Date(post.createdAt as string).getTime()
      : (post.createdAt as number)
    : Date.now();
  const publishedAt = post.publishedAt
    ? typeof post.publishedAt === "string"
      ? new Date(post.publishedAt as string).getTime()
      : (post.publishedAt as number)
    : post.status === "published"
      ? createdAt
      : undefined;

  return {
    _id: id,
    title,
    slug: (post.slug as string) ?? generateSlug(title),
    excerpt: (post.excerpt ?? "") as string,
    content: (post.content ?? "") as string,
    coverImage: post.coverImage as string | undefined,
    tags: (post.tags ?? []) as string[],
    publishedAt,
    createdAt,
    updatedAt: post.updatedAt
      ? typeof post.updatedAt === "string"
        ? new Date(post.updatedAt as string).getTime()
        : (post.updatedAt as number)
      : createdAt,
    readingTime: (post.readingTime ?? 1) as number,
    status: (post.status ?? "draft") as "draft" | "published",
  };
}

// Initialize localStorage with sample data
function initializeStorage(): BlogPost[] {
  if (typeof window === "undefined") return samplePosts;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePosts));
    return samplePosts;
  }

  // Parse and migrate old posts to new format
  const parsed = JSON.parse(stored) as Record<string, unknown>[];
  const migrated = parsed.map(migratePost);
  
  // Save migrated data back
  localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
  
  return migrated;
}

function saveToStorage(posts: BlogPost[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// ============================================================================
// QUERY HOOKS - Replace with useQuery(api.blogs.xxx) when using Convex
// ============================================================================

/**
 * Get all published blog posts
 * 
 * Convex replacement:
 * const posts = useQuery(api.blogs.listPublished);
 */
export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate async loading like Convex would
    const timer = setTimeout(() => {
      const allPosts = initializeStorage();
      const published = allPosts
        .filter((post) => post.status === "published" && post.publishedAt)
        .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
      setPosts(published);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { posts, isLoading };
}

/**
 * Get all blog posts (including drafts) - for admin
 * 
 * Convex replacement:
 * const posts = useQuery(api.blogs.listAll);
 */
export function useAllBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const allPosts = initializeStorage();
      const sorted = allPosts.sort((a, b) => b.updatedAt - a.updatedAt);
      setPosts(sorted);
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { posts, isLoading, refetch };
}

/**
 * Get a single blog post by ID
 * 
 * Convex replacement:
 * const post = useQuery(api.blogs.getById, { id });
 */
export function useBlogPost(id: string | undefined) {
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setPost(null);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      const allPosts = initializeStorage();
      const found = allPosts.find((p) => p._id === id || p.slug === id);
      setPost(found ?? null);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [id]);

  return { post, isLoading };
}

/**
 * Get a blog post by slug
 * 
 * Convex replacement:
 * const post = useQuery(api.blogs.getBySlug, { slug });
 */
export function useBlogPostBySlug(slug: string | undefined) {
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      const allPosts = initializeStorage();
      const found = allPosts.find((p) => p.slug === slug);
      setPost(found ?? null);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [slug]);

  return { post, isLoading };
}

// ============================================================================
// MUTATION HOOKS - Replace with useMutation(api.blogs.xxx) when using Convex
// ============================================================================

/**
 * Create a new blog post
 * 
 * Convex replacement:
 * const createPost = useMutation(api.blogs.create);
 * await createPost({ title, content, ... });
 */
export function useCreatePost() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(async (input: CreateBlogPostInput): Promise<BlogPost> => {
    setIsPending(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const allPosts = initializeStorage();
    const now = Date.now();

    const newPost: BlogPost = {
      _id: crypto.randomUUID(),
      title: input.title,
      slug: generateSlug(input.title),
      excerpt: input.excerpt || input.title.substring(0, 150) + "...",
      content: input.content,
      coverImage: input.coverImage,
      tags: input.tags,
      status: input.status,
      publishedAt: input.status === "published" ? now : undefined,
      createdAt: now,
      updatedAt: now,
      readingTime: calculateReadingTime(input.content),
    };

    allPosts.push(newPost);
    saveToStorage(allPosts);

    setIsPending(false);
    return newPost;
  }, []);

  return { mutate, isPending };
}

/**
 * Update an existing blog post
 * 
 * Convex replacement:
 * const updatePost = useMutation(api.blogs.update);
 * await updatePost({ _id, title, content, ... });
 */
export function useUpdatePost() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(async (input: UpdateBlogPostInput): Promise<BlogPost | null> => {
    setIsPending(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const allPosts = initializeStorage();
    const index = allPosts.findIndex((p) => p._id === input._id);

    if (index === -1) {
      setIsPending(false);
      return null;
    }

    const existingPost = allPosts[index];
    const now = Date.now();

    const updatedPost: BlogPost = {
      ...existingPost,
      ...input,
      slug: input.title ? generateSlug(input.title) : existingPost.slug,
      updatedAt: now,
      readingTime: input.content
        ? calculateReadingTime(input.content)
        : existingPost.readingTime,
      publishedAt:
        input.status === "published" && !existingPost.publishedAt
          ? now
          : existingPost.publishedAt,
    };

    allPosts[index] = updatedPost;
    saveToStorage(allPosts);

    setIsPending(false);
    return updatedPost;
  }, []);

  return { mutate, isPending };
}

/**
 * Delete a blog post
 * 
 * Convex replacement:
 * const deletePost = useMutation(api.blogs.remove);
 * await deletePost({ id });
 */
export function useDeletePost() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(async (id: string): Promise<boolean> => {
    setIsPending(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const allPosts = initializeStorage();
    const filtered = allPosts.filter((p) => p._id !== id);

    if (filtered.length === allPosts.length) {
      setIsPending(false);
      return false;
    }

    saveToStorage(filtered);
    setIsPending(false);
    return true;
  }, []);

  return { mutate, isPending };
}

