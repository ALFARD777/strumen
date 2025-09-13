"use client";

import {
	IconBasketFilled,
	IconHomeFilled,
	IconSettingsFilled,
} from "@tabler/icons-react";
import clsx from "clsx";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/components/store/auth";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "../ui/button";
import Container from "../ui/container";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "../ui/navigationMenu";
import AuthButton from "./authButton";
import CartButton from "./cartButton";
import ContactsButton from "./contactsButton";
import { Logo } from "./logo";
import MenuDrawer from "./menudrawer";
import NavbarToggle from "./navbartoggle";
import { SubMenu } from "./submenus";
import { ThemeSwitch } from "./themeSwitch";

const Header = () => {
	const pathname = usePathname();
	const isHomePage = pathname === "/";
	const isAdminPage = pathname === "/admin";
	const user = useAuthStore((state) => state.user);

	const items = siteConfig.navItems.map((link) =>
		link.sub ? (
			<NavigationMenuItem key={link.label}>
				<NavigationMenuTrigger
					prps={{ className: "cursor-pointer" }}
					rotate="group-data-[state=open]:rotate-180"
				>
					{!link.clickable ? (
						link.label
					) : (
						<NextLink href={link.href}>{link.label}</NextLink>
					)}
				</NavigationMenuTrigger>
				<SubMenu link={link} />
			</NavigationMenuItem>
		) : (
			<NavigationMenuItem key={link.href}>
				<div className={clsx(navigationMenuTriggerStyle(), "cursor-pointer")}>
					{link.label}
				</div>
			</NavigationMenuItem>
		),
	);

	return (
		<div className="fixed top-0 left-0 w-full z-50 flex justify-center shadow-md backdrop-blur bg-background/60">
			<Container className="py-2">
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
						<CartButton />
						<ThemeSwitch />
						<AuthButton />
					</div>

					<div className="flex items-center lg:hidden select-none justify-end gap-4">
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
			<MenuDrawer />
		</div>
	);
};

export default Header;
