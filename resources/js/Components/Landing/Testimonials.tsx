import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Professional Photographer",
    content:
      "The quality of equipment and customer service at CameraRentals is unmatched. They've been my go-to for years!",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "Sarah Lee",
    role: "Indie Filmmaker",
    content:
      "Renting high-end cinema cameras has never been easier. CameraRentals has everything I need for my productions.",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "Mike Chen",
    role: "Travel Vlogger",
    content:
      "Flexible rental periods and their wide selection of gear make CameraRentals perfect for my globetrotting adventures.",
    avatar: "/placeholder.svg?height=40&width=40"
  }
];

export default function Testimonials() {
  return (
    <section className="container py-12 lg:py-16">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
        What Our Customers Are Saying
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src={testimonial.avatar}
                    alt={testimonial.name}
                  />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{testimonial.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
