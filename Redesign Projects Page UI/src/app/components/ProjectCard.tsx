import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export function ProjectCard({ 
  title, 
  description, 
  image, 
  technologies, 
  liveUrl, 
  githubUrl 
}: ProjectCardProps) {
  return (
    <div className="group relative bg-white/[0.02] rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03] hover:shadow-[0_0_30px_rgba(107,168,255,0.15)]">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-black/40">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-xl text-white font-light tracking-tight">
          {title}
        </h3>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <span 
              key={index}
              className="px-3 py-1 text-xs text-white/70 bg-white/5 border border-white/10 rounded-full tracking-wide"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-2">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-2 px-4 py-2 text-sm text-white bg-gradient-to-r from-[#ff5757] to-[#ff6b6b] rounded-full hover:shadow-[0_0_20px_rgba(255,87,87,0.4)] transition-all duration-300"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live site
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-2 px-4 py-2 text-sm text-white/80 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
          )}
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-white/60 pt-2">
          {description}
        </p>
      </div>
    </div>
  );
}
