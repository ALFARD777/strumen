import type React from "react";
import Container from "../ui/container";
import { Title } from "../ui/title";
import { Path } from "./path";

type Props = {
	children: React.ReactNode;
	title?: string;
	path: { href: string; label: string }[];
};

export default function PageContent({ children, path, title }: Props) {
	return (
		<div className="flex justify-center mt-5 lg:mt-22">
			<Container className="flex-col mx-2">
				<Path>{path}</Path>
				<div className="bg-background-200 rounded-md p-2 mt-2">
					{title && <Title className={"p-2"}>{title}</Title>}
					{children}
				</div>
			</Container>
		</div>
	);
}
