'use client';

import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export default function ChatbotButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        'fixed bottom-8 right-5 rounded-full h-12 w-12 transition-opacity duration-300 z-50',
        'opacity-100' // Always visible for now, can be made conditional later
      )}
      onClick={onClick}
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
}
