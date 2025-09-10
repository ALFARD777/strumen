import clsx from "clsx";
import type React from "react";

type Props = {
	children: React.ReactNode;
	className?: string;
};

const Container = ({ children, className }: Props) => {
	return (
		<div className={clsx("flex w-full max-w-[1280px] px-2", className)}>
			{children}
		</div>
	);
};

export default Container;
