import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted">
      <div className="container mx-auto py-8 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <a href="/" className="flex items-center space-x-2">
              <img src="/logo.png" width={160} height={120} alt="" />
            </a>
            <p className="mt-4 text-sm text-muted-foreground">
              Your one-stop shop for high-quality camera rentals.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Rental Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>123 Camera Street, Lens City, PC 12345</li>
              <li>Phone: (123) 456-7890</li>
              <li>Email: info@camerarentals.com</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Newsletter</h3>
            <form className="mt-4 flex flex-col gap-2">
              <Input type="email" placeholder="Enter your email" />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 CameraRentals. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
