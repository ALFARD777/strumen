"use client";

import { IconHomeFilled, IconSettingsFilled } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Container from "../ui/container";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigationMenu";
import { ButtonLink } from "../ui/button";
import { ThemeSwitch } from "./themeSwitch";
import { Logo } from "./logo";
import NavbarToggle from "./navbartoggle";
import MenuDrawer from "./menudrawer";
import { SubMenu } from "./submenus";
import AuthButton from "./authButton";
import ContactsButton from "./contactsButton";
import { useAuthStore } from "@/components/store/auth";
import { siteConfig } from "@/config/site";

const Header = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isAdminPage = pathname === "/admin";
  const user = useAuthStore((state) => state.user);

  const items = siteConfig.navItems.map((link) =>
    link.sub ? (
      <NavigationMenuItem key={link.href}>
        <NavigationMenuTrigger
          prps={{ className: "cursor-pointer" }}
          rotate="group-data-[state=open]:rotate-180"
          href={link.href}
        >
          {link.label}
        </NavigationMenuTrigger>
        <SubMenu link={link} />
      </NavigationMenuItem>
    ) : (
      <NavigationMenuItem key={link.href}>
        <div className={clsx(navigationMenuTriggerStyle(), "cursor-pointer")}>
          {link.label}
        </div>
      </NavigationMenuItem>
    )
  );

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center shadow-md backdrop-blur bg-background/60">
      <Container className="py-2 px-2 xl:px-0">
        <header className="flex w-full">
          <div className="flex items-center py-3 basis-full">
            <Logo />
            <NavigationMenu className="hidden lg:flex ml-3">
              <NavigationMenuList>
                {items}
                <ContactsButton />
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden lg:flex justify-end basis-full sm:basis-1/5 items-center gap-3 select-none">
            {!isHomePage && (
              <ButtonLink
                aria-label="На главную"
                href="/"
                variant="icon"
                size="icon"
              >
                <IconHomeFilled />
              </ButtonLink>
            )}
            {user?.isAdmin && !isAdminPage && (
              <ButtonLink
                aria-label="Панель управления"
                href="/admin"
                variant="icon"
                size="icon"
              >
                <IconSettingsFilled />
              </ButtonLink>
            )}
            <ThemeSwitch />
            <AuthButton />
          </div>

          <div className="flex items-center lg:hidden basis-1 pl-4 select-none justify-end gap-2">
            <ThemeSwitch />
            <NavbarToggle />
          </div>
        </header>
      </Container>
      <MenuDrawer />
    </div>
  );
};

export default Header;
