"use client";

import { IconHome2, IconSettings } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/components/store/auth";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "../ui/button";
import Container from "../ui/container";
import AuthButton from "./authButton";
import CartButton from "./cartButton";
import { Logo } from "./logo";
import { NavMenu } from "./menu";
import MenuDrawer from "./menudrawer";
import NavbarToggle from "./navbartoggle";
import Search from "./search";
import { ThemeSwitch } from "./themeSwitch";

type MenuItem = {
  label: string;
  href: string;
  clickable?: boolean;
  children?: MenuItem[];
};

type NavItem = {
  label: string;
  href: string;
  clickable?: boolean;
  sub?: NavItem[];
};

function mapNav(items: NavItem[], parentHref = ""): MenuItem[] {
  return items.map((item) => {
    const fullHref = parentHref ? `${parentHref}/${item.href}` : item.href;
    return {
      label: item.label,
      href: fullHref,
      clickable: item.clickable ?? false,
      children: item.sub?.length ? mapNav(item.sub, fullHref) : undefined,
    };
  });
}

const menus: MenuItem[] = mapNav(siteConfig.navItems);
const headerIconClassName =
  "size-auto min-w-0 h-auto p-0 m-0 rounded-none shadow-none";

const Header = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isAdminPage = pathname === "/admin";
  const user = useAuthStore((state) => state.user);

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center shadow-md backdrop-blur bg-background/60">
      <Container className="py-2">
        <header className="flex w-full justify-between py-3 items-center">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="hidden lg:flex" id="navMenu">
            <NavMenu item={menus} />
          </div>

          <div className="hidden lg:flex select-none items-center gap-4">
            <Search className={headerIconClassName} />
            {!isHomePage && (
              <ButtonLink
                aria-label="На главную"
                href="/"
                variant="icon"
                className={headerIconClassName}
              >
                <IconHome2 />
              </ButtonLink>
            )}
            {user?.isAdmin && !isAdminPage && (
              <ButtonLink
                aria-label="Панель управления"
                href="/admin"
                variant="icon"
                className={headerIconClassName}
              >
                <IconSettings />
              </ButtonLink>
            )}
            <CartButton
              userId={user?.id || undefined}
              className={headerIconClassName}
            />
            <ThemeSwitch className={headerIconClassName} />
            <AuthButton />
          </div>

          <div className="flex items-center lg:hidden select-none justify-end gap-6">
            <Search />
            {user?.isAdmin && !isAdminPage && (
              <ButtonLink
                aria-label="Панель управления"
                href="/admin"
                variant="icon"
                size="icon"
              >
                <IconSettings />
              </ButtonLink>
            )}
            <ThemeSwitch />
            <NavbarToggle />
          </div>
        </header>
      </Container>
      <MenuDrawer userId={user?.id || undefined} />
    </div>
  );
};

export default Header;
