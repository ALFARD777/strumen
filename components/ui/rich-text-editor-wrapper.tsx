"use client";
import dynamic from "next/dynamic";
import { LoadingSpinner } from "./spinner";

// Динамический импорт RichTextEditor только на клиенте
const RichTextEditor = dynamic(
	() =>
		import("./rich-text-editor").then((mod) => ({
			default: mod.RichTextEditor,
		})),
	{
		ssr: false,
		loading: () => (
			<div className="border border-input rounded-md overflow-hidden">
				<div className="border-b border-border p-2 flex flex-wrap gap-1">
					<div className="h-8 w-8 bg-muted rounded animate-pulse" />
					<div className="h-8 w-8 bg-muted rounded animate-pulse" />
					<div className="h-8 w-8 bg-muted rounded animate-pulse" />
					<div className="h-8 w-8 bg-muted rounded animate-pulse" />
				</div>
				<div className="min-h-[120px] p-3 flex items-center justify-center">
					<LoadingSpinner />
				</div>
			</div>
		),
	},
);

export { RichTextEditor };
