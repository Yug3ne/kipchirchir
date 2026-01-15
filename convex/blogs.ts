import { v } from "convex/values";
import type { QueryCtx } from "./_generated/server";

import { authComponent } from "./auth";
import { mutation, query } from "./_generated/server";

type AuthUser = Awaited<ReturnType<typeof authComponent.getAuthUser>>;

type BlogPostDoc = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  publishedAt?: number;
  createdAt: number;
  updatedAt: number;
  readingTime: number;
  status: "draft" | "published";
  authorId?: string;
};

function nowMs(): number {
  return Date.now();
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

async function requireAuth(ctx: QueryCtx): Promise<NonNullable<AuthUser>> {
  try {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Unauthenticated");
    }
    return user;
  } catch {
    // authComponent.getAuthUser throws ConvexError("Unauthenticated") when no session
    throw new Error("Unauthenticated");
  }
}

function getAuthUserId(user: { userId?: string | null; _id: unknown }): string {
  return String(user.userId ?? user._id);
}

async function requireAdmin(ctx: QueryCtx): Promise<NonNullable<AuthUser>> {
  const user = await requireAuth(ctx);
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (!adminEmail) {
    throw new Error("Server misconfigured: ADMIN_EMAIL is not set");
  }

  const userEmail = user.email?.toLowerCase().trim();
  if (!userEmail || userEmail !== adminEmail.toLowerCase()) {
    throw new Error("Not authorized");
  }

  return user;
}

async function ensureUniqueSlug(
  ctx: QueryCtx,
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let slug = baseSlug;
  for (let attempt = 0; attempt < 50; attempt++) {
    const existing: BlogPostDoc | null = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (!existing || (excludeId && existing._id === excludeId)) {
      return slug;
    }

    slug = `${baseSlug}-${attempt + 2}`;
  }

  throw new Error("Failed to generate a unique slug");
}

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const posts: BlogPostDoc[] = await ctx.db
      .query("blogPosts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    posts.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
    return posts;
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    try {
      await requireAdmin(ctx);
    } catch {
      // For unauthenticated/non-admin users, return an empty list.
      // The Admin UI already redirects to /login; this avoids noisy console errors.
      return [];
    }

    const posts: BlogPostDoc[] = await ctx.db.query("blogPosts").collect();
    posts.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
    return posts;
  },
});

export const getById = query({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) return null;

    // Check if user is admin - if so, return post regardless of status
    try {
      await requireAdmin(ctx);
      return post;
    } catch {
      // Not admin - only return published posts
      if (post.status !== "published") {
        return null;
      }
      return post;
    }
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    // Only return published posts to public users
    if (post && post.status !== "published") {
      return null;
    }
    return post;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    tags: v.array(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    const createdAt = nowMs();

    const readingTime = calculateReadingTime(args.content);
    const baseSlug = generateSlug(args.title);
    const slug = await ensureUniqueSlug(ctx, baseSlug);

    const publishedAt = args.status === "published" ? createdAt : undefined;

    const id = await ctx.db.insert("blogPosts", {
      title: args.title,
      slug,
      excerpt: args.excerpt,
      content: args.content,
      coverImage: args.coverImage,
      tags: args.tags,
      status: args.status,
      publishedAt,
      createdAt,
      updatedAt: createdAt,
      readingTime,
      authorId: getAuthUserId(user),
    });

    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("blogPosts"),
    title: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Post not found");
    }

    const updatedAt = nowMs();

    const patch: {
      updatedAt: number;
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      readingTime?: number;
      coverImage?: string;
      tags?: string[];
      status?: "draft" | "published";
      publishedAt?: number;
    } = {
      updatedAt,
    };

    if (args.title !== undefined) {
      patch.title = args.title;
      const baseSlug = generateSlug(args.title);
      patch.slug = await ensureUniqueSlug(ctx, baseSlug, String(args.id));
    }

    if (args.excerpt !== undefined) patch.excerpt = args.excerpt;
    if (args.content !== undefined) {
      patch.content = args.content;
      patch.readingTime = calculateReadingTime(args.content);
    }

    if (args.coverImage !== undefined) patch.coverImage = args.coverImage;
    if (args.tags !== undefined) patch.tags = args.tags;

    if (args.status !== undefined) {
      patch.status = args.status;
      if (args.status === "published" && !existing.publishedAt) {
        patch.publishedAt = updatedAt;
      }
      if (args.status === "draft") {
        patch.publishedAt = undefined;
      }
    }

    await ctx.db.patch(args.id, patch);
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
    return null;
  },
});
