'use client';

import Link from 'next/link';
import { Facebook, Send, MessageCircle } from 'lucide-react';
import TikTokIcon from '@/components/icons/tiktok';
import Logo from '@/components/icons/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { useContacts } from '@/hooks/useContacts';
import { useHomeSettings } from '@/hooks/useHomeSettings';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2024);
  
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  const { contacts } = useContacts();
  const contact = contacts.length > 0 ? contacts[0] : null;
  const { settings } = useHomeSettings();

  const navLinks = [
    { href: "/genuine-parts", label: "Genuines Parts and Accessories" },
    { href: "/", label: "Home" },
    { href: "/shipping", label: "Shipping" },
    { href: "/policy", label: "Policy" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <footer className="bg-muted border-t">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-bold text-lg">{settings?.title || 'SD Auto'}</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              {settings?.footer_home || '15 years of expertise in genuine auto parts for Thailand-made brands • Worldwide shipping • Family-owned Australian business'}
            </p>
             <div className="flex space-x-4 mt-4">
              <Link href="/contact" aria-label="Facebook" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></Link>
              <Link href="https://wa.me/61460786533" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-muted-foreground hover:text-green-600"><MessageCircle className="h-5 w-5" /></Link>
              <Link href="/contact" aria-label="Telegram" className="text-muted-foreground hover:text-primary"><Send className="h-5 w-5" /></Link>
              <Link href="/contact" aria-label="TikTok" className="text-muted-foreground hover:text-primary"><TikTokIcon className="h-5 w-5" /></Link>
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
              <li>{contact?.address || 'SD AUTO Werribee, Victoria 3030 Australia'}</li>
              <li><a href={contact?.phone ? `tel:${contact.phone}` : `tel:+61460786533`} className="hover:text-primary transition-colors">{contact?.phone || '+61 460 786 533'}</a></li>
              <li><a href={contact?.whatsApp ? `https://wa.me/${contact.whatsApp.replace(/[^\d]/g, '')}` : `https://wa.me/61460786533`} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors">WhatsApp: {contact?.whatsApp || '+61 460 786 533'}</a></li>
              <li><a href={contact?.email ? `mailto:${contact.email}` : `mailto:sdautoaustralia@gmail.com`} className="hover:text-primary transition-colors">{contact?.email || 'sdautoaustralia@gmail.com'}</a></li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold mb-4">Business Hours</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(contact?.business_hour ? contact.business_hour.split('\n') : ['Monday - Saturday: 9am-6pm', 'Sunday: Closed']).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} SD Auto Showcase. All Rights Reserved. | Developed by <Link href="https://ansokwin.reancode.online" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">An Sokwin</Link></p>
        </div>
      </div>
    </footer>
  );
}
