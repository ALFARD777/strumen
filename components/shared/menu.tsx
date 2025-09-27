"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import NextLink from "next/link";
import { type ReactNode, useState } from "react";
import { ContactsButton } from "./contactsButton";

type MenuItem = {
  label: string;
  href: string;
  clickable?: boolean;
  children?: MenuItem[];
};

export function NavMenu({ item }: { item: MenuItem[] }) {
  return (
    <nav className="relative w-full">
      <ul className="flex space-x-4 items-center justify-around">
        {item.map((el) => (
          <MenuItemComponent key={el.label} item={el} level={1} />
        ))}
        <ContactsButton />
      </ul>
    </nav>
  );
}

function MenuItemComponent({ item, level }: { item: MenuItem; level: number }) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {level === 1 && item.clickable ? (
        <NextLink
          href={item.href}
          className="group px-4 py-2 hover:bg-background-200 rounded font-semibold flex gap-2 leading-0 items-center"
        >
          {item.label}
          <ChevronDown className="transition-transform duration-200 group-hover:rotate-180" size={20} />
        </NextLink>
      ) : level === 1 && !item.clickable ? (
        <span className="group px-4 py-2 rounded font-semibold cursor-pointer flex items-center gap-2 leading-0">
          {item.label}
          <ChevronDown className="transition-transform duration-200 group-hover:rotate-180" size={20} />
        </span>
      ) : level !== 1 && !hasChildren ? (
        <LinkContainer href={item.href}>{item.label}</LinkContainer>
      ) : (
        <LinkContainer href={item.href} className="group font-semibold flex justify-between items-center gap-2">
          {item.label}
          <ChevronDown className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:rotate-180" />
        </LinkContainer>
      )}

      {hasChildren && (
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, delay: 0.1 }}
              className={`absolute left-0 mt-2 p-2 bg-background shadow-lg rounded min-w-[300px] z-10 ${
                level > 1 ? "top-0 left-full ml-1" : ""
              }`}
            >
              {item.children?.map((child) => (
                <MenuItemComponent key={child.label} item={child} level={level + 1} />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  );
}

function LinkContainer({ children, href, className }: { children: ReactNode; href: string; className?: string }) {
  return (
    <button
      type="button"
      className="w-full px-4 py-2 hover:bg-background-300 rounded cursor-pointer text-left"
      onClick={() => {
        window.location.href = href;
      }}
    >
      <NextLink href={href} className={className}>
        {children}
      </NextLink>
    </button>
  );
}
