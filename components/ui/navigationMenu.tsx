import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

function NavigationMenu({
	className,
	children,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
	return (
		<NavigationMenuPrimitive.Root
			delayDuration={50}
			data-slot="navigation-menu"
			className={cn(
				"group/navigation-menu relative flex flex-1 items-center justify-center",
				className,
			)}
			{...props}
		>
			{children}
		</NavigationMenuPrimitive.Root>
	);
}

function MobileMenu({
	className,
	children,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
	return (
		<NavigationMenuPrimitive.Root
			data-slot="navigation-menu"
			className={cn("group/navigation-menu", className)}
			{...props}
		>
			{children}
		</NavigationMenuPrimitive.Root>
	);
}

function NavigationMenuList({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
	return (
		<NavigationMenuPrimitive.List
			data-slot="navigation-menu-list"
			className={cn(
				"group flex flex-1 list-none items-center justify-center gap-2",
				className,
			)}
			{...props}
		/>
	);
}

function MobileMenuList({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
	return (
		<NavigationMenuPrimitive.List
			data-slot="navigation-menu-list"
			className={clsx("group flex list-none gap-2 w-full", className)}
			{...props}
		/>
	);
}

function NavigationMenuItem({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
	return (
		<NavigationMenuPrimitive.Item
			data-slot="navigation-menu-item"
			className={cn("relative", className)}
			{...props}
		/>
	);
}

function MobileMenuItem({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
	return (
		<NavigationMenuPrimitive.Item
			data-slot="navigation-menu-item"
			className={cn("relative w-full", className)}
			{...props}
		/>
	);
}

const navigationMenuTriggerStyle = cva(
	"group inline-flex w-full items-center justify-between px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none transition-all ease-out data-[state=open]:bg-accent/40 data-[state=open]:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
);

type TriggerProps = {
	prps: {
		className?: string;
	} & React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>;
	rotate: string;
	children: React.ReactNode;
};

function NavigationMenuTrigger({ prps, rotate, children }: TriggerProps) {
	const { className, ...props } = prps;

	return (
		<NavigationMenuPrimitive.Trigger
			data-slot="navigation-menu-trigger"
			className={cn(
				navigationMenuTriggerStyle(),
				"flex items-center justify-between gap-2",
				className,
			)}
			{...props}
		>
			<span className="flex-1 text-center">{children}</span>
			<ChevronDownIcon
				size={16}
				className={cn("flex-shrink-0 transition-transform", rotate)}
				aria-hidden="true"
			/>
		</NavigationMenuPrimitive.Trigger>
	);
}

function MobileMenuTrigger({ prps, rotate, children }: TriggerProps) {
	const { className, ...props } = prps;

	return (
		<NavigationMenuPrimitive.Trigger
			data-slot="navigation-menu-trigger"
			className={cn(
				navigationMenuTriggerStyle(),
				"flex items-center justify-between",
				className,
			)}
			{...props}
		>
			<span className="flex-1 text-start">{children}</span>
			<ChevronDownIcon
				size={16}
				className={cn("flex-shrink-0 transition-transform", rotate)}
				aria-hidden="true"
			/>
		</NavigationMenuPrimitive.Trigger>
	);
}

function NavigationMenuContent({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
	return (
		<NavigationMenuPrimitive.Content
			data-slot="navigation-menu-content"
			className={cn(
				"mt-10 bg-background shadow-[0_0_10px_rgba(0,0,0,0.3)] rounded",
				"top-0 left-0 p-2 absolute w-auto",
				"data-[state=open]:animate-in",
				"data-[state=open]:fade-in",
				className,
			)}
			{...props}
		/>
	);
}

function MobileMenuContent({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
	return (
		<NavigationMenuPrimitive.Content
			data-slot="navigation-menu-content"
			className={cn(
				"w-full",
				"data-[state=open]:animate-in data-[state=closed]:animate-out",
				"data-[state=open]:fade-in data-[state=closed]:fade-out",
				className,
			)}
			{...props}
		/>
	);
}

function NavigationMenuLink({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
	return (
		<NavigationMenuPrimitive.Link
			data-slot="navigation-menu-link"
			className={cn(
				"flex flex-col gap-1 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring",
				className,
			)}
			{...props}
		/>
	);
}

function NavigationMenuIndicator({
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
	return (
		<NavigationMenuPrimitive.Indicator
			data-slot="navigation-menu-indicator"
			className={cn(
				"top-full z-10 flex h-2 items-end justify-center overflow-hidden transition-opacity duration-300 data-[state=visible]:opacity-100 data-[state=hidden]:opacity-0",
				className,
			)}
			{...props}
		>
			<div className="bg-border h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
		</NavigationMenuPrimitive.Indicator>
	);
}

function NavigationSubMenu({
	children,
	className,
	...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
	return (
		<NavigationMenuPrimitive.Content
			data-slot="navigation-submenu"
			className={cn(
				"absolute top-0 left-full mt-2 w-[200px] bg-background shadow-md rounded-md transition-opacity duration-300 opacity-0 scale-95 group-data-[state=open]:opacity-100 group-data-[state=open]:scale-100 group-data-[state=closed]:opacity-0 group-data-[state=closed]:scale-95",
				className,
			)}
			{...props}
		>
			{children}
		</NavigationMenuPrimitive.Content>
	);
}

export {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuContent,
	NavigationMenuTrigger,
	NavigationMenuLink,
	NavigationMenuIndicator,
	NavigationSubMenu,
	navigationMenuTriggerStyle,
	MobileMenu,
	MobileMenuList,
	MobileMenuItem,
	MobileMenuTrigger,
	MobileMenuContent,
};
