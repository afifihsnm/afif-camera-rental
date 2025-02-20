import { Calendar, Camera, DollarSign, Headphones, Truck } from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Access to Pro Gear Without the Price Tag",
    description: "Save money by renting top-tier equipment for your projects."
  },
  {
    icon: Camera,
    title: "Wide Range of Top Brands & Models",
    description:
      "Choose from our extensive selection of professional cameras and lenses."
  },
  {
    icon: Calendar,
    title: "Flexible Rental Periods",
    description:
      "Daily, weekly, or monthly rentals to suit your project timeline."
  },
  {
    icon: Headphones,
    title: "Expert Support & Well-Maintained Equipment",
    description:
      "Get help from our knowledgeable team and rent gear in perfect condition."
  },
  {
    icon: Truck,
    title: "Convenient Pickup & Delivery Options",
    description:
      "Choose between in-store pickup or have your gear delivered to your location."
  }
];

export default function Benefits() {
  return (
    <section className="container py-12 lg:py-16">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
        Why Choose CameraRentals?
      </h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <benefit.icon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">{benefit.title}</h3>
              <p className="mt-1 text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
