import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mdToHtml(md: string) {
  if (!md) return '';
  // Very minimal markdown to HTML (headings + paragraphs)
  return md
    .split('\n')
    .map((l) => {
      if (l.startsWith('# ')) return `<h1>${l.slice(2)}</h1>`;
      if (l.startsWith('## ')) return `<h2>${l.slice(3)}</h2>`;
      if (l.startsWith('### ')) return `<h3>${l.slice(4)}</h3>`;
      if (l.trim() === '---' || l.trim() === '***') return `<hr />`;
      if (l.trim() === '') return '';
      return `<p>${l}</p>`;
    })
    .join('');
}
