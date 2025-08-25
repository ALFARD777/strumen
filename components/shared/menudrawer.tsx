"use client";
import clsx from "clsx";
import { IconX } from "@tabler/icons-react";
import { useMenuStore } from "../store/menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
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
import { MobileSubMenu } from "./submenus";
import { siteConfig } from "@/config/site";

const MenuDrawer = () => {
  const isOpen = useMenuStore((s) => s.isOpen);
  const close = useMenuStore((s) => s.close);

  const items = siteConfig.navItems.map((link, idx) =>
    link.sub ? (
      <MobileMenuItem key={idx}>
        <MobileMenuTrigger
          prps={{ className: "cursor-pointer" }}
          rotate="group-data-[state=open]:rotate-180"
          href={link.href}
        >
          {link.label}
        </MobileMenuTrigger>
        <MobileSubMenu link={link} />
      </MobileMenuItem>
    ) : (
      <MobileMenuItem key={idx}>
        <button
          className={clsx(navigationMenuTriggerStyle(), "cursor-pointer")}
          onClick={() => {
            close();
          }}
        >
          {link.label}
        </button>
      </MobileMenuItem>
    )
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
      </DrawerContent>
    </Drawer>
  );
};

export default MenuDrawer;
