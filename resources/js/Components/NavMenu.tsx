import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/Components/ui/navigation-menu";
import { Link } from "@inertiajs/react";
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu";

export const NavMenu = (props: NavigationMenuProps) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link href="/search">Browse Products</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);
