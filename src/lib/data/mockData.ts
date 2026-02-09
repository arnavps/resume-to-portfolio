export const portfolioData = {
    name: "Alex Dev",
    title: "Senior Full Stack Developer",
    bio: "Passionate about building scalable web applications and intuitive user experiences. Specialized in React, Node.js, and cloud architecture.",
    location: "San Francisco, CA",
    socials: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "mailto:alex@example.com"
    },
    skills: {
        frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        backend: ["Node.js", "PostgreSQL", "GraphQL", "Redis"],
        tools: ["Git", "Docker", "AWS", "Figma"]
    },
    projects: [
        {
            id: 1,
            title: "E-commerce Platform",
            description: "A full-stack e-commerce solution with Next.js and Stripe. Features include real-time inventory, secure checkout, and admin dashboard.",
            tags: ["Next.js", "TypeScript", "Stripe"],
            link: "#"
        },
        {
            id: 2,
            title: "Task Management App",
            description: "Real-time collaboration tool for remote teams. specialized for agile workflows with Kanban boards and sprint planning.",
            tags: ["React", "Firebase", "Tailwind"],
            link: "#"
        },
        {
            id: 3,
            title: "Fitness Tracker API",
            description: "RESTful API for tracking workouts and nutrition. Built with scalability in mind using microservices architecture.",
            tags: ["Node.js", "Express", "PostgreSQL"],
            link: "#"
        }
    ],
    experience: [
        {
            id: 1,
            role: "Senior Frontend Developer",
            company: "TechCorp Inc.",
            period: "2022 - Present",
            description: "Leading the frontend migration to Next.js and implementing a new design system. Improved site performance by 40%."
        },
        {
            id: 2,
            role: "Full Stack Engineer",
            company: "StartupX",
            period: "2020 - 2022",
            description: "Built scalable APIs and interactive UI for a fintech product. Mentored junior developers and established code quality standards."
        }
    ]
};

export type PortfolioData = typeof portfolioData;
