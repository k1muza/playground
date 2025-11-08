import Container from './container';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t py-8 text-sm text-muted-foreground">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p>© {new Date().getFullYear()} LearnVerse</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
