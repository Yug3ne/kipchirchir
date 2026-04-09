import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Home,
  User,
  Briefcase,
  FolderOpen,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  MapPin,
  Phone,
  ChevronDown,
  Code2,
  Database,
  Smartphone,
  Globe,
  Menu,
  X,
  BookOpen,
  Layers,
  Terminal,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Theme } from "@/hooks/use-theme";
import { useTheme } from "@/hooks/use-theme";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Navigation items
const navItems = [
  { id: "home", label: "HOME", icon: Home },
  { id: "about", label: "ABOUT", icon: User },
  { id: "experience", label: "WORK", icon: Briefcase },
  { id: "projects", label: "PROJECTS", icon: FolderOpen },
  { id: "blog", label: "BLOG", icon: BookOpen, isLink: true, href: "/blog" },
  { id: "contact", label: "CONTACT", icon: Mail },
];

// Skills data (aligned with resume + day-to-day stack)
const skills = {
  languages: [
    "TypeScript",
    "JavaScript",
    "Python",
    "PHP",
    "SQL",
    "HTML5",
    "CSS3",
  ],
  frameworks: [
    "Vue 3",
    "React",
    "React Native",
    "Next.js",
    "Expo",
    "Django",
    "Laravel",
    "Tailwind CSS",
    "shadcn/ui",
  ],
  stateAndData: [
    "Pinia",
    "TanStack Query",
    "Zustand",
    "Redux",
    "Context API",
    "GraphQL (Lighthouse)",
  ],
  databases: ["PostgreSQL", "Convex", "Supabase", "Neon"],
  tools: [
    "Git",
    "Vite",
    "Vitest",
    "GitHub Actions",
    "Postman",
    "PostHog",
    "VS Code",
    "Cursor",
  ],
};

// Experience data (reverse chronological)
const experiences = [
  {
    company: "Payd",
    role: "Frontend Developer",
    location: "Nairobi, Kenya",
    period: "Jan 2026 – Present",
    highlights: [
      "Collaborate with the frontend team on a Vue 3 fintech PWA serving wallets and payments across 20+ African countries with multi-currency support",
      "Contributed 30+ composables (exchange rates, amount input) to the shared codebase, powering real-time conversion and settlement logic",
      "Helped integrate TanStack Query across 10+ data domains with cache invalidation and throttled refresh for API performance",
      "Worked on JWT auth with refresh queuing and route guards alongside other engineers hardening the service layer",
      "Contributed to a 300KB+ bundle reduction through dynamic imports, dependency cleanup, and replacing moment.js with date-fns",
      "Implemented PostHog analytics with PII masking; wrote Vitest coverage for encryption and transaction utilities",
    ],
  },
  {
    company: "Virgil Africa",
    role: "Full-Stack Developer",
    location: "Nairobi, Kenya",
    period: "Feb 2025 – May 2025",
    highlights: [
      "Spearheaded frontend for a new client-facing product: UI prototyping, component architecture, Zustand, and REST integration",
      "Improved an eCommerce checkout flow with responsive React UI to reduce abandonment",
      "Maintained React + Django client apps: paid down tech debt and shipped scalable UI upgrades",
      "Configured GitHub Actions CI/CD for automated builds and deploys to a VPS",
    ],
  },
  {
    company: "Cybasoft",
    role: "Full-Stack Developer",
    location: "Elkridge, MD (Remote)",
    period: "Oct 2024 – Oct 2025",
    highlights: [
      "Contributed to Planrr — Expo (React Native) and Laravel — for personal contributions and shared expenses",
      "Built and maintained GraphQL APIs with Laravel Lighthouse for efficient reads/writes across money-movement flows",
      "Delivered Laravel features (deadline tracking, status filters) and maintained legacy Django REST APIs",
      "Collaborated on React Native integration to keep mobile state in sync with backend data",
    ],
  },
];

// Projects data (featured work + open source; GitHub: github.com/Yug3ne)
const projects = [
  {
    title: "Payd Node SDK",
    description:
      "Open-source TypeScript SDK for the Payd payments API — collections (including M-Pesa STK Push) and payouts across 20+ African countries.",
    tech: ["TypeScript", "Node.js", "Express"],
    highlights: [
      "Interactive test dashboard with live webhook monitoring",
      "101-test automated regression suite for API behavior",
    ],
    github: "https://github.com/Yug3ne/payd-sdks",
    live: "https://payd-sdks.vercel.app",
    image: "/placeholder-payd-sdks.png",
  },
  {
    title: "Sauti Link",
    description:
      "Civic governance platform connecting citizens and officials — bilingual bill context and a real-time Convex backend for trustworthy voting flows.",
    tech: ["React 19", "Convex", "TypeScript", "shadcn/ui"],
    highlights: [
      "USSD simulator path for feature-phone access",
      "Engagement analytics dashboards for organizers",
    ],
    github: "https://github.com/Yug3ne/sautilink",
    live: "https://sautilink.vercel.app",
    image: "/placeholder-sautilink.png",
  },
  {
    title: "ScanTiko",
    description:
      "Event ticket scanner — custom camera overlay and instant API checks — deployed live for high-traffic tournaments.",
    tech: ["React Native", "Expo"],
    highlights: [
      "2,000+ tickets validated at Kabeberi 7s with resilient offline behavior",
      "Real-time verification and operator-friendly scanning UX",
    ],
    github: "https://github.com/Yug3ne/ScanTiko",
    live: null,
    image: "/placeholder-scantiko.png",
  },
  {
    title: "Planrr",
    description:
      "Mobile-first app for group contributions, savings, shared expenses, and household money workflows — production app on major stores.",
    tech: ["React Native", "Expo", "Laravel", "GraphQL", "PostgreSQL"],
    highlights: [
      "Shipped on iOS and Android with multi-currency and reporting",
      "GraphQL + Laravel backend powering Planrr’s collaborative money features",
    ],
    github: null,
    live: "https://planrr.io",
    image: "/placeholder-planrr.png",
  },
  {
    title: "Green Ledger",
    description:
      "AI-assisted investment flow matching energy innovators with investors — structured submissions and scored evaluations.",
    tech: [
      "Next.js",
      "TypeScript",
      "Prisma ORM",
      "Google Gemini AI",
      "PostgreSQL",
    ],
    highlights: [
      "Deep multi-step forms tuned to energy vertical data",
      "Role-based access with Better Auth",
    ],
    github: "https://github.com/Yug3ne/green-ledger",
    live: null,
    image: "/placeholder-greenledger.png",
  },
  {
    title: "Portfolio & Blog",
    description:
      "This site — React, Vite, Tailwind v4, Convex, and Better Auth for a fast portfolio with a live admin-backed blog.",
    tech: ["React", "TypeScript", "Vite", "Convex", "Tailwind CSS"],
    highlights: [
      "Reactive Convex data for published posts",
      "Production deploy with polished marketing sections",
    ],
    github: "https://github.com/Yug3ne/kipchirchir",
    live: "https://kipchirchirkoech.co.ke",
    image: "/placeholder-portfolio.png",
  },
];

// Education data
const education = [
  {
    school: "Moringa School",
    degree: "Certificate of Software Engineering",
    location: "Nairobi, Kenya",
    period: "Dec 2023 – Aug 2024",
    detail:
      "Intensive software engineering, web development, algorithms & data structures, and agile delivery — full-stack team projects with Git, clean code, and TDD.",
  },
];

// Animated text component
function AnimatedText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block animate-fade-in"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

// Mobile Navigation
function MobileNav({
  activeSection,
  isOpen,
  setIsOpen,
  theme,
  toggleTheme,
  onLogoClick,
}: {
  activeSection: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  theme: Theme;
  toggleTheme: () => void;
  onLogoClick: () => void;
}) {
  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-b border-border z-50 flex items-center justify-between px-4 md:hidden">
        <button
          onClick={onLogoClick}
          className="size-10 rounded-xl overflow-hidden"
        >
          <img
            src="/profile.png"
            alt="EK"
            className="size-full object-cover object-top"
          />
        </button>
        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-40 pt-16 md:hidden">
          <nav className="flex flex-col items-center justify-center h-full gap-6">
            {navItems.map((item) =>
              "isLink" in item && item.isLink ? (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-xl font-medium transition-colors text-muted-foreground hover:text-foreground"
                >
                  <item.icon className="size-6" />
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 text-xl font-medium transition-colors ${
                    activeSection === item.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="size-6" />
                  {item.label}
                </a>
              ),
            )}
            <div className="flex gap-4 mt-8">
              <a
                href="https://www.linkedin.com/in/eugenekoech9/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="size-6" />
              </a>
              <a
                href="https://github.com/Yug3ne"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="size-6" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

// Sidebar Navigation (Desktop)
function Sidebar({
  activeSection,
  theme,
  toggleTheme,
  onLogoClick,
}: {
  activeSection: string;
  theme: Theme;
  toggleTheme: () => void;
  onLogoClick: () => void;
}) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-card/80 backdrop-blur-xl border-r border-border z-50 hidden md:flex flex-col items-center py-8">
      {/* Logo - Triple click for admin */}
      <div className="mb-8">
        <button
          onClick={onLogoClick}
          className="size-12 rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
          aria-label="Logo"
        >
          <img
            src="/profile.png"
            alt="EK"
            className="size-full object-cover object-top"
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-2">
        {navItems.map((item) =>
          "isLink" in item && item.isLink ? (
            <Link
              key={item.id}
              to={item.href}
              className="group relative flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <item.icon className="size-5" />
              <span className="text-[10px] font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                {item.label}
              </span>
            </Link>
          ) : (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`group relative flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 ${
                activeSection === item.id
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <item.icon className="size-5" />
              <span className="text-[10px] font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                {item.label}
              </span>
              {activeSection === item.id && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
            </a>
          ),
        )}
      </nav>

      {/* Theme Toggle */}
      <div className="mb-4">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      {/* Social Links */}
      <div className="flex flex-col gap-3">
        <a
          href="https://www.linkedin.com/in/eugenekoech9/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Linkedin className="size-5" />
        </a>
        <a
          href="https://github.com/Yug3ne"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Github className="size-5" />
        </a>
      </div>
    </aside>
  );
}

// Mini IDE-style preview (static snippet — not a live sandbox)
function HeroCodePreview() {
  return (
    <div
      className="w-full rounded-xl border border-border bg-card shadow-lg shadow-black/5 dark:shadow-black/20 ring-1 ring-border/60 overflow-hidden"
      role="region"
      aria-label="Example code from this portfolio’s stack"
    >
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-muted/70">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2 rounded-full bg-[#ff5f56]" />
          <span className="size-2 rounded-full bg-[#febc2e]" />
          <span className="size-2 rounded-full bg-[#28c840]" />
        </div>
        <Terminal className="size-3.5 text-muted-foreground shrink-0 ml-0.5" />
        <span className="ml-auto font-mono text-[10px] text-muted-foreground truncate">
          use-blog.ts
        </span>
      </div>
      <pre className="p-3.5 sm:p-4 lg:p-4 text-[10px] sm:text-[11px] lg:text-xs leading-relaxed font-mono text-left overflow-x-auto">
        <code>
          <span className="text-violet-600 dark:text-violet-400">import</span>
          <span className="text-muted-foreground"> {"{"} </span>
          <span className="text-sky-700 dark:text-sky-300"> useQuery </span>
          <span className="text-muted-foreground">{"}"} </span>
          <span className="text-violet-600 dark:text-violet-400"> from</span>
          <span className="text-emerald-700 dark:text-emerald-400">
            {" "}
            &quot;convex/react&quot;
          </span>
          <span className="text-muted-foreground">;</span>
          {"\n"}
          <span className="text-violet-600 dark:text-violet-400">import</span>
          <span className="text-muted-foreground"> {"{"} </span>
          <span className="text-sky-700 dark:text-sky-300"> api </span>
          <span className="text-muted-foreground">{"}"} </span>
          <span className="text-violet-600 dark:text-violet-400"> from</span>
          <span className="text-emerald-700 dark:text-emerald-400">
            {" "}
            &quot;../../convex/_generated/api&quot;
          </span>
          <span className="text-muted-foreground">;</span>
          {"\n\n"}
          <span className="text-violet-600 dark:text-violet-400">
            export function
          </span>
          <span className="text-sky-700 dark:text-sky-300"> useBlogPosts</span>
          <span className="text-muted-foreground">() {"{"}</span>
          {"\n  "}
          <span className="text-violet-600 dark:text-violet-400">const</span>
          <span className="text-muted-foreground"> posts </span>
          <span className="text-violet-600 dark:text-violet-400">=</span>
          <span className="text-muted-foreground"> </span>
          <span className="text-sky-700 dark:text-sky-300">useQuery</span>
          <span className="text-muted-foreground">(api.blogs.listPublished);</span>
          {"\n  "}
          <span className="text-violet-600 dark:text-violet-400">return</span>
          <span className="text-muted-foreground"> {"{"}</span>
          {"\n    "}
          <span className="text-muted-foreground">posts,</span>
          {"\n    "}
          <span className="text-muted-foreground">
            isLoading: posts{" "}
          </span>
          <span className="text-violet-600 dark:text-violet-400">===</span>
          <span className="text-muted-foreground"> undefined,</span>
          {"\n  "}
          <span className="text-muted-foreground">{"};"}</span>
          {"\n"}
          <span className="text-muted-foreground">{"}"}</span>
        </code>
      </pre>
      <p className="px-3 py-2 text-[10px] text-muted-foreground border-t border-border bg-muted/30 font-mono">
        Excerpt from this repo — Convex keeps the blog list live; mapping
        omitted for space.
      </p>
    </div>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section
      id="home"
      aria-label="Introduction"
      itemScope
      itemType="https://schema.org/Person"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-16 md:pt-0 md:pb-0"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <header className="space-y-3">
              <p className="text-muted-foreground text-sm md:text-base tracking-widest uppercase font-medium">
                Hello, I'm
              </p>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight"
                itemProp="name"
              >
                <AnimatedText text="Eugene" className="text-foreground" />
                <br />
                <AnimatedText text="Kipchirchir" className="text-primary" />
              </h1>
            </header>

            <p
              className="text-lg md:text-xl text-muted-foreground font-light"
              itemProp="jobTitle"
            >
              Frontend &amp; Full-Stack Developer
            </p>

            <p
              className="text-muted-foreground max-w-lg mx-auto lg:mx-0 text-sm md:text-base leading-relaxed"
              itemProp="description"
            >
              I build web and mobile software with Vue, React, and full-stack
              tools. I work well in teams, enjoy learning from others, and care
              about maintainable code and a clear user experience.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <ButtonLink size="lg" className="gap-2" href="#contact">
                <Mail className="size-4" />
                Get in Touch
              </ButtonLink>
              <ButtonLink
                size="lg"
                variant="outline"
                className="gap-2"
                href="#projects"
              >
                <FolderOpen className="size-4" />
                View Projects
              </ButtonLink>
            </div>

            <div className="flex gap-8 pt-6 justify-center lg:justify-start">
              {[
                { value: "2+", label: "Years" },
                { value: "60+", label: "Repos" },
                { value: "3", label: "Companies" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-2xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-lg mx-auto lg:max-w-none">
            <HeroCodePreview />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <ChevronDown className="size-8 text-muted-foreground/40" />
        </div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  const skillCategories = [
    { title: "Languages", icon: Code2, items: skills.languages },
    { title: "Frameworks", icon: Globe, items: skills.frameworks },
    { title: "State & Data", icon: Layers, items: skills.stateAndData },
    { title: "Databases", icon: Database, items: skills.databases },
    { title: "Tools", icon: Smartphone, items: skills.tools },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-16 md:py-24 relative"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-12 md:mb-16">
            <h2
              id="about-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            >
              About <span className="text-primary">Me</span>
            </h2>
          </header>

          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Bio — wider column */}
            <div className="lg:col-span-3 space-y-5">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                I&apos;m based in Nairobi and work on the frontend team at Payd,
                where we build a Vue 3 fintech app for wallets and payments.
                It&apos;s a collaborative environment — I pair with designers,
                product, and backend engineers day to day.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Earlier I worked full-stack at Virgil Africa (React, Django,
                CI/CD) and Cybasoft on Planrr (Expo, Laravel, GraphQL).
                I&apos;m glad to help wherever a feature needs it — UI, APIs,
                or performance — as part of a wider team.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Moringa School is where I picked up solid habits — agile
                delivery, testing, and everyday collaboration in Git — that
                still guide how I approach my work.
              </p>

              {/* Education */}
              <div className="pt-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-3">
                  Education
                </h3>
                {education.map((edu, i) => (
                  <div key={i} className="border-l-2 border-primary/30 pl-4">
                    <p className="font-medium text-sm">{edu.school}</p>
                    <p className="text-muted-foreground text-xs">
                      {edu.degree} · {edu.period}
                    </p>
                    {"detail" in edu && edu.detail ? (
                      <p className="text-muted-foreground text-xs mt-1.5 leading-relaxed">
                        {edu.detail}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Contact details */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  Nairobi, Kenya
                </span>
                <span className="flex items-center gap-2">
                  <Mail className="size-4 text-primary" />
                  eugenekoech9@gmail.com
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="size-4 text-primary" />
                  (+254) 708676540
                </span>
              </div>
            </div>

            {/* Skills — narrower column */}
            <div className="lg:col-span-2 space-y-3">
              {skillCategories.map((category) => (
                <div key={category.title}>
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                    <category.icon className="size-3.5 text-primary" />
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {category.items.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Experience Section
function ExperienceSection() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="py-16 md:py-24 bg-muted/30"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-12 md:mb-16">
            <h2
              id="experience-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            >
              Work <span className="text-primary">Experience</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Places I've contributed and what I worked on
            </p>
          </header>

          <div className="relative pl-6 md:pl-8">
            <div
              className="absolute left-0 top-2 bottom-2 w-px bg-border"
              aria-hidden
            />

            <div className="space-y-8 md:space-y-10">
              {experiences.map((exp, i) => (
                <div key={i} className="relative">
                  <div
                    className="absolute -left-6 md:-left-8 top-1.5 size-3 rounded-full bg-primary ring-4 ring-background"
                    aria-hidden
                  />
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {exp.role}
                        </h3>
                        <p className="text-sm text-primary font-medium">
                          {exp.company}
                          <span className="text-muted-foreground font-normal">
                            {" · "}
                            {exp.location}
                          </span>
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="shrink-0 w-fit text-xs mt-1 sm:mt-0"
                      >
                        {exp.period}
                      </Badge>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {exp.highlights.map((highlight, j) => (
                        <li key={j} className="flex gap-2.5">
                          <span className="text-primary mt-1.5 shrink-0">
                            <span className="block size-1.5 rounded-full bg-primary/60" />
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Projects Section
function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-16 md:py-24"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-12 md:mb-16">
            <h2
              id="projects-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            >
              Featured <span className="text-primary">Projects</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              Open source work and side projects I've built or contributed to
            </p>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, i) => (
              <Card
                key={i}
                className="group flex flex-col bg-card hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors leading-snug">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors p-1"
                          aria-label={`${project.title} source code`}
                        >
                          <Github className="size-4" />
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors p-1"
                          aria-label={`${project.title} live demo`}
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-xs leading-relaxed line-clamp-3">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-auto space-y-3 pt-0">
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {project.highlights.map((highlight, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="text-primary shrink-0 mt-0.5">→</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tech.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="text-[10px]"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  const links = [
    {
      icon: Mail,
      label: "Email",
      value: "eugenekoech9@gmail.com",
      href: "mailto:eugenekoech9@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "(+254) 708676540",
      href: "tel:+254708676540",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "eugenekoech9",
      href: "https://www.linkedin.com/in/eugenekoech9/",
      external: true,
    },
    {
      icon: Github,
      label: "GitHub",
      value: "Yug3ne",
      href: "https://github.com/Yug3ne",
      external: true,
    },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-16 md:py-24 bg-muted/30"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <header className="mb-10">
            <h2
              id="contact-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            >
              Get In <span className="text-primary">Touch</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Open to opportunities and collaborations — feel free to reach out
              through any channel.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 gap-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={"external" in link ? "_blank" : undefined}
                rel={"external" in link ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all group text-left"
              >
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors shrink-0">
                  <link.icon className="size-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{link.label}</p>
                  <p className="text-sm font-medium truncate">{link.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-6 md:py-8 border-t border-border" role="contentinfo">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs md:text-sm text-center md:text-left">
            © {new Date().getFullYear()} Eugene Kipchirchir Koech. All rights
            reserved.
          </p>
          <nav
            aria-label="Social media links"
            className="flex items-center gap-4"
          >
            <a
              href="https://www.linkedin.com/in/eugenekoech9/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="size-5" />
            </a>
            <a
              href="https://github.com/Yug3ne"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="size-5" />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

// Main App
export function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Triple click detection for admin access
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    clickCount.current += 1;

    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }

    if (clickCount.current >= 3) {
      // Triple click detected - go to login (which will redirect to admin if authenticated)
      clickCount.current = 0;
      navigate("/login");
    } else {
      // Reset after 500ms if not triple-clicked
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 500);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 },
    );

    navItems.forEach((item) => {
      if (!("isLink" in item)) {
        const element = document.getElementById(item.id);
        if (element) observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Close mobile menu when clicking a link
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        activeSection={activeSection}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogoClick={handleLogoClick}
      />
      <MobileNav
        activeSection={activeSection}
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogoClick={handleLogoClick}
      />

      <main className="md:ml-20">
        <HeroSection />
        <Separator />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}

export default App;
