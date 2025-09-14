import React from "react";
import { v4 } from "uuid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

type Props = {
  children: { href: string; label: string }[];
};

export function Path({ children }: Props) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {children.map((page, index) => (
          <React.Fragment key={v4()}>
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
