import type React from "react";
import { cn } from "@/lib/utils";
import Container from "../ui/container";
import { Title } from "../ui/title";
import { Path } from "./path";

type Props = {
	children: React.ReactNode;
	title?: string;
	path?: { href: string; label: string }[];
	noIndent?: boolean;
};

export default function PageContent({
	children,
	path,
	title,
	noIndent,
}: Props) {
	return (
		<div className={cn("flex justify-center", !noIndent && "mt-5 lg:mt-22")}>
			<Container className="flex-col mx-2">
				{path && <Path>{path}</Path>}
				<div className={cn("bg-background-200 rounded-md p-2 mt-2")}>
					{title && <Title className="p-2">{title}</Title>}
					{children}
				</div>
			</Container>
		</div>
	);
}
