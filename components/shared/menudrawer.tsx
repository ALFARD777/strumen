"use client";
import { IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { siteConfig } from "@/config/site";
import { useMenuStore } from "../store/menu";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "../ui/drawer";
import {
	MobileMenu,
	MobileMenuItem,
	MobileMenuList,
	MobileMenuTrigger,
	navigationMenuTriggerStyle,
} from "../ui/navigationMenu";
import AuthButton from "./authButton";
import CartButton from "./cartButton";
import { MobileSubMenu } from "./submenus";

const MenuDrawer = ({ userId }: { userId?: number }) => {
	const isOpen = useMenuStore((s) => s.isOpen);
	const close = useMenuStore((s) => s.close);

	const items = siteConfig.navItems.map((link) =>
		link.sub ? (
			<MobileMenuItem key={link.label}>
				<MobileMenuTrigger
					prps={{ className: "cursor-pointer" }}
					rotate="group-data-[state=open]:rotate-180"
				>
					{link.label}
				</MobileMenuTrigger>
				<MobileSubMenu link={link} />
			</MobileMenuItem>
		) : (
			<MobileMenuItem key={link.label}>
				<button
					type="button"
					className={clsx(navigationMenuTriggerStyle(), "cursor-pointer")}
					onClick={() => {
						close();
					}}
				>
					{link.label}
				</button>
			</MobileMenuItem>
		),
	);

	return (
		<Drawer open={isOpen} direction="right" onOpenChange={(v) => !v && close()}>
			<DrawerContent>
				<DrawerHeader>
					<div className="flex justify-between">
						<DrawerTitle>Навигация</DrawerTitle>
						<DrawerClose onClick={close}>
							<IconX />
						</DrawerClose>
					</div>
				</DrawerHeader>
				<DrawerDescription className="text-center">
					Выберите компонент для перехода
				</DrawerDescription>
				<MobileMenu className="p-4">
					<MobileMenuList className="flex flex-col items-start gap-4">
						{items}
					</MobileMenuList>
				</MobileMenu>
				<DrawerFooter>
					<CartButton mobile userId={userId} />
					<AuthButton primary />
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default MenuDrawer;
