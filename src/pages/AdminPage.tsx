import { useState, useRef } from "react";
import { Link, useNavigate, useParams, Navigate } from "react-router";
import {
  ArrowLeft,
  Save,
  Eye,
  Edit3,
  Trash2,
  Plus,
  FileText,
  Tag,
  Clock,
  Calendar,
  Send,
  Bold,
  Italic,
  Code,
  List,
  Quote,
  Heading1,
  Heading2,
  Link2,
  Image,
  Minus,
  Sparkles,
  Check,
  Loader2,
  LogOut,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useAllBlogPosts,
  useBlogPost,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
} from "@/hooks/use-blog";
import {
  formatDate,
  calculateReadingTime,
  type BlogPost,
  type CreateBlogPostInput,
} from "@/lib/blog-types";
import { useAuth } from "@/hooks/use-auth";

// Markdown toolbar buttons
const toolbarButtons = [
  { icon: Bold, label: "Bold", before: "**", after: "**" },
  { icon: Italic, label: "Italic", before: "*", after: "*" },
  { icon: Code, label: "Inline Code", before: "`", after: "`" },
  { icon: Heading1, label: "Heading 1", before: "# ", after: "" },
  { icon: Heading2, label: "Heading 2", before: "## ", after: "" },
  { icon: Quote, label: "Quote", before: "> ", after: "" },
  { icon: List, label: "List", before: "- ", after: "" },
  { icon: Minus, label: "Divider", before: "\n---\n", after: "" },
  { icon: Link2, label: "Link", before: "[", after: "](url)" },
];

// Simple markdown preview parser
function parseMarkdownPreview(content: string): string {
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

  // Paragraphs
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

// Post List Component
function PostList({
  posts,
  isLoading,
  onEdit,
  onDelete,
  onNew,
}: {
  posts: BlogPost[] | undefined;
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const deletePost = useDeletePost();

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      await deletePost.mutate(id);
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Articles</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and create blog posts
          </p>
        </div>
        <Button onClick={onNew} className="gap-2">
          <Plus className="size-4" />
          New Article
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-8 text-primary animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!posts || posts.length === 0) && (
        <Card className="bg-card/50 border-dashed">
          <CardContent className="py-12 text-center">
            <FileText className="size-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">No articles yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Start writing your first blog post
            </p>
            <Button onClick={onNew} className="gap-2">
              <Plus className="size-4" />
              Create Article
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Posts Grid */}
      {!isLoading && posts && posts.length > 0 && (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card
              key={post._id}
              className="bg-card/50 hover:bg-card/80 transition-colors"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={
                          post.status === "published" ? "default" : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {post.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(post.publishedAt ?? post.createdAt)}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.readingTime} min
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg truncate mb-1">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-1">
                      {post.excerpt}
                    </p>
                    <div className="flex gap-1.5 mt-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-[10px]"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(post._id)}
                    >
                      <Edit3 className="size-4" />
                    </Button>
                    <Button
                      variant={
                        deleteConfirm === post._id ? "destructive" : "ghost"
                      }
                      size="icon-sm"
                      onClick={() => handleDelete(post._id)}
                      disabled={deletePost.isPending}
                    >
                      {deleteConfirm === post._id ? (
                        <Check className="size-4" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Editor Component
function Editor({
  postId,
  onSave,
  onCancel,
}: {
  postId: string | null; // null = new post
  onSave: () => void;
  onCancel: () => void;
}) {
  const { post, isLoading: isLoadingPost } = useBlogPost(postId ?? undefined);
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  // Track which post we've initialized form for
  const [initializedForId, setInitializedForId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState(""); // URL (from Convex storage or external)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null); // Local file for upload
  const [coverImagePreview, setCoverImagePreview] = useState(""); // Local preview URL
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when post loads (for editing mode) - only once per post
  if (post && post._id !== initializedForId) {
    setInitializedForId(post._id);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setTags(post.tags.join(", "));
    setCoverImage(post.coverImage ?? "");
    setCoverImagePreview(post.coverImage ?? "");
    setStatus(post.status);
  }

  // Handle file selection for cover image
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    // Store the file for later upload to Convex
    setCoverImageFile(file);

    // Create local preview URL
    const previewUrl = URL.createObjectURL(file);
    setCoverImagePreview(previewUrl);

    // Clear any existing URL since we're using a file now
    setCoverImage("");
  };

  // Clear the cover image
  const handleClearImage = () => {
    setCoverImageFile(null);
    if (coverImagePreview && !coverImage) {
      URL.revokeObjectURL(coverImagePreview); // Clean up blob URL
    }
    setCoverImagePreview("");
    setCoverImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleToolbarClick = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newContent);

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSave = async (publishStatus: "draft" | "published") => {
    if (!title.trim() || !content.trim()) return;

    // Determine cover image URL
    let finalCoverImage = coverImage.trim() || undefined;

    // TODO: When integrating Convex, upload the file here:
    // if (coverImageFile) {
    //   const uploadUrl = await generateUploadUrl();
    //   const result = await fetch(uploadUrl, {
    //     method: "POST",
    //     headers: { "Content-Type": coverImageFile.type },
    //     body: coverImageFile,
    //   });
    //   const { storageId } = await result.json();
    //   finalCoverImage = await getUrl({ storageId });
    // }

    // For now (before Convex), use the preview URL for local testing
    if (coverImageFile && coverImagePreview) {
      finalCoverImage = coverImagePreview;
    }

    const postData: CreateBlogPostInput = {
      title: title.trim(),
      excerpt: excerpt.trim() || title.trim().substring(0, 150) + "...",
      content: content.trim(),
      coverImage: finalCoverImage,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status: publishStatus,
    };

    if (postId && post) {
      // Update existing post
      await updatePost.mutate({
        _id: postId,
        ...postData,
      });
    } else {
      // Create new post
      await createPost.mutate(postData);
    }

    onSave();
  };

  const isPending = createPost.isPending || updatePost.isPending;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = calculateReadingTime(content);

  // Loading state for editing
  if (postId && isLoadingPost) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">
              {postId ? "Edit Article" : "New Article"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {wordCount} words · {readingTime} min read
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            {showPreview ? (
              <>
                <Edit3 className="size-4" />
                Edit
              </>
            ) : (
              <>
                <Eye className="size-4" />
                Preview
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            disabled={isPending || !title.trim() || !content.trim()}
            className="gap-2"
          >
            <Save className="size-4" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave("published")}
            disabled={isPending || !title.trim() || !content.trim()}
            className="gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Send className="size-4" />
                Publish
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          {showPreview ? (
            /* Preview Mode */
            <Card className="bg-card/50 min-h-[600px]">
              <CardContent className="p-8">
                <h1 className="text-3xl font-bold mb-4">
                  {title || "Untitled"}
                </h1>
                {excerpt && (
                  <p className="text-lg text-muted-foreground mb-8 border-l-4 border-primary/30 pl-4">
                    {excerpt}
                  </p>
                )}
                <div
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdownPreview(content),
                  }}
                />
              </CardContent>
            </Card>
          ) : (
            /* Edit Mode */
            <>
              {/* Title Input */}
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article title..."
                className="h-14 text-2xl font-bold border-0 border-b rounded-none px-0 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50"
              />

              {/* Excerpt Input */}
              <Input
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief description (optional)..."
                className="h-12 text-lg border-0 border-b rounded-none px-0 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50 text-muted-foreground"
              />

              {/* Toolbar */}
              <div className="flex flex-wrap gap-1 p-2 bg-muted/30 rounded-xl border border-border/50">
                {toolbarButtons.map((btn) => (
                  <Button
                    key={btn.label}
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleToolbarClick(btn.before, btn.after)}
                    title={btn.label}
                  >
                    <btn.icon className="size-4" />
                  </Button>
                ))}
                <div className="flex-1" />
                <span className="text-xs text-muted-foreground self-center px-2">
                  Markdown supported
                </span>
              </div>

              {/* Content Textarea */}
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your article in Markdown...

# Use headings like this
**Bold text** and *italic text*

> Add quotes for emphasis

- Create lists
- With multiple items

```javascript
// Add code blocks
const hello = 'world';
```

Happy writing!"
                className="min-h-[500px] font-mono text-sm resize-none border-border/50 bg-card/30 focus-visible:ring-primary/30"
              />
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status Card */}
          <Card className="bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                Article Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant={status === "draft" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatus("draft")}
                  className="flex-1"
                >
                  Draft
                </Button>
                <Button
                  variant={status === "published" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatus("published")}
                  className="flex-1"
                >
                  Published
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cover Image Card */}
          <Card className="bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Image className="size-4 text-primary" />
                Cover Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* File Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border/50 hover:border-primary/50 rounded-lg p-4 text-center cursor-pointer transition-colors group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Image className="size-8 mx-auto text-muted-foreground/50 group-hover:text-primary/50 transition-colors mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload image
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>

              {/* Or use URL */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex-1 h-px bg-border" />
                <span>or paste URL</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <Input
                value={coverImage}
                onChange={(e) => {
                  setCoverImage(e.target.value);
                  setCoverImagePreview(e.target.value);
                  setCoverImageFile(null); // Clear file if using URL
                }}
                placeholder="https://example.com/image.jpg"
                className="text-sm"
              />

              {/* Preview */}
              {(coverImagePreview || coverImageFile) && (
                <div className="relative">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted border border-border">
                    <img
                      src={coverImagePreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "";
                        (e.target as HTMLImageElement).alt = "Failed to load";
                      }}
                    />
                  </div>
                  {/* Clear button */}
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    onClick={handleClearImage}
                    className="absolute top-2 right-2 size-6 rounded-full"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                  {/* File info */}
                  {coverImageFile && (
                    <p className="text-xs text-muted-foreground mt-2 truncate">
                      📎 {coverImageFile.name} (
                      {(coverImageFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags Card */}
          <Card className="bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Tag className="size-4 text-primary" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="React, TypeScript, Tutorial..."
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Separate tags with commas
              </p>
              {tags && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Writing Tips */}
          <Card className="bg-linear-to-br from-primary/5 to-chart-2/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                Writing Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-muted-foreground space-y-2">
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  Use clear, descriptive headings
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  Add code examples for tutorials
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  Break up text with lists and quotes
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  End with a call-to-action
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-card/50">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{wordCount}</p>
                  <p className="text-xs text-muted-foreground">Words</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {readingTime}
                  </p>
                  <p className="text-xs text-muted-foreground">Min read</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Main Admin Page Component
export function AdminPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { posts, isLoading, refetch } = useAllBlogPosts();
  const { user, isAuthenticated, signOut } = useAuth();

  // Derive editingPostId directly from URL params (no state needed)
  const editingPostId = id === "new" ? "new" : (id ?? null);

  const handleEdit = (postId: string) => {
    navigate(`/admin/${postId}`);
  };

  const handleNew = () => {
    navigate("/admin/new");
  };

  const handleSave = () => {
    refetch();
    navigate("/admin");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleCancel = () => {
    navigate("/admin");
  };

  const handleDelete = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-linear-to-br from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-linear-to-tl from-chart-2/5 via-transparent to-transparent rounded-full blur-3xl" />
        {/* Diagonal lines pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              currentColor 0,
              currentColor 1px,
              transparent 1px,
              transparent 60px
            )`,
          }}
        />
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
              <span className="text-sm font-medium">View Blog</span>
            </Link>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1.5 font-mono text-xs">
                <Shield className="size-3" />
                Admin
              </Badge>
              {user && (
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {user.name || user.email}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Sign Out</span>
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

      {/* Main Content */}
      <main className="relative py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            {editingPostId !== null ? (
              <Editor
                postId={editingPostId === "new" ? null : editingPostId}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <PostList
                posts={posts}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onNew={handleNew}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/50 py-8 mt-auto">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              Admin Dashboard · © {new Date().getFullYear()} Eugene Kipchirchir
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link
                to="/blog"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                View Blog
              </Link>
              <Link
                to="/"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Portfolio
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdminPage;
