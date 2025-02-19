import { Navbar } from "@/Components/Navbar";
// import { usePage } from "@inertiajs/react";
import { PropsWithChildren /*, useState*/ } from "react";

export default function Authenticated({
  // header,
  children
}: PropsWithChildren) {
  // const user = usePage().props.auth.user;

  // const [showingNavigationDropdown, setShowingNavigationDropdown] =
  //   useState(false);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-screen-2xl">{children}</main>
    </div>
  );
}
