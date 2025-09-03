import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';
import Logo from '@/components/icons/logo';

export default function Footer() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "Our Team" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="bg-muted border-t">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-bold text-lg">SD AutoCar</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your trusted partner in automotive care and excellence.
            </p>
             <div className="flex space-x-4 mt-4">
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" aria-label="GitHub" className="text-muted-foreground hover:text-primary"><Github className="h-5 w-5" /></Link>
              <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.href}><Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>SD AUTO PART 87 Kookaburra Avenue Werribee, Victoria 3030 Australia</li>
              <li>+61 460 786 533</li>
              <li>sdautoaustralia@gmail.com</li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold mb-4">Business Hours</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Mon - Fri: 8:00 AM - 6:00 PM</li>
              <li>Sat: 9:00 AM - 3:00 PM</li>
              <li>Sun: Closed</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SD AutoCar Showcase. All Rights Reserved. | Developed by An Sokwin</p>
        </div>
      </div>
    </footer>
  );
}
