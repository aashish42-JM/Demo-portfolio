import { Project, Mission, Achievement, LogbookEntry, Skill, JourneyLevel } from "@/types";
import { APP_DEFINITIONS } from "./app-definitions";

export const APP_REGISTRY = Object.values(APP_DEFINITIONS);

// ─── PERSONAL DATA ────────────────────────────────────────────────────────────
export const PERSONAL = {
  name: "Aashish Timalsina",
  title: "CSIT Student · AI Enthusiast · Full Stack Learner",
  location: "Lalitpur, Nepal",
  college: "Academia International College (TU)",
  email: "aashish.tim@gmail.com",
  phone: "9843062333",
  github: "https://github.com/aashish42-JM",
  linkedin: "https://www.linkedin.com/in/aashish-timalsina/",
  portfolio: "https://aashishtimalsina-portfolio.netlify.app",
  mission: "From a curious student to an employable professional building real-world AI solutions.",
  vision:
    "To build products that help students and solve real-world problems through AI and software.",
  bio: "A curious and ambitious BSc CSIT student from Nepal who loves building real-world AI-powered solutions. I believe in learning by doing — every project I build teaches me something new and moves me closer to my goal of becoming a professional software engineer and AI developer.",
};

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Career-Tantra",
    description: "AI Career Navigator for Nepalese students",
    long_description:
      "Career-Tantra solves a critical problem: Nepalese students don't know what skills to learn, what career path to choose, where to find internships, or how to become employable. The platform provides AI-powered career mentoring, personalized roadmaps, skills tracking, and internship recommendations.",
    tech_stack: ["HTML", "CSS", "JavaScript", "Node.js", "Express", "Groq API"],
    status: "active",
    github_url: "https://github.com/aashish42-JM/Career-Tantra",
    featured: true,
    created_at: "2024-01-01",
  },
  {
    id: "2",
    title: "Personal Portfolio",
    description: "AashishOS — An OS-themed interactive developer portfolio",
    long_description:
      "This very portfolio — built as a digital operating system experience. Visitors boot into AashishOS, open apps, explore a 3D skill galaxy, and chat with an AI version of Aashish.",
    tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "Three.js", "Framer Motion", "Groq API"],
    status: "active",
    github_url: "https://github.com/aashish42-JM/Portfolio",
    live_url: "https://aashishtimalsina-portfolio.netlify.app",
    featured: true,
    created_at: "2024-06-01",
  },
  {
    id: "3",
    title: "Genz-Innovators",
    description: "A community-driven platform for Gen Z innovators",
    long_description:
      "Genz-Innovators is a platform connecting young innovators, entrepreneurs, and creators to collaborate, share ideas, and build the future together.",
    tech_stack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    status: "active",
    github_url: "https://github.com/aashish42-JM/Genz-Innovators",
    featured: true,
    created_at: "2024-05-01",
  },
  {
    id: "4",
    title: "Attendance Management System",
    description: "C++ OOP-based attendance tracker with file handling",
    long_description:
      "A robust attendance management system built with C++ using Object-Oriented Programming concepts including inheritance, templates, and file handling. Demonstrates strong understanding of low-level programming and data persistence.",
    tech_stack: ["C++", "OOP", "File Handling", "Templates", "Inheritance"],
    status: "active",
    github_url: "https://github.com/aashish42-JM",
    featured: false,
    created_at: "2023-09-01",
  },
];

// ─── SKILLS ───────────────────────────────────────────────────────────────────
export const SKILLS: Skill[] = [
  { name: "Python", category: "Programming", level: "intermediate", color: "#4FC3F7", size: 1.4, description: "Used for scripting, automation, and AI/ML projects" },
  { name: "C++", category: "Programming", level: "intermediate", color: "#64B5F6", size: 1.3, description: "OOP, data structures, algorithms" },
  { name: "C", category: "Programming", level: "intermediate", color: "#90CAF9", size: 1.1, description: "Low-level programming fundamentals" },
  { name: "Java", category: "Programming", level: "beginner", color: "#B3E5FC", size: 1.0, description: "Basic Java programming and OOP" },
  { name: "JavaScript", category: "Web", level: "intermediate", color: "#FFD54F", size: 1.3, description: "Frontend and backend web development" },
  { name: "HTML", category: "Web", level: "intermediate", color: "#FF8A65", size: 1.1, description: "Semantic HTML structure" },
  { name: "CSS", category: "Web", level: "intermediate", color: "#CE93D8", size: 1.1, description: "Responsive styling and animations" },
  { name: "MySQL", category: "Database", level: "intermediate", color: "#A5D6A7", size: 1.2, description: "Relational database design and queries" },
  { name: "React", category: "Learning", level: "learning", color: "#4DD0E1", size: 1.2, description: "Currently learning — building components and hooks" },
  { name: "Node.js", category: "Learning", level: "learning", color: "#AED581", size: 1.2, description: "Server-side JavaScript and REST APIs" },
  { name: "Machine Learning", category: "Learning", level: "learning", color: "#FF8A80", size: 1.3, description: "Exploring ML algorithms and models" },
  { name: "Git", category: "Tools", level: "intermediate", color: "#FFAB91", size: 1.0, description: "Version control and collaboration" },
  { name: "Groq API", category: "AI", level: "intermediate", color: "#EA80FC", size: 1.1, description: "Used in Career-Tantra for AI mentor features" },
];

// ─── MISSIONS ─────────────────────────────────────────────────────────────────
export const MISSIONS: Mission[] = [
  { id: "m1", title: "Master React", description: "Build 3 React projects and understand hooks, context, and routing", status: "active", category: "Web Development", xp_reward: 500, created_at: "2024-01-01" },
  { id: "m2", title: "Build AI Products", description: "Launch 2 AI-powered products used by real users", status: "active", category: "AI", xp_reward: 1000, created_at: "2024-01-01" },
  { id: "m3", title: "Land an Internship", description: "Secure a software engineering or data science internship", status: "active", category: "Career", xp_reward: 2000, created_at: "2024-01-01" },
  { id: "m4", title: "Learn Data Science", description: "Complete a Data Science course and build a real dataset project", status: "active", category: "Data Science", xp_reward: 800, created_at: "2024-01-01" },
  { id: "m5", title: "Contribute to Open Source", description: "Make 5 meaningful pull requests to open source projects", status: "active", category: "Open Source", xp_reward: 600, created_at: "2024-01-01" },
  { id: "m6", title: "Learn C Programming", description: "Completed fundamentals of C programming", status: "completed", category: "Programming", xp_reward: 200, created_at: "2023-01-01" },
  { id: "m7", title: "Learn C++", description: "Mastered OOP, file handling, and templates in C++", status: "completed", category: "Programming", xp_reward: 300, created_at: "2023-06-01" },
  { id: "m8", title: "Build First Project", description: "Shipped Attendance Management System using C++", status: "completed", category: "Projects", xp_reward: 400, created_at: "2023-09-01" },
  { id: "m9", title: "Get GitHub Education Pack", description: "Verified student and received GitHub Education Pack", status: "completed", category: "Career", xp_reward: 150, created_at: "2023-10-01" },
  { id: "m10", title: "Build with AI APIs", description: "Integrated Groq API into Career-Tantra", status: "completed", category: "AI", xp_reward: 500, created_at: "2024-03-01" },
];

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
export const ACHIEVEMENTS: Achievement[] = [
  { id: "a1", title: "GitHub Education Pack", description: "Verified student with access to premium developer tools", icon: "🎓", unlocked_at: "2023-10-01", created_at: "2023-10-01" },
  { id: "a2", title: "First Commit", description: "Pushed first code to GitHub", icon: "🚀", unlocked_at: "2023-06-01", created_at: "2023-06-01" },
  { id: "a3", title: "AI Builder", description: "Integrated AI API into a production project", icon: "🤖", unlocked_at: "2024-03-01", created_at: "2024-03-01" },
  { id: "a4", title: "Problem Solver", description: "Built Attendance Management System using OOP", icon: "🧩", unlocked_at: "2023-09-01", created_at: "2023-09-01" },
  { id: "a5", title: "Hackathon Participant", description: "Participated in hackathons and bootcamps", icon: "⚡", unlocked_at: "2024-02-01", created_at: "2024-02-01" },
  { id: "a6", title: "Full Stack Starter", description: "Built Career-Tantra with HTML/CSS/JS + Node.js backend", icon: "🌐", unlocked_at: "2024-06-01", created_at: "2024-06-01" },
];

// ─── JOURNEY LEVELS ───────────────────────────────────────────────────────────
export const JOURNEY_LEVELS: JourneyLevel[] = [
  { level: 1, title: "The Beginning", description: "Started BSc CSIT at Academia International College. Discovered a passion for computers and coding.", date: "2022", xp: 100, unlocked: true, icon: "🎓" },
  { level: 2, title: "Code Warrior", description: "Learned C and C++ programming. Mastered OOP, data structures, file handling, and algorithms.", date: "2023", xp: 300, unlocked: true, icon: "⚔️" },
  { level: 3, title: "Builder", description: "Built real-world projects. Created the Attendance Management System and started web development with HTML/CSS/JS.", date: "2023", xp: 500, unlocked: true, icon: "🔨" },
  { level: 4, title: "AI Initiate", description: "Discovered the power of AI. Integrated Groq API into Career-Tantra. Started learning Machine Learning.", date: "2024", xp: 800, unlocked: true, icon: "🤖" },
  { level: 5, title: "Open Source", description: "Contributing to open source. Collaborating with developers worldwide. Building in public.", date: "2024-2025", xp: 1200, unlocked: false, icon: "🌍" },
  { level: 6, title: "Future: Pro Developer", description: "Software Engineer or Data Scientist. Building AI products that help students across Nepal and the world.", date: "2025+", xp: 2000, unlocked: false, icon: "🚀" },
];

// ─── LOGBOOK ENTRIES ──────────────────────────────────────────────────────────
export const LOGBOOK_ENTRIES: LogbookEntry[] = [
  {
    id: "l1",
    title: "Started learning React hooks",
    content: "Deep-dived into useState, useEffect, and useContext. Built a small todo app to practice. Key insight: state management is about keeping UI in sync with data.",
    tags: ["React", "JavaScript", "Frontend"],
    week: "Week 24, 2024",
    week_number: 24,
    created_at: "2024-06-10"
  },
  {
    id: "l2",
    title: "Explored Groq API capabilities",
    content: "Integrated Groq's llama-3-70b model into Career-Tantra. The speed is incredible — responses in under a second. Learned about system prompts and temperature tuning.",
    tags: ["AI", "Groq", "Career-Tantra"],
    week: "Week 20, 2024",
    week_number: 20,
    created_at: "2024-05-15"
  },
  {
    id: "l3",
    title: "Built REST API with Node.js + Express",
    content: "Created backend routes for Career-Tantra. Learned about middleware, route handlers, and JSON file storage. Next step: move to a real database.",
    tags: ["Node.js", "Express", "Backend"],
    week: "Week 16, 2024",
    week_number: 16,
    created_at: "2024-04-18"
  },
  {
    id: "l4",
    title: "C++ OOP Deep Dive",
    content: "Completed Attendance Management System. Used inheritance, templates, and polymorphism. File handling with fstream. OOP really clicks now — code is so much more organized.",
    tags: ["C++", "OOP", "Projects"],
    week: "Week 36, 2023",
    week_number: 36,
    created_at: "2023-09-05"
  },
];

// ─── AI SYSTEM PROMPT ─────────────────────────────────────────────────────────
export const AI_SYSTEM_PROMPT = `You are "Aashish AI", the personal AI assistant of Aashish Timalsina.
 
 Your identity:
 - You are not ChatGPT.
 - You are not a general-purpose AI assistant.
 - You are the digital representation of Aashish Timalsina and his portfolio.
 
 Your purpose is ONLY to answer questions related to:
 
 • Aashish Timalsina
 • His education
 • His skills
 • His projects
 • His achievements
 • His career goals
 • His learning journey
 • His technologies
 • His portfolio website
 • His internship experiences
 • His future plans
 • His GitHub projects
 • His technical interests
 • His certifications
 • His developer journey
 
 ━━━━━━━━━━━━━━━━━━
 KNOWN INFORMATION
 ━━━━━━━━━━━━━━━━━━
 
 Name:
 Aashish Timalsina
 
 Location:
 Lalitpur, Nepal
 
 Education:
 BSc CSIT Student
 
 University:
 Tribhuvan University
 
 College:
 Academia International College
 
 GitHub:
 https://github.com/aashish42-JM 
 
 LinkedIn:
 https://www.linkedin.com/in/aashish-timalsina/ 
 
 Projects:
 1. Career Tantra
 2. Personal Portfolio
 3. Attendance Management System
 
 Programming Skills:
 - C
 - C++
 - Python
 - Java
 
 Web Technologies:
 - HTML
 - CSS
 - JavaScript
 
 Databases:
 - MySQL
 
 Currently Learning:
 - React
 - Node.js
 - Data Science
 - Machine Learning
 - Artificial Intelligence
 
 Tools:
 - Git
 - GitHub
 - VS Code
 - ChatGPT
 - Gemini
 - Groq
 - Trae AI
 
 Goals:
 - Become a Software Engineer
 - Work with AI technologies
 - Build impactful products
 - Solve real-world problems using technology
 
 ━━━━━━━━━━━━━━━━━━
 STRICT RULES
 ━━━━━━━━━━━━━━━━━━
 
 You MUST ONLY answer questions that can be answered using the information above or information available on the portfolio website.
 
 If the information is not available in the portfolio data, respond exactly with:
 
 "I can only answer questions related to Aashish Timalsina, his skills, projects, and information available in this portfolio."
 
 You MUST refuse:
 - Mathematics questions
 - Programming questions
 - Coding requests
 - Homework help
 - General knowledge questions
 - Current affairs
 - Science questions
 - History questions
 - Entertainment questions
 - Personal advice unrelated to Aashish
 - Questions unrelated to the portfolio
 
 Examples:
 
 User:
 What is 2 + 2?
 
 Response:
 I can only answer questions related to Aashish Timalsina, his skills, projects, and information available in this portfolio.
 
 User:
 Write Python code for a linked list.
 
 Response:
 I can only answer questions related to Aashish Timalsina, his skills, projects, and information available in this portfolio.
 
 User:
 Who won the FIFA World Cup?
 
 Response:
 I can only answer questions related to Aashish Timalsina, his skills, projects, and information available in this portfolio.
 
 User:
 What projects has Aashish built?
 
 Response:
 Aashish has worked on Career Tantra, an AI career navigator for Nepalese students, an Attendance Management System built using C++ OOP concepts, and his personal portfolio website.
 
 User:
 What technologies is Aashish currently learning?
 
 Response:
 Aashish is currently learning React, Node.js, Data Science, Machine Learning, and Artificial Intelligence.
 
 ━━━━━━━━━━━━━━━━━━
 BEHAVIOR
 ━━━━━━━━━━━━━━━━━━
 
 - Be concise and professional.
 - Speak in first person as if you are Aashish's digital representative.
 - Never claim information that does not exist in the portfolio.
 - If unsure, refuse politely.
 - Never break character.
 - Never answer outside your knowledge domain.
 
 You are a portfolio assistant, not a general AI chatbot.`;
