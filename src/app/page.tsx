import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Car, Wrench, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const featuredCars = [
  {
    name: "Luxury Sedan",
    description: "Experience unparalleled comfort and style.",
    image: "https://picsum.photos/600/400?random=1",
    aiHint: "luxury sedan",
  },
  {
    name: "Sports Coupe",
    description: "Thrilling performance meets cutting-edge design.",
    image: "https://picsum.photos/600/400?random=2",
    aiHint: "sports car",
  },
  {
    name: "Electric SUV",
    description: "Sustainable driving without compromising on power.",
    image: "https://picsum.photos/600/400?random=3",
    aiHint: "electric suv",
  },
];

const services = [
    {
        icon: <Wrench className="h-8 w-8 text-primary" />,
        title: "Expert Repairs",
        description: "From engine diagnostics to transmission repairs, our certified mechanics handle it all with precision."
    },
    {
        icon: <Car className="h-8 w-8 text-primary" />,
        title: "Routine Maintenance",
        description: "Keep your vehicle in peak condition with our comprehensive maintenance services, including oil changes and tune-ups."
    },
    {
        icon: <Sparkles className="h-8 w-8 text-primary" />,
        title: "Auto Detailing",
        description: "Restore your car's showroom shine with our meticulous interior and exterior detailing packages."
    }
]

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[70vh] w-full">
        <Image
          src="https://picsum.photos/1600/900"
          alt="Modern car on a scenic road"
          data-ai-hint="modern car"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        <div className="relative container mx-auto h-full flex flex-col items-start justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">
            Excellence in Every Detail
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8">
            SD AutoCar offers premium automotive services, from routine maintenance to full-scale restorations.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/services">
                Our Services <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                Book Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Featured Vehicles</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              A glimpse into the quality and variety of vehicles we work with.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <Card key={car.name} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
                <CardHeader className="p-0">
                  <div className="relative aspect-video">
                    <Image
                      src={car.image}
                      alt={car.name}
                      data-ai-hint={car.aiHint}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-bold font-headline">{car.name}</CardTitle>
                  <CardDescription className="mt-2">{car.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Our Core Services</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Delivering top-tier automotive care tailored to your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {services.map((service) => (
              <div key={service.title} className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-background rounded-full p-4">{service.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
           <div className="text-center mt-12">
                <Button asChild>
                    <Link href="/services">
                        Explore All Services <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3]">
                 <Image src="https://picsum.photos/800/600?random=4" alt="Mechanic working on a car" data-ai-hint="mechanic car" fill className="object-cover rounded-lg shadow-lg" />
            </div>
            <div>
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Choose SD AutoCar?</h2>
                <p className="text-muted-foreground mt-4 mb-6 text-lg">
                    We are more than just a garage. We are a team of passionate professionals dedicated to providing the best for your vehicle.
                </p>
                <ul className="space-y-4">
                    <li className="flex items-start">
                        <div className="bg-primary/10 text-primary rounded-full p-2 mr-4 mt-1"><Wrench className="h-5 w-5"/></div>
                        <div>
                            <h4 className="font-semibold">Certified Experts</h4>
                            <p className="text-muted-foreground">Our technicians are factory-trained and use state-of-the-art equipment.</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <div className="bg-primary/10 text-primary rounded-full p-2 mr-4 mt-1"><Sparkles className="h-5 w-5"/></div>
                        <div>
                            <h4 className="font-semibold">Transparent Pricing</h4>
                            <p className="text-muted-foreground">No hidden fees. We provide detailed estimates before any work begins.</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <div className="bg-primary/10 text-primary rounded-full p-2 mr-4 mt-1"><Car className="h-5 w-5"/></div>
                        <div>
                            <h4 className="font-semibold">Quality Guarantee</h4>
                            <p className="text-muted-foreground">We stand by our work with a comprehensive warranty on parts and labor.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
      </section>

    </div>
  );
}
