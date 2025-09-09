import clsx from "clsx";

const Title = ({
	className,
	children,
}: {
	className?: string;
	children: string;
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
