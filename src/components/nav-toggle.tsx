'use client';
import { ChevronDown, Beaker, FolderGit2, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export function NavToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-fd-accent transition-colors"
      >
        Menu <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-fd-border bg-fd-background shadow-xl flex flex-col p-1.5 z-50">
          <Link 
            href="/docs/labs" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-fd-accent transition-colors"
          >
            <div className="bg-amber-500/10 border border-amber-500/20 p-1 rounded-md text-amber-500">
              <Beaker className="w-4 h-4" />
            </div>
            Labs
          </Link>
          <Link 
            href="/docs/projects" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-fd-accent transition-colors"
          >
            <div className="bg-blue-500/10 border border-blue-500/20 p-1 rounded-md text-blue-500">
              <FolderGit2 className="w-4 h-4" />
            </div>
            Projects
          </Link>
          <Link 
            href="/blog" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-fd-accent transition-colors"
          >
            <div className="bg-violet-500/10 border border-violet-500/20 p-1 rounded-md text-violet-500">
              <BookOpen className="w-4 h-4" />
            </div>
            Blog
          </Link>
        </div>
      )}
    </div>
  );
}
