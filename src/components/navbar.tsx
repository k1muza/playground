'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Book, Code, FileText, Home, Search, Feather } from 'lucide-react';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/courses', label: 'Courses', icon: Book },
  { href: '/problems', label: 'Problems', icon: Code },
  { href: '/articles', label: 'Articles', icon: FileText },
  { href: '/search', label: 'Search', icon: Search },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
          <Feather className="h-7 w-7 text-primary" />
          <span className="font-headline">LearnVerse</span>
        </Link>
        <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                'flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                (pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href))) &&
                  'bg-accent text-accent-foreground'
              )}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
