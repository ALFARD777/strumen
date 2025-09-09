import * as React from "react";
import { IMaskInput, type IMaskInputProps } from "react-imask";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
	label?: string;
};

const inputStyle = cn(
	"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-6.5 file:hover:scale-105 file:transition-all file:cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-medium file:px-2 file:bg-accent file:rounded-md disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
	"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
	"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
);

function Input({ className, label, id, ...props }: InputProps) {
	const generatedId = React.useId();
	const inputId = id || generatedId;

	return label ? (
		<label htmlFor={inputId} className="block w-full">
			<span className="block mb-1 text-sm font-medium">{label}</span>
			<input
				id={inputId}
				data-slot="input"
				className={cn(inputStyle, className)}
				{...props}
			/>
		</label>
	) : (
		<input
			id={inputId}
			data-slot="input"
			className={cn(inputStyle, className)}
			{...props}
		/>
	);
}

function Textarea({
	className,
	label,
	id,
	...props
}: React.ComponentProps<"textarea"> & { label?: string }) {
	const generatedId = React.useId();
	const inputId = id || generatedId;

	return label ? (
		<label htmlFor={inputId} className="block w-full">
			<span className="block mb-1 text-sm font-medium">{label}</span>
			<textarea
				id={inputId}
				data-slot="textarea"
				className={cn(inputStyle, className)}
				{...props}
			/>
		</label>
	) : (
		<textarea
			id={inputId}
			data-slot="textarea"
			className={cn(inputStyle, className)}
			{...props}
		/>
	);
}

function InputMask({
	className,
	type,
	label,
	id,
	...props
}: InputProps & IMaskInputProps<HTMLInputElement>) {
	const generatedId = React.useId();
	const inputId = id || generatedId;

	return label ? (
		<label htmlFor={inputId} className="block w-full">
			<span className="block mb-1 text-sm font-medium">{label}</span>
			<IMaskInput
				id={inputId}
				type={type}
				data-slot="input"
				className={cn(inputStyle, className)}
				{...props}
			/>
		</label>
	) : (
		<IMaskInput
			id={inputId}
			type={type}
			data-slot="input"
			className={cn(inputStyle, className)}
			{...props}
		/>
	);
}

export { Input, InputMask, Textarea };
