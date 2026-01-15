import { useMutation, useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

import type {
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from "@/lib/blog-types";

type BlogPostId = Id<"blogPosts">;

function mapDocToBlogPost(doc: {
  _id: unknown;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | undefined;
  tags: string[];
  publishedAt?: number | undefined;
  createdAt: number;
  updatedAt: number;
  readingTime: number;
  status: "draft" | "published";
  authorId?: string | undefined;
}): BlogPost {
  return {
    _id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    content: doc.content,
    coverImage: doc.coverImage ?? undefined,
    tags: doc.tags,
    publishedAt: doc.publishedAt ?? undefined,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    readingTime: doc.readingTime,
    status: doc.status,
    authorId: doc.authorId ?? undefined,
  };
}

export function useBlogPosts() {
  const posts = useQuery(api.blogs.listPublished);
  return {
    posts: posts?.map(mapDocToBlogPost),
    isLoading: posts === undefined,
  };
}

export function useAllBlogPosts() {
  const posts = useQuery(api.blogs.listAll);

  return {
    posts: posts?.map(mapDocToBlogPost),
    isLoading: posts === undefined,
    refetch: () => {
      // Convex automatically keeps queries up to date.
      // Kept for backwards compatibility with the existing UI.
    },
  };
}

export function useBlogPost(id: string | undefined) {
  const post = useQuery(
    api.blogs.getById,
    id ? { id: id as BlogPostId } : "skip"
  );

  return {
    post: post ? mapDocToBlogPost(post) : post,
    isLoading: id ? post === undefined : false,
  };
}

export function useBlogPostBySlug(slug: string | undefined) {
  const post = useQuery(api.blogs.getBySlug, slug ? { slug } : "skip");

  return {
    post: post ? mapDocToBlogPost(post) : post,
    isLoading: slug ? post === undefined : false,
  };
}

export function useCreatePost() {
  const create = useMutation(api.blogs.create);

  return {
    isPending: false,
    mutate: async (input: CreateBlogPostInput): Promise<void> => {
      await create({
        title: input.title,
        excerpt: input.excerpt,
        content: input.content,
        coverImage: input.coverImage,
        tags: input.tags,
        status: input.status,
      });
    },
  };
}

export function useUpdatePost() {
  const update = useMutation(api.blogs.update);

  return {
    isPending: false,
    mutate: async (input: UpdateBlogPostInput): Promise<void> => {
      await update({
        id: input._id as BlogPostId,
        title: input.title,
        excerpt: input.excerpt,
        content: input.content,
        coverImage: input.coverImage,
        tags: input.tags,
        status: input.status,
      });
    },
  };
}

export function useDeletePost() {
  const mutation = useMutation(api.blogs.remove);

  return {
    isPending: false,
    mutate: async (id: string): Promise<boolean> => {
      await mutation({ id: id as BlogPostId });
      return true;
    },
  };
}
