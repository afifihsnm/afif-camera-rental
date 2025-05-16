import { Button } from "@/Components/ui/button";
import { Link, usePage } from "@inertiajs/react";
import { Package2, ShieldCheck, ShoppingCart, User } from "lucide-react";
import { Logo } from "./Logo";
import { NavMenu } from "./NavMenu";
import { NavSheet } from "./NavSheet";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";

export const Navbar = () => {
  const { auth, cartCount, rentCount } = usePage().props;

  return (
    <nav className="h-16 border-b bg-background">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />
        </div>

        <div className="flex items-center gap-4">
          {auth.user ? (
            <>
              {/* Admin Panel button only for 'owner' */}
              {auth.roles?.includes("owner") && (
                <a href="/admin">
                  <Button variant="ghost">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Go to Admin Panel
                  </Button>
                </a>
              )}
              {/* Cart Button */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0">
                    {cartCount}
                  </Badge>
                </Button>
              </Link>

              {/* Orders Button */}
              <Link href="/history">
                <Button variant="ghost" size="icon" className="relative">
                  <Package2 className="h-5 w-5" />
                  <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0">
                    {rentCount}
                  </Badge>
                </Button>
              </Link>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <p className="font-medium">{auth.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {auth.user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Link href={route("logout")} method="post">
                      Sign Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Unauthenticated users */}
              <a href="/admin">
                <Button variant="ghost">
                  <ShieldCheck />
                  Go to Admin Panel
                </Button>
              </a>
              <Link href="/login">
                <Button variant="outline" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};
