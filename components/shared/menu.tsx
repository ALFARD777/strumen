"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import NextLink from "next/link";
import { type ReactNode, useRef, useState } from "react";
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
  const hoverRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    hoverRef.current = true;
    timeoutRef.current = setTimeout(() => {
      if (hoverRef.current) setOpen(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    hoverRef.current = false;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  return (
    <li className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
              transition={{ duration: 0.15 }}
              className={`absolute left-0 min-w-[300px] z-10 ${level > 1 && "top-0 left-full"}`}
            >
              <div className={`mt-2 p-2 bg-background shadow-lg rounded w-full ${level > 1 && "ml-3"}`}>
                {item.children?.map((child) => (
                  <MenuItemComponent key={child.label} item={child} level={level + 1} />
                ))}
              </div>
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
