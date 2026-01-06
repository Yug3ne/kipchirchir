// Blog Types - These will match your Convex schema

export interface BlogPost {
  _id: string; // Convex uses _id
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  publishedAt?: number; // Convex timestamp (milliseconds)
  createdAt: number;
  updatedAt: number;
  readingTime: number;
  status: "draft" | "published";
  authorId?: string; // For future auth integration
}

// Input types for mutations
export interface CreateBlogPostInput {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status: "draft" | "published";
}

export interface UpdateBlogPostInput {
  _id: string;
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  tags?: string[];
  status?: "draft" | "published";
}

// Helper functions
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

