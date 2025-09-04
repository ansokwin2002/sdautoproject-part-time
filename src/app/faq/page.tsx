import FaqClient from "@/components/faq-client";

export default function FaqPage() {
    const context = `SD AutoCar is a premier automotive service center. We offer a wide range of services including:
- General Maintenance: Oil changes, filter replacements, fluid checks, and tune-ups. Prices start at $79.
- Brake Repair & Service: Complete brake inspections, pad and rotor replacement. Prices start at $149.
- Engine Diagnostics: Advanced computer diagnostics for all modern vehicles. Diagnostic fees start from $99.
- A/C & Heating Repair: From recharges to compressor repairs. A/C recharge is $129.
- Electrical Systems: Battery testing and replacement, alternator and starter repairs.
- Full Auto Detailing: Interior and exterior detailing, paint correction, and ceramic coating. Packages start from $199.
Our business hours are Monday to Friday, 8:00 AM to 6:00 PM, and Saturday from 9:00 AM to 3:00 PM. We are closed on Sundays.
Our address is SD AUTO PART 87 Kookaburra Avenue Werribee, Victoria 3030 Australia. 
You can book an appointment by calling +61 460 786 533 or using the contact form on our website. 
We stand by our work with a comprehensive warranty on parts and labor.`;

  return (
    <div className="bg-muted min-h-[calc(100vh-14rem)]">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mt-3 max-w-3xl mx-auto text-lg">
            Have questions? Find answers here, or ask our AI assistant for specific information about our services.
          </p>
        </div>
        <FaqClient serviceContext={context} />
      </div>
    </div>
  );
}
