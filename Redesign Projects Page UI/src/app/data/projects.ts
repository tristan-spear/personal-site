import exampleImage from 'figma:asset/657a11d858a9fbc0b44450701595bd9ffa5a5394.png';

export interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export const webProjects: Project[] = [
  {
    title: "QR Code Generator with Link Shortening",
    description: "Generates permanent QR codes for free, with optional link shortening to keep codes scannable even for long URLs.",
    image: exampleImage,
    technologies: ["JavaScript", "Node.js", "Express", "EJS", "Bootstrap", "Axios"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example"
  },
  {
    title: "MIT OpenCourseWare Site",
    description: "A blog-style site that helps students quickly browse and access MIT OpenCourseWare content across STEM subjects.",
    image: exampleImage,
    technologies: ["JavaScript", "Node.js", "Express", "EJS", "Bootstrap", "jQuery", "Nodemailer"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example"
  },
  {
    title: "Portfolio Website",
    description: "A modern, responsive portfolio showcasing projects and technical skills with a clean, minimal design.",
    image: exampleImage,
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example"
  },
  {
    title: "Task Management App",
    description: "Full-stack task management application with real-time updates and collaborative features.",
    image: exampleImage,
    technologies: ["React", "Node.js", "MongoDB", "Socket.io", "Express"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example"
  }
];

export const embeddedProjects: Project[] = [
  {
    title: "IoT Weather Station",
    description: "Real-time weather monitoring system with cloud data logging and mobile notifications.",
    image: exampleImage,
    technologies: ["C++", "Arduino", "ESP32", "MQTT", "Firebase"],
    githubUrl: "https://github.com/example"
  },
  {
    title: "Smart Home Controller",
    description: "Automated home control system with voice commands and mobile app integration.",
    image: exampleImage,
    technologies: ["C", "Raspberry Pi", "Python", "MQTT", "REST API"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example"
  }
];
