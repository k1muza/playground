'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/footer';

export default function ConditionalFooter() {
  const pathname = usePathname();

  // An array of paths where the footer should be hidden.
  // The problem detail page has a unique layout that should fill the screen.
  const hiddenPaths = ['/problems/'];

  const shouldHideFooter = hiddenPaths.some(p => pathname.startsWith(p) && pathname.length > p.length);

  if (shouldHideFooter) {
    return null;
  }

  return <Footer />;
}
