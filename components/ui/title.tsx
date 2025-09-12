import clsx from "clsx";
import type React from "react";

const Title = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<h2
			className={clsx(
				"text-xl font-semibold tracking-wider text-center",
				className,
			)}
		>
			{children}
		</h2>
	);
};

export { Title };
