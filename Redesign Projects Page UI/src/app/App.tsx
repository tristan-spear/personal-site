import { Navigation } from './components/Navigation';
import { ProjectCard } from './components/ProjectCard';
import { webProjects, embeddedProjects } from './data/projects';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section - Title & Intro */}
          <div className="max-w-3xl mx-auto mb-24">
            <div className="relative">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff5757]/10 via-[#6BA8FF]/10 to-[#ff5757]/10 rounded-3xl blur-3xl opacity-30" />
              
              {/* Content container */}
              <div className="relative bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
                <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                  Projects
                </h1>
                <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
                  Web applications and embedded systems I've built or contributed to.
                </p>
              </div>
            </div>
          </div>

          {/* Web Projects Section */}
          <section className="mb-20">
            <div className="mb-8">
              <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
                Web Projects
              </h2>
              <div className="h-px bg-gradient-to-r from-white/20 via-white/5 to-transparent mt-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {webProjects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </section>

          {/* Embedded Projects Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 font-light">
                Embedded Projects
              </h2>
              <div className="h-px bg-gradient-to-r from-white/20 via-white/5 to-transparent mt-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {embeddedProjects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}