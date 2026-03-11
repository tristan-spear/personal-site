export function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-11 h-11 border border-white/20 rounded flex items-center justify-center text-white text-sm font-light tracking-wider">
            TS
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <a href="#" className="text-white/60 hover:text-white transition-colors text-sm tracking-wide">
            HOME
          </a>
          <a href="#" className="text-white border-b border-white transition-colors text-sm tracking-wide">
            PROJECTS
          </a>
          <a href="#" className="text-white/60 hover:text-white transition-colors text-sm tracking-wide">
            BLOG
          </a>
          <a href="#" className="text-white/60 hover:text-white transition-colors text-sm tracking-wide">
            RESUME
          </a>
          <a href="#" className="text-white/60 hover:text-white transition-colors text-sm tracking-wide">
            CONTACT
          </a>
        </div>
      </nav>
    </header>
  );
}
