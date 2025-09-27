"use client";
import { useMenuStore } from "../store/menu";
import { MobileMenu, MobileMenuContent, MobileMenuTrigger } from "../ui/navigationMenu";

type Props = {
  link: {
    label: string;
    href: string;
    sub: {
      label: string;
      href: string;
      sub?: {
        label: string;
        href: string;
      }[];
    }[];
  };
};

type SubSubMenuProps = {
  hrefParent: string;
  items: { href: string; label: string }[];
};

const MobileSubMenu = ({ link }: Props) => {
  return (
    <MobileMenuContent>
      <ul className="flex flex-col">
        {link.sub.map((item) => {
          if (item.sub) {
            return (
              <MobileMenu key={item.href} className="w-full">
                <li>
                  <MobileMenuTrigger prps={{ className: "cursor-pointer" }} rotate="group-data-[state=open]:-rotate-90">
                    <div className="ml-2">{item.label}</div>
                  </MobileMenuTrigger>
                  <MobileSubSubMenu hrefParent={link.href + item.href} items={item.sub} />
                </li>
              </MobileMenu>
            );
          }

          return (
            <li key={item.href} className="pl-2">
              <button
                type="button"
                onClick={() => {
                  window.location.href = link.href + item.href;
                  close();
                }}
                // href={link.href + item.href}
                className="block p-2 hover:bg-accent rounded text-sm text-start"
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </MobileMenuContent>
  );
};

const MobileSubSubMenu = ({ hrefParent, items }: SubSubMenuProps) => {
  const close = useMenuStore((s) => s.close);
  return (
    <MobileMenuContent>
      <ul className="flex flex-col pl-4">
        {items.map((subitem) => (
          <li key={subitem.href} className="relative group">
            <button
              type="button"
              // href={hrefParent + subitem.href}
              className="block pl-4 py-2 hover:bg-accent rounded text-sm text-start"
              onClick={() => {
                window.location.href = hrefParent + subitem.href;
                close();
              }}
            >
              {subitem.label}
            </button>
          </li>
        ))}
      </ul>
    </MobileMenuContent>
  );
};

export { MobileSubMenu };
