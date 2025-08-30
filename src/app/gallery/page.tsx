import Image from "next/image";

const galleryImages = [
  { src: "https://picsum.photos/800/600?random=11", alt: "Classic car restoration", aiHint: "classic car" },
  { src: "https://picsum.photos/600/800?random=12", alt: "Detailed engine bay", aiHint: "car engine" },
  { src: "https://picsum.photos/800/600?random=13", alt: "Sports car with custom wheels", aiHint: "custom wheels" },
  { src: "https://picsum.photos/800/600?random=14", alt: "Before and after paint correction", aiHint: "car paint" },
  { src: "https://picsum.photos/600/800?random=15", alt: "Immaculate car interior", aiHint: "car interior" },
  { src: "https://picsum.photos/800/600?random=16", alt: "Luxury SUV after detailing", aiHint: "suv detailing" },
  { src: "https://picsum.photos/800/600?random=17", alt: "Technician working on a vehicle", aiHint: "car repair" },
  { src: "https://picsum.photos/600/800?random=18", alt: "Custom exhaust system installation", aiHint: "car exhaust" },
  { src: "https://picsum.photos/800/600?random=19", alt: "A collection of serviced cars", aiHint: "serviced cars" },
  { src: "https://picsum.photos/600/800?random=20", alt: "Polishing a car exterior", aiHint: "car polishing" },
  { src: "https://picsum.photos/800/600?random=21", alt: "Clean car wheel", aiHint: "car wheel" },
  { src: "https://picsum.photos/600/800?random=22", alt: "Mechanic under a car", aiHint: "mechanic undercar" },
];

export default function GalleryPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Our Work in Pictures</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-lg">
            A showcase of our craftsmanship, attention to detail, and the stunning results we deliver for our clients.
          </p>
        </div>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {galleryImages.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-md break-inside-avoid group">
              <Image
                src={image.src}
                alt={image.alt}
                data-ai-hint={image.aiHint}
                width={800}
                height={600}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
