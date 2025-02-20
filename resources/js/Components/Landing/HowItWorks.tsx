import { Calendar, Camera, Search } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Select",
    description:
      "Explore our wide range of cameras and equipment. Filter by type, brand, or your specific needs."
  },
  {
    icon: Calendar,
    title: "Choose Rental Dates & Book",
    description: "Select your desired rental period and easily book online."
  },
  {
    icon: Camera,
    title: "Pickup & Shoot!",
    description: "Pick up your gear and Capture your vision!"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="container py-12 lg:py-16">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
        Easy 3-Step Rental Process
      </h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-primary p-3">
              <step.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold">{step.title}</h3>
            <p className="mt-2 text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
