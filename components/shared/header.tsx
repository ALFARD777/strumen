"use client";

import { IconHomeFilled, IconSettingsFilled } from "@tabler/icons-react";
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

const Header = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isAdminPage = pathname === "/admin";
  const user = useAuthStore((state) => state.user);

  // const items = siteConfig.navItems.map((link) =>
  //   link.sub ? (
  //     <NavigationMenuItem key={link.label}>
  //       <NavigationMenuTrigger prps={{ className: "cursor-pointer" }} rotate="group-data-[state=open]:rotate-180">
  //         {!link.clickable ? link.label : <NextLink href={link.href}>{link.label}</NextLink>}
  //       </NavigationMenuTrigger>
  //       <SubMenu link={link} />
  //     </NavigationMenuItem>
  //   ) : (
  //     <NavigationMenuItem key={link.href}>
  //       <div className={clsx(navigationMenuTriggerStyle(), "cursor-pointer")}>{link.label}</div>
  //     </NavigationMenuItem>
  //   ),
  // );

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center shadow-md backdrop-blur bg-background/60">
      <Container className="py-2">
        <header className="flex w-full">
          <div className="flex items-center py-3 basis-full">
            <Logo />
            <div className="hidden lg:flex mx-8 w-full " id="navMenu">
              <NavMenu item={menus} />
            </div>
            {/* <NavigationMenu className="hidden lg:flex ml-3 transition-all duration-300" id="navMenu">
              <NavigationMenuList>
                {items}
                <ContactsButton />
              </NavigationMenuList>
            </NavigationMenu> */}
          </div>

          <div className="hidden lg:flex justify-end basis-full sm:basis-1/5 items-center select-none">
            <Search />
            {!isHomePage && (
              <ButtonLink aria-label="На главную" href="/" variant="icon" size="icon">
                <IconHomeFilled />
              </ButtonLink>
            )}
            {user?.isAdmin && !isAdminPage && (
              <ButtonLink aria-label="Панель управления" href="/admin" variant="icon" size="icon">
                <IconSettingsFilled />
              </ButtonLink>
            )}
            <CartButton userId={user?.id || undefined} />
            <ThemeSwitch />
            <AuthButton />
          </div>

          <div className="flex items-center lg:hidden select-none justify-end gap-4">
            <Search className="p-0" />
            {user?.isAdmin && !isAdminPage && (
              <ButtonLink
                aria-label="Панель управления"
                href="/admin"
                variant="icon"
                size="icon"
                className="p-0 size-auto"
              >
                <IconSettingsFilled />
              </ButtonLink>
            )}
            <ThemeSwitch className="p-0" />
            <NavbarToggle />
          </div>
        </header>
      </Container>
      <MenuDrawer userId={user?.id || undefined} />
    </div>
  );
};

// function Nav() {
//   return (
//     <MantineProvider>
//       <div >
//       <Menu trigger="hover" openDelay={50} closeDelay={150} shadow="md" width={200}>
//         <Menu.Target>
//           <NextLink href="/catalog" className="px-3 py-2 rounded hover:bg-background-200 font-semibold">
//             Каталог
//           </NextLink>
//         </Menu.Target>
//       </Menu></div>
//     </MantineProvider>
//   );
// }

export default Header;
