import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Car, Sparkles, BatteryCharging, Wind, CircleDot } from "lucide-react";
import type { ReactElement } from "react";

interface Service {
  icon: ReactElement;
  title: string;
  description: string;
  price: string;
}

const serviceList: Service[] = [
  {
    icon: <Wrench className="h-10 w-10 text-primary" />,
    title: "General Maintenance",
    description: "Oil changes, filter replacements, fluid checks, and tune-ups to keep your car running smoothly.",
    price: "Starting at $79",
  },
  {
    icon: <CircleDot className="h-10 w-10 text-primary" />,
    title: "Brake Repair & Service",
    description: "Complete brake inspections, pad and rotor replacement, and hydraulic system repairs.",
    price: "Starting at $149",
  },
  {
    icon: <Car className="h-10 w-10 text-primary" />,
    title: "Engine Diagnostics",
    description: "Advanced computer diagnostics to identify and fix engine problems quickly and accurately.",
    price: "Diagnostics from $99",
  },
  {
    icon: <Wind className="h-10 w-10 text-primary" />,
    title: "A/C & Heating Repair",
    description: "Stay comfortable with our expert A/C and heating system services, from recharges to compressor repairs.",
    price: "A/C Recharge $129",
  },
  {
    icon: <BatteryCharging className="h-10 w-10 text-primary" />,
    title: "Electrical Systems",
    description: "Battery testing and replacement, alternator and starter repairs, and complex wiring solutions.",
    price: "Contact for quote",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "Full Auto Detailing",
    description: "Interior and exterior detailing, paint correction, and ceramic coating for a lasting shine.",
    price: "Packages from $199",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Our Services</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-lg">
            Comprehensive automotive solutions delivered with expertise and care. We handle everything to keep you on the road safely.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceList.map((service) => (
            <Card key={service.title} className="flex flex-col text-center items-center shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-4">
                    {service.icon}
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <CardTitle className="text-2xl font-bold font-headline mb-2">{service.title}</CardTitle>
                <CardDescription className="mb-4 flex-grow">{service.description}</CardDescription>
                <p className="font-semibold text-primary mt-auto">{service.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
