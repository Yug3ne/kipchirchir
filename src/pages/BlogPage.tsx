import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Search,
  Sparkles,
  BookOpen,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBlogPosts } from "@/hooks/use-blog";
import { formatDate } from "@/lib/blog-types";

export function BlogPage() {
  const { posts, isLoading } = useBlogPosts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = posts ? [...new Set(posts.flatMap((post) => post.tags))] : [];

  // Filter posts based on search and tag
  const filteredPosts = posts?.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = !selectedTag || post.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/8 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-chart-2/6 via-transparent to-transparent rounded-full blur-3xl" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Portfolio</span>
            </Link>
            <Link
              to="/"
              className="size-10 rounded-xl bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center text-primary-foreground font-bold text-sm"
            >
              EK
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Decorative element */}
            <div className="flex items-center justify-center gap-3 text-primary">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
              <Sparkles className="size-5" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-foreground">Thoughts &</span>{" "}
              <span className="text-primary">Insights</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Exploring software engineering, building products, and the journey
              of continuous learning in tech.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto pt-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-12 rounded-xl bg-card/50 border-border/50 focus:border-primary/50 focus:bg-card transition-all"
                />
              </div>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <Button
                  variant={selectedTag === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(null)}
                  className="rounded-full"
                >
                  All
                </Button>
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                    className="rounded-full"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="relative pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="size-8 text-primary animate-spin" />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && (!filteredPosts || filteredPosts.length === 0) && (
              <div className="text-center py-16">
                <BookOpen className="size-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-muted-foreground">
                  No articles found
                </h3>
                <p className="text-muted-foreground/70 mt-2">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}

            {/* Posts */}
            {!isLoading && filteredPosts && filteredPosts.length > 0 && (
              <div className="grid gap-8">
                {/* Featured Post (First Post) */}
                <Link to={`/blog/${filteredPosts[0].slug}`} className="group">
                  <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Image Side */}
                      <div className="aspect-[4/3] md:aspect-auto relative bg-gradient-to-br from-primary/10 via-chart-2/10 to-chart-3/10 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center space-y-3">
                            <div className="size-20 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                              <BookOpen className="size-8 text-primary" />
                            </div>
                            <p className="text-xs text-muted-foreground/60 font-medium tracking-wider uppercase">
                              Featured Article
                            </p>
                          </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-4 left-4 size-24 border border-primary/20 rounded-xl rotate-12 group-hover:rotate-6 transition-transform duration-500" />
                        <div className="absolute bottom-4 right-4 size-16 border border-chart-2/20 rounded-lg -rotate-12 group-hover:-rotate-6 transition-transform duration-500" />
                      </div>

                      {/* Content Side */}
                      <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {filteredPosts[0].tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs font-medium"
                              >
                                <Tag className="size-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <h2 className="text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors leading-tight">
                            {filteredPosts[0].title}
                          </h2>

                          <p className="text-muted-foreground leading-relaxed line-clamp-3">
                            {filteredPosts[0].excerpt}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="size-4" />
                              {formatDate(
                                filteredPosts[0].publishedAt ??
                                  filteredPosts[0].createdAt
                              )}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="size-4" />
                              {filteredPosts[0].readingTime} min read
                            </span>
                          </div>

                          <div className="pt-2">
                            <span className="text-primary font-medium text-sm group-hover:underline underline-offset-4">
                              Read article →
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>

                {/* Rest of Posts */}
                {filteredPosts.length > 1 && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.slice(1).map((post, index) => (
                      <Link
                        key={post._id}
                        to={`/blog/${post.slug}`}
                        className="group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <Card className="h-full overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                          {/* Image */}
                          <div className="aspect-[16/10] relative bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <BookOpen className="size-10 text-muted-foreground/30 group-hover:text-primary/40 transition-colors" />
                            </div>
                            {/* Subtle pattern overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>

                          <CardContent className="p-5 space-y-3">
                            <div className="flex flex-wrap gap-1.5">
                              {post.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-[10px] font-medium px-2 py-0.5"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <h3 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h3>

                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {post.excerpt}
                            </p>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                {formatDate(post.publishedAt ?? post.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {post.readingTime} min
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

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

export default BlogPage;
