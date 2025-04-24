import Benefits from "@/Components/Landing/Benefits";
import FAQ from "@/Components/Landing/FAQ";
import Hero from "@/Components/Landing/Hero";
import HowItWorks from "@/Components/Landing/HowItWorks";
import Testimonials from "@/Components/Landing/Testimonials";
import Authenticated from "@/Layouts/AppLayout";

export default function Landing() {
  return (
    <Authenticated>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Hero />
        <Benefits />
        <HowItWorks />
        <Testimonials />
        <FAQ />
      </div>
    </Authenticated>
  );
}
