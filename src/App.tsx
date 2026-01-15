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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

// Skills data
const skills = {
  languages: [
    "Python",
    "SQL",
    "HTML5",
    "CSS3",
    "JavaScript",
    "TypeScript",
    "PHP",
    "Go (Learning)",
  ],
  frameworks: [
    "Django",
    "Laravel",
    "ReactJS",
    "React Native",
    "Next.js",
    "Expo",
    "Tailwind CSS",
    "Shadcn-UI",
  ],
  tools: ["Git", "GitHub", "Postman", "VS Code", "Cursor", "Slack", "Webstorm"],
  databases: ["PostgreSQL", "Neon", "Supabase"],
  stateManagement: ["Zustand", "Context API", "Redux"],
};

// Experience data
const experiences = [
  {
    company: "Cybasoft",
    role: "Full-Stack Developer",
    location: "Elkridge, MD - Remote",
    period: "Jan 2025 - Sept 2025",
    highlights: [
      "Contributed to Planrr, a mobile-first productivity platform built with Expo (React Native) and Laravel for managing group contributions, savings goals, tasks, and expenses",
      "Built and maintained GraphQL APIs using Laravel Lighthouse for efficient data fetching and mutations",
      "Developed core backend features including deadline tracking, status filtering, and multi-currency support",
      "Collaborated with frontend developers to integrate backend logic into React Native mobile app, ensuring smooth UI/backend synchronization",
    ],
  },
  {
    company: "Virgil Africa",
    role: "Full-Stack Developer",
    location: "Nairobi, Kenya - Hybrid",
    period: "Feb 2025 - May 2025",
    highlights: [
      "Optimized checkout process for eCommerce application, improving UX and reducing cart abandonment",
      "Spearheaded frontend development of new client-facing application with end-to-end ownership",
      "Implemented state management using Zustand for clean, lightweight global state handling",
      "Assisted in configuring GitHub Actions for CI/CD deployment workflows",
    ],
  },
];

// Projects data
const projects = [
  {
    title: "Planrr",
    description:
      "An all-in-one productivity mobile app for managing group contributions, savings goals, tasks, expenses, and event planning with real-time tracking and multi-currency support.",
    tech: ["React Native", "Expo", "Laravel", "GraphQL", "PostgreSQL"],
    highlights: [
      "Available on iOS App Store and Google Play Store",
      "Features group contributions, savings goals, expense tracking, and task management",
      "Multi-currency support and PDF reporting capabilities",
    ],
    github: null,
    live: "https://planrr.io",
    image: "/placeholder-planrr.png",
  },
  {
    title: "Green Ledger",
    description:
      "AI-powered investment platform connecting energy innovators with investors through intelligent project assessment and matching.",
    tech: [
      "Next.js",
      "TypeScript",
      "Prisma ORM",
      "Google Gemini AI",
      "PostgreSQL",
    ],
    highlights: [
      "Multi-step submission forms with 25+ energy-specific parameters",
      "AI-powered evaluation system with quantitative scores",
      "Role-based access control with Better Auth",
    ],
    github: "https://github.com/Yug3ne/green-ledger",
    live: null,
    image: "/placeholder-greenledger.png",
  },
  {
    title: "ScanTiko",
    description:
      "Mobile application for real-time event ticket validation and attendee management deployed at Kabeberi 7s rugby tournament.",
    tech: ["React Native", "Expo", "NativeWind"],
    highlights: [
      "Processed over 2,000 tickets with real-time API integration",
      "Custom scanning overlay with automatic ticket ID extraction",
      "Offline resilience with dark theme optimization",
    ],
    github: "https://github.com/Yug3ne/ScanTiko",
    live: null,
    image: "/placeholder-scantiko.png",
  },
  {
    title: "InkSpire",
    description:
      "A book review application that enables users to get recommendations based on community reviews and create genre-based reading communities.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    highlights: [
      "Community-driven book recommendations and reviews",
      "Genre-based community building features",
      "Modern responsive design with Next.js",
    ],
    github: "https://github.com/Yug3ne/InkSpire",
    live: null,
    image: "/placeholder-inkspire.png",
  },
  {
    title: "KeepTime",
    description:
      "A progressive web app (PWA) offline time tracker built with Vue.js and Dexie for local-first data persistence.",
    tech: ["Vue.js", "Dexie", "PWA", "IndexedDB"],
    highlights: [
      "Offline-first architecture with IndexedDB",
      "Progressive Web App capabilities",
      "Local data persistence with Dexie",
    ],
    github: "https://github.com/Yug3ne/KeepTime",
    live: null,
    image: "/placeholder-keeptime.png",
  },
  {
    title: "EcoRide",
    description:
      "A ride-sharing or transportation application built with TypeScript for sustainable urban mobility solutions.",
    tech: ["TypeScript", "React", "Node.js"],
    highlights: [
      "Sustainable transportation platform",
      "Full-stack TypeScript implementation",
      "Modern user interface design",
    ],
    github: "https://github.com/Yug3ne/ecoride",
    live: null,
    image: "/placeholder-ecoride.png",
  },
];

// Education data
const education = [
  {
    school: "African Leadership University",
    degree: "BSc (Hons) Software Engineering",
    location: "Rwanda",
    period: "Sept 2024 - Dec 2027",
  },
  {
    school: "Moringa School",
    degree: "Certificate of Software Engineering",
    location: "Nairobi",
    period: "Dec 2023 - Aug 2024",
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
          className="size-10 rounded-xl bg-linear-to-br from-primary to-chart-3 flex items-center justify-center text-primary-foreground font-bold text-lg"
        >
          EK
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
              )
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
          className="size-12 rounded-xl bg-linear-to-br from-primary to-chart-3 flex items-center justify-center text-primary-foreground font-bold text-xl hover:scale-105 transition-transform cursor-pointer"
          aria-label="Logo"
        >
          EK
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
          )
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

// Hero Section
function HeroSection() {
  return (
    <section
      id="home"
      aria-label="Introduction"
      itemScope
      itemType="https://schema.org/Person"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 md:pt-0"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-primary/5" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 size-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 left-1/3 size-64 bg-chart-2/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-4 md:space-y-6 text-center lg:text-left">
            <header className="space-y-2">
              <p className="text-muted-foreground text-base md:text-lg tracking-wide">
                Hello, I'm
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight"
                itemProp="name"
              >
                <AnimatedText text="Eugene" className="text-foreground" />
                <br />
                <AnimatedText text="Kipchirchir" className="text-primary" />
              </h1>
            </header>

            <p
              className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light"
              itemProp="jobTitle"
            >
              Full-Stack Developer
            </p>

            <p
              className="text-muted-foreground max-w-lg mx-auto lg:mx-0 text-base md:text-lg leading-relaxed"
              itemProp="description"
            >
              Building scalable applications with React, Django, Laravel, and
              Next.js. A collaborative team player and leader, passionate about
              continuous learning and creating seamless user experiences.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <ButtonLink size="lg" className="gap-2" href="#contact">
                <Mail className="size-4" />
                Contact Me
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

            {/* Quick Stats */}
            <div className="flex gap-6 md:gap-8 pt-6 md:pt-8 justify-center lg:justify-start">
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  2+
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Years Experience
                </p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  5+
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Projects Completed
                </p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  3+
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Companies Worked
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -inset-4 bg-linear-to-br from-primary/20 to-chart-2/20 rounded-3xl blur-2xl" />
              <div className="absolute -top-8 -right-8 size-32 border-2 border-primary/30 rounded-2xl rotate-12" />
              <div className="absolute -bottom-8 -left-8 size-24 border-2 border-chart-2/30 rounded-xl -rotate-12" />

              {/* Profile Image */}
              <figure className="relative aspect-3/4 rounded-3xl bg-linear-to-br from-muted to-muted/50 border border-border overflow-hidden">
                <img
                  src="/profile.png"
                  alt="Eugene Kipchirchir Koech - Full-Stack Developer specializing in React, Django, and Laravel"
                  itemProp="image"
                  loading="eager"
                  className="w-full h-[115%] object-cover object-top"
                />
              </figure>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <ChevronDown className="size-8 text-muted-foreground" />
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
        <article className="max-w-6xl mx-auto">
          {/* Section Header */}
          <header className="text-center mb-12 md:mb-16">
            <h2
              id="about-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            >
              About <span className="text-primary">Me</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              A passionate full-stack developer with expertise in building
              modern web and mobile applications
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Bio */}
            <div className="space-y-4 md:space-y-6">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                I'm a Full-Stack Developer currently pursuing my BSc in Software
                Engineering at African Leadership University. With a strong
                foundation in frontend development and hands-on experience at
                companies like Cybasoft and Virgil Africa, I specialize in
                building scalable applications using modern technologies.
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                I thrive in collaborative environments and enjoy both
                contributing as a team player and stepping up to lead when
                needed. I'm always eager to learn new technologies — currently
                expanding into backend development with{" "}
                <span className="text-primary font-medium">Golang</span> to
                strengthen my full-stack capabilities.
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                My journey began at Moringa School where I gained a solid
                foundation in software engineering practices. Since then, I've
                worked on diverse projects ranging from eCommerce platforms to
                productivity apps like Planrr.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="size-5 text-primary shrink-0" />
                  <span>Rwanda / Kenya</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="size-5 text-primary shrink-0" />
                  <span>(+254) 708676540</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="size-5 text-primary shrink-0" />
                  <span className="break-all">eugenekoech9@gmail.com</span>
                </div>
              </div>

              {/* Education */}
              <div className="pt-6">
                <h3 className="text-lg md:text-xl font-semibold mb-4">
                  Education
                </h3>
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <div key={i} className="border-l-2 border-primary/30 pl-4">
                      <h4 className="font-medium text-sm md:text-base">
                        {edu.school}
                      </h4>
                      <p className="text-muted-foreground text-xs md:text-sm">
                        {edu.degree}
                      </p>
                      <p className="text-muted-foreground/60 text-xs">
                        {edu.period} • {edu.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid gap-4">
              {skillCategories.map((category) => (
                <Card
                  key={category.title}
                  className="bg-card/50 backdrop-blur-sm"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                      <category.icon className="size-4 md:size-5 text-primary" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </article>
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
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <header className="text-center mb-12 md:mb-16">
            <h2
              id="experience-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            >
              Work <span className="text-primary">Experience</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              My professional journey and contributions to various organizations
            </p>
          </header>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

            {experiences.map((exp, i) => (
              <div
                key={i}
                className={`relative flex flex-col md:flex-row gap-4 md:gap-8 mb-8 md:mb-12 ${
                  i % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 top-0 size-4 rounded-full bg-primary md:-translate-x-1/2 z-10" />

                {/* Content */}
                <div
                  className={`ml-10 md:ml-0 md:w-1/2 ${
                    i % 2 === 0 ? "md:pl-12" : "md:pr-12 md:text-right"
                  }`}
                >
                  <Card className="bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div
                        className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 ${
                          i % 2 === 0 ? "" : "md:flex-row-reverse"
                        }`}
                      >
                        <div className={i % 2 === 0 ? "" : "md:text-right"}>
                          <CardTitle className="text-lg md:text-xl">
                            {exp.company}
                          </CardTitle>
                          <CardDescription>{exp.role}</CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className="shrink-0 w-fit text-xs"
                        >
                          {exp.period}
                        </Badge>
                      </div>
                      <p
                        className={`text-xs md:text-sm text-muted-foreground flex items-center gap-1 mt-2 ${
                          i % 2 === 0 ? "" : "md:justify-end"
                        }`}
                      >
                        <MapPin className="size-3" />
                        {exp.location}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ul
                        className={`space-y-2 text-xs md:text-sm text-muted-foreground ${
                          i % 2 === 0 ? "" : "md:text-right"
                        }`}
                      >
                        {exp.highlights.map((highlight, j) => (
                          <li
                            key={j}
                            className={`flex gap-2 ${
                              i % 2 === 0 ? "" : "md:flex-row-reverse"
                            }`}
                          >
                            <span className="text-primary shrink-0">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
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
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <header className="text-center mb-12 md:mb-16">
            <h2
              id="projects-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            >
              Featured <span className="text-primary">Projects</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              A selection of projects I've worked on, showcasing my skills in
              full-stack development
            </p>
          </header>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project, i) => (
              <Card
                key={i}
                className="group overflow-hidden bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Project Image */}
                <div className="aspect-video bg-linear-to-br from-muted to-muted/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-chart-2/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FolderOpen className="size-12 md:size-16 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-muted-foreground/50 text-xs md:text-sm">
                        Project Image
                      </p>
                    </div>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    {project.github && (
                      <ButtonLink
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="size-4" />
                        Code
                      </ButtonLink>
                    )}
                    {project.live && (
                      <ButtonLink
                        size="sm"
                        className="gap-2"
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="size-4" />
                        Live
                      </ButtonLink>
                    )}
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-base md:text-xl group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 md:space-y-4">
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {project.tech.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="text-[10px] md:text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-1 text-xs md:text-sm text-muted-foreground">
                    {project.highlights.slice(0, 2).map((highlight, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="text-primary">→</span>
                        <span className="line-clamp-1">{highlight}</span>
                      </li>
                    ))}
                  </ul>
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
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-16 md:py-24 bg-muted/30"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <header className="text-center mb-12 md:mb-16">
            <h2
              id="contact-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            >
              Get In <span className="text-primary">Touch</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              I'm always open to new opportunities and collaborations. Feel free
              to reach out!
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Info */}
            <div className="space-y-6 md:space-y-8">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold mb-4">
                  Let's talk
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Whether you have a project in mind, want to discuss potential
                  opportunities, or just want to connect — I'd love to hear from
                  you.
                </p>
              </div>

              <div className="space-y-3 md:space-y-4">
                <a
                  href="mailto:eugenekoech9@gmail.com"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-card/50 hover:bg-card transition-colors group"
                >
                  <div className="size-10 md:size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                    <Mail className="size-4 md:size-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Email
                    </p>
                    <p className="font-medium text-sm md:text-base truncate">
                      eugenekoech9@gmail.com
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+254708676540"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-card/50 hover:bg-card transition-colors group"
                >
                  <div className="size-10 md:size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                    <Phone className="size-4 md:size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Phone
                    </p>
                    <p className="font-medium text-sm md:text-base">
                      (+254) 708676540
                    </p>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/eugenekoech9/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-card/50 hover:bg-card transition-colors group"
                >
                  <div className="size-10 md:size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                    <Linkedin className="size-4 md:size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      LinkedIn
                    </p>
                    <p className="font-medium text-sm md:text-base">
                      eugenekoech9
                    </p>
                  </div>
                </a>

                <a
                  href="https://github.com/Yug3ne"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-card/50 hover:bg-card transition-colors group"
                >
                  <div className="size-10 md:size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                    <Github className="size-4 md:size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      GitHub
                    </p>
                    <p className="font-medium text-sm md:text-base">Yug3ne</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-base md:text-lg">
                  Send a message
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Fill out the form below and I'll get back to you soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs md:text-sm">
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs md:text-sm">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-xs md:text-sm">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      placeholder="What's this about?"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs md:text-sm">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Your message..."
                      className="min-h-24 md:min-h-32 text-sm"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
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
      { threshold: 0.3 }
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
