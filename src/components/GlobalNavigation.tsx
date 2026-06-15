import React from "react";

export default function GlobalNavigation() {
  const handleInitiateContact = () => {
    if (typeof (window as any).scrollToSection === "function") {
      (window as any).scrollToSection("contact");
    } else {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/75 backdrop-blur-md border-b border-zinc-800/80 font-mono text-xs select-none h-16 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex justify-between items-center">
        
        {/* Left Brand Identity with dynamic hardware look */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-cyan-400 rounded-sm animate-pulse" />
          <a href="#hero" className="font-bold text-white tracking-widest text-[13px] hover:text-cyan-400 transition-colors uppercase">
            JP // SYS_ADMIN
          </a>
        </div>

        {/* Right Nav Links & CTA */}
        <div className="flex items-center gap-6">
          {/* Minimalist raw hyperlinks */}
          <div className="hidden md:flex items-center gap-5 text-zinc-400">
            <a
              href="https://jeevapravin.github.io/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors uppercase relative group"
            >
              Resume (PDF)
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
            </a>
            <span className="text-zinc-800">|</span>
            <a
              href="https://github.com/jeevapravin"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors uppercase relative group"
            >
              GitHub
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
            </a>
            <span className="text-zinc-800">|</span>
            <a
              href="https://www.linkedin.com/in/jeeva-pravin-2365aa279"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors uppercase relative group"
            >
              LinkedIn
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-400 group-hover:w-full transition-all duration-300" />
            </a>
          </div>

          {/* Stark CTA Button */}
          <button
            onClick={handleInitiateContact}
            className="px-4 py-1.5 bg-[#ffffff] text-black font-bold uppercase transition-all duration-300 hover:bg-[#22d3ee] hover:-translate-y-0.5 rounded-none active:translate-y-0 text-[11px] tracking-wider cursor-pointer border border-transparent shadow-[0_0_15px_-3px_rgba(255,255,255,0.2)]"
          >
            [ INITIATE CONTACT ]
          </button>
        </div>

      </div>
    </nav>
  );
}
