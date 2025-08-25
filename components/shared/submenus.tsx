import NextLink from "next/link";
import {
  MobileMenu,
  MobileMenuContent,
  MobileMenuTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "../ui/navigationMenu";

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

const SubMenu = ({ link }: Props) => {
  return (
    <NavigationMenuContent>
      <ul className="flex flex-col min-w-[250px] p-2">
        {link.sub.map((item) => {
          if (item.sub) {
            return (
              <NavigationMenu key={item.href} className="w-full">
                <li className="relative group w-full">
                  <NavigationMenuTrigger
                    prps={{
                      className: "cursor-pointer",
                    }}
                    rotate="group-data-[state=open]:-rotate-90"
                  >
                    <NextLink href={link.href + item.href}>
                      {item.label}
                    </NextLink>
                  </NavigationMenuTrigger>

                  <SubSubMenu
                    hrefParent={link.href + item.href}
                    items={item.sub}
                  />
                </li>
              </NavigationMenu>
            );
          }

          return (
            <li key={item.href}>
              <NavigationMenuLink asChild>
                <NextLink
                  href={link.href + item.href}
                  className="block p-2 hover:bg-accent rounded text-sm text-center"
                >
                  {item.label}
                </NextLink>
              </NavigationMenuLink>
            </li>
          );
        })}
      </ul>
    </NavigationMenuContent>
  );
};

const SubSubMenu = ({ hrefParent, items }: SubSubMenuProps) => {
  return (
    <NavigationMenuContent className="absolute left-full ml-5 -top-10">
      <ul className="flex flex-col min-w-[200px] p-2">
        {items.map((subitem) => (
          <li key={subitem.href} className="relative group">
            <NextLink
              href={hrefParent + subitem.href}
              className="block p-2 hover:bg-accent rounded text-sm text-center"
            >
              {subitem.label}
            </NextLink>
          </li>
        ))}
      </ul>
    </NavigationMenuContent>
  );
};

const MobileSubMenu = ({ link }: Props) => {
  return (
    <MobileMenuContent>
      <ul className="flex flex-col">
        {link.sub.map((item, idx) => {
          if (item.sub) {
            return (
              <MobileMenu key={idx} className="w-full">
                <li>
                  <MobileMenuTrigger
                    prps={{ className: "cursor-pointer" }}
                    rotate="group-data-[state=open]:-rotate-90"
                  >
                    <div className="ml-2">{item.label}</div>
                  </MobileMenuTrigger>
                  <MobileSubSubMenu
                    hrefParent={link.href + item.href}
                    items={item.sub}
                  />
                </li>
              </MobileMenu>
            );
          }

          return (
            <li key={idx} className="pl-2">
              <NextLink
                href={link.href + item.href}
                className="block p-2 hover:bg-accent rounded text-sm text-start"
              >
                {item.label}
              </NextLink>
            </li>
          );
        })}
      </ul>
    </MobileMenuContent>
  );
};

const MobileSubSubMenu = ({ hrefParent, items }: SubSubMenuProps) => {
  return (
    <MobileMenuContent>
      <ul className="flex flex-col pl-4">
        {items.map((subitem, idx) => (
          <li key={idx} className="relative group">
            <NextLink
              href={hrefParent + subitem.href}
              className="block pl-4 py-2 hover:bg-accent rounded text-sm text-start"
            >
              {subitem.label}
            </NextLink>
          </li>
        ))}
      </ul>
    </MobileMenuContent>
  );
};

export { SubMenu, SubSubMenu, MobileSubMenu };
