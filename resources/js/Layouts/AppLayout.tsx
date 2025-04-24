import Footer from "@/Components/Footer";
import { Navbar } from "@/Components/Navbar";
// import { usePage } from "@inertiajs/react";
import { PropsWithChildren /*, useState*/ } from "react";
import { Toaster } from "sonner";

export default function Authenticated({
  // header,
  children
}: PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <Toaster position="top-center" />
      <Navbar />
      <main className="mx-auto max-w-screen-2xl">{children}</main>
      <Footer />
    </div>
  );
}
