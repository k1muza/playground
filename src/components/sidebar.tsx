'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';

export default function Sidebar({
  sections,
}: {
  sections: { id: string; title: string }[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <aside className="md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:w-72 md:shrink-0">
      <Button
        onClick={() => setOpen(!open)}
        variant="outline"
        className="mb-3 w-full justify-between md:hidden"
      >
        {open ? 'Hide lessons' : 'Show lessons'}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      <nav
        className={`${
          open ? 'block' : 'hidden'
        } rounded-lg border bg-card p-2 md:block md:h-full md:overflow-y-auto`}
      >
        <p className="p-2 text-sm font-semibold">Course Sections</p>
        <ul className="space-y-1">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
