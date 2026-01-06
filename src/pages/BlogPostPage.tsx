import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  Copy,
  Check,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useBlogPostBySlug } from "@/hooks/use-blog";
import { formatDate } from "@/lib/blog-types";

// Simple markdown parser for rendering
function parseMarkdown(content: string): string {
  let html = content;

  // Headers
  html = html.replace(
    /^### (.*$)/gim,
    '<h3 class="text-xl font-bold mt-8 mb-4 text-foreground">$1</h3>'
  );
  html = html.replace(
    /^## (.*$)/gim,
    '<h2 class="text-2xl font-bold mt-10 mb-4 text-foreground">$1</h2>'
  );
  html = html.replace(
    /^# (.*$)/gim,
    '<h1 class="text-3xl font-bold mt-12 mb-6 text-foreground">$1</h1>'
  );

  // Bold and Italic
  html = html.replace(
    /\*\*\*(.*?)\*\*\*/gim,
    '<strong class="font-bold"><em>$1</em></strong>'
  );
  html = html.replace(
    /\*\*(.*?)\*\*/gim,
    '<strong class="font-semibold text-foreground">$1</strong>'
  );
  html = html.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');

  // Code blocks
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/gim,
    '<pre class="bg-muted/50 border border-border rounded-xl p-4 my-6 overflow-x-auto"><code class="text-sm font-mono text-foreground/90">$2</code></pre>'
  );

  // Inline code
  html = html.replace(
    /`([^`]+)`/gim,
    '<code class="bg-muted/70 text-primary px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
  );

  // Blockquotes
  html = html.replace(
    /^> (.*$)/gim,
    '<blockquote class="border-l-4 border-primary/50 pl-4 my-6 italic text-muted-foreground">$1</blockquote>'
  );

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr class="my-8 border-border/50" />');

  // Lists
  html = html.replace(
    /^\d+\. (.*$)/gim,
    '<li class="ml-6 list-decimal mb-2">$1</li>'
  );
  html = html.replace(/^- (.*$)/gim, '<li class="ml-6 list-disc mb-2">$1</li>');

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/gim,
    '<a href="$2" class="text-primary hover:underline underline-offset-4">$1</a>'
  );

  // Paragraphs (wrap remaining text)
  html = html
    .split("\n\n")
    .map((para) => {
      if (
        para.startsWith("<h") ||
        para.startsWith("<pre") ||
        para.startsWith("<blockquote") ||
        para.startsWith("<hr") ||
        para.startsWith("<li") ||
        para.trim() === ""
      ) {
        return para;
      }
      return `<p class="mb-4 leading-relaxed text-muted-foreground">${para}</p>`;
    })
    .join("\n");

  return html;
}

export function BlogPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, isLoading } = useBlogPostBySlug(id);
  const [copied, setCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Redirect if post not found
  useEffect(() => {
    if (!isLoading && post === null) {
      navigate("/blog");
    }
  }, [isLoading, post, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  // Post not found (will redirect)
  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Article not found...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-linear-to-bl from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-linear-to-tr from-chart-2/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/blog"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">All Articles</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="rounded-xl"
              >
                {copied ? (
                  <Check className="size-4 text-green-500" />
                ) : (
                  <Share2 className="size-4" />
                )}
              </Button>
              <Link
                to="/"
                className="size-10 rounded-xl bg-linear-to-br from-primary to-chart-3 flex items-center justify-center text-primary-foreground font-bold text-sm"
              >
                EK
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="relative py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Article Header */}
            <header className="space-y-6 mb-12">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-medium">
                    <Tag className="size-3 mr-1.5" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-linear-to-br from-primary to-chart-3 flex items-center justify-center text-primary-foreground text-xs font-bold">
                    EK
                  </div>
                  <span className="font-medium text-foreground">
                    Eugene Kipchirchir
                  </span>
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  {formatDate(post.publishedAt ?? post.createdAt)}
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {post.readingTime} min read
                </span>
              </div>

              {/* Excerpt */}
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed border-l-4 border-primary/30 pl-4">
                {post.excerpt}
              </p>
            </header>

            <Separator className="mb-12" />

            {/* Article Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
            />

            {/* Article Footer */}
            <footer className="mt-16 pt-8 border-t border-border/50">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Author Card */}
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-xl bg-linear-to-br from-primary to-chart-3 flex items-center justify-center text-primary-foreground font-bold">
                    EK
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Eugene Kipchirchir
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Full-Stack Developer
                    </p>
                  </div>
                </div>

                {/* Share */}
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="size-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      Copy link
                    </>
                  )}
                </Button>
              </div>
            </footer>
          </div>
        </div>
      </article>

      {/* Back to blog */}
      <section className="relative pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to all articles</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="size-5" />
        </button>
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Eugene Kipchirchir Koech
            </p>
            <Link
              to="/"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Back to Portfolio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default BlogPostPage;
