import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";

export default function Hero() {
  return (
    <section className="container flex flex-col items-center justify-center gap-4 pb-8 pt-6 md:py-10 lg:py-16">
      <div className="flex max-w-[980px] flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
          Unlock Your Creative Vision: Rent Professional Cameras & Gear
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          Your one-stop shop for high-quality cameras, lenses, and accessories
          for photography and videography.
        </p>
      </div>
      <div className="flex gap-4">
        <Link href="/search">
          <Button size="lg">Browse Cameras</Button>
        </Link>
        <Button size="lg" variant="outline">
          Learn More
        </Button>
      </div>
      <div className="mt-8 overflow-hidden rounded-lg">
        <img
          src="/landing-page-image.jpg"
          height={400}
          width={800}
          alt="Professional camera equipment"
          className="aspect-[2/1] object-cover"
        />
      </div>
    </section>
  );
}
