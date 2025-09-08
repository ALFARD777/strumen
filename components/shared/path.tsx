import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb";

type Props = {
  children: { href: string; label: string }[];
};

export function Path({ children }: Props) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {children.map((page, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink href={page.href}>{page.label}</BreadcrumbLink>
            </BreadcrumbItem>
            {children.length !== index + 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
