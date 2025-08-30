import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Linkedin, Twitter } from "lucide-react";

const teamMembers = [
  {
    name: "John Doe",
    role: "Master Technician",
    bio: "With over 20 years of experience, John is a certified master technician specializing in European vehicles. His passion for precision and problem-solving is unmatched.",
    avatar: "https://picsum.photos/200/200?random=21",
    aiHint: "man portrait",
  },
  {
    name: "Jane Smith",
    role: "Service Advisor",
    bio: "Jane is the friendly face you'll meet when you arrive. She excels at understanding customer needs and ensuring a smooth, transparent service experience.",
    avatar: "https://picsum.photos/200/200?random=22",
    aiHint: "woman portrait",
  },
  {
    name: "Mike Johnson",
    role: "Detailing Specialist",
    bio: "Mike has an artist's eye for detail. He transforms cars with his expertise in paint correction, ceramic coatings, and interior rejuvenation.",
    avatar: "https://picsum.photos/200/200?random=23",
    aiHint: "person portrait",
  },
  {
    name: "Sarah Williams",
    role: "Lead Mechanic",
    bio: "Sarah leads our diagnostics team. She is an expert in complex electrical systems and modern engine technology, ensuring accurate and efficient repairs.",
    avatar: "https://picsum.photos/200/200?random=24",
    aiHint: "female engineer",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-muted">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Meet Our Expert Team</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-lg">
            The passionate professionals dedicated to providing the highest quality automotive care.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.name} className="text-center shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="items-center pt-6">
                <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
                  <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.aiHint} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl font-bold">{member.name}</CardTitle>
                <CardDescription className="text-sm text-primary font-medium">{member.role}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <p className="text-muted-foreground text-sm mb-4 flex-grow">{member.bio}</p>
                <div className="flex justify-center space-x-3 mt-auto">
                  <a href="#" aria-label={`${member.name}'s Twitter`} className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
                  <a href="#" aria-label={`${member.name}'s LinkedIn`} className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
